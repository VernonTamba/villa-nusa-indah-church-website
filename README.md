<div align="center">

<img src="./public/logo.png" alt="GMAHK Villa Nusa Indah Logo" width="100" />

# GMAHK Villa Nusa Indah — Church Website

**Official website of Gereja Masehi Advent Hari Ketujuh Villa Nusa Indah**

A warm community where worship feels like family, faith grows with purpose, and every visitor is invited to discover a place to belong.

[![Live Site](https://img.shields.io/badge/🌐_Live_Site-your--domain.com-4f46e5?style=for-the-badge)](https://your-domain.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](./LICENSE)

</div>

---

## 📖 About

This is the official website for **GMAHK Villa Nusa Indah (VNI)** — a Seventh-day Adventist church based in Indonesia. The site serves as a public-facing portal for the congregation, offering:

- 🏠 An informative **landing page** covering who we are, what we believe, and when we gather
- 👥 A **members directory** powered by a live database
- 🎵 A **worship service rundown** managed through an admin dashboard
- 💳 A **donation page** for supporting the church's ministry
- 🌐 Full **bilingual support** (Bahasa Indonesia & English)
- 🌙 **Dark mode** as the default experience

---

## ✨ Features

| Feature | Description |
|---|---|
| 🌍 **Bilingual (ID / EN)** | Custom i18n system with language toggle — no third-party library |
| 🌙 **Dark Mode First** | Dark theme by default, toggleable with `next-themes` |
| 🗺️ **Interactive Map** | Embedded church location map via Leaflet |
| 📋 **Service Rundown** | Live worship service schedule managed via admin panel |
| 👥 **Members Directory** | Searchable member list fetched from Supabase |
| 🔐 **Admin Dashboard** | Protected admin interface for managing rundown & members |
| 💳 **Donate Page** | Dedicated page with giving instructions |
| 📱 **Responsive Design** | Mobile-first, works on all screen sizes |
| ⚡ **Turbopack** | Blazing fast local dev with Next.js Turbopack |

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org/) — App Router |
| **Language** | [TypeScript 5.6](https://www.typescriptlang.org/) (strict) |
| **UI Library** | [HeroUI v2](https://heroui.com/) (`@heroui/react`) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + `tailwind-variants` |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) |
| **Icons** | `@tabler/icons-react`, `lucide-react` |
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL) via `@supabase/ssr` |
| **i18n** | Custom `LanguageProvider` + `useLanguage()` hook |
| **Map** | [Leaflet](https://leafletjs.com/) + `react-leaflet` |
| **Theme** | `next-themes` (dark default) |
| **Font** | Inter (via `config/fonts.ts`) |
| **Build** | Turbopack (dev) |

---

## 🗂️ Project Structure

```
vni-church-website/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout — Navbar + Footer + Providers
│   ├── page.tsx                  # Home page (all landing sections)
│   ├── providers.tsx             # HeroUI + ThemeProvider + LanguageProvider
│   ├── error.tsx                 # Global error boundary
│   ├── donate/                   # Donation page
│   │   └── page.tsx
│   ├── login/                    # Login page
│   │   └── page.tsx
│   ├── members/                  # Public members directory
│   │   └── page.tsx              # Server Component — fetches from Supabase
│   └── admin/                    # Protected admin dashboard
│       ├── page.tsx
│       ├── admin-shell.tsx
│       ├── actions.ts            # Server Actions (rundown CRUD)
│       ├── rundown/              # Manage worship service rundown
│       └── members/              # Manage member records
│
├── components/                   # Shared UI components
│   ├── navbar.tsx                # Top navigation bar
│   ├── footer.tsx                # Site footer
│   ├── hero.tsx                  # Hero / landing banner section
│   ├── core-values.tsx           # Church core values section
│   ├── core-beliefs.tsx          # Statement of beliefs section
│   ├── rundown.tsx               # Worship service schedule section
│   ├── location.tsx              # Map + address section
│   ├── get-in-touch.tsx          # Contact / social links section
│   ├── faq.tsx                   # Frequently asked questions section
│   ├── language-toggle.tsx       # ID ↔ EN language switcher
│   ├── theme-switch.tsx          # Dark / light mode toggle
│   ├── icons.tsx                 # Custom SVG icon components
│   ├── primitives.ts             # tailwind-variants style primitives
│   └── ui/                       # Low-level reusable UI primitives
│
├── constants/                    # Static data (non-DB content)
│   ├── core-beliefs.ts
│   ├── core-values.ts
│   ├── faq.tsx
│   ├── rundown.tsx
│   ├── get-in-touch.ts
│   ├── contact-details.ts
│   ├── location.ts
│   └── footer.tsx
│
├── config/
│   ├── site.ts                   # Site name, nav items, social links
│   └── fonts.ts                  # Font configuration (Inter)
│
├── lib/
│   ├── i18n.tsx                  # Custom LanguageProvider + useLanguage hook
│   └── utils.ts                  # Utility helpers (cn, etc.)
│
├── messages/
│   ├── id.json                   # 🇮🇩 Indonesian translations
│   └── en.json                   # 🇬🇧 English translations
│
├── types/
│   └── index.ts                  # Shared TypeScript types
│
├── utils/supabase/
│   ├── client.ts                 # Browser-side Supabase client
│   ├── server.ts                 # Server-side Supabase client (cookies)
│   └── middleware.ts             # Session refresh middleware
│
└── styles/
    └── globals.css               # Global CSS, Tailwind directives, theme vars
```

---

## 🏠 Page Sections (Home)

The home page is composed of the following sections, rendered in order:

| # | Section | Component | Description |
|---|---|---|---|
| 1 | **Hero** | `hero.tsx` | Welcome banner with church tagline and CTA |
| 2 | **Core Values** | `core-values.tsx` | Church's guiding values |
| 3 | **Core Beliefs** | `core-beliefs.tsx` | Statement of faith |
| 4 | **Service Rundown** | `rundown.tsx` | Weekly worship schedule |
| 5 | **Location** | `location.tsx` | Interactive map + address |
| 6 | **Get In Touch** | `get-in-touch.tsx` | Social links and contact |
| 7 | **FAQ** | `faq.tsx` | Frequently asked questions |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- A [Supabase](https://supabase.com/) project with a `members` table

### 1. Clone the repository

```bash
git clone https://github.com/VernonTamba/villa-nusa-indah-church-website.git
cd villa-nusa-indah-church-website
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint with auto-fix |

---

## 🌐 Internationalization (i18n)

This project uses a **custom i18n system** (no `next-intl` or similar libraries).

- Translations live in `messages/id.json` (Indonesian) and `messages/en.json` (English)
- Default locale: **Bahasa Indonesia** (`id`)
- Language is persisted in `localStorage` under the key `vni-locale`
- Access translations in client components via the `useLanguage()` hook:

```tsx
"use client";
import { useLanguage } from "@/lib/i18n";

const { messages, locale, toggleLocale } = useLanguage();
```

> ⚠️ **Note**: `useLanguage()` is client-only. Never call it in a Server Component.

---

## 🗄️ Database (Supabase)

The project uses [Supabase](https://supabase.com/) (PostgreSQL) for dynamic data.

| Table | Usage |
|---|---|
| `members` | Church member records shown in the members directory |

**Server-side access** (recommended for pages/layouts):
```ts
import { createClient } from "@/utils/supabase/server";
const supabase = await createClient();
```

**Client-side access** (for interactive components):
```ts
import { createClient } from "@/utils/supabase/client";
const supabase = createClient();
```

---

## 🔗 Social Media

| Platform | Link |
|---|---|
| 📺 YouTube | [@GMAHKvillanusaindah](https://www.youtube.com/@GMAHKvillanusaindah) |
| 📘 Facebook | [GmahkVillaNusaIndah](https://www.facebook.com/GmahkVillaNusaIndah) |
| 📸 Instagram | [@gmahkvni](https://www.instagram.com/gmahkvni/) |

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---

<div align="center">

Made with ❤️ for the congregation and visitors of **GMAHK Villa Nusa Indah**

</div>
