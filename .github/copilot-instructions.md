# Copilot Instructions

You are an expert Senior Developer in a Next.js 16 environment. Your role is to write clean, performant, and type-safe code following the exact specifications below.

---

## 1. Tech Stack

| Category        | Technology               |
| --------------- | ------------------------ |
| Framework       | Next.js 16 (App Router)  |
| Language        | TypeScript (Strict mode) |
| Database        | Supabase (PostgreSQL)    |
| Validation      | Zod                      |
| Styling         | Tailwind CSS             |
| UI Library      | Custom components        |
| Testing         | Vitest                   |
| Package Manager | Bun                      |

---

## 2. Project Architecture

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
│   │       ├── response/ # Response helpers
│   │       └── string/  # String utilities
│   │
│   └── utils/            # Shared utilities (client-safe)
│       ├── seo.ts        # SEO utilities
│       ├── schema.ts     # JSON-LD schema builders
│       └── base-url.ts   # Base URL helper
│
└── types/                 # Global TypeScript definitions
    └── api/              # API-related types
```

---

## 3. Scripts

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
    └── db.ts            # Database operations (batch upserts for posts, tags, mappings)
```

### Available Commands

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
bun run test             # Run tests once
bun run test:watch       # Run tests in watch mode
bun run test:coverage    # Run tests with coverage

# Supabase Migrations
supabase migration new <name>  # Create new migration file
```

---

## 4. Utils Knowledge Base

### Client-Safe Utils (`src/lib/utils/`)

| File        | Function                | Description                                            |
| ----------- | ----------------------- | ------------------------------------------------------ |
| `seo.ts`    | `getBaseUrl()`          | Returns normalized base URL for the application        |
| `seo.ts`    | `safeCanonical(slug)`   | Normalizes a slug by removing leading/trailing slashes |
| `seo.ts`    | `getCanonicalUrl(slug)` | Generates fully qualified canonical URL                |
| `schema.ts` | `personSchema()`        | Builds Schema.org Person entity                        |
| `schema.ts` | `webApiSchema()`        | Builds Schema.org WebAPI entity                        |
| `schema.ts` | `getFullSchemaGraph()`  | Returns complete JSON-LD graph                         |

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

## 5. Server/Client Separation

**IMPORTANT**: Never import server-side code in client components.

- Server-only code: `src/lib/server/**`
- Shared utilities (client-safe): `src/lib/utils/**`

```typescript
// Server-side (API routes, Server Actions)
import { supabase } from "@/lib/server/db/supabase";

// Client-safe utilities
import { getCanonicalUrl } from "@/lib/utils/seo";
```

---

## 6. Coding Style

### Naming Conventions

| Type                | Convention           | Example         |
| ------------------- | -------------------- | --------------- |
| Components          | PascalCase           | `BlogCard.tsx`  |
| Functions/Variables | camelCase            | `fetchCouplets` |
| Files               | kebab-case           | `api-utils.ts`  |
| Constants           | SCREAMING_SNAKE_CASE | `MAX_RETRIES`   |
| React Components    | PascalCase           | `Button.tsx`    |

### Import Order

1. React/Next.js built-ins
2. External libraries
3. Internal aliases (`@/`)
4. Relative imports (`../`, `./`)

---

## 7. Formatting (Prettier)

Follow the project's Prettier configuration. Check `prettier.config.mjs` before generating code.

If unavailable, use these rules:

```json
{
  "printWidth": 120,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

**Important**: Always format code blocks according to these rules.

---

## 8. TypeScript Standards

### Types vs Interfaces

```typescript
// Use interface for object shapes
interface BlogPost {
  id: string;
  title: string;
}

// Use type for unions and tuples
type Status = "draft" | "published";
```

### Strict Rules

- **NO `any`**: Use `unknown` if uncertain
- **Avoid `!`**: Use optional chaining `?.` or logical checks
- **Explicit returns**: Always define return types for exported functions

---

## 9. Supabase & Database

### Client Usage

```typescript
// Server Components / API
import { supabase } from "@/lib/server/db/supabase";
```

### Query Rules

- Always select specific columns (avoid `SELECT *`)
- Use RLS (Row Level Security) policies
- Never expose Service Role key on client

---

## 10. Validation (Zod)

Validate all inputs from API requests, Server Actions, and Forms.

```typescript
import { z } from "zod";

const CreatePostSchema = z.object({ title: z.string().min(5).max(100), content: z.string().min(10) });
```

---

## 11. API Routes

- Handle errors with try/catch
- Return standardized responses using `success` and `failure` helpers:
  ```typescript
  return success(data);
  return failure("Error message", { status: 400 });
  ```
- Check HTTP methods explicitly (GET, POST, etc.)

---

## 12. React Best Practices

- **Components**: Functional components only
- **Hooks**: Extract logic to custom hooks (`useDebounce`, `useToggle`)
- **Props**: Destructure in function signature
- **Memoization**: Use `useMemo` for expensive calculations, `useCallback` only when necessary

---

## 13. Testing (Vitest)

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

## 14. JSDoc Documentation

Add JSDoc comments for:

- Exported functions and hooks
- Complex utility functions
- Types and interfaces
- Scripts (sync.ts, indexnow.ts, lib/\*.ts)

Skip for:

- Obvious props (`className`, `children`)
- Simple interfaces

```typescript
/**
 * Fetches a single blog post by its unique identifier.
 *
 * @param {string} id - The UUID of the post.
 * @returns The post object or null if not found.
 * @throws {DatabaseError} If the connection fails.
 */
export async function getPostById(id: string): Promise<BlogPost | null> {
  // implementation
}
```

---

## 15. Component Example

```tsx
import { type ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
}

export function Button({ children, variant = "primary", onClick }: ButtonProps) {
  return (
    <button className={variant === "primary" ? "bg-blue-500 text-white" : "bg-gray-200"} onClick={onClick}>
      {children}
    </button>
  );
}
```

---

## 16. Commit Message Format

```
# Subject line: lowercase, max 50 characters
fix: standardize react types in components

# Body: can have normal case, describe changes
- Add react import for consistent type usage
- Use React.JSX.Element for return types
```

### Rules

- Subject line: lowercase only, max 50 characters
- Body: normal case allowed, max 72 characters per line
- Use conventional commits format (type: subject)

---

## 17. Committing Changes

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
4. Update git.md with the new prepared commands
5. Remove stale commits from git.md when changes are committed

Output the exact git commands. Do NOT commit automatically.
