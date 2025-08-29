# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Life-dash is a personal finance dashboard application designed to reduce friction in financial tracking by automating data ingestion and visualizing progress toward user-defined goals. Multi-tenant by design with local-first development and containerized cloud deployment.

## Architecture

**Monorepo Structure:**

- `apps/api/`: `@app/api/` - Elysia.js REST API server with TypeScript (currently minimal implementation)
- `apps/ui/`: `@app/ui/` - Next.js frontend SPA with React 19, heroui/react + framer-motion, reCharts, d3 (currently minimal implementation)
- `apps/bgw/`: `@app/bgw/` - Background worker for data ingestion, categorization, projections, and notifications (currently minimal implementation)
- `modules/dbo/`: `@app/dbo/` - Prisma database operations with MariaDB (currently minimal implementation)
- `modules/shared/`: `@app/shared/` - Shared assets, constants, types, hooks, and utilities (currently minimal implementation)

**Key Technologies:**

- **Runtime:** Bun (primary package manager and runtime)
- **Testing:** Vitest (planned, not yet configured)
- **Backend:** Elysia.js with TypeScript `@app/api` (dependencies: elysia, joi, luxon, axios)
- **Frontend:** Next.js App Router with React 19, heroui/react + framer-motion, reCharts, d3, Tailwind, TypeScript `@app/ui`
- **Database:** MariaDB with Prisma ORM, TypeScript `@app/dbo`
- **Background Worker:** Node.js worker `@app/bgw` for data processing and notifications
- **Shared Resources:** Constants, types, utilities `@app/shared`

## Development Status

**Current State:** Repository is fully scaffolded with proper monorepo structure but contains minimal implementation. All main source files are essentially empty placeholder files.

**Implemented:**

- Complete workspace structure and TypeScript configuration
- Code quality tooling (ESLint flat config, Prettier, Husky pre-commit hooks)
- Package dependencies properly configured per workspace
- Path mapping and aliases configured in tsconfig and bunfig.toml

**To Be Implemented:** Core application logic, database schemas, API endpoints, UI components, background workers

## Important Notes

- **Best Practices** - Follow best practices for code quality, testing, and documentation
- **Linux/macOS only** - Development environment requires Unix-based system
- **Bun primary** - Use Bun commands rather than npm/yarn
- **TypeScript strict** - Full TypeScript coverage with strict configuration
- **Security-first** - All endpoints protected with authentication middleware (planned)
- **Docker** - Dockerfiles and configurations for containerized development and deployment (planned)

## Development Commands

- `bun install` - Install all workspace dependencies
- `bun run format` - Format code with Prettier
- Pre-commit hooks automatically run lint-staged on commit
