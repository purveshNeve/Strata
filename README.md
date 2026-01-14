# Exam Analytics Platform

A comprehensive exam performance analytics platform built with React, Tailwind CSS, Prisma, and Express.

## Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS
- **Backend**: Express.js + Prisma ORM
- **Database**: PostgreSQL
- **State Management**: TanStack Query (React Query)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

1. Create a PostgreSQL database (locally or using a service like Supabase, Railway, etc.)
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Update `.env` with your database connection string:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/exam_analytics?schema=public"
   VITE_API_URL="http://localhost:3001"
   PORT=3001
   ```

### 3. Initialize Prisma

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push

# Or use migrations for production
npm run db:migrate
```

### 4. Start Development Servers

**Terminal 1 - Backend API:**
```bash
npm run dev:server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` (Vite default)
The backend API will be available at `http://localhost:3001`

## Database Schema

The platform uses 4 main tables:

1. **users** - User profiles and authentication
2. **question_attempts** - Individual question attempts with metadata
3. **recommendations** - AI-generated study recommendations
4. **test_sessions** - Mock test session metadata

See `prisma/schema.prisma` for full schema details.

## API Endpoints

### Analytics
- `GET /api/analytics/summary?user_id=<id>` - Overall statistics
- `GET /api/analytics/topic-mastery?user_id=<id>` - Topic mastery scores

### Attempts
- `GET /api/attempts?user_id=<id>&limit=50` - List attempts
- `POST /api/attempts/bulk` - Bulk create attempts (CSV upload)

### Recommendations
- `GET /api/recommendations?user_id=<id>&active_only=true` - List recommendations
- `PATCH /api/recommendations/:id/follow` - Mark recommendation as followed

## Features

- **Dashboard**: Overview statistics and trends
- **Topic Mastery**: Heatmap visualization of mastery by topic
- **Attempt History**: Table of past test attempts
- **Recommendations**: AI-powered study recommendations
- **CSV Upload**: Bulk import test data

## Development Notes

- The app uses a demo user ID (`demo-user-1`) for testing
- All API responses follow the format: `{ success: boolean, error: string | null, data: any }`
- Frontend gracefully falls back to mock data if backend is unavailable
