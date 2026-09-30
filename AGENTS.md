# Repository Guidelines

## Architecture & Project Structure

This is a Next.js 15 App Router application using React 18, strict TypeScript, Tailwind CSS v4, HeroUI, Framer Motion, and Supabase.

- `app/` owns routes, layouts, metadata, providers, and server actions. Public routes are `/`, `/members`, `/gallery`, and `/donate`; `/login` and `/admin/**` use separate shells.
- `app/conditional-shell.tsx` provides the public navbar, page loader, content container, and footer. `app/admin/layout.tsx` performs a server-side auth check and wraps admin pages in `AdminShell`.
- Keep data-fetching Server Components separate from interactive Client Components. Add `"use client"` only for hooks, event handlers, context, or browser APIs.
- `components/` contains shared public sections; `components/ui/` contains reusable local primitives. `config/` contains site, font, and gallery configuration; `constants/` contains static section data.
- `styles/globals.css` defines Tailwind v4 setup and semantic color tokens. `lib/animations.ts`, `lib/utils.ts`, and `components/primitives.ts` provide shared motion and styling utilities.

## Data, State & Integrations

- Supabase clients live in `utils/supabase/`: use the server client in Server Components and server actions, and the browser client only in Client Components.
- Initial admin and member data is fetched on the server. Database and storage mutations are centralized in `app/admin/actions.ts`; preserve their validation, revalidation, table/bucket names, and return contracts.
- `middleware.ts` refreshes Supabase sessions, protects `/admin/**`, preserves `redirectTo`, and redirects authenticated users away from `/login`. The admin layout repeats the auth check intentionally.
- There is no global state library. Use local React state for UI state, `LanguageProvider` for locale, and `next-themes` for theme state.
- Translated copy lives in `messages/id.json` and `messages/en.json`. Update both files together and use `useLanguage()` only in Client Components.
- Do not commit secrets. Supabase code currently references `NEXT_PUBLIC_SUPABASE_URL` plus both `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; do not rename or consolidate these as part of visual work.

## Components & Styling

- Reuse HeroUI and existing primitives in `components/ui/` before creating new controls. Use `cn()` from `lib/utils.ts`, `tailwind-variants`/CVA for reusable variants, and shared variants from `lib/animations.ts` where appropriate.
- Prefer semantic Tailwind tokens such as `bg-background`, `text-foreground`, `border-border`, `primary`, and `secondary` over new literal colors. Put reusable theme values in `styles/globals.css`.
- Follow nearby conventions: two-space indentation, double quotes, semicolons, kebab-case filenames, PascalCase components, camelCase values, and `@/` imports.
- Preserve Next.js image optimization and existing responsive, reduced-motion, keyboard, focus, and ARIA behavior.

## Commands & Verification

- `npm run dev`: start development with Turbopack.
- `npx tsc --noEmit`: run the TypeScript check.
- `npx eslint .`: lint without modifying files.
- `npm run lint`: run ESLint with automatic fixes; inspect the resulting diff.
- `npm run build`: create the production build.
- `npm run start`: serve a completed production build.

No automated test framework or `test` script is configured. For code changes, run the relevant typecheck and lint checks plus a production build when scope warrants it. Manually verify affected routes, both languages, responsive layouts, and any affected authentication, admin, or Supabase flow.

## Newskin Development Rules

- Treat the current application as production behavior: preserve routing, business logic, API and server-action contracts, validation, authentication, permissions, state behavior, and integrations unless explicitly asked to change them.
- Keep presentation work within established boundaries. Reuse shared components, hooks, utilities, tokens, and design-system primitives; avoid new dependencies and unrelated refactors.
- Prefer semantic design tokens and reusable variants over hardcoded colors or repeated style values.
- Prioritize responsive behavior and accessibility, including semantic structure, keyboard operation, visible focus, sufficient contrast, useful labels, and reduced-motion preferences.
- Make changes incrementally. Visually verify meaningful UI changes on desktop and mobile, in Indonesian and English where copy or layout is affected.
- Run the relevant checks after changes: `npx tsc --noEmit`, `npx eslint .`, and `npm run build` when appropriate. Since no automated UI test suite exists, record the manual routes and states verified.

## Commits & Pull Requests

Follow the existing concise commit style, such as `fix(members): ...`, `fix(rundown): ...`, or `perf: ...`. Pull requests should describe the behavior change, validation performed, related issues, and include screenshots for visual changes.
