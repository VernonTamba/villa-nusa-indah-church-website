# Donate Newskin migration

Verified on 2026-09-28 against the local development server.

## Scope and decisions

- Updated only `app/donate/page.tsx` in application code, building on the existing uncommitted Newskin foundation.
- Reused `ns-container`, typography, surface, feature, and alert primitives plus the shared Button's public primary variant. No new dependencies or global styling changes.
- Grouped the transfer account and instructions into a desktop grid; retained their reading order when stacked on tablet and mobile. Kept the existing copy, account data, clipboard handler, timed success state, and map URL/settings.
- Used definition-list semantics for account details and a dedicated live status for copy confirmation. Added an explicit keyboard outline locally because the shared Button's outline reset otherwise suppressed the Newskin focus outline.
- Used Next.js Link for the existing homepage contact destination.

## Verification

- `npx.cmd tsc --noEmit`: passed.
- `npx.cmd eslint app/donate/page.tsx`: passed without warnings.
- `npx.cmd eslint .`: blocked by six existing errors in admin image/member managers, with unrelated warnings elsewhere.
- Production build not run for this single-page presentation change.
- Playwright using installed Chrome: Indonesian and English at 1440, 768, 375, and 320px. Screenshots captured; no horizontal overflow; one main landmark and H1; Copy button at least 48px high.
- Verified clipboard contents, two-second success reset, denied and unavailable clipboard feedback, recovery, keyboard activation, and visible 2px keyboard focus outline.
- Verified language buttons, mobile menu opening/closing, and contact-link navigation to `/#get-in-touch` after switching to Next.js Link.
- Verified 320px reflow with 200% root text size and reduced motion.
- No donation-page JavaScript exceptions or hydration errors observed. External requests to Google Maps, Google Tag Manager, and Vercel analytics were blocked (`ERR_NETWORK_ACCESS_DENIED`); live map contents could not be verified. The embedded URL and attributes remain unchanged.
- Following the original contact anchor under reduced motion exposed existing homepage Hero/Rundown hydration errors. These are outside the donation-page scope.

Screenshots and raw results are in `.playwright-mcp/donate-*.png` and `.playwright-mcp/donate-results.json` (local verification artifacts).
