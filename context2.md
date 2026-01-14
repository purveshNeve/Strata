AI-Powered Competitive Exam 
Performance Analytics Platform 
Complete System Design Blueprint for 24-Hour 
Hackathon  
�
�
Problem Statement & Differentiation 
What Makes Most Solutions Fail: 
● Generic pie charts showing "Weak in Math: 45%" 
● Static recommendations that never evolve 
● No explanation for why advice is given 
● Treats all mistakes equally without understanding context 
● Data lost when browser closes 
● Single-user experiences with no collaboration potential 
Our Winning Approach: 
● Build a system that learns about the student as it collects data 
● Provide transparent reasoning for every insight 
● Show confidence levels and acknowledge uncertainty 
● Demonstrate adaptive intelligence that improves over time 
● Persistent, scalable backend architecture 
● Real-time data synchronization across devices 
● Foundation for multi-user features and analytics 
�
�
System Architecture (Full-Stack Layered Design) 
Architecture Philosophy for 24 Hours 
Why Add Backend Despite Time Constraints: The persistent storage API in artifacts is 
excellent for prototypes, but a real backend demonstrates: 
● Production-readiness thinking - Shows you understand scalability 
● Data integrity - Prevents data loss, handles concurrent updates properly 
● Richer features - Cross-device sync, user accounts, comparative analytics 
● Judge appeal - Differentiates from pure frontend solutions 
Keeping It Simple: 
● Use managed services (no DevOps complexity) 
● RESTful APIs only (no WebSockets, GraphQL, message queues) 
● Minimal database schema (3-4 tables max) 
● Leverage platform features (auth, storage, hosting all-in-one) 
Backend Architecture Layer 
Technology Approach for 24-Hour Timeline 
Supabase (PostgreSQL + Auth + Storage) 
● Why: Single platform for database, authentication, and APIs 
● Setup time: 15 minutes (includes auth scaffolding) 
● Zero DevOps: Managed hosting, automatic backups 
● Built-in features: Row-level security, real-time subscriptions (optional), REST API 
auto-generation 
●  
Database Design Philosophy 
Core Principle: Denormalization for Speed Instead of perfectly normalized relational design, 
optimize for read performance since analytics queries dominate over writes. 
Table Structure (3 Main Tables): 
1. Users Table 
● Purpose: Store user profiles and authentication linkage 
● Key Fields: user_id, email, name, created_at, preferences (JSONB for flexible settings) 
● Why JSONB for preferences: Allows storing things like "default subject focus", 
"exam_date", "notification_settings" without schema changes 
● Index strategy: Primary key on user_id, unique index on email 
2. Question_Attempts Table (The Heart of the System) 
● Purpose: Every single question attempt recorded 
● Key Fields: 
○ attempt_id (primary key) 
○ user_id (foreign key) 
○ question_metadata (JSONB): topic, subtopic, difficulty, skills_tags[] 
○ correctness (boolean) 
○ confidence_rating (1-5) 
○ time_taken_seconds 
○ mistake_type (enum: conceptual, calculation, misread, guess, null if correct) 
○ test_session_id (groups questions from same mock test) 
○ attempted_at (timestamp) 
● Why JSONB for question_metadata: 
○ Flexible schema for different exam types (JEE has different topics than GMAT) 
○ Can add new skill tags without migrations 
○ Allows nested structures like {"topic": "Algebra", "subtopic": 
"Quadratics", "skills": ["word_problem", "multi_step"]} 
● Indexing strategy: 
○ Composite index on (user_id, attempted_at) for timeline queries 
○ Index on question_metadata using GIN (for JSONB queries like "all Algebra 
attempts") 
○ Index on test_session_id for batch analysis 
3. Recommendations Table 
● Purpose: Store generated recommendations and track their effectiveness 
● Key Fields: 
○ recommendation_id 
○ user_id 
○ generated_at (timestamp) 
○ focus_area (text: "Conditional Probability Fundamentals") 
○ priority (high/medium/low) 
○ reasoning (text) 
○ evidence (JSONB: all the data points that led to this) 
○ action_steps (text array) 
○ confidence_score (0-100) 
○ data_point_count (how many attempts informed this) 
○ followed (boolean, user marks as done) 
○ followed_at (timestamp, null if not followed) 
○ outcome_improved (boolean, null until next test, then calculated) 
● Why track recommendations: 
○ Powers the "Prediction Accuracy" feature 
○ Shows evolution over time ("we recommended X on Jan 1, then Y on Jan 5") 
○ Demonstrates system learning to judges 
Optional 4th Table: Test_Sessions (If time permits) 
● Purpose: Metadata about each mock test taken 
● Fields: session_id, user_id, test_name, test_date, overall_score, total_questions, 
total_time 
● Benefit: Allows "Test 1 vs Test 3" comparisons without recalculating from individual 
attempts 
Data Flow Architecture 
Write Path (User Takes Questions): 
1. Frontend: User answers question, clicks submit 
2. API Call: POST to /api/attempts with question data 
3. Backend Processing: 
○ Validate data (required fields present, confidence 1-5, etc.) 
○ Enrich data: Add timestamp, auto-classify mistake_type if wrong 
○ Insert into Question_Attempts table 
○ Trigger calculation: Check if new attempt crosses threshold for generating 
recommendation 
4. Response: Return saved attempt with ID 
5. Frontend: Update UI optimistically, show confirmation 
Read Path (Dashboard Loads): 
1. Frontend: User opens dashboard 
2. Parallel API Calls: 
○ GET /api/attempts?user_id=X&limit=500 (last 500 attempts) 
○ GET /api/recommendations?user_id=X&active=true (current 
recommendations) 
○ GET /api/analytics/summary?user_id=X (pre-computed stats) 
3. Backend Processing: 
○ Attempts endpoint: Simple query with ordering and pagination 
○ Recommendations: Filter by user, order by priority/date 
○ Summary endpoint: This is where magic happens (see Analytics Processing 
below) 
4. Frontend: Receives data, renders dashboards using client-side calculations where 
appropriate 
Analytics Processing Strategy 
Hybrid Approach: Backend Aggregation + Frontend Rendering 
What Backend Should Calculate (Heavy lifting): 
● Topic mastery scores: Aggregate attempts per topic, apply decay function 
● Stability metrics: Calculate variance, streaks across time windows 
● Confidence-performance gaps: Group by topic, compute average deltas 
● Mistake distributions: Count mistake_types per topic 
● Time efficiency stats: Average time per topic, identify outliers 
Why on backend: 
● Reduces data sent over network (send aggregated scores, not 500 raw attempts) 
● Consistent calculations (same decay formula applied for all clients) 
● Can use database's aggregation functions (GROUP BY, window functions) 
What Frontend Should Calculate (Visualization): 
● Chart rendering: Takes aggregated data, draws heatmaps/line charts 
● Sorting/filtering: User wants to see "only high-priority recommendations" 
● Trend arrows: Compare current vs previous period (data already aggregated) 
Example Backend Aggregation Endpoint: 
GET /api/analytics/topic-mastery?user_id=123 
Backend Logic: 
1. Query: SELECT all attempts for user, grouped by topic 
2. For each topic: - Apply recency decay: weight = 0.5^(days_ago/7) - Calculate: SUM(correctness * weight) / SUM(weight) - Return: {topic: "Algebra", mastery_score: 67, attempt_count: 24} 
3. Return JSON array of topic scores 
Frontend receives compact data, renders heatmap 
Recommendation Engine Backend Logic 
When to Generate Recommendations: 
● Trigger: After every 5th attempt in a topic (threshold for "enough data") 
● Or: After completing a full test session 
● Or: User explicitly clicks "Refresh Insights" 
Generation Process (Backend Function): 
1. Fetch user's attempt history: Last 100 attempts or 30 days 
2. Calculate all metrics: 
○ Mastery scores per topic (already have from analytics endpoint) 
○ Stability scores per topic 
○ Confidence gaps per topic 
○ Mistake patterns per topic 
○ Time efficiency per topic 
3. Score each topic for priority: 
○ Impact potential = (100 - mastery_score) × topic_weight × instability_factor 
○ topic_weight: How much this topic appears in exams (configurable) 
○ instability_factor: Higher if variance is high (fragile knowledge) 
4. Generate recommendation objects: 
○ Top 3-5 topics by priority score 
○ For each, compile evidence from raw data 
○ Write reasoning text (template-based or simple AI generation if using Claude 
API) 
○ Calculate confidence based on data_point_count 
5. Save to Recommendations table 
6. Return recommendations to frontend 
Recommendation Evolution Tracking: 
● Each time recommendations are regenerated, previous ones stay in database 
● Query: "Get all recommendations for user, ordered by generated_at" shows evolution 
● Compare consecutive recommendations to show how advice changed 
Authentication & User Management 
Approach: Leverage Supabase Auth (or Firebase Auth) 
Why Not Build Custom Auth: 
● Email/password hashing is complex and security-sensitive 
● Session management requires careful token handling 
● 24 hours is too short for secure custom auth 
What We Get Free: 
● Email/password signup and login 
● Session management (JWT tokens) 
● Password reset flows 
● Row-level security (database automatically filters by user_id) 
Implementation Time: ~1 hour 
1. Enable auth in Supabase dashboard 
2. Add signup/login UI components (use pre-built Supabase UI library) 
3. Configure row-level security policies: 
○ Users can only read/write their own attempts 
○ Users can only see their own recommendations 
4. Frontend: Store auth token, include in API headers 
For Demo: 
● Create 3 pre-seeded accounts: alex@demo.com, sam@demo.com, jordan@demo.com 
● Each has sample data showing different patterns 
● Demo can log in as each to show different student journeys 
File Upload & Batch Processing 
CSV Upload Flow with Backend: 
Option 1: Direct Backend Processing (Recommended for 24h) 
1. User selects CSV in frontend 
2. Frontend parses CSV using Papaparse (validation, preview) 
3. Frontend sends parsed JSON array to backend 
○ POST /api/attempts/bulk with array of question objects 
4. Backend validates each row, inserts in transaction 
5. Returns success/failure for each row 
6. Frontend shows results: "45/50 questions imported, 5 errors" 
Why parse on frontend: 
● Faster user feedback (immediate validation errors) 
● Reduces backend load 
● Better UX (can preview before committing) 
Option 2: Backend File Processing (If time permits) 
1. Upload CSV file to Supabase Storage 
2. Trigger backend function to process file 
3. Backend reads file, parses, validates, inserts 
4. Return job status to frontend 
For 24h hackathon: Use Option 1 (simpler, fewer moving parts) 
API Endpoint Structure 
Core Endpoints (Minimum Viable): 
Authentication: 
● POST /auth/signup - Create account 
● POST /auth/login - Get session token 
● POST /auth/logout - Invalidate session 
Question Attempts: 
● GET /api/attempts - List user's attempts (with filters: date range, topic, session) 
● POST /api/attempts - Add single attempt 
● POST /api/attempts/bulk - Batch insert from CSV 
● GET /api/attempts/:id - Get single attempt details 
Analytics: 
● GET /api/analytics/summary - Overall stats (total attempts, avg accuracy, etc.) 
● GET /api/analytics/topic-mastery - Mastery scores by topic 
● GET /api/analytics/stability - Stability scores by topic 
● GET /api/analytics/confidence-gaps - Confidence calibration by topic 
● GET /api/analytics/mistake-patterns - Mistake distribution 
Recommendations: 
● GET /api/recommendations - List active recommendations 
● POST /api/recommendations/generate - Force regenerate recommendations 
● PATCH /api/recommendations/:id/follow - Mark recommendation as followed 
● GET /api/recommendations/history - Timeline of past recommendations 
Test Sessions: 
● GET /api/sessions - List user's test sessions 
● POST /api/sessions - Create new test session 
● GET /api/sessions/:id/compare - Compare two sessions 
Error Handling Strategy: 
● All endpoints return consistent JSON: {success: boolean, data: any, error: 
string} 
● Use HTTP status codes: 200 (success), 400 (validation), 401 (auth), 500 (server) 
● Frontend shows user-friendly error messages 
Deployment Strategy for 24 Hours 
Backend Deployment: Supabase (Zero Config) 
1. Create Supabase project (5 minutes) 
2. Define tables in dashboard SQL editor (15 minutes) 
3. Enable RLS policies (10 minutes) 
4. Backend APIs are auto-generated from tables 
5. Total setup: 30 minutes 
Frontend Deployment: Vercel 
1. Connect GitHub repo 
2. Configure environment variables (Supabase URL, anon key) 
3. Deploy on commit 
4. Total: 10 minutes 
Database Seeding for Demo: 
● Create SQL script to insert sample data for 3 users 
● Run once after table creation 
● Script includes: 
○ 3 user accounts (alex, sam, jordan) 
○ 150+ question attempts per user (showing patterns) 
○ 5-10 recommendations per user (at different timestamps) 
○ 3-4 test sessions per user 
Scalability Considerations (Talking Points for Judges) 
Current Design Handles: 
● 10,000 users with 500 attempts each = 5M records (well within PostgreSQL capability) 
● Proper indexing ensures <100ms query times even at scale 
● Supabase auto-scales infrastructure 
What We'd Add for Production: 
● Caching layer: Redis for frequently accessed analytics (topic mastery) 
● Background jobs: Use Supabase Edge Functions for async recommendation 
generation 
● Data archiving: Move attempts older than 1 year to cold storage 
● Rate limiting: Prevent abuse of API endpoints 
But for hackathon: Current design is production-ready for early-stage product 
Frontend Architecture (Enhanced with Backend 
Integration) 
State Management with Backend 
Approach: React TanStack Query (or SWR) 
● Why: Handles API calls, caching, loading states automatically 
● Setup time: 30 minutes 
● Benefits: 
○ Automatic refetching when user returns to tab 
○ Optimistic updates (UI responds before backend confirms) 
○ Request deduplication (don't fetch same data twice) 
State Layers: 
1. Server State (React Query): Attempts, recommendations, analytics - cached from API 
2. UI State (React useState): Modal open/closed, selected topic filter 
3. Auth State (Context): Current user, session token 
Data Fetching Pattern: 
Frontend Component: - On mount: useQuery('topic-mastery') → triggers GET /api/analytics/topic-mastery - React Query caches response for 5 minutes - Shows loading spinner while fetching - Renders heatmap when data arrives - If user adds new attempt: mutate → invalidates cache → refetches automatically 
Offline Support Strategy 
For 24h Hackathon: 
● Don't build complex offline sync (too time-consuming) 
● Do: Show clear loading/error states when backend unavailable 
● Do: Use React Query's cached data if network fails 
● Fallback: "You're offline. Showing last synced data from 2 minutes ago." 
Nice-to-have (if time): 
● Store draft attempts in browser localStorage 
● On reconnect: POST drafts to backend, clear localStorage 
Layer 1: Data Ingestion & Validation (Enhanced) 
CSV Upload with Backend Processing 
Flow: 
1. User drops CSV file 
2. Frontend parses with Papaparse → shows preview table 
3. Validation: 
○ Client-side: Check required columns, data types, ranges 
○ Server-side: Check for duplicates, validate against existing sessions 
4. User confirms → Frontend POSTs JSON array to /api/attempts/bulk 
5. Backend processes in transaction (all or nothing) 
6. Shows success: "48/50 imported. 2 duplicates skipped." 
Error Handling: 
● Show errors inline in preview table (red highlighting) 
● Allow user to fix in browser before submitting 
● Backend returns which rows failed with reasons 
Manual Entry with Instant Sync 
Flow: 
1. User fills form → clicks "Add Question" 
2. Frontend optimistically adds to UI (instant feedback) 
3. Background: POST to /api/attempts 
4. If backend confirms: Show green checkmark 
5. If backend fails: Revert UI change, show error 
Auto-save Drafts: 
● Store form data in localStorage every 5 seconds 
● On page reload: "You have an unsaved question. Resume?" 
Sample Datasets (Now in Database) 
Implementation: 
● Pre-seeded database accounts: alex@demo.com, sam@demo.com, jordan@demo.com 
● Each has 100+ attempts showing different patterns 
● Demo mode: "Load Alex's Data" → logs in as alex@demo.com 
Layer 2: Student Understanding Model 
(Backend-Powered) 
Feature 2.1: Topic Mastery Tracker 
Backend Calculation: 
● Endpoint: GET /api/analytics/topic-mastery 
● SQL aggregation with window functions for decay 
● Returns: [{topic: "Algebra", mastery: 67, attempts: 24, trend: 
"improving"}] 
Frontend Rendering: 
● Receives aggregated scores 
● Draws heatmap using Recharts 
● Hover shows details from backend response 
Recency Decay Logic (Backend): 
● For each attempt: weight = 0.5^(days_ago / 7) 
● Mastery = Σ(correctness × weight) / Σ(weight) 
● Database query uses window functions for efficiency 
Feature 2.2: Stability Analysis 
Backend Calculation: 
● Endpoint: GET /api/analytics/stability 
● For each topic: Calculate variance of last 10 attempts 
● Flag if variance > 0.3 (30% instability) 
● Return: [{topic: "Trigonometry", stability: 42, status: "fragile"}] 
Why on backend: 
● Needs historical analysis across multiple test sessions 
● Can use SQL's VAR_POP function for efficiency 
Feature 2.3: Confidence-Performance Gap 
Backend Calculation: 
● Endpoint: GET /api/analytics/confidence-gaps 
● Group attempts by topic 
● For each: gap = AVG(confidence_rating - correctness×5) 
● Categorize: overconfident (gap > 1), underconfident (gap < -1) 
● Return: [{topic: "Probability", gap: 2.3, category: 
"overconfident", sample_size: 12}] 
Frontend Visualization: 
● 2x2 quadrant chart 
● Each dot is a topic, positioned by avg_confidence (Y) and avg_correctness (X) 
● Color by gap category 
Layer 3: Question-Level Insight Engine 
Feature 3.1: Micro-Skill Tagging 
Data Storage: 
In Question_Attempts table, question_metadata JSONB field: 
{  "topic": "Algebra",  "subtopic": "Quadratics",  "skills": ["word_problem", "multi_step", 
"quadratic_formula"]} 
●  
Backend Querying: 
● Endpoint: GET /api/analytics/micro-skills?skill=word_problem 
● Uses JSONB operators: WHERE question_metadata @> '{"skills": 
["word_problem"]}' 
● Returns all attempts tagged with that skill 
Frontend Tree View: 
● Fetches topic → subtopic → skill hierarchy 
● Click skill → Calls backend for filtered attempts 
● Shows: "8 attempts at quadratic word problems: 3 correct, 5 wrong" 
Feature 3.2: Mistake Pattern Classifier 
Backend Auto-Classification: 
When attempt is inserted (and correctness = false): 
IF time_taken < 30 AND confidence < 2:  mistake_type = "guess"ELIF time_taken > 
topic_avg_time * 1.5:  mistake_type = "conceptual"ELSE:  mistake_type = "calculation" 
●  
● Store in mistake_type column 
Analytics Endpoint: 
● GET /api/analytics/mistake-patterns?topic=Algebra 
● Returns: {conceptual: 12, calculation: 5, misread: 2, guess: 3} 
Frontend Pie Chart: 
● Receives counts, renders distribution 
● Click slice → Shows specific questions of that mistake type 
Feature 3.3: Time Efficiency Analysis 
Backend Calculation: 
● Endpoint: GET /api/analytics/time-efficiency 
● For each topic: 
○ avg_time = AVG(time_taken_seconds) 
○ avg_correctness = AVG(correctness) 
○ efficiency_score = avg_correctness / (avg_time / 60) [accuracy per minute] 
● Flag "time traps": Questions with time > 2×avg AND wrong 
Frontend Scatter Plot: 
● X-axis: time_taken, Y-axis: correctness, size: confidence 
● Each dot is an attempt 
● Hovering shows question details 
Layer 4: Recommendation Engine (Backend Core Logic) 
Recommendation Generation Algorithm 
Trigger Points: 
1. User completes test session → auto-generate 
2. User clicks "Refresh Insights" → force generate 
3. Every 10 new attempts in any topic → check if new recommendation needed 
Backend Process: 
1. Fetch all metrics (from analytics endpoints) 
2. Score each topic: 
○ priority_score = (100 - mastery) × topic_weight × 
instability × recent_attempt_count 
○ topic_weight: Configurable (e.g., Algebra = 1.5, Geometry = 1.0) 
3. Select top 5 topics by priority_score 
4. For each topic, generate recommendation: 
○ Focus Area: "Master [Subtopic with lowest mastery]" 
○ Priority: High if score > 70, Medium if 40-70, Low if < 40 
○ Reasoning: Template-based text (see below) 
○ Evidence: Fetch specific data points (last 10 attempts, mistake counts, time 
stats) 
○ Action Steps: Predefined steps based on mistake_type distribution 
○ Confidence: Based on attempt count (high if >10, medium if 5-10, low if <5) 
5. Insert into Recommendations table with generated_at = NOW() 
6. Return recommendations 
Reasoning Template System 
Backend has templates like: 
IF mastery < 40 AND mistake_type mostly "conceptual": 
Reasoning = "You've attempted {attempt_count} questions in {topic} with only {mastery}% 
accuracy.  
              {conceptual_percent}% of errors are conceptual, indicating fundamental gaps.  
              This is an exam-frequent topic worth {topic_weight}% of marks." 
 
IF mastery > 80 AND confidence_gap < -1: 
  Reasoning = "You're performing well in {topic} ({mastery}% accuracy) but show low confidence  
              (avg {avg_confidence}/5). This suggests you understand but doubt yourself." 
 
Variables filled from database queries 
Evidence Compilation 
For each recommendation, backend fetches: 
● Last 10 attempts in that topic 
● Mistake type distribution 
● Average time vs benchmark 
● Confidence ratings 
● Trend (last 5 vs previous 5) 
Stored as JSONB in evidence field: 
{ 
  "recent_attempts": 12, 
  "accuracy": 0.25, 
  "avg_confidence": 3.2, 
  "avg_time_seconds": 246, 
  "benchmark_time": 135, 
  "mistake_breakdown": {"conceptual": 9, "calculation": 2, "guess": 1}, 
  "trend": "no_improvement" 
} 
 
Prediction Accuracy Tracking 
How It Works: 
1. When recommendation generated: outcome_improved = NULL (unknown) 
2. User marks "Followed" → followed = TRUE, followed_at = NOW() 
3. After user's next test session: 
○ Backend compares mastery_before vs mastery_after for that topic 
○ If improved by >10%: outcome_improved = TRUE 
○ If no change or worse: outcome_improved = FALSE 
4. Accuracy metric: COUNT(outcome_improved = TRUE) / COUNT(followed = TRUE) 
Frontend Display: 
● Badge: "Our guidance accuracy: 7/9 recommendations led to improvement (78%)" 
● Shows system is tracking its own performance 
Layer 5: Improvement Tracking & Adaptive Intelligence 
Feature 5.1: Advice Evolution Timeline 
Backend Query: 
● GET /api/recommendations/history?user_id=X 
● Returns all recommendations ordered by generated_at 
● Group by test session or time periods 
Frontend Timeline: 
● Horizontal timeline with cards for each generation date 
● Each card shows: 
○ Date 
○ Top 3 recommendations at that point 
○ What changed from previous (diff logic in frontend) 
Example Data Flow: 
Jan 1: [{topic: "Probability", priority: "high", mastery: 30}] 
Jan 5: [{topic: "Probability - Bayes", priority: "high", mastery: 35}, ...] 
Jan 10: [{topic: "Permutations", priority: "high", mastery: 40}, ...] 
Frontend shows: "Focus shifted from broad Probability to specific Bayes Theorem to new 
weak area Permutations" 
Feature 5.2: System Confidence Growth 
Backend Calculation: 
● For each recommendation generation timestamp: 
○ avg_data_points = AVG(data_point_count) across all 
recommendations 
○ confidence_score = MIN(avg_data_points / 10, 1) × 100 (caps at 
100%) 
Frontend Line Chart: 
● X-axis: Time, Y-axis: System Confidence % 
● Shows growth: 42% → 67% → 89% as more data collected 
Feature 5.3: Skill Trajectory Projections 
Backend Calculation: 
● Endpoint: GET /api/analytics/projections?topic=Algebra 
● Fetch mastery scores over time 
● Apply linear regression: mastery(t) = slope × t + intercept 
● Project to mastery = 100 or exam_date (whichever first) 
● Return: {current: 67, projected_date: "2026-01-25", days_remaining: 
14} 
Frontend Visualization: 
● Line chart with actual scores (solid line) + projected trend (dotted line) 
● Label: "At current pace, Algebra mastery by Jan 25" 
�
�
UI/UX Structure (Backend-Integrated) 
Page 1: Onboarding & Authentication 
New Flow with Backend: 
1. Landing page: "Sign up / Log in" 
2. After auth: "Upload your first test OR load sample data" 
3. Sample data button → Logs in as demo account (pre-seeded) 
Loading States: 
● "Uploading CSV... 0/48 rows processed" 
● "Calculating insights... Please wait 2-3 seconds" 
Page 2: Dashboard (Real-time Data) 
Data Fetching: 
● On page load: Parallel API calls 
○ /api/analytics/summary (overall stats) 
○ /api/analytics/topic-mastery (heatmap data) 
○ /api/analytics/stability (stability indicators) 
○ /api/analytics/confidence-gaps (calibration meter) 
Refresh Mechanism: 
● "Last updated: 2 minutes ago" with refresh button 
● Auto-refresh every 5 minutes (using React Query) 
Page 3: Deep Insights (Backend-Driven) 
Tab 1: Mistake Patterns 
● Data: GET /api/analytics/mistake-patterns 
● Chart: Pie chart of distribution 
● Table: Top 10 repeated mistakes (from /api/attempts filtered by mistake_type) 
Tab 2: Time Analysis 
● Data: GET /api/analytics/time-efficiency 
● Scatter plot: Each dot is an attempt 
● Click dot → Fetch /api/attempts/:id for details 
Tab 3: Micro-Skills 
● Tree built from JSONB skill tags 
● Click skill → GET /api/analytics/micro-skills?skill=X 
Page 4: Recommendations Hub (Live Updates) 
Data Source: 
● GET /api/recommendations?active=true 
● Shows current recommendations 
User Interaction: 
● "Mark as Followed" → PATCH /api/recommendations/:id/follow 
● "Refresh Insights" → POST /api/recommendations/generate → Shows new recs 
Real-time Feel: 
● When user adds new attempt → Check if threshold crossed → Auto-generate new 
recommendation 
● Show notification: "New insight available! 
�
�
" 
Page 5: Progress & Evolution (Historical Data) 
Timeline: 
● GET /api/recommendations/history (all past recommendations) 
● Shows evolution cards 
Comparison View: 
● GET /api/sessions?user_id=X (list sessions) 
● User selects Session 1 vs Session 3 
● GET /api/sessions/compare?session1=A&session2=B 
● Backend returns side-by-side metrics 