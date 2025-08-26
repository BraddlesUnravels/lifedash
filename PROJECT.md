# Personal Finance Dashboard — Project Overview

## Elevator Pitch

Build a fun, low-friction personal finance dashboard that reduces anxiety by automating data ingestion and visualizing progress toward user-defined goals. Multi-tenant by design: anyone can add accounts, budgets, and goals. Runs locally first; ships to the cloud via containers.

## Objectives

- **Reduce friction**: automated data import (CSV exports now; bank APIs later).
- **Clarity fast**: weekly/monthly cashflow, debt payoff, savings trajectory, data visualization.
- **Goal-centric**: users define time-bound goals, dashboard shows probability and path to success.
- **Portfolio-ready**: clean, documented, testable code with CI/CD.

## Non-Goals

- Tax advice, financial recommendations, or direct bank integrations on day one.
- Hard-coding Brad’s goals; they exist only as seed/demo data.

## Tech Stack

- **Frontend**: React 19, heroui/react + framer-motion, reCharts, d3, Tailwind, Typescript, and Vite
- **Backend**: ElysiaJS (Bun), TypeScript. Joi for validation. TypeORM (MySQL).
- **Luxon**: Project wide Date/time manipulation and formatting, all times stored in UTC and converted to local before display.
- **Tagging & Categorization**: Run a Node worker that auto-tags transactions by merchant (Woolies = groceries, Shell = fuel). Use ML-lite (e.g. TensorFlow.js) if you want to train it to learn your habits.
- **Infra**: Docker, docker-compose (dev), MySQL (Schema & migrations managed via TypeORM).
- **CI/CD**: GitHub Actions → container build → registry → deploy (Google cloud app services, ECS/Fargate or Azure Container Apps).
- **Obs/Sec**: Pino logs (JSON), OpenTelemetry hooks, JWT auth (Paseto preferred), OWASP headers, rate limiting.

## High-Level Architecture

- **API (Elysia)**: auth, users, accounts, transactions, budgets, goals, projections.
- **Worker**: background ingestion, categorization, projections, notifications.
- **Web**: SPA with routes: Dashboard, Transactions, Goals, Budgets, Settings.
- **DB**: MySQL schemas; Redis for jobs and ephemeral caches (consider in architecture for later integration).

## DataBase (MySQL)

- All timestamps should be stored in UTC. If not recorded in UTC, they should be converted to UTC upon ingestion.

## Data Model (minimal)

- `User(id, email, hashed_password, created_at)`
- `Account(id, user_id, name, type, provider, currency)`
- `Transaction(id, account_id, date, amount, merchant, category, notes, imported_source)`
- `RecurringTransaction(id, user_id, name, amount, frequency, next_date)`
- `Goal(id, user_id, name, target_amount, deadline, type, priority, status)`
- `Budget(id, user_id, period, amount_total)`
- `BudgetItem(id, budget_id, category, amount_cap)`
- `Notification(id, user_id, type, message, created_at, read_at)`

## API Surface (sample)

- `POST /auth/register | /auth/login`
- `GET /me`
- `POST /accounts` / `GET /accounts`
- `POST /transactions/import` (CSV), `GET /transactions?filters`
- `POST /goals` / `GET /goals` / `GET /goals/:id/projection`
- `GET /dashboard/summary` (aggregate KPIs)
- `POST /budgets` / `GET /budgets/current`

## Frontend Views

- **Dashboard**: net worth sparkline, cashflow chart, debt snowball timeline, goal progress rings, alerts.
- **Transactions**: list + bulk recategorization, rules.
- **Goals**: create/edit; Monte-Carlo-lite projection; “what-if” sliders (monthly savings, timeframe).
- **Budgets**: envelope view; overspend indicators.
- **Settings**: currency, categories, import rules, API keys (future).

## Data Visualization (sample)

- **Sankey diagrams**: visualize cash flow through different categories and time periods. Identify bottlenecks & leaks.
- **Time series charts**: track income, expenses, and savings over time. Spot trends and anomalies.
- **Calendar heatmap**: see which days you spend the most (spikes in red).
- **Goal progress bars**: visualize how close you are to achieving each financial goal.

## User Notifications

- **Types**: alerts, reminders, confirmations.
- **Delivery**: in-app, slack, discord, email & SMS (future).
- **Settings**: user preferences for notification channels and frequencies.

## Deployment & Config

- Twelve-Factor: `.env` only; no secrets in code.
- CORS: API reads allowed origins from `ALLOWED_ORIGINS` env.
- Migrations via Prisma; seed script includes demo goals.

## Testing

- **API**: Vitest + supertest for routes & schemas.
- **Web**: Vitest + RTL + MSW.
- **E2E**: Playwright (happy paths: import CSV → goals → dashboard).

## Roadmap (phased)

1. **MVP**: local compose; CSV import; dashboard KPIs; create goals; basic projections.
2. **Debt strategy**: snowball/avalanche simulator + schedule.
3. **Rules engine**: auto-categorization & recurring detection.
4. **Cloud**: push images, one-click deploy; add metrics & alerts.
5. **Nice-to-have**: bank APIs, webhooks, notifications, multi-currency.

## Demo Seed (example goals, not hard-coded)

- Buy home in 4 years (deposit target 80k).
- Finance car (<40k) in 18 months.
- Pay off two credit cards (<12 months totalling 12k).
- Overseas holiday (min 1 week) in 6–12 months (budget 5k).

## Repo Structure

```
.github
.husky
.vscode
/apps
  /api        # ElysiaJS API (src, tests)
    /__tests__
    /src
  /ui        # React app (src, tests)
    /__tests__
    /src
  /bgw        # Background worker (src, tests)
    /__tests__
    /src
/modules
  /shared
    # Shared images, files, constants, types, hooks, utils etc.
  /dbo
    # TypeORM entities and migrations
```
