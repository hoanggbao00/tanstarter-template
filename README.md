# Repo

A web monorepo using [Vite+](https://viteplus.dev/guide/) (`vp`) as the unified toolchain for dev/build, formatting, linting, testing, and running tasks across packages.

## Stack

| Layer                         | Technology                                                                                                                                             |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Runtime / package manager** | [Bun](https://bun.sh/) workspaces (`packageManager`: `bun@1.3.11`)                                                                                     |
| **Language**                  | TypeScript 6                                                                                                                                           |
| **Frontend**                  | React 19, [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router) + [TanStack Query](https://tanstack.com/query) |
| **Build / SSR**               | Vite (via Vite+), [Nitro](https://nitro.unjs.io/)                                                                                                      |
| **Styling**                   | Tailwind CSS v4 (`@tailwindcss/vite`)                                                                                                                  |
| **UI**                        | Shared library `@repo/ui` (Base UI, shadcn-style workflow, Sonner, Tabler Icons)                                                                       |
| **Backend (realtime)**        | [Convex](https://www.convex.dev/) (`packages/convex`)                                                                                                  |
| **Auto-import (`apps/web`)**  | [unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import) ([unplugin](https://github.com/unjs/unplugin)) — see below                    |

### Dependency versions (catalog)

Shared dependency versions are defined once in the root `package.json` under the `catalog` field. Workspace packages reference them with the `catalog:` protocol (for example `"react": "catalog:"`) so React, Vite, Tailwind, and other shared libraries stay aligned across `apps/*` and `packages/*`. Bump or add a version in the root catalog when you want to change it everywhere it is used.

### Auto-import (`apps/web`)

The web app uses **unplugin-auto-import** in `apps/web/vite.config.ts` so you can omit explicit imports for common APIs. Presets include **React** and selected **TanStack Router** exports (`Link`, `useNavigate`, `useParams`, and others). Local modules under `src/lib`, `src/hooks`, `src/icons`, and `src/utils` are auto-imported as well. TypeScript declarations are generated into `apps/web/auto-imports.d.ts` when the dev server or build runs.

## Requirements

- **Node.js** `>= 22.12.0` (see `engines` in `package.json`)
- **Bun** matching the version in `packageManager` (currently `1.3.11`) for installs and some scripts
- **Vite+ (`vp`)** — global CLI: [Getting started](https://viteplus.dev/guide/)

Install `vp` (macOS / Linux):

```bash
curl -fsSL https://vite.plus | bash
```

Open a new shell and run `vp help`.

After cloning, install dependencies with Vite+ (preferred over calling `npm` / `pnpm` / `yarn` directly for this project’s workflow):

```bash
vp install
```

## Project structure

```text
repo/
├── apps/
│   └── web/                 # Main web app (@repo/web)
├── packages/
│   ├── ui/                  # Shared UI components & styles (@repo/ui)
│   └── convex/              # Convex backend (@repo/convex)
├── tools/
│   └── tsconfig/            # Shared TypeScript configs (@repo/tsconfig)
├── vite.config.ts           # Vite+ config (fmt, lint, staged, vp run cache)
├── package.json             # Workspaces + dependency catalog
└── AGENTS.md                # Vite+ workflow notes for contributors / agents
```

## Packages & tooling

| Path / package            | Role                                                                                                                                                                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`apps/web`**            | Dev server (`vp dev`), build (`vp build`), preview; Nitro SSR/production (`start`). Depends on `@repo/ui`. Vite: [unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import) for React, router, and local `src/*` dirs. |
| **`packages/ui`**         | Shared UI; exports components and `styles/base.css`.                                                                                                                                                                                 |
| **`packages/convex`**     | Convex schema and functions; use `convex dev` while working on the backend.                                                                                                                                                          |
| **`tools/tsconfig`**      | `base.json`, `react.json` consumed via `extends` in apps and packages.                                                                                                                                                               |
| **Root `vite.config.ts`** | Vite+: Oxfmt, type-aware lint, staged hook (`vp check --fix`), cache for `vp run`.                                                                                                                                                   |

**Useful commands** (from the repo root):

| Goal                                                                          | Command                                                                     |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Format, lint, test, and build the whole monorepo                              | `vp run ready`                                                              |
| Run tests in workspaces                                                       | `vp run -r test`                                                            |
| Build workspaces                                                              | `vp run -r build`                                                           |
| Dev the web app (port 3000 in `apps/web`)                                     | `vp run dev`                                                                |
| Individual check / lint / test / build ([Vite+](https://viteplus.dev/guide/)) | `vp check`, `vp lint`, `vp test`, `vp build` (in a package or via `vp run`) |

Note: `vp dev`, `vp build`, and `vp test` are Vite+ built-ins. To run a `package.json` script with the same name, use `vp run <script-name>`.

---

For Vite+ conventions in this repo, see `AGENTS.md`.
