import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Analytics endpoints
app.get('/api/analytics/summary', async (req, res) => {
  try {
    const { user_id: userId } = req.query
    if (!userId) {
      return res.status(400).json({ success: false, error: 'Missing user_id', data: null })
    }

    const attempts = await prisma.questionAttempt.findMany({
      where: { userId },
      orderBy: { attemptedAt: 'desc' },
    })

    const totalAttempts = attempts.length
    const correctAttempts = attempts.filter(a => a.correctness).length
    const avgAccuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0
    const avgTime = totalAttempts > 0
      ? attempts.reduce((sum, a) => sum + a.timeTakenSeconds, 0) / totalAttempts
      : 0

    // Calculate mastery (weighted by recency)
    const now = new Date()
    const masteryScores = attempts.map(a => {
      const daysAgo = (now - a.attemptedAt) / (1000 * 60 * 60 * 24)
      const weight = Math.pow(0.5, daysAgo / 7) // Recency decay
      return { correctness: a.correctness ? 1 : 0, weight }
    })

    const totalWeight = masteryScores.reduce((sum, m) => sum + m.weight, 0)
    const weightedMastery = totalWeight > 0
      ? (masteryScores.reduce((sum, m) => sum + m.correctness * m.weight, 0) / totalWeight) * 100
      : 0

    // Calculate trend (last 10 vs previous 10)
    const recent10 = attempts.slice(0, 10)
    const previous10 = attempts.slice(10, 20)
    const recentAccuracy = recent10.length > 0
      ? (recent10.filter(a => a.correctness).length / recent10.length) * 100
      : 0
    const previousAccuracy = previous10.length > 0
      ? (previous10.filter(a => a.correctness).length / previous10.length) * 100
      : 0
    const trend = recentAccuracy - previousAccuracy

    res.json({
      success: true,
      error: null,
      data: {
        totalAttempts,
        avgAccuracy: Math.round(avgAccuracy * 10) / 10,
        avgTime: Math.round(avgTime),
        mastery: Math.round(weightedMastery * 10) / 10,
        trend: Math.round(trend * 10) / 10,
      },
    })
  } catch (error) {
    console.error('Error fetching summary:', error)
    res.status(500).json({ success: false, error: error.message, data: null })
  }
})

app.get('/api/analytics/topic-mastery', async (req, res) => {
  try {
    const { user_id: userId } = req.query
    if (!userId) {
      return res.status(400).json({ success: false, error: 'Missing user_id', data: [] })
    }

    const attempts = await prisma.questionAttempt.findMany({
      where: { userId },
      orderBy: { attemptedAt: 'desc' },
    })

    // Group by topic and calculate mastery with recency decay
    const topicMap = new Map()
    const now = new Date()

    attempts.forEach(attempt => {
      const metadata = attempt.questionMetadata
      const topic = metadata?.topic || 'Unknown'

      if (!topicMap.has(topic)) {
        topicMap.set(topic, [])
      }

      const daysAgo = (now - attempt.attemptedAt) / (1000 * 60 * 60 * 24)
      const weight = Math.pow(0.5, daysAgo / 7)
      topicMap.get(topic).push({
        correctness: attempt.correctness ? 1 : 0,
        weight,
      })
    })

    const topicMastery = Array.from(topicMap.entries()).map(([topic, scores]) => {
      const totalWeight = scores.reduce((sum, s) => sum + s.weight, 0)
      const mastery = totalWeight > 0
        ? (scores.reduce((sum, s) => sum + s.correctness * s.weight, 0) / totalWeight) * 100
        : 0

      return {
        topic,
        mastery_score: Math.round(mastery * 10) / 10,
        attempts: scores.length,
      }
    }).sort((a, b) => a.topic.localeCompare(b.topic))

    res.json({ success: true, error: null, data: topicMastery })
  } catch (error) {
    console.error('Error fetching topic mastery:', error)
    res.status(500).json({ success: false, error: error.message, data: [] })
  }
})

// Attempts endpoints
app.get('/api/attempts', async (req, res) => {
  try {
    const { user_id: userId, limit = 50 } = req.query
    if (!userId) {
      return res.status(400).json({ success: false, error: 'Missing user_id', data: [] })
    }

    const attempts = await prisma.questionAttempt.findMany({
      where: { userId },
      orderBy: { attemptedAt: 'desc' },
      take: parseInt(limit),
    })

    res.json({ success: true, error: null, data: attempts })
  } catch (error) {
    console.error('Error fetching attempts:', error)
    res.status(500).json({ success: false, error: error.message, data: [] })
  }
})

app.post('/api/attempts/bulk', async (req, res) => {
  try {
    const { user_id: userId, attempts } = req.body
    if (!userId) {
      return res.status(400).json({ success: false, error: 'Missing user_id', data: null })
    }
    if (!Array.isArray(attempts) || attempts.length === 0) {
      return res.status(400).json({ success: false, error: 'No attempts provided', data: null })
    }

    const rows = attempts.map(row => ({
      userId,
      questionMetadata: row.question_metadata || row.questionMetadata || {},
      correctness: row.correctness ?? false,
      confidenceRating: row.confidence_rating || row.confidenceRating || 3,
      timeTakenSeconds: row.time_taken_seconds || row.timeTakenSeconds || 0,
      mistakeType: row.mistake_type || row.mistakeType || null,
      testSessionId: row.test_session_id || row.testSessionId || null,
      attemptedAt: row.attempted_at ? new Date(row.attempted_at) : new Date(),
    }))

    const result = await prisma.questionAttempt.createMany({
      data: rows,
      skipDuplicates: true,
    })

    res.json({ success: true, error: null, data: { count: result.count } })
  } catch (error) {
    console.error('Error creating bulk attempts:', error)
    res.status(500).json({ success: false, error: error.message, data: null })
  }
})

// Recommendations endpoints
app.get('/api/recommendations', async (req, res) => {
  try {
    const { user_id: userId, active_only: activeOnly = 'true' } = req.query
    if (!userId) {
      return res.status(400).json({ success: false, error: 'Missing user_id', data: [] })
    }

    const where = {
      userId,
      ...(activeOnly === 'true' ? { followed: false } : {}),
    }

    const recommendations = await prisma.recommendation.findMany({
      where,
      orderBy: { generatedAt: 'desc' },
    })

    res.json({ success: true, error: null, data: recommendations })
  } catch (error) {
    console.error('Error fetching recommendations:', error)
    res.status(500).json({ success: false, error: error.message, data: [] })
  }
})

app.patch('/api/recommendations/:id/follow', async (req, res) => {
  try {
    const { id } = req.params

    const recommendation = await prisma.recommendation.update({
      where: { id },
      data: {
        followed: true,
        followedAt: new Date(),
      },
    })

    res.json({ success: true, error: null, data: recommendation })
  } catch (error) {
    console.error('Error marking recommendation as followed:', error)
    res.status(500).json({ success: false, error: error.message, data: null })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
