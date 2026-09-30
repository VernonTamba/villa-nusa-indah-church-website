# VNI Church Website — Project Context for Claude

## Project Overview

This is the official website for **GMAHK Villa Nusa Indah (VNI)** — a Seventh-day Adventist church. The website serves as a public-facing portal for the congregation, providing information about the church, its members directory, service rundowns, core beliefs/values, location, and contact details. It also includes a password-protected **Admin Panel** for content management.

- **Language**: Bahasa Indonesia (default), with English toggle support
- **Default Theme**: Dark mode

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) with Turbopack |
| UI Library | HeroUI v2 (`@heroui/react`) |
| Styling | Tailwind CSS v4 + `tailwind-variants` |
| Animation | Framer Motion |
| Icons | `@tabler/icons-react`, `lucide-react` |
| Database | Supabase (PostgreSQL) via `@supabase/ssr` |
| Auth | Supabase Auth (email/password) — protects `/admin` routes |
| i18n | Custom `LanguageProvider` (no next-intl) |
| Map | Google Maps Embed (iframe) |
| Theme | `next-themes` (dark default) |
| Font | Inter (`fontInter` from `config/fonts.ts`) |
| Language | TypeScript (strict) |

---

## Project Structure

```
vni-church-website/
├── app/                            # Next.js App Router pages
│   ├── layout.tsx                  # Root layout (wraps ConditionalShell + Providers)
│   ├── page.tsx                    # Home page
│   ├── providers.tsx               # HeroUIProvider + ThemeProvider + LanguageProvider
│   ├── conditional-shell.tsx       # Client component: shows Navbar+Footer only for public routes
│   ├── error.tsx                   # Error boundary
│   ├── admin/                      # 🔒 Admin Panel (requires Supabase auth)
│   │   ├── layout.tsx              # Auth guard + AdminShell wrapper
│   │   ├── page.tsx                # Admin dashboard redirect
│   │   ├── admin-shell.tsx         # Sidebar layout for admin (client component)
│   │   ├── actions.ts              # Server Actions for all DB mutations
│   │   ├── members/                # Manage church members
│   │   │   ├── page.tsx
│   │   │   └── members-manager.tsx # Full CRUD UI for members
│   │   ├── rundown/                # Manage service rundown participants
│   │   │   ├── page.tsx
│   │   │   └── rundown-form.tsx    # Form to assign participant names per role
│   │   └── images/                 # Manage hero & sabbath moment images
│   │       ├── page.tsx
│   │       └── images-manager.tsx  # Upload/reorder/delete images UI
│   ├── login/                      # Login page (redirects to /admin if already authed)
│   │   ├── layout.tsx
│   │   └── page.tsx                # Email/password login form
│   ├── donate/                     # Donation page with bank account details
│   │   └── page.tsx
│   └── members/                    # Public members directory
│       ├── layout.tsx
│       ├── page.tsx                # Server Component — fetches from Supabase
│       └── members-directory.tsx   # Client component for the members grid
├── components/                     # Shared UI components (public site)
│   ├── navbar.tsx
│   ├── footer.tsx
│   ├── hero.tsx
│   ├── rundown.tsx
│   ├── core-beliefs.tsx
│   ├── core-values.tsx
│   ├── location.tsx
│   ├── get-in-touch.tsx
│   ├── faq.tsx
│   ├── language-toggle.tsx
│   ├── theme-switch.tsx
│   ├── icons.tsx
│   ├── primitives.ts               # tailwind-variants style primitives
│   └── ui/                         # Low-level UI primitives
│       ├── badge.tsx
│       ├── button.tsx
│       ├── map.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       └── side-sheet.tsx
├── constants/                      # Static data for sections (not from DB)
│   ├── rundown.tsx
│   ├── core-beliefs.ts
│   ├── core-values.ts
│   ├── faq.tsx
│   ├── contact-us.tsx
│   ├── get-in-touch.ts
│   ├── location.ts
│   ├── contact-details.ts
│   └── footer.tsx
├── config/
│   ├── site.ts                     # Nav items, site name/description, external links
│   └── fonts.ts                    # Font definitions (Inter)
├── lib/
│   ├── i18n.tsx                    # Custom LanguageProvider + useLanguage hook
│   ├── animations.ts               # Shared Framer Motion variants (fadeUp, staggerItem, etc.)
│   └── utils.ts                    # Utility helpers (cn, etc.)
├── messages/
│   ├── id.json                     # Indonesian translations
│   └── en.json                     # English translations
├── middleware.ts                   # Route protection: redirects /admin → /login if unauthed
├── types/
│   └── index.ts                    # Shared TypeScript types (IconSvgProps, etc.)
├── utils/supabase/
│   ├── client.ts                   # Browser Supabase client
│   ├── server.ts                   # Server-side Supabase client (cookie-based)
│   └── middleware.ts               # Supabase session refresh middleware
└── styles/
    └── globals.css                 # Global CSS, Tailwind directives, theme vars
```

---

## Key Conventions

### Components
- Use **HeroUI components** (`@heroui/react`) as the primary component library.
- Style via **Tailwind CSS v4 utility classes** and `tailwind-variants` for variant-based styles.
- Use `cn()` from `lib/utils.ts` (wraps `tailwind-merge` + `clsx`) for conditional class merging.
- Prefer **Framer Motion** for animations.
- Icons: prefer `@tabler/icons-react`; `lucide-react` is also available.

### Server vs. Client Components
- **Server Components** (no `"use client"`) should be used for data fetching pages (e.g., `app/members/page.tsx`).
- Use `utils/supabase/server.ts` (`createClient`) for **server-side** DB access (cookie-based).
- Use `utils/supabase/client.ts` (`createClient`) for **client-side** DB access (browser).
- Add `"use client"` only when you need React hooks, event handlers, or browser APIs.

### Layout & Navigation Shell
- The root `layout.tsx` wraps everything in `<ConditionalShell>` (`app/conditional-shell.tsx`).
- `ConditionalShell` hides the public `<Navbar>` and `<Footer>` for `/login` and `/admin` routes, since those have their own layout.

### Animations
- Shared Framer Motion variants live in `lib/animations.ts`: `fadeUp`, `fadeIn`, `staggerContainer`, `staggerItem`, `slideLeft`, `slideRight`, `viewport`.
- Import and reuse these across all page sections for consistent scroll-reveal effects.

### i18n (Internationalization)
- The project uses a **custom i18n system** — NOT `next-intl` or similar libraries.
- All translatable text must be added to both `messages/id.json` and `messages/en.json`.
- Access translations via the `useLanguage()` hook:
  ```tsx
  "use client";
  import { useLanguage } from "@/lib/i18n";

  const { messages, locale, toggleLocale } = useLanguage();
  ```
- `LanguageProvider` is client-only; do NOT call `useLanguage()` in Server Components.
- Locale is persisted in `localStorage` under the key `"vni-locale"`.
- Supported locales: `"id"` (Indonesian, default) and `"en"` (English).

### Data / Constants
- Static section data (non-DB content) lives in `constants/` as typed arrays/objects.
- Constants files often import from `messages/` or use the i18n system indirectly.

### Supabase
- Environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- Always `await createClient()` on the server side.
- **DB tables in use:**
  - `members` — church member profiles (name, position, image_url)
  - `rundown_participants` — maps `service_key` + `role_key` → `participant_name`
  - `hero_images` — hero carousel images (storage_path, public_url, display_order)
  - `sabbath_moments` — gallery images with label, title, description, display_order
- **Storage buckets in use:**
  - `member-photos` — member profile pictures
  - `hero-images` — hero section carousel images
  - `sabbath-moments` — sabbath moment gallery images

### Authentication & Admin
- Supabase Auth (email/password) protects `/admin` routes.
- `middleware.ts` redirects unauthenticated users from `/admin/**` → `/login`.
- `middleware.ts` redirects authenticated users away from `/login` → `/admin`.
- All DB mutations (add/edit/delete) are performed via **Server Actions** in `app/admin/actions.ts`.
- The admin layout (`app/admin/layout.tsx`) verifies session server-side and renders `AdminShell`.
- `AdminShell` (`app/admin/admin-shell.tsx`) provides the sidebar navigation for the admin panel (Rundown, Anggota, Gambar sections).

### Theming
- Default theme: **dark**. Configured via `next-themes` with `attribute: "class"`.
- Theme toggle is in `components/theme-switch.tsx`.
- Language toggle is in `components/language-toggle.tsx`.

### Path Aliases
- `@/` maps to the project root (configured in `tsconfig.json`).

---

## Development Commands

```bash
npm run dev     # Start dev server with Turbopack (http://localhost:3000)
npm run build   # Production build
npm run lint    # ESLint with auto-fix
```

---

## Important Notes & Gotchas

1. **`useLanguage()` is client-only.** Never call it in a Server Component — wrap in a `"use client"` child component instead.
2. **Supabase `createClient` is async on the server** — always `await` it.
3. **Tailwind CSS v4** is in use — some v3 utilities may behave differently. Check `styles/globals.css` for custom theme variables.
4. **The README.md is outdated** — it still refers to the HeroUI template. Ignore it for project context.
5. **Authentication IS implemented** via Supabase Auth — `/admin` routes are protected. The `middleware.ts` handles session refresh and route guards.
6. **Server Actions** in `app/admin/actions.ts` handle all DB writes — do not write to Supabase directly from client components for mutation operations.
7. **`contact-us.tsx` component is not listed in components/** — the contact section data lives in `constants/contact-us.tsx`, rendered by a section in the home page.
8. **`hero.ts` at the root** is a small config file (not the Hero component — that's `components/hero.tsx`).
