# College Discovery Platform — Backend

Backend API for a college discovery platform built with Next.js, Prisma, and PostgreSQL.

## Features
- College search with filters (name, state, type, rating, fees)
- Compare 2–3 colleges side by side
- Rank-based college predictor (JEE, NEET, CAT etc.)
- JWT authentication + save/unsave colleges

## Tech Stack
- **Framework:** Next.js 14 (API Routes)
- **Language:** TypeScript
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Auth:** JWT + bcrypt
- **Validation:** Zod

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Create `.env` file:
```
DATABASE_URL="your-neon-postgresql-url"
JWT_SECRET="your-random-secret"
```
Get a free database at **neon.tech**. Generate a secret with:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Set up database
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 4. Run locally
```bash
npm run dev
```
Visit http://localhost:3000

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/colleges` | No | Search & filter colleges |
| GET | `/api/colleges/:id` | No | Single college detail |
| GET | `/api/colleges/meta` | No | Available states & types |
| POST | `/api/compare` | No | Compare 2–3 colleges |
| GET | `/api/predict` | No | Supported exams & categories |
| POST | `/api/predict` | No | Predict colleges by rank |
| GET | `/api/saved` | Yes | List saved colleges |
| POST | `/api/saved` | Yes | Save a college |
| DELETE | `/api/saved/:collegeId` | Yes | Unsave a college |

---

## Example Requests

**Search colleges**
```
GET /api/colleges?q=iit&type=engineering&minRating=4
```

**Predict colleges**
```json
POST /api/predict
{
  "exam": "JEE_MAIN",
  "rank": 5000,
  "category": "general"
}
```

**Compare colleges**
```json
POST /api/compare
{
  "ids": ["college_id_1", "college_id_2"]
}
```

**Protected routes — add this header**
```
Authorization: Bearer <your-jwt-token>
```

---

