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
src/
├── app/                    # Next.js App Router - routing only
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
│
├── components/             # Reusable UI components
│   ├── docs/             # API documentation components
│   ├── CopyButton.tsx
│   ├── CodeBlock.tsx
│   ├── Footer.tsx
│   └── Header.tsx
│
├── constants/             # SEO metadata and API parameters
│
├── lib/
│   ├── server/           # Server-side code (never expose to client)
│   │   ├── db/           # Database clients & mappers
│   │   │   ├── mappings/ # Data mappers (post, tag, post-tags)
│   │   │   ├── supabase.ts
│   │   │   └── upsert.ts
│   │   ├── integrations/ # Third-party integrations
│   │   │   ├── gsheet.ts
│   │   │   └── jwt.client.ts
│   │   ├── env/          # Environment variables
│   │   │   └── server.ts
│   │   └── utils/        # Server utilities
│   │       ├── array/    # Array utilities (duplicates)
│   │       ├── debug/    # Debug utilities (log)
│   │       ├── errors/   # Error handling (api-error, error-handler)
│   │       ├── response/# Response helpers (success, failure)
│   │       └── string/   # String utilities (hash, sanitize, formatting)
│   │
│   └── utils/            # Shared utilities (client-safe)
│       ├── boolean.ts
│       ├── base-url.ts
│       └── index.ts
│
└── types/                 # Global TypeScript definitions
    └── api/              # API-related types
```

---

## Available Commands

```bash
# Development
pnpm run dev              # Start development server
pnpm run build            # Build for production
pnpm run start            # Start production server

# Linting & Formatting
npx eslint .              # Lint all files
npx eslint --fix .        # Fix auto-fixable issues
npx prettier --write .   # Format files

# TypeScript
npx tsc --noEmit          # Type check only

# Testing
pnpm test                 # Run Jest tests
```

---

## Coding Standards

### Naming

- Components: `PascalCase` (`Button.tsx`)
- Functions: `camelCase` (`fetchCouplets`)
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

### Server/Client Separation

- Server-only code goes in `src/lib/server/`
- Never import from `src/lib/server/` in client components
- Use `src/lib/utils/` for shared utilities that are safe for both

---

## API Standards

- Use `success` and `failure` helpers for responses
- Check HTTP methods explicitly
- Handle errors with try/catch
- Validate all inputs with Zod

---

## Supabase Guidelines

- Import from `@/lib/server/db/supabase`
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
