# GitHub Copilot Instructions

You are an expert Senior Developer in a Next.js 16 environment. Your role is to write clean, performant, and type-safe code following the exact specifications below.

## 1. Tech Stack & Versions

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (Strict mode enabled)
- **Database:** Supabase (PostgreSQL)
- **Validation:** Zod
- **Styling:** Tailwind CSS
- **UI Library:** Custom components
- **Testing:** Jest


## 2. Project Architecture

We use Feature-Sliced Design architecture. Respect these boundaries:

- `app/`: Routing only (Next.js App Router).
- `components/`: Reusable UI components.
    - `docs/`: Api documentation page components (e.g., `ApiEndPoints`).
- `constants/`: SEO metadata and API parameters.
- `lib/`: Utilities, services, helpers, integrations, and database clients.
    - `lib/db/`: Database clients & query functions, useful for apis.
    - `lib/env/ : Environment variable access for server and client separately (e.g., `import env ...`).
    - `lib/integrations/ : Third-party integrations (e.g., Google Sheets, JWT).
    - `lib/services/ : couplet fetching and processing logic (e.g., `fetchCouplets`).
    - `lib/utils/ : Helper functions (e.g., `cn` for classNames).
    - `lib/utils/api/ : Helper functions for API routes (e.g., `ApiError`).
    - `lib/utils/string/ : String manipulation utilities (e.g., `toSentenceCase`).
    - `lib/utils/array/ : Array manipulation utilities (e.g., `findDuplicates`).
- `types/`: Global TypeScript definitions.
- `types/api/`: Types related to API.

## 3. Coding Style & Formatting

### General Rules

- **Language:** Use English for code and comments.
- **Naming:**
    - **Components:** PascalCase (e.g., `BlogCard.tsx`).
    - **Functions/Variables:** camelCase (e.g., `fetchPosts`).
    - **Files:** kebab-case for non-component files (e.g., `api-utils.ts`).
    - **Constants:** SCREAMING_SNAKE_CASE (e.g., `MAX_RETRIES`).

## Code Formatting (Prettier)

You must follow the formatting rules defined in our project configuration. Do not default to standard generic formatting.

1. **Prettier:** Always check the `.prettierrc` file in the project root before generating code. Match the existing formatting style of the project.
2. **ESLint:** Ensure generated code passes standard Next.js ESLint rules. Avoid patterns that trigger common warnings (like unused variables or missing dependencies in useEffect).

If You are unable to access the `.prettierrc` file, Fallback to these common Prettier settings used in Next.js projects:

**Rules for `.prettierrc`:**

- **Print Width:** 100 characters max.
- **Tab Width:** 4 tabs.
- **Use Tabs:** true (use tabs).
- **Semicolons:** Do not add semicolons.
- **Quotes:** Use double quotes.
- **Trailing Commas:** Add trailing commas in multi-line objects (es5).
- **Bracket Spacing:** Add spaces inside object literals `{ key: value }`.
- **Arrow Function Parentheses:** Always use parentheses `(x) => x`.
- **Operator Position:** Place operators at the start of lines in multiline expressions.
- **Object Wrapping:** Preserve existing wrapping of objects (do not force wrap or unwrap).

### Linting (ESLint)

- **Imports:** Group imports: React/Next first, External libraries second, Internal aliases third.
- **Unused Vars:** Do not leave unused variables; prefix with `_` if intentionally unused.

**Important:**
When writing code blocks, ensure they are pre-formatted according to these rules so I don't have to run the formatter manually.

## 4. TypeScript Standards

### Types vs Interfaces

- Use **`interface`** for public API definitions and object shapes that might be extended.
- Use **`type`** for union types, tuples, or computed types.

```typescript
// GOOD
interface BlogPost {
	id: string;
	title: string;
}

type Status = "draft" | "published";
```

### Strictness

- **NO `any`**: Always define proper types. Use `unknown` if type is uncertain.
- **Non-null assertions:** Avoid `!`. Use optional chaining `?.` or logical checks.

## 5. Documentation (JSDoc)

- Add JSDoc comments for all exported functions, hooks, and complex types.
- Do not add JSDoc for obvious props (e.g., a `className` prop).

```typescript
/**
 * Fetches a single blog post by its ID.
 *
 * @param id - The UUID of the post.
 * @returns The post object or null if not found.
 * @throws {DatabaseError} If the connection fails.
 */
export async function getPostById(id: string): Promise<BlogPost | null> {
	// implementation
}
```

## 6. Supabase & Database

- **Client Usage:**
    - Server Components/API: Import `createClient` from `@/lib/db/supabase`.
- **Queries:** Always select specific columns. Avoid `SELECT *`.
- **Security:** Never expose the Service Role key on the client. Use RLS (Row Level Security) policies.

## 7. Validation (Zod)

- Validate all inputs from API requests, Server Actions, and Forms.
- Define schemas at the bottom of the file or in a separate `schemas.ts` file.

```typescript
const CreatePostSchema = z.object({
	title: z.string().min(5).max(100),
	content: z.string().min(10),
});
```

## 8. API & Server Actions

### API Routes (`app/api/`)

- Handle errors using try/catch.
- Return standardized JSON responses:
    ```typescript
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    ```
- use `success` and `failure` functions for returning responses to maintain consistency.
- Check HTTP methods (GET, POST) explicitly.

## 9. React Best Practices

- **Components:** Functional components only.
- **Hooks:** Keep components small; extract logic to custom hooks (e.g., `useDebounce`).
- **Props:** Destructure props in the function signature.
- **Memoization:** Use `useMemo` for expensive calculations and `useCallback` for functions passed to child components only if necessary (avoid premature optimization).

## 10. Examples

### Correct Component Structure

```tsx
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps {
	children: ReactNode;
	variant?: "primary" | "secondary";
	onClick?: () => void;
}

export function Button({ children, variant = "primary", onClick }: ButtonProps) {
	return (
		<button
			className={cn(
				"px-4 py-2 rounded-md",
				variant === "primary" ? "bg-blue-500 text-white" : "bg-gray-200"
			)}
			onClick={onClick}
		>
			{children}
		</button>
	);
}
```
