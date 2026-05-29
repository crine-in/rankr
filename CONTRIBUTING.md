# Contributing to Rankr

Thank you for your interest in contributing to **Rankr**! This project is designed to be a high-performance, developer-friendly, and accessible platform to assist students across competitive exams. Contributions are what make the open-source community such an amazing place to learn, inspire, and create.

---

## 🗺️ How Can I Contribute?

There are many ways you can contribute to the growth and refinement of Rankr:

1.  **Adding Exam Configurations & Datasets**: Expand our dataset references by adding configurations in `lib/config/exams.ts` and preparing seeding tables.
2.  **Reporting Bugs**: Open an issue detailing standard reproduction steps, expected versus actual behaviors, and environment configurations.
3.  **Proposing Features**: Propose UX updates, charting tools, or statistical algorithms to improve the accuracy of our prediction engines.
4.  **Improving Documentation**: Refine instructions, correct typos, or add code-level annotations.

---

## 💻 Local Development Setup

To configure your machine for local development:

### 1. Fork and Clone
```bash
git clone https://github.com/your-username/rankr.git
cd rankr
```

### 2. Install Dependencies
Rankr uses `pnpm` workspaces for swift dependency management. Do not use `npm` or `yarn` directly:
```bash
pnpm install
```

### 3. Setup Supabase
You will need a Supabase instance running. Apply the main schema in the **Supabase SQL Editor**:
*   Navigate to your project dashboard.
*   Open SQL Editor -> New Query.
*   Paste and run the contents of [db/schema.sql](./db/schema.sql).

Configure your `.env.local` according to the instructions in the [README.md](./README.md).

### 4. Run the Development Server
```bash
pnpm dev
```
Navigate to `http://localhost:3000` to preview your changes in real-time.

---

## ➕ Adding a New Exam (Developer Steps)

We have designed our architecture to make scaling to new exams incredibly simple:

1.  Open [lib/config/exams.ts](./lib/config/exams.ts).
2.  Append a new `Exam` configuration block into the export list. Specify the exact categories, max marks, and display titles.
3.  Add historical benchmark csv records to [db/seed_data.csv](./db/seed_data.csv) (or create your own insert script).
4.  Run `pnpm run seed` to generate mock values (optional for dev) or use your raw database ingestion.
5.  **Crucial Step**: Ensure you run `REFRESH MATERIALIZED VIEW yearly_rank_stats;` in the Supabase SQL editor so the new exam's statistics card compiles in <10ms!

---

## 🎨 Coding Standards & Conventions

To maintain codebase health and consistency:

*   **TypeScript**: Rankr is strictly type-safe. Ensure there are no implicit `any` statements or skipped types. Run `npx tsc --noEmit` to verify type safety.
*   **Next.js App Router**:
    *   Place client-side code (`"use client"`) strictly at the leaf component level where user interaction occurs.
    *   Maintain server component structures (`async/await` data fetching) for layouts and pages to maximize SEO and caching benefits.
*   **Vanilla CSS / Tailwind**: Rely on established global design parameters. Avoid ad-hoc values; instead, use Tailwind standard spacing and tailwind palettes.
*   **Formatting**: We recommend keeping code formatted with standard formatting tools.

---

## 📥 Submitting a Pull Request

When you are ready to submit your code:

1.  **Branching**: Create a descriptive feature branch from `main`:
    ```bash
    git checkout -b feat/add-marks-vs-rank-chart
    ```
2.  **Lint & Compile**: Run local type verification before committing:
    ```bash
    rm -rf .next && npx tsc --noEmit
    ```
3.  **Commit Messages**: Keep commit messages concise and informative:
    *   `feat: add dynamic linear year weight scaling to predictor`
    *   `fix: resolve wbjee layout loading state flash`
4.  **Submit PR**: Open a Pull Request on GitHub. Detail:
    *   What the change accomplishes.
    *   How you verified the changes (include screenshots/GIFs for UI changes).
    *   Any open questions or architectural trade-offs you made.

We review all pull requests promptly. Thank you for contributing to Rankr!
