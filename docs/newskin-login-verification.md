# Login Newskin migration — 28 September 2026

Scope: `app/login/page.tsx`, building on the existing Newskin foundation and in-progress workspace changes. No shared styles, dependencies, translation copy, authentication handlers, validation, middleware, or navigation contracts changed.

## Implementation

- Reuse `ns-title`, `ns-copy`, `ns-label`, `ns-field`, `ns-surface`, `ns-caption`, and the local Button's public variants. The form keeps a narrow single column, with 20/24px surface padding and 24px field-group spacing.
- Use the official logo already used by the homepage navigation. Align the heading and description with the form, and keep the existing language toggle available above it.
- Replace the isolated red error styling with the semantic danger alert, associate it with both fields, and provide localized loading status. Retain the existing error state lifecycle and `noValidate` behavior.
- Keep 44px password-toggle and 48px submit targets, visible keyboard focus, and explicit reduced-motion spinner utilities. Tailwind's animation utility otherwise overrides the foundation's component-layer reduced-motion rule.

## Verification

- `npx.cmd tsc --noEmit`: passed.
- `npx.cmd eslint app/login/page.tsx`: passed, no warnings.
- Repository ESLint and the standard production build: blocked by six existing errors in `app/admin/images/images-manager.tsx` and `app/admin/members/members-manager.tsx`.
- `npm.cmd run build -- --no-lint`: passed compilation, type validation, page generation, and build tracing (exit 0). Existing metadataBase and admin static-render probe warnings remain.
- Playwright used an isolated headless Chrome instance because the browser connector profile was occupied. Both Indonesian and English checked at 1440, 768, 375, and 320px: no horizontal overflow, all fields/buttons at least 44px high, one main landmark and one h1.
- Passed password show/hide, field retention across language changes, email → password → reveal keyboard order, visible focus, pending-submit disabling, reduced-motion spinner, mocked invalid-credential recovery, error associations, and retained `redirectTo` query.
- `/admin/gallery` without a session redirects to `/login?redirectTo=%2Fadmin%2Fgallery`.
- 200% root text enlargement at 768px reflows without horizontal overflow; this is text enlargement, not exhaustive browser zoom certification.
- 31 Playwright assertions passed. No JavaScript page exceptions. One expected console 400 from the intercepted invalid-credential response; no other console errors. No credentials sent to Supabase, and valid-account sign-in was not exercised.
- Development font fetching reported a Google Fonts connection failure and used the existing fallback; screenshots therefore do not certify the downloaded Inter face. Font configuration was preserved.

## Review artifacts

- [Desktop, English](../.playwright-mcp/login-newskin-en-1440.png)
- [Tablet, Indonesian](../.playwright-mcp/login-newskin-id-768.png)
- [Mobile, English](../.playwright-mcp/login-newskin-en-375.png)
- [Error state, 320px](../.playwright-mcp/login-newskin-error-320.png)
- [200% text](../.playwright-mcp/login-newskin-text-200.png)
- [Assertion results](../.playwright-mcp/login-newskin-results.json)
