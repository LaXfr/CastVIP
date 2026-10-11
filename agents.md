# Workspace Invariants
- Strictly use Pure JavaScript (`.js`, `.jsx`). Never generate TypeScript (`.ts`, `.tsx`).
- Strictly use `thirdweb` v5 modular imports (`thirdweb`, `thirdweb/react`, `thirdweb/chains`, `thirdweb/extensions/erc721`). Never use `@thirdweb-dev/*`.
- Always update `roadmap.md`, `worklog.md`, `fixes.md`, and `gitlog.md` after completing a task.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
