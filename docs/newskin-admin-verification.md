# Newskin admin verification

This admin presentation pass extends the established [Newskin direction](newskin-design-direction.md). It introduces no tokens, design identity, dependencies, or shared-system changes. Earlier public-site work and unrelated repository drift remain outside this pass.

## Implementation decisions

| Changed file | Presentation change |
| --- | --- |
| [Admin shell](../app/admin/admin-shell.tsx) | Applies `.newskin`, semantic surfaces and action styling; reuses `SideSheet` for mobile navigation and respects the user's motion preference. |
| [Images manager](../app/admin/images/images-manager.tsx) | Uses shared fields, actions, feedback and `AccessibleDialog`; keeps image actions visible and Sabbath moment text readable on narrow screens. |
| [Members manager](../app/admin/members/members-manager.tsx) | Uses shared dialogs and form styling, visible actions and a readable responsive grid; preserves stable initial content rendering and reduced-motion behavior. |
| [Rundown form](../app/admin/rundown/rundown-form.tsx) | Aligns heading, fields, save action and feedback with Newskin; labels and editable rows adapt to mobile while accordion edits persist. |

The implementation reuses `ns-title`, `ns-copy`, `ns-field`, `ns-primary`, `ns-secondary`, `ns-surface` and `ns-alert` from the [existing stylesheet](../styles/globals.css). Dialog semantics and keyboard behavior come from [AccessibleDialog](../components/ui/accessible-dialog.tsx) and [SideSheet](../components/ui/side-sheet.tsx). No shared-system extension was required.

Authentication middleware, the admin layout, server pages and server actions were untouched in this pass. Routing, validation, data contracts and Supabase integrations retain their existing implementation.

## Verification

- `npx tsc --noEmit`: passed.
- Scoped ESLint: zero errors or warnings; [saved result](../.playwright-mcp/admin-lint-fixed.json).
- Repository ESLint: exit 0, zero errors and 369 existing, out-of-scope warnings; [saved result](../.playwright-mcp/repo-lint-admin.json).
- Production build: initial and final correction builds passed; the final Next build returned native exit code 0. See the [build log](../.playwright-mcp/admin-build.log).

The browser harness rendered the real admin components with sample data through a temporary `/login/newskin-preview` fixture. This verifies presentation and local interactions, not live authenticated database or storage writes. The temporary route and its directory were removed before delivery.

The [main browser results](../.playwright-mcp/admin-results.json) report every check passing: 1440px desktop, 768px tablet, 375px mobile and 320px narrow layouts with Indonesian and English locale settings; 200% reflow; heading and main-landmark structure; accordion edit retention; search and empty states; required-name and moment validation; member and moment edit values; delete confirmation cancellation; reorder mode; image tabs; dialog initial focus, containment, Escape and focus return; mobile menu behavior; and protected redirects for `/admin`, `/admin/rundown`, `/admin/members` and `/admin/images`. Reduced-motion rendering was also reviewed.

Existing admin copy remains Indonesian with some English labels under both locale settings. These checks establish layout compatibility, not complete admin localization. Browser console failures in the main run were blocked external Google/Vercel analytics requests (`ERR_NETWORK_ACCESS_DENIED`).

A final review corrected squeezed Sabbath moment text at 375px and 320px. The [correction results](../.playwright-mcp/admin-correction-results.json) confirm reflow at all four widths and dialog focus return, with no recorded page errors. These correction captures used a fallback font because Google font loading was blocked; font configuration was unchanged. The earlier full verification rerun had network access and no font warning.

## Screenshot evidence

| Surface | Desktop (1440px) | Mobile (375px) |
| --- | --- | --- |
| Rundown | [Indonesian](../.playwright-mcp/admin-rundown-id-1440.png), [English setting](../.playwright-mcp/admin-rundown-en-1440.png) | [Indonesian](../.playwright-mcp/admin-rundown-id-375.png), [English setting](../.playwright-mcp/admin-rundown-en-375.png) |
| Members | [Indonesian](../.playwright-mcp/admin-members-id-1440.png), [English setting](../.playwright-mcp/admin-members-en-1440.png) | [Indonesian](../.playwright-mcp/admin-members-id-375.png), [English setting](../.playwright-mcp/admin-members-en-375.png) |
| Images | [Indonesian](../.playwright-mcp/admin-images-id-1440.png), [English setting](../.playwright-mcp/admin-images-en-1440.png) | [Indonesian](../.playwright-mcp/admin-images-id-375.png), [English setting](../.playwright-mcp/admin-images-en-375.png) |
| Corrected Sabbath rows | [1440px](../.playwright-mcp/admin-sabbath-1440.png) | [375px](../.playwright-mcp/admin-sabbath-375.png), [320px](../.playwright-mcp/admin-sabbath-320.png) |

Additional evidence includes the [768px corrected rows](../.playwright-mcp/admin-sabbath-768.png), [moment form](../.playwright-mcp/admin-moment-form-375.png), [member dialog](../.playwright-mcp/admin-member-dialog-375.png) and [mobile menu](../.playwright-mcp/admin-menu-375.png). Tablet and 320px captures for each main surface and locale are alongside these files, named `admin-{rundown,members,images}-{id,en}-{768,320}.png`.
