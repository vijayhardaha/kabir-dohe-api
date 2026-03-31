# AGENTS.md - Agentic Coding Guidelines

This document provides agentic coding guidelines for the Kabir Dohe API project.

---

## Tech Stack

| Category        | Technology               |
| --------------- | ------------------------ |
| Framework       | Next.js 16 (App Router)  |
| Language        | TypeScript (Strict mode) |
| Database        | Supabase (PostgreSQL)    |
| Validation      | Zod                      |
| Styling         | Tailwind CSS             |
| Testing         | Vitest                   |
| Package Manager | Bun                      |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router - routing only
│   ├── api/               # API routes
│   │   └── couplets/     # Couplets API endpoint
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
│
├── components/             # Reusable UI components
│   ├── docs/             # API documentation components
│   │   ├── Introduction.tsx
│   │   ├── QueryParameters.tsx
│   │   ├── ResponseFormat.tsx
│   │   ├── ErrorResponse.tsx
│   │   └── UsageExamples.tsx
│   ├── CopyButton.tsx
│   ├── CodeBlock.tsx
│   ├── Footer.tsx
│   └── Header.tsx
│
├── constants/             # SEO metadata and API parameters
│
├── lib/
│   ├── server/           # Server-side code (never expose to client)
│   │   ├── db/          # Database clients
│   │   │   └── supabase.ts
│   │   ├── env/         # Environment variables
│   │   │   └── server.ts
│   │   └── utils/       # Server utilities
│   │       ├── errors/  # Error handling
│   │       │   ├── api-error.ts
│   │       │   └── error-handler.ts
│   │       ├── response/ # Response helpers
│   │       │   ├── response.ts
│   │       │   └── response.test.ts
│   │       └── string/  # String utilities
│   │           ├── sanitize.ts
│   │           └── formatting.ts
│   │
│   └── utils/            # Shared utilities (client-safe)
│       ├── seo.ts        # SEO utilities (siteUrl, cleanPath, getPermaLink)
│       ├── schema.ts     # JSON-LD schema builders
│       └── base-url.ts   # Base URL helper
│
└── types/                 # Global TypeScript definitions
    └── api/              # API-related types
```

---

## Scripts

```
scripts/
├── sync.ts               # Database sync script (Google Sheets → Supabase)
│                         # Usage: bun run sync (dev) or bun run sync:prod (prod)
├── indexnow.ts           # IndexNow API submission script
│                         # Usage: bun run indexnow
└── lib/
    ├── env.ts            # Environment loader & validation (Zod schema)
    ├── supabase.ts      # Supabase client factory
    ├── gsheet.ts        # Google Sheets integration (fetch, validate, transform)
    └── db.ts            # Database operations (batch upserts for posts, tags, categories, mappings)
```

---

## Commit Message Format

```
# Subject line: lowercase, max 50 characters
fix: standardize react types in components

# Body: can have normal case, describe changes
- Add react import for consistent type usage
- Use React.JSX.Element for return types
```

---

## Committing Changes

After completing a task:

1. Run `git status` and `git diff` to review changes
2. Group changes into logical commits:
   - **One file changed**: Single commit
   - **Multiple files with similar changes**: One commit per logical change
   - **Unrelated changes**: Separate commits
3. Prepare `git add` and `git commit` commands following commitlint rules:
   - Max subject: 50 characters
   - Max body line: 72 characters
   - Subject must be lowercase
4. Update `.tmp/git.md` with the new prepared commands
5. Remove stale commits from `.tmp/git.md` when changes are committed

### `.tmp/git.md` Rules

- `.tmp/git.md` holds prepared commit commands for the current task session.
- If `.tmp/git.md` has been **cleared or modified by the user**, do NOT restore previous commit entries.
- When resuming work, read `.tmp/git.md` first. If it is empty or changed, start fresh — only check unstaged changes (`git status`/`git diff`) and prepare new commit commands for those changes.
- Never assume old commits from a previous session are still relevant. The user may have committed them manually or discarded them.

Output the exact git commands. Do NOT commit automatically.

---

## Available Commands

```bash
# Development
bun run dev              # Start development server
bun run build            # Build for production
bun run start            # Start production server

# Linting & Formatting
bun run lint             # Lint all files
bun run lint:fix         # Fix auto-fixable issues
bun run format           # Format files
bun run format:check     # Check formatting

# Scripts (Database Sync)
bun run sync             # Sync database in development mode (.env.local)
bun run sync:prod        # Sync database in production mode (.env.production)
bun run indexnow         # Submit sitemap URLs to IndexNow

# Testing
bun run test            # Run tests once
bun run test:watch     # Run tests in watch mode
bun run test:coverage  # Run tests with coverage

# Supabase Migrations
supabase migration new <name>  # Create new migration file
```

---

## Utils Knowledge Base

### Client-Safe Utils (`src/lib/utils/`)

| File        | Function               | Description                                            |
| ----------- | ---------------------- | ------------------------------------------------------ |
| `seo.ts`    | `siteUrl()`            | Returns normalized base URL for the application        |
| `seo.ts`    | `cleanPath(slug)`      | Normalizes a slug by removing leading/trailing slashes |
| `seo.ts`    | `getPermaLink(slug)`   | Generates fully qualified canonical URL                |
| `schema.ts` | `personSchema()`       | Builds Schema.org Person entity                        |
| `schema.ts` | `webApiSchema()`       | Builds Schema.org WebAPI entity                        |
| `schema.ts` | `getFullSchemaGraph()` | Returns complete JSON-LD graph                         |

### Server Utils (`src/lib/server/utils/`)

| File                   | Function                      | Description                                                               |
| ---------------------- | ----------------------------- | ------------------------------------------------------------------------- |
| `string/sanitize.ts`   | `sanitize(string, separator)` | Converts text to URL-safe slug                                            |
| `string/sanitize.ts`   | `sanitizeKey(string)`         | Converts text to snake_case key                                           |
| `string/sanitize.ts`   | `sanitizeTitle(string)`       | Converts text to kebab-case title                                         |
| `string/formatting.ts` | `toSentenceCase(str)`         | Converts string to sentence case                                          |
| `response/response.ts` | `success(data)`               | Creates standardized success response                                     |
| `response/response.ts` | `successCached(data)`         | Creates cached success response (s-maxage=60, stale-while-revalidate=300) |
| `response/response.ts` | `failure(message, status)`    | Creates standardized error response                                       |

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

- Import the singleton client: `import { supabase } from '@/lib/server/db/supabase'`
- Always select specific columns (avoid `SELECT *`)
- Use RLS policies for security
- Never expose Service Role key on client
- For scripts, use service role key from environment variables

---

## Validation (Zod)

```typescript
import { z } from "zod";

const CreatePostSchema = z.object({ title: z.string().min(5).max(100), content: z.string().min(10) });
```

---

## Testing (Vitest)

Tests are located alongside the code they test with `.test.ts` or `.test.tsx` extension.

```bash
# Run tests in watch mode
bun run test

# Run tests once
bun run test:run
```

### Test File Conventions

- Test files use `.test.ts` or `.test.tsx` extension
- Place tests next to the code they test (same directory)
- Use `@testing-library/react` for React components
- Use descriptive test names: `describe('FunctionName', () => { it('should...') })`

---

## JSDoc Requirements

Add JSDoc to:

- Exported functions and hooks
- Complex utility functions
- Types and interfaces
- Scripts (sync.ts, indexnow.ts, lib/\*.ts)

Skip for:

- Obvious props (`className`, `children`)
- Simple interfaces
