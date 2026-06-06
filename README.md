# College Discovery Platform — Backend

> Track B · Backend Engineer · Node.js + Next.js API Routes + Prisma + PostgreSQL

## Features
- **College Search & Filter** — full-text search, filter by state/type/rating/fees, paginated
- **Compare Colleges** — diff payload for 2–3 colleges, server-computed
- **Predictor Tool** — rank-based cutoff matching from database, no hardcoded logic
- **Auth + Saved Items** — JWT auth, user-scoped save/unsave

---

## Stack
| Layer | Tech |
|---|---|
| Framework | Next.js 14 (API Routes) |
| Language | TypeScript |
| ORM | Prisma |
| Database | PostgreSQL (Neon) |
| Auth | JWT (jsonwebtoken) + bcrypt |
| Validation | Zod |
| Deployment | Vercel + Neon |

---

## Local Setup

### 1. Clone and install
```bash
git clone <your-repo-url>
cd college-discovery
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://..."   # from Neon (see below)
JWT_SECRET="your-random-secret"   # generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Set up Neon database (free)
1. Go to https://neon.tech and sign up
2. Create a new project → copy the **Connection string**
3. Paste it as `DATABASE_URL` in your `.env`

### 4. Run migrations and seed
```bash
npm run db:push      # push schema to database
npm run db:seed      # seed 50 colleges + demo user
```

### 5. Start development server
```bash
npm run dev
```

Visit http://localhost:3000 — you'll see all API endpoints listed.

---

## API Reference

### Auth

#### Register
```
POST /api/auth/register
Content-Type: application/json

{ "email": "user@example.com", "password": "mypassword" }
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{ "email": "user@example.com", "password": "mypassword" }
```
Returns `{ token, user }` — use `token` in `Authorization: Bearer <token>` header for protected routes.

**Demo account:** `demo@example.com` / `demo1234`

---

### Colleges

#### Search & Filter
```
GET /api/colleges?q=iit&state=Maharashtra&type=engineering&minRating=4&maxFees=300000&page=1&limit=20&sortBy=rating&sortOrder=desc
```

All params optional. Response:
```json
{
  "data": [...],
  "meta": { "total": 12, "page": 1, "limit": 20, "totalPages": 1, "hasNext": false, "hasPrev": false }
}
```

#### College Detail
```
GET /api/colleges/:id
```
Returns full college with courses and cutoffs.

#### Filter Metadata
```
GET /api/colleges/meta
```
Returns all available states and types for building filter dropdowns.

---

### Compare
```
POST /api/compare
Content-Type: application/json

{ "ids": ["clxxx1", "clxxx2", "clxxx3"] }
```
Returns a diff object keyed by field — `fees`, `rating`, `established`, `topCourse`, `cutoffRank`.

---

### Predictor
```
POST /api/predict
Content-Type: application/json

{
  "exam": "JEE_MAIN",
  "rank": 5000,
  "category": "general"
}
```
Supported exams: `JEE_MAIN`, `JEE_ADVANCED`, `NEET`, `CAT`, `JAM`, `CUET`  
Supported categories: `general`, `obc`, `sc`, `st`, `ews`

```
GET /api/predict   → returns supported exams and categories
```

---

### Saved Items (requires auth)
```
GET    /api/saved                         → list saved colleges
POST   /api/saved   { "collegeId": "..." } → save college (idempotent)
DELETE /api/saved/:collegeId              → unsave college
```

---

## Deployment (Vercel + Neon)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to https://vercel.com → New Project → Import your GitHub repo
2. Add environment variables:
   - `DATABASE_URL` — your Neon connection string
   - `JWT_SECRET` — your random secret
3. Click **Deploy**

### 3. Run migrations on production
After first deploy, run once:
```bash
npx prisma migrate deploy
```
Or add to your `package.json` build script:
```json
"build": "prisma generate && prisma migrate deploy && next build"
```

### 4. Seed production database (optional)
```bash
DATABASE_URL="<neon-url>" npm run db:seed
```

---

## Project Structure
```
├── prisma/
│   ├── schema.prisma        # DB schema — User, College, Course, Cutoff, SavedItem
│   └── seed.ts              # 50 colleges + demo user
├── src/
│   ├── lib/
│   │   ├── prisma.ts        # Singleton Prisma client
│   │   ├── jwt.ts           # signToken / verifyToken
│   │   ├── errors.ts        # Domain error classes
│   │   └── handleError.ts   # Maps errors to HTTP responses
│   ├── middleware/
│   │   └── auth.ts          # withAuth HOC — JWT guard
│   └── services/
│       ├── auth.service.ts      # register, login
│       ├── college.service.ts   # search, findById, meta
│       ├── compare.service.ts   # compare diff engine
│       ├── predictor.service.ts # rank-based cutoff matching
│       └── saved.service.ts     # save, unsave, list
├── pages/
│   ├── index.tsx            # API directory landing page
│   └── api/
│       ├── auth/register.ts
│       ├── auth/login.ts
│       ├── colleges/index.ts
│       ├── colleges/[id].ts
│       ├── colleges/meta.ts
│       ├── compare.ts
│       ├── predict.ts
│       └── saved/index.ts + [collegeId].ts
└── styles/globals.css
```

---

## Architecture Decisions

**Why route handlers are thin:** All business logic lives in services. Route handlers only parse input (Zod), call a service, and serialize the response. This means services are testable independently without HTTP context.

**Why $transaction for search:** `prisma.$transaction([findMany, count])` runs both queries in parallel — one round-trip instead of two.

**Why upsert for save:** `@@unique([userId, collegeId])` + upsert makes saves idempotent. No race condition, no 409 error needed.

**Why cutoffs are in the DB:** The predictor does a pure SQL range query `rankFrom <= rank <= rankTo`. No application-level loops or hardcoded arrays. Adding new exams means inserting rows, not changing code.

**Why constant-time bcrypt on wrong email:** The dummy hash ensures the same time is spent whether the email exists or not, preventing timing-based email enumeration.

**Why diff is server-computed in compare:** The frontend receives a field-keyed diff object — it never needs comparison logic. This keeps the frontend dumb and the business logic centralized.
