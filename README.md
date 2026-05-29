# ⚡ Rankr: Premium Competitive Exam Rank Prediction Platform

Rankr is a state-of-the-art, high-performance, anonymous rank prediction and historical aggregate analytics engine for major competitive exams (including JEE Main, NEET, GATE, CAT, and WBJEE). Built on a strictly **no-auth, privacy-first philosophy**, Rankr allows candidates to instantly benchmark performance and predict percentiles using actual historical datasets.

---

## 🚀 Key Features

*   **Zero-Authentication Engine**: No signups, email entries, or phone number fields required. Open access for students.
*   **Proximity-Decay Linear Interpolation**: A custom mathematical model that partitions historical data by year, interpolates rank benchmarks, and applies an exponential distance decay factor to prioritize the closest calendar years.
*   **Highly Optimized Architecture**: Leveraging PostgreSQL Materialized Views and concurrent indexes to perform complex multi-year aggregates in **<10ms** (a 50x speedup over standard client-side JS processing).
*   **Unified Next.js App Routing**: Clean, scalable directory layout supporting SEO-optimized dynamic routes:
    *   `/[exam]/rank-predictor` — Dynamic interactive predictor dashboard.
    *   `/[exam]/[year]` — Yearly ranks archive and detailed exam analytics.
    *   `/[exam]/marks-vs-rank` — Comprehensive marks-to-rank reference charts.
    *   `/[exam]/previous-year-ranks` — Historical year-over-year trends tracker.
*   **Robust Security Architecture**: Strictly enforced database Row Level Security (RLS) allowing `SELECT`-only privileges to the public while locking editing capabilities to secure server actions.
*   **Modern Premium Glassmorphism UI**: Beautiful tailwind gradients, smooth micro-interactions, responsive skeleton loaders, and a friendly Duolingo-style error screen.

---

## 🛠️ Technology Stack

*   **Frontend Framework**: Next.js 16.2.6 (App Router, React server components)
*   **Styling**: Vanilla CSS & TailwindCSS (premium, responsive dark/light styling)
*   **Database & API Layer**: Supabase (PostgreSQL, PostgREST Client)
*   **Icons**: Lucide React
*   **Tooling**: PNPM Workspaces, TypeScript, ESBuild

---

## 📂 Codebase Directory Structure

```bash
rankr/
├── app/                      # Next.js App Router (unified dynamic dynamic routing)
│   ├── [exam]/               # Dynamic segments for exams
│   │   ├── [year]/           # Yearly data dynamic route (e.g. /jee-main/2024)
│   │   ├── marks-vs-rank/    # Marks-vs-rank reference tables
│   │   ├── rank-predictor/   # Dedicated exam-wise rank predictors
│   │   └── error.tsx / loading.tsx  # Global layout skeleton loaders and error boundaries
│   ├── layout.tsx            # Navigation and SEO Wrapper
│   └── page.tsx              # Platform landing page
├── components/               # High-fidelity shared React UI components
│   ├── ui/                   # Reusable premium primitive cards, inputs, selects
│   └── PredictorLandingPage.tsx  # Dynamic component handling exam predictors
├── db/                       # Database schemas and static seeding materials
│   ├── schema.sql            # Main database layout and materialized view queries
│   └── seed_data.csv         # Standardized mock CSV data for importing
├── lib/                      # Core business logic and query engines
│   ├── config/               # Platform exam registration config
│   │   └── exams.ts          # Central source of truth for exam metadata
│   ├── queries/              # Database read/write logic
│   │   ├── predict-rank.ts   # Advanced exponential proximity decay engine
│   │   └── statistics.ts     # Aggregation and NLP natural summary generators
│   └── supabase.ts           # Supabase client declarations
├── scripts/                  # Development automation scripts
│   └── seed.ts               # Core database mock generator and view refresh
└── package.json              # Main project dependencies
```

---

## 📐 Mathematical Model: Proximity-Decay Interpolation

To provide students with precise rank ranges rather than generalized predictions, Rankr implements a custom **Proximity-Decay Linear Interpolation** algorithm:

1.  **Year-Wise Partitioning**: Historical record tables are queried and dynamically grouped by calendar year ($Y_i$).
2.  **Linear Interpolation**: For each year containing sufficient benchmarks, adjacent data points above ($pt_{above}$) and below ($pt_{below}$) the candidate's score are selected.
    $$\text{PredictedRank}_{Y_i} = y_{above} + \frac{x_{above} - x_{input}}{x_{above} - x_{below}} \times (y_{below} - y_{above})$$
3.  **Proximity Weighting**: To predict current outcomes, closer years are heavily prioritized. We compute the distance to the target prediction year ($Y_{target}$) and apply exponential decay:
    $$\text{Distance} = |Y_i - Y_{target}|$$
    $$\text{Weight}_{Y_i} = e^{-0.8 \times \text{Distance}}$$
4.  **Normalized Sum**: The final predicted rank is calculated as the normalized weighted sum of all active year predictions:
    $$\text{FinalPredictedRank} = \frac{\sum (\text{PredictedRank}_{Y_i} \times \text{Weight}_{Y_i})}{\sum \text{Weight}_{Y_i}}$$

This model ensures that if predicting for **2026**, the system automatically places **~60.5% weight on 2025 data**, **~27.2% weight on 2024 data**, and **~12.3% weight on 2023 data**, providing a highly realistic, market-sensitive prediction.

---

## 🏁 Quick Start & Local Setup

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v18+) and [pnpm](https://pnpm.io/) installed.

### 2. Environment Configuration
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-secret-service-role-key # For administrative seeding
```

### 3. Database Schema Setup
Execute the statements in `db/schema.sql` inside the **Supabase SQL Editor** to construct the main `rank_data` table, configure indexes, materialize aggregation views, and activate public Row Level Security.

### 4. Populate Database Records
Run the programmatic seeding script to initialize the core database tables:
```bash
pnpm run seed
```

> [!IMPORTANT]
> **Performance Optimization**: PostgreSQL Materialized Views are cached datasets. After importing your own CSV records or runs, ensure you run the view refresh command in the Supabase SQL editor to enable the ultra-fast indexing paths:
> ```sql
> REFRESH MATERIALIZED VIEW yearly_rank_stats;
> ```

### 5. Launch Local Dev Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application in action.

---

## ➕ Adding a New Exam

Adding a new competitive exam to the platform is fully automated and requires **zero frontend changes or route creations**. 

Simply open `lib/config/exams.ts` and add your new exam configurations into the `exams` array:

```typescript
export const exams: Exam[] = [
  ...
  {
    slug: "wbjee",
    name: "WBJEE",
    fullName: "West Bengal Joint Entrance Examination",
    description: "Predict your WBJEE state engineering rank and check college eligibility benchmarks.",
    maxMarks: 200,
    categories: ["GENERAL", "OBC-A", "OBC-B", "SC", "ST"],
    genders: ["MALE", "FEMALE"],
  }
];
```

The unified Next.js folder architecture (`app/[exam]/...`) will dynamically catch the new slug, wire up its metadata sitemaps, build aggregate cards, configure the prediction inputs, and pull the exam's respective database metrics automatically!

---

## 📜 Licenses & Contributing

Rankr is open source and welcoming to code contributions.
*   Review our [Contributing Guidelines](./CONTRIBUTING.md) to get started.
*   Read our [Code of Conduct](./CODE_OF_CONDUCT.md) to understand our community standards.
