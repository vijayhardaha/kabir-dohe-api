# CLAUDE.md - Claude Code Context

## Project Overview

Kabir Ke Dohe API - A Next.js API for accessing couplets and poetry.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Strict mode)
- **Database**: Supabase (PostgreSQL)
- **Validation**: Zod
- **Styling**: Tailwind CSS
- **Testing**: Vitest
- **Package Manager**: Bun

## Key Directories

```
src/
├── app/              # Next.js App Router (routing only)
│   └── api/         # API routes
├── components/       # UI components (PascalCase)
├── constants/        # SEO metadata, API params
├── lib/
│   ├── server/      # Server-only code (db, env, utils)
│   └── utils/       # Client-safe utilities
└── types/           # TypeScript definitions
```

## Critical Rules

### Server/Client Separation
- Server-only code goes in `src/lib/server/` - NEVER import in client components
- Client-safe utilities go in `src/lib/utils/`

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

### Naming Conventions
- Components: `PascalCase` (`Button.tsx`)
- Functions: `camelCase` (`fetchCouplets`)
- Files: `kebab-case` (`api-utils.ts`)
- Constants: `SCREAMING_SNAKE_CASE` (`MAX_RETRIES`)

## Common Commands

```bash
# Development
bun run dev              # Start dev server
bun run build            # Production build

# Quality
bun run lint             # Lint files
bun run lint:fix         # Fix auto-fixable issues
bun run format           # Format files

# Testing
bun run test             # Run tests
bun run test:watch       # Watch mode

# Database Sync
bun run sync             # Sync dev database
bun run sync:prod        # Sync production database
```

## API Response Helpers

Use standardized response helpers from `src/lib/server/utils/response/`:

```typescript
import { success, successCached, failure } from '@/lib/server/utils/response/response';

return success(data);                    // 200 OK
return successCached(data);              // 200 with cache headers
return failure('Error message', 400);    // Error response
```

## Supabase Guidelines

- Import singleton: `import { supabase } from '@/lib/server/db/supabase'`
- Select specific columns (avoid `SELECT *`)
- Use RLS policies for security
- Never expose Service Role key on client

## Validation

```typescript
import { z } from "zod";

const Schema = z.object({
  title: z.string().min(5).max(100)
});
```

## Commit Format

```
fix: standardize react types in components

- Add react import for consistent type usage
- Use React.JSX.Element for return types
```

- Subject: lowercase, max 50 characters
- Body: max 72 characters per line
