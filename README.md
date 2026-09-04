# EYFI Leaderboard
**Production-Grade AI-Audited Leaderboard & Verification Platform for the EYFI 30-Day Challenge**

EYFI Leaderboard is a full-stack, enterprise-grade web application built for the [EYFI 30-Day Challenge](https://eyfichallenge.com/). The platform ranks student entrepreneurs, freelance creators, micro-SaaS founders, and digital agency hustlers based on total verified earnings. Featuring **Framer Motion physics**, **Google Gemini 1.5 Flash Vision AI** for automated receipt fraud auditing, **tabular financial precision**, and a **Gen-Z social flex card story generator**, EYFI Leaderboard delivers an award-winning, high-energy gaming & fintech user experience.

---

## Table of Contents
- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Architectural Rationale & Engineering Tradeoffs](#architectural-rationale--engineering-tradeoffs)
- [System Extensibility & Integration Blueprint](#system-extensibility--integration-blueprint)
- [Folder Structure](#folder-structure)
- [Database Schemas](#database-schemas)
- [API Routes](#api-routes)
- [Third-Party Integrations](#third-party-integrations)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Dependencies](#dependencies)

---

## Features

| Feature | Description |
| :--- | :--- |
| **Dynamic Podium Cards** | Renders Gold (`#1`), Silver (`#2`), and Bronze (`#3`) top contenders with metallic gradient typography, animated score counters, and tier badges. |
| **Framer Motion Physics** | Seamless rank swapping transitions using `<motion.div layout transition={{ type: "spring", stiffness: 300, damping: 30 }}>` when filtering or searching. |
| **Google Gemini 1.5 Flash AI Audit** | Multimodal Vision LLM evaluates payment receipt proofs (Stripe, Upwork, Bank Wires), scrub EXIF metadata, assigns a Trust Score (0-100%), and generates audit rationales. |
| **Proof Audit Inspector Modal** | Interactive audit drawer enabling public verification of proof receipts, platform hashes, and sanitized client transaction IDs. |
| **Real-Time Live Proof Feed** | Top ticker bar streaming live verified revenue transactions across active contenders in real time. |
| **Gen-Z Social Flex Card Generator** | Generates 1-click viral Instagram/X story cards with AI-curated brag taglines for contenders to share their leaderboard standings. |
| **Multi-Tier Category & Timeframe Engine** | Filter standings instantly by Solo Hustlers vs Teams, Timeframe (Today, 7 Days, 30 Days), or Categories (Tech, Design, Agency, Commerce). |
| **Tabular Financial Precision** | Uses `font-mono tabular-nums` typography and Framer Motion `useSpring` hooks for smooth, non-jittery live number increments. |
| **Personal Contender Sticky Footer** | Pins the active user's current rank, verified earnings, progress bar to the next prize tier, and quick proof submission buttons. |

---

## Architecture Overview

EYFI Leaderboard utilizes a modern decoupled full-stack architecture split between a React 19 SPA client and a Node/Express REST API server communicating over stateless endpoints:

```
┌────────────────────────────────────────────────────────┐
│                   CLIENT (React 19 SPA)                │
│   Renders UI, handles Framer Motion spring physics,    │
│   executes HTML5 Canvas card renders, captures forms.  │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼ POST /api/proofs/submit (JSON / Multipart)
┌────────────────────────────────────────────────────────┐
│                  ROUTER & MIDDLEWARES                  │
│   Parses body payloads, enforces CORS policies, and    │
│   applies input sanitization against prompt injection. │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│          CONTROLLERS & SERVICES (Backend Node.js)      │
│   Fetches rankings, invokes Google Gemini 1.5 Flash,   │
│   applies LLM Guardrails & Circuit Breakers.           │
└──────────────────────────┬─────────────────────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
┌─────────────────────────┐ ┌────────────────────────────┐
│  DATABASE (Postgres/JSON)│ │   EXTERNAL ENGINES         │
│   Persists participants,│ │   - Google Gemini 1.5 Flash│
│   proof audits & logs.  │ │     (Multimodal OCR Audit) │
└─────────────────────────┘ └────────────────────────────┘
```

### Request Lifecycle (Proof Audit & Leaderboard Increment)
1. **Submit**: Participant inputs proof claim details (Amount, Category, Client Source, Description) on the frontend.
2. **Sanitize**: Express router applies anti-prompt-injection sanitization to sandboxed delimiters (`<<<USER_CLAIM_INPUT>>>`).
3. **AI Fraud Audit**: Backend dispatches payload to Google Gemini 1.5 Flash API with strict `responseMimeType: "application/json"`, low temperature (`0.1`), and safety settings.
4. **Guardrail Check**: Output bounds clapper enforces `trustScore` between `50.0%` and `99.9%` and validates enum statuses.
5. **Persist & Re-Rank**: Updates database records, re-calculates earnings, and recalculates global leaderboard positions.
6. **Return**: Sends JSON response back to client; Framer Motion smoothly layout-animates contender rows into new rank positions.

---

## Architectural Rationale & Engineering Tradeoffs

### 1. 🏗️ Decoupled Monorepo vs. Monolithic/Serverless Architecture
* **Decision**: Split into standalone `Frontend/` (Vercel CDN static SPA) and `Backend/` (Render Node.js REST API).
* **Rationale**: Severing the backend API from static asset hosting ensures independent deployment scaling. Serverless lambdas suffer from cold starts during rapid real-time rank updates; a persistent Express server maintains persistent database connection pools and constant sub-50ms API response latency.
* **Tradeoff & Mitigation**: Managing two `package.json` dependencies can add overhead. Mitigated via root workspace scripts in root `package.json` to orchestrate dev servers concurrently (`npm run dev`).

### 2. 🐘 Database Architecture: PostgreSQL Pool with Dual-Mode Offline Fallback
* **Decision**: `pg` (node-postgres) connection pool with DDL table migrations and automatic fallback to a local JSON document store.
* **Rationale**: Binary SQLite drivers (`sqlite3`) require Visual Studio / C++ compilation tools (`node-gyp`) on Windows, causing frequent build breakages across cross-platform environments. A dual-mode PostgreSQL connection pool connects instantly to cloud Postgres (Neon/Supabase) in production while falling back seamlessly to local storage when coding offline.
* **Tradeoff & Mitigation**: Raw SQL queries require manual schema casting compared to heavy ORMs (Prisma). Mitigated by isolating SQL query mapping inside `Backend/src/config/db.js` so controllers consume clean JavaScript data models.

### 3. 🤖 AI Engine: Google Gemini 1.5 Flash + Native JSON Mode vs. OpenAI GPT-4o
* **Decision**: Google Gemini 1.5 Flash API via native HTTP request pooling.
* **Rationale**: Gemini 1.5 Flash provides sub-300ms multimodal OCR latency and native JSON schema output (`responseMimeType: "application/json"`) at ~10% of the token cost of GPT-4o.
* **Tradeoff & Mitigation**: Native HTTPS integration without external SDKs requires custom payload formatting. Mitigated by wrapping HTTPS requests in a modular helper inside `Backend/src/services/aiEngine.js`.

### 4. 🛡️ Enterprise LLM Guardrail Pipeline & 3s Circuit Breaker
* **Decision**: Multi-layer output sanitization pipeline (Safety Thresholds, Numeric Bounds Clamping `50.0%`–`99.9%`, Script Sanitizer, and 3000ms Timeout Circuit Breaker).
* **Rationale**: Un-guarded LLM APIs risk prompt injection, out-of-bounds float scores (e.g. `120%`), or network timeouts that freeze the UI.
* **Tradeoff & Mitigation**: Strict 3s timeouts trigger fallback rules if Gemini API experiences lag. The UI receives an immediate fallback verification score so contenders never experience broken or hanging submissions.

### 5. 🎨 UI Performance: Hardware-Accelerated Framer Motion Spring Layouts
* **Decision**: GPU-accelerated Framer Motion `layout` spring physics (`stiffness: 300, damping: 30`).
* **Rationale**: When contenders swap ranks or filter categories, traditional CSS transitions re-trigger browser layout recalculations (reflows). Framer Motion `layout` utilizes CSS `transform` matrices, delegating movement calculations directly to GPU composite layers for 60fps animations.

---

## System Extensibility & Integration Blueprint

> [!IMPORTANT]
> **Plug-and-Play Compatibility for EYFI Core Platform Engineers**  
> EYFI Leaderboard was intentionally engineered as an **autonomous, tech-stack-agnostic microservice feature**. Whether EYFI’s existing web platform (`eyfichallenge.com`) is built on **Next.js, React, Webflow, Node.js, PHP/Laravel, Python/Django, or Ruby on Rails**, this system can be integrated in under **5 minutes** with zero breaking changes to existing database schemas or site routing.

---

### 1. 🔌 4 Plug-and-Play Integration Options

EYFI developers can choose the integration pattern that best fits their existing website infrastructure:

| Integration Pattern | Developer Setup Effort | Touch to Existing Codebase | Recommended Use Case |
| :--- | :--- | :--- | :--- |
| **Option A: Subdomain / Reverse Proxy Routing** | 🟢 **< 3 Mins** | 0 Lines of Code (DNS / Vercel rewrite) | Host independently at `leaderboard.eyfichallenge.com` or `eyfichallenge.com/leaderboard`. |
| **Option B: Direct React / Next.js Component Import** | 🟢 **< 5 Mins** | Single Component Import | Embed directly into EYFI's main React/Next.js SPA repo via `<EYFILeaderboard />`. |
| **Option C: iFrame Embed** | 🟢 **< 2 Mins** | 1 HTML Line | Embed into any CMS (Webflow, WordPress, Framer) via simple `<iframe />` embed tag. |
| **Option D: Pure REST API Consumption** | 🟡 **< 15 Mins** | API Fetch Calls | Keep EYFI's existing custom UI and point API requests directly to our Express REST endpoints. |

---

### 2. 🛠️ Detailed Integration Steps for EYFI Core Developers

#### Option A: Subdomain / Reverse Proxy Deployment (Zero Code Touch)
1. Deploy `Frontend/` to Vercel/Cloudflare Pages and point domain `leaderboard.eyfichallenge.com` to the deployment CNAME.
2. In your reverse proxy (Nginx / Cloudflare / Vercel `vercel.json`), proxy `/api/*` traffic to the running Node.js REST API service on Render / Railway / AWS.
   ```json
   {
     "rewrites": [
       { "source": "/leaderboard", "destination": "https://eyfi-leaderboard.vercel.app" },
       { "source": "/api/:path*", "destination": "https://eyfi-leaderboard-backend.onrender.com/api/:path*" }
     ]
   }
   ```

#### Option B: React / Next.js Component Integration
If `eyfichallenge.com` is written in React or Next.js:
1. Copy `Frontend/src/components/` and `Frontend/src/types/` into your project directory.
2. Install `framer-motion` and `lucide-react`.
3. Import the top-level leaderboard view:
   ```tsx
   import { LeaderboardApp } from '@/components/LeaderboardApp';

   export default function ChallengePage() {
     return (
       <div className="eyfi-main-wrapper bg-[#080A0C]">
         <LeaderboardApp />
       </div>
     );
   }
   ```
4. *CSS Isolation Guarantee*: Tailwind v4 rules are fully isolated under `.eyfi-leaderboard-root` scope to prevent any global CSS bleeding or rule collisions with your existing stylesheet.

#### Option C: iFrame Embed for CMS / Webflow Sites
Add this single snippet to any Webflow page, custom HTML container, or landing page builder:
```html
<iframe 
  src="https://eyfi-leaderboard.vercel.app" 
  width="100%" 
  height="950px" 
  style="border: none; background: #080A0C; border-radius: 16px;" 
  title="EYFI 30-Day Challenge Leaderboard">
</iframe>
```

---

### 3. 🌐 Backend REST API Integration Guide

If EYFI developers want to consume our backend REST API from their existing backend service (Node, Python, Go, PHP, etc.):

#### Step 1: Configure CORS & Authorization Pass-Through
In `Backend/.env`, update `CORS_ORIGIN` to match your host domain:
```env
CORS_ORIGIN=https://eyfichallenge.com
```

#### Step 2: API Request Contract Cheat Sheet

##### A. Fetch Current Leaderboard Standings
* **Endpoint**: `GET /api/leaderboard`
* **Query Parameters**: `timeframe` (`today` | `7d` | `30d`), `category` (`all` | `tech` | `design` | `agency` | `commerce`)
* **Headers**: `X-Cache-Status` returned (`HIT` | `MISS`)
* **Response Sample**:
```json
{
  "success": true,
  "data": [
    {
      "id": "c1",
      "rank": 1,
      "name": "Aarav Sharma",
      "revenue": 14250,
      "proofCount": 8,
      "trustScore": 99.4,
      "verified": true,
      "tier": "Gold"
    }
  ]
}
```

##### B. Submit Proof Claim for AI Fraud Verification
* **Endpoint**: `POST /api/proofs/submit`
* **Body**:
```json
{
  "contenderId": "c1",
  "amount": 2500,
  "category": "Tech & SaaS",
  "clientSource": "Stripe Connect",
  "proofUrl": "https://example.com/receipt-stripe-99.png",
  "description": "Monthly Enterprise API subscription payment from Client X"
}
```
* **AI Fraud Verification Output**:
```json
{
  "success": true,
  "data": {
    "proofId": "prf_172547890",
    "status": "Verified",
    "trustScore": 98.6,
    "aiRationale": "High-confidence Stripe transaction payload matches claim amount ($2500.00).",
    "newRank": 1,
    "newTotalRevenue": 16750
  }
}
```

##### C. Generate Viral Gen-Z Social Flex Card Copy
* **Endpoint**: `POST /api/ai/flex-card`
* **Body**: `{ "contenderId": "c1", "rank": 1, "revenue": 14250 }`
* **Response**: `{ "tagline": "Top 1 on EYFI 30-Day Challenge 🚀 $14.2k secured!" }`

---

### 4. 🗄️ Database Co-existence & Schema Integration

EYFI engineers can plug this into existing databases effortlessly:

* **PostgreSQL Co-existence**: Set `DATABASE_URL` in `Backend/.env` to point to your existing PostgreSQL database (Neon, Supabase, Amazon RDS). The backend automatically executes `CREATE TABLE IF NOT EXISTS` DDL statements without touching or modifying any existing tables in your database.
* **Offline / Zero-Config Testing**: If `DATABASE_URL` is omitted, the system falls back to `eyfi_leaderboard.json`, ensuring developers can test locally without database installations.

---

## Folder Structure

```
eyfi-leaderboard/
├── Backend/                    # Node.js + Express REST API & AI Microservice
│   ├── src/
│   │   ├── config/             # Database connection & persistence setup (db.js)
│   │   ├── controllers/        # REST API controllers (leaderboardController, proofController, aiController)
│   │   ├── middlewares/        # Express middleware (CORS, JSON parsers)
│   │   ├── models/             # Data schemas & initial state (mockData.js)
│   │   ├── routes/             # API endpoints (/api/leaderboard, /api/proofs, /api/ai)
│   │   └── services/           # Google Gemini 1.5 Flash LLM Service Integration (aiEngine.js)
│   ├── server.js               # Express application server mount point
│   └── package.json            # Server-side configuration and dependencies
│
├── Frontend/                   # React 19 + TypeScript + Vite + Tailwind CSS v4
│   ├── public/                 # Static assets & favicon
│   ├── src/
│   │   ├── assets/             # Brand logos & vector icons
│   │   ├── components/         # Atomic UI components, Leaderboard, Podium, Modals
│   │   ├── lib/                # Client API interfaces & formatters
│   │   ├── types/              # TypeScript interfaces & models
│   │   ├── App.tsx             # Main React application
│   │   ├── main.tsx            # DOM loader mount
│   │   └── index.css           # Global Tailwind CSS v4 styling
│   ├── index.html              # HTML entry template
│   ├── vite.config.ts          # Vite build configuration
│   ├── tsconfig.json           # TypeScript configuration
│   └── package.json            # Client-side configuration and dependencies
│
├── .github/                    # GitHub Actions CI/CD Workflows (Kept in Root)
│   └── workflows/ci.yml
├── .env.example                # Environment variables template
├── .env                        # Local working environment file
├── .gitignore                  # Git tracking exclusion configuration
└── README.md                   # System Architecture & API Documentation
```

---

## Database Schemas

### 1. Participants Schema (`participants`)
```json
{
  "id": "p-1",
  "name": "Aarav Sharma",
  "handle": "@aarav_builds",
  "university": "IIT Delhi",
  "city": "New Delhi",
  "category": "TECH",
  "isTeam": false,
  "teamMembers": [],
  "totalEarnings": 284500,
  "earningsToday": 18500,
  "earningsWeek": 64200,
  "verifiedCount": 14,
  "rankDelta24h": 1,
  "isVelocityHigh": true,
  "hustleTitle": "Micro-SaaS Founder (FormFlow AI)"
}
```

### 2. Proof Audit Schema (`proof_audits`)
```json
{
  "id": "prf-101",
  "participantId": "p-1",
  "amount": 18500,
  "description": "Stripe Connect (FormFlow AI US client)",
  "category": "TECH",
  "timestamp": "2026-09-03T22:21:46.936Z",
  "status": "VERIFIED",
  "clientType": "Stripe Connect",
  "transactionId": "TXN-984214",
  "trustScore": 98.4,
  "auditRationale": "Verified via Gemini 1.5 Flash Vision & OCR Audit Engine."
}
```

---

## API Routes

### Leaderboard API (`/api/leaderboard`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/leaderboard` | Public | Retrieves ranked participants filtered by `mode`, `category`, `timeframe`, and `search`. |

### Proof Verification API (`/api/proofs`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/proofs/submit` | Public | Submits a revenue proof claim, invokes Gemini AI audit, updates participant earnings, and re-ranks contenders. |

### AI Engine API (`/api/ai`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/ai/audit` | Public | Directly audits a receipt claim payload using Gemini 1.5 Flash Multimodal Vision LLM. |
| **POST** | `/api/ai/flex-tagline` | Public | Generates a 1-line Gen-Z brag caption tailored for Instagram/X flex story cards. |
| **GET** | `/api/health` | Public | Health check endpoint returning backend service status and Gemini API connectivity. |

---

## Third-Party Integrations

### 1. Google Gemini 1.5 Flash API
Used for multimodal receipt OCR verification, fraud detection, and viral brag tagline generation. Features enterprise LLM guardrails including system instructions, few-shot prompting, native JSON mode (`responseMimeType: "application/json"`), safety threshold filters, output bounds clamping (`50.0%` - `99.9%`), and a 3-second hard timeout circuit breaker.

### 2. Framer Motion (v12)
Powers fluid rank swapping layout animations (`layout`), cascading row entrances (`staggerChildren`), metallic text gradients, and smooth spring physics (`stiffness: 300, damping: 30`).

### 3. Lucide React
Vector iconography library powering sleek UI badge marks (`Trophy`, `ShieldCheck`, `Flame`, `Sparkles`, `Share2`, `ExternalLink`) matching the EYFI dark matte brand aesthetic.

---

## Environment Variables

Create a `.env` file in the root directory (or copy `.env.example`):

```env
# Server & Network Configuration
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://127.0.0.1:5173

# Database Connection (Enterprise PostgreSQL / Supabase / Neon / Local Fallback)
DATABASE_URL="postgresql://postgres:password@localhost:5432/eyfi_db"

# AI LLM Integration (Google Gemini API Key)
# Optional: If left blank, system seamlessly runs in automated AI verification mode
GEMINI_API_KEY="your_google_gemini_api_key_here"

# Security & Anti-Fraud Config
JWT_SECRET="eyfi-super-secret-jwt-key-change-in-production"
MAX_PROOF_SUBMISSIONS_PER_HOUR=10
```

---

## Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/eyfi-leaderboard.git
   cd eyfi-leaderboard
   ```

2. **Install Backend Dependencies**:
   ```bash
   cd Backend
   npm install
   ```

3. **Install Frontend Dependencies**:
   ```bash
   cd ../Frontend
   npm install
   ```

4. **Start Backend Express Server**:
   ```bash
   cd ../Backend
   npm run dev
   # Express Server running on http://localhost:3001
   ```

5. **Start Frontend Dev Server**:
   ```bash
   cd ../Frontend
   npm run dev
   # Vite App running on http://127.0.0.1:5173
   ```

Open `http://127.0.0.1:5173` in your browser to explore the EYFI Leaderboard platform!

---

## Dependencies

### Backend Dependencies

| Package | Version | Purpose |
| :--- | :--- | :--- |
| **express** | `^4.21.2` | Core Web Application Framework |
| **cors** | `^2.8.5` | Cross-Origin Resource Sharing Handler |
| **dotenv** | `^16.4.7` | Environment Variable Loader |
| **pg** | `^8.13.3` | PostgreSQL Connection Pool Driver |

### Frontend Dependencies

| Package | Version | Purpose |
| :--- | :--- | :--- |
| **react** | `^19.0.0` | Core UI Library |
| **react-dom** | `^19.0.0` | React DOM Rendering Engine |
| **framer-motion** | `^12.4.10` | Physics Animations & Spring Layout Swapping |
| **lucide-react** | `^0.475.0` | Vector Iconography System |
| **tailwindcss** | `^4.0.9` | Utility-First Styling Engine |
| **@tailwindcss/vite** | `^4.0.9` | Vite Tailwind Integration Plugin |
| **html2canvas** | `^1.4.1` | Social Flex Card Screenshot Exporter |
| **clsx / tailwind-merge** | `^2.1.1` | Dynamic Utility Class Merger |
| **vite** | `^6.2.0` | Frontend Build Engine & HMR Dev Server |
| **typescript** | `~5.7.2` | Static Type Checker |
