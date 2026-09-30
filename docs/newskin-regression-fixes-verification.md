# Newskin regression fixes — 29 September 2026

Only the confirmed migration-caused keyboard focus regression was changed. Existing application behavior, navbar, data fetching, authentication, and unrelated styling were preserved.

## Fix

`components/ui/button.tsx`: Newskin's `public-primary` and `public-secondary` variants removed the base focus ring while retaining `outline-none`. Add explicit focus-visible outline utilities to both variants: 2px solid semantic `ring` color, with a 4px offset. Existing button variants and local overrides remain intact.

## Correction to the preceding audit

The reported 24px mobile menu collapse was caused by the shared browser test session's animation clock. A temporary pre-Newskin navbar preview exhibited the same symptom. In a fresh Playwright browser context with normal time, the unchanged current navbar opens to 836px at a 900px viewport height. Menu links are within its bounds and pass hit testing on `/`, `/members`, `/gallery`, and `/donate` at 768px and 375px. No navbar fix was necessary. The temporary baseline files were removed.

Early focus measurements in the shared context also captured frozen transition states; they are superseded by the fresh-context results below. The missing outline itself was a confirmed migration regression, caused by the new public variants.

## Verification after the fix group

- `npx.cmd tsc --noEmit`: passed.
- `npx.cmd eslint components/ui/button.tsx`: passed without warnings.
- `npx.cmd eslint .`: passed with zero errors and 369 existing warnings.
- Playwright/browser MCP in a fresh browser context: login submit and primary/secondary gallery filters show `rgb(248, 167, 36) solid 2px` outlines with `4px` offsets at 1440px, 768px, and 375px in English and Indonesian.
- Lightbox next control shows the same outline at all three widths; keyboard activation advances the photo, Escape closes the dialog, and focus returns to the triggering photo.
- Mobile menu open/close and visible, unobstructed links verified on all four public routes at 768px and 375px.
- No uncaught page exceptions in the final clean-context run. Existing Supabase connectivity failures remain outside this presentation fix.

Authenticated admin mutations and live Supabase data were not tested. No production build was run for this narrowly scoped button-style change.

## Evidence

- [Final browser measurements](../.playwright-mcp/newskin-fix-verification.json)
- [Login focus, 375px](../.playwright-mcp/fix-clean-login-375.png)
- [Lightbox focus, 375px](../.playwright-mcp/fix-clean-lightbox-375.png)
- [Unchanged mobile menu, 375px](../.playwright-mcp/fix-clean-menu-375.png)

Login and lightbox captures at 1440px and 768px are alongside these files with the same naming pattern.
