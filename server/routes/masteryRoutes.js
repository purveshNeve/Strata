const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Mastery Calculation Function
function calculateTopicMastery(attempts) {
  if (!attempts || attempts.length === 0) return 0;

  const difficultyWeights = {
    'Easy': 1,
    'Medium': 1.5,
    'Hard': 2
  };

  let totalWeightedScore = 0;
  let totalWeight = 0;
  let confidenceAlignmentScore = 0;
  let difficultyProgressScore = 0;

  attempts.forEach(attempt => {
    const weight = difficultyWeights[attempt.difficulty] || 1;
    totalWeight += weight;
    
    if (attempt.correct) {
      totalWeightedScore += weight;
      
      if (attempt.confidence === 3) {
        confidenceAlignmentScore += 0.15;
      } else if (attempt.confidence === 2) {
        confidenceAlignmentScore += 0.1;
      } else {
        confidenceAlignmentScore += 0.05;
      }
    } else {
      if (attempt.confidence === 3) {
        confidenceAlignmentScore -= 0.1;
      } else if (attempt.confidence === 2) {
        confidenceAlignmentScore -= 0.05;
      }
    }
  });

  const weightedAccuracy = totalWeight > 0 ? (totalWeightedScore / totalWeight) : 0;
  const normalizedConfidence = Math.max(0, Math.min(1, (confidenceAlignmentScore / attempts.length + 1) / 2));
  
  const hardQuestions = attempts.filter(a => a.difficulty === 'Hard').length;
  const correctHardQuestions = attempts.filter(a => a.difficulty === 'Hard' && a.correct).length;
  difficultyProgressScore = attempts.length > 0 ? 
    (hardQuestions / attempts.length) * 0.5 + (correctHardQuestions / Math.max(hardQuestions, 1)) * 0.5 : 0;

  const sortedAttempts = [...attempts].sort((a, b) => 
    new Date(b.attempt_date) - new Date(a.attempt_date)
  );
  
  let recencyWeightedMastery = 0;
  let recencyTotalWeight = 0;
  
  sortedAttempts.forEach((attempt, index) => {
    const recencyWeight = Math.exp(-index / 10);
    recencyTotalWeight += recencyWeight;
    if (attempt.correct) {
      recencyWeightedMastery += recencyWeight;
    }
  });
  
  const recencyFactor = recencyTotalWeight > 0 ? 
    (recencyWeightedMastery / recencyTotalWeight) : weightedAccuracy;

  let mastery = (
    weightedAccuracy * 0.4 +
    normalizedConfidence * 0.2 +
    difficultyProgressScore * 0.2 +
    recencyFactor * 0.2
  ) * 100;

  return Math.round(Math.max(0, Math.min(100, mastery)));
}

// GET mastery data for a student
router.get('/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const result = await pool.query(
      `SELECT topic, subtopic, difficulty, correct, confidence, attempt_date, time_taken
       FROM student_attempts
       WHERE student_id = $1
       ORDER BY attempt_date DESC`,
      [studentId]
    );

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: 'No attempts found for this student'
      });
    }

    const topicGroups = {};
    result.rows.forEach(row => {
      if (!topicGroups[row.topic]) {
        topicGroups[row.topic] = [];
      }
      topicGroups[row.topic].push(row);
    });

    const masteryData = Object.keys(topicGroups).map(topic => ({
      topic: topic,
      mastery: calculateTopicMastery(topicGroups[topic]),
      attemptCount: topicGroups[topic].length,
      lastAttempt: topicGroups[topic][0].attempt_date,
      correctCount: topicGroups[topic].filter(a => a.correct).length,
      accuracy: Math.round((topicGroups[topic].filter(a => a.correct).length / topicGroups[topic].length) * 100)
    }));

    res.json({
      success: true,
      data: masteryData
    });
  } catch (error) {
    console.error('Error fetching mastery data:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch mastery data',
      details: error.message
    });
  }
});

// POST - Add new attempt
router.post('/attempt', async (req, res) => {
  try {
    const { 
      studentId, questionId, topic, subtopic, 
      difficulty, correct, timeTaken, confidence, attemptDate 
    } = req.body;

    // Validation
    if (!studentId || !questionId || !topic || !difficulty || correct === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    const result = await pool.query(
      `INSERT INTO student_attempts 
       (student_id, question_id, topic, subtopic, difficulty, correct, time_taken, confidence, attempt_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [studentId, questionId, topic, subtopic, difficulty, correct, timeTaken, confidence, attemptDate || new Date()]
    );

    res.json({ 
      success: true, 
      message: 'Attempt recorded successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error recording attempt:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to record attempt',
      details: error.message
    });
  }
});

// GET - Detailed topic breakdown
router.get('/:studentId/:topic', async (req, res) => {
  try {
    const { studentId, topic } = req.params;
    
    const result = await pool.query(
      `SELECT * FROM student_attempts
       WHERE student_id = $1 AND topic = $2
       ORDER BY attempt_date DESC`,
      [studentId, topic]
    );

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        data: null,
        message: 'No attempts found for this topic'
      });
    }

    const attempts = result.rows;
    const mastery = calculateTopicMastery(attempts);

    // Subtopic breakdown
    const subtopicGroups = {};
    attempts.forEach(attempt => {
      if (attempt.subtopic) {
        if (!subtopicGroups[attempt.subtopic]) {
          subtopicGroups[attempt.subtopic] = [];
        }
        subtopicGroups[attempt.subtopic].push(attempt);
      }
    });

    const subtopicMastery = Object.keys(subtopicGroups).map(subtopic => ({
      subtopic,
      mastery: calculateTopicMastery(subtopicGroups[subtopic]),
      attemptCount: subtopicGroups[subtopic].length,
      correctCount: subtopicGroups[subtopic].filter(a => a.correct).length
    }));

    res.json({
      success: true,
      data: {
        topic,
        overallMastery: mastery,
        totalAttempts: attempts.length,
        correctAttempts: attempts.filter(a => a.correct).length,
        subtopics: subtopicMastery,
        recentAttempts: attempts.slice(0, 10)
      }
    });
  } catch (error) {
    console.error('Error fetching topic details:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch topic details',
      details: error.message
    });
  }
});

module.exports = router;