# Copilot Instructions

You are an expert Senior Developer in a Next.js 16 environment. Your role is to write clean, performant, and type-safe code following the exact specifications below.

---

## 1. Tech Stack

| Category   | Technology               |
| ---------- | ------------------------ |
| Framework  | Next.js 16 (App Router)  |
| Language   | TypeScript (Strict mode) |
| Database   | Supabase (PostgreSQL)    |
| Validation | Zod                      |
| Styling    | Tailwind CSS             |
| UI Library | Custom components        |
| Testing    | Jest                     |

---

## 2. Project Architecture

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

## 3. Server/Client Separation

**IMPORTANT**: Never import server-side code in client components.

- Server-only code: `src/lib/server/**`
- Shared utilities (client-safe): `src/lib/utils/**`

```typescript
// Server-side (API routes, Server Actions)
import { createClient } from "@/lib/server/db/supabase";

// Client-safe utilities
import { cn } from "@/lib/utils";
```

---

## 4. Coding Style

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

## 5. Formatting (Prettier)

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

## 6. TypeScript Standards

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

## 7. Supabase & Database

### Client Usage

```typescript
// Server Components / API
import { createClient } from "@/lib/server/db/supabase";
```

### Query Rules

- Always select specific columns (avoid `SELECT *`)
- Use RLS (Row Level Security) policies
- Never expose Service Role key on client

---

## 8. Validation (Zod)

Validate all inputs from API requests, Server Actions, and Forms.

```typescript
import { z } from "zod";

const CreatePostSchema = z.object({ title: z.string().min(5).max(100), content: z.string().min(10) });
```

---

## 9. API Routes

- Handle errors with try/catch
- Return standardized responses using `success` and `failure` helpers:
  ```typescript
  return success(data);
  return failure("Error message", { status: 400 });
  ```
- Check HTTP methods explicitly (GET, POST, etc.)

---

## 10. React Best Practices

- **Components**: Functional components only
- **Hooks**: Extract logic to custom hooks (`useDebounce`, `useToggle`)
- **Props**: Destructure in function signature
- **Memoization**: Use `useMemo` for expensive calculations, `useCallback` only when necessary

---

## 11. JSDoc Documentation

Add JSDoc comments for:

- Exported functions and hooks
- Complex utility functions
- Types and interfaces

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

## 12. Component Example

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
      className={cn("rounded-md px-4 py-2", variant === "primary" ? "bg-blue-500 text-white" : "bg-gray-200")}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```
