# AGENTS.md - Kabir Dohe API Guidelines (for Agents, Claude, Copilot)

You are an expert Senior Developer. Write clean, performant, type-safe code.

## Stack

Next.js 16 (App Router) · TypeScript (strict) · Supabase · Zod · Tailwind · Vitest · Bun

## Structure

```
src/
├── app/api/           # API routes (routing only)
├── components/         # UI components (PascalCase)
├── constants/         # SEO metadata, API params
├── lib/
│   ├── server/       # Server-only: db, env, utils (NEVER import in client)
│   └── utils/       # Client-safe: seo, schema
└── types/            # TypeScript definitions
```

## Rules

**Server/Client**: `src/lib/server/` = server-only · `src/lib/utils/` = client-safe

**Naming**: Components→PascalCase · Functions→camelCase · Files→kebab-case · Constants→SCREAMING_SNAKE_CASE

**TypeScript**: `interface` for shapes · `type` for unions · NO `any` (use `unknown`) · Avoid `!` (use `?.`)

**Prettier**: `printWidth:120`, `tabWidth:2`, `semi`, `singleQuote`, `trailingComma:"es5"`

## Response Helpers

```typescript
import { success, successCached, failure } from "@/lib/server/utils/response/response";
return success(data); // 200 OK
return successCached(data); // 200 + cache headers
return failure("Error", 400); // Error response
```

## Utils

### Client-Safe (`src/lib/utils/`)

- `seo.ts`: `siteUrl()` · `cleanPath(slug)` · `getPermaLink(slug)`
- `schema.ts`: `personSchema()` · `webApiSchema()` · `getFullSchemaGraph()`

### Server (`src/lib/server/utils/`)

- `string/sanitize.ts`: `sanitize(str, sep)` · `sanitizeKey()` · `sanitizeTitle()`
- `string/formatting.ts`: `toSentenceCase(str)`
- `response/response.ts`: `success(data)` · `successCached(data)` · `failure(msg, status)`
- `errors/api-error.ts`: `ApiError` class with `statusCode` and `isOperational`
- `errors/error-handler.ts`: `handleError(error)` · `handleRouteError(error)`

## Supabase

- Singleton: `import { supabase } from '@/lib/server/db/supabase'`
- Select specific columns (no `SELECT *`) · Use RLS · Never expose service role key

## Validation (Zod)

```typescript
const Schema = z.object({ title: z.string().min(5), content: z.string().min(10) });
```

## Common Patterns

**Default params with `as const`:**

```typescript
const DEFAULT_PARAMS = { search_query: "", limit: 10 } as const;
```

**Zod query params with defaults:**

```typescript
const QuerySchema = z.object({
  search_query: z.string().optional().default(""),
  limit: z.coerce.number().optional().default(10)
});
type QueryParams = z.infer<typeof QuerySchema>;
```

**ApiError usage:**

```typescript
throw new ApiError("Not found", 404);
```

## JSDoc

Add JSDoc to exported functions, types, interfaces, and scripts. Use `@param {type}`, `@returns`, `@throws {Error}`, and `@example`.

```typescript
/**
 * Converts arbitrary text into a normalized slug.
 *
 * @param {string} string - Source text that may include accents and symbols.
 * @param {string} [separator="-"] - Replacement character between slug segments.
 * @returns {string} Lowercase slug stripped to URL-safe characters.
 * @example
 * sanitize("Hello World!"); // "hello-world"
 */
export function sanitize(string: string, separator = "-"): string { ... }
```

**Skip for**: Obvious props (`className`, `children`), simple interfaces, private/helper functions.

## Comments

Explain **why**, not what. Capitalize first letter. Place on own line (avoid end-of-line).

```typescript
// Cache category results for quick lookups during post sync.
// Transliterate before slugging so accented characters produce stable ASCII output.
```

**Skip for**: Obvious code that explains itself, TODOs without context.

## Testing

- Files: `*.test.ts` next to code they test
- Run: `bun run test` (watch) · `bun run test:run` (once)

## Commits

```
fix: lowercase subject max 50 chars

- Body: normal case, max 72 chars per line
- Conventional commits (type: subject)
```

## `.tmp/git.md`

Store prepared `git add`/`git commit` commands. Read on resume; if cleared, start fresh with unstaged changes. Output exact commands only — do NOT auto-commit.

## Commands

```bash
bun run dev|build|start       # Dev/prod
bun run lint|lint:fix|format # Quality
bun run test|test:run         # Testing
bun run sync|sync:prod         # DB sync (dev/prod)
bun run indexnow               # IndexNow submission
supabase migration new <name>  # Create migration
```
