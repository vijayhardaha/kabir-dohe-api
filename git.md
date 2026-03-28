# Git Commit Commands

## Unstaged Changes

Rename SEO utility functions:

```
git add src/lib/utils/seo.ts src/lib/utils/seo.test.ts src/app/page.tsx src/components/docs/Examples.tsx src/components/docs/UsageExamples.tsx src/lib/utils/schema.ts AGENTS.md .github/copilot-instructions.md
git commit -m "refactor: rename seo functions for clarity

- getBaseUrl -> siteUrl
- safeCanonical -> cleanPath
- getCanonicalUrl -> getPermaLink
- remove NEXT_PUBLIC_SITE_URL support"
```
