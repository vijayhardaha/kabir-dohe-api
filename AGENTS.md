# AGENTS.md - Agentic Coding Guidelines

This document provides agentic coding guidelines for the Kabir Ke Dohe API project.

---

## Tech Stack

| Category   | Technology               |
| ---------- | ------------------------ |
| Framework  | Next.js 16 (App Router)  |
| Language   | TypeScript (Strict mode) |
| Database   | Supabase (PostgreSQL)    |
| Validation | Zod                      |
| Styling    | Tailwind CSS             |
| Testing    | Jest                     |

---

## Project Structure

```
app/                  # Next.js App Router - routing only

components/           # Reusable UI components
└── docs/            # API documentation components

constants/            # SEO metadata and API parameters

lib/                  # Utilities and services
├── db/              # Database clients
├── env/             # Environment variables
├── integrations/    # Third-party integrations
├── services/        # Business logic
└── utils/           # Helper functions

types/                # Global TypeScript definitions
└── api/             # API-related types
```

---

## Available Commands

```bash
# Development
pnpm run dev           # Start development server
pnpm run build         # Build for production
pnpm run start         # Start production server

# Linting & Formatting
npx eslint .                    # Lint all files
npx eslint --fix .              # Fix auto-fixable issues
npx prettier --write .          # Format files

# TypeScript
npx tsc --noEmit               # Type check only

# Testing
pnpm test                       # Run Jest tests
```

---

## Coding Standards

### Naming

- Components: `PascalCase` (`Button.tsx`)
- Functions: `camelCase` (`fetchPosts`)
- Files: `kebab-case` (`api-utils.ts`)
- Constants: `SCREAMING_SNAKE_CASE` (`MAX_RETRIES`)

### Import Order

1. React/Next.js built-ins
2. External libraries
3. Internal aliases (`@/`)
4. Relative imports

### TypeScript

- Use `interface` for object shapes
- Use `type` for unions and tuples
- NO `any` - use `unknown` if uncertain
- Avoid `!` - use optional chaining

---

## API Standards

- Use `success` and `failure` helpers for responses
- Check HTTP methods explicitly
- Handle errors with try/catch
- Validate all inputs with Zod

---

## Supabase Guidelines

- Import from `@/lib/db/supabase`
- Always select specific columns (avoid `SELECT *`)
- Use RLS policies for security
- Never expose Service Role key on client

---

## Validation (Zod)

```typescript
import { z } from "zod";

const CreatePostSchema = z.object({ title: z.string().min(5).max(100), content: z.string().min(10) });
```

---

## JSDoc Requirements

Add JSDoc to:

- Exported functions and hooks
- Complex utility functions
- Types and interfaces

Skip for:

- Obvious props (`className`, `children`)
- Simple interfaces
