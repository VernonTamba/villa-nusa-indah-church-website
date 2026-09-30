# Newskin design system

Use alongside [the approved direction](newskin-design-direction.md). This system extends the public website and login; admin styling, data, authentication, and validation remain independent.

## Foundations

`styles/globals.css` owns shared `.ns-*` styles. They are scoped to `.newskin`, including dialog portals, so admin styling remains independent. The foundation is available for incremental page adoption; this change does not migrate page compositions. Retain Inter, the forced-dark theme, existing light-theme definitions, and real church photography.

| Typography        | Style           | Size / line height   |
| ----------------- | --------------- | -------------------- |
| Homepage title    | `ns-display`    | Fluid 36–64px / 1.1  |
| Page title        | `ns-title`      | Fluid 32–48px / 1.15 |
| Section title     | `ns-heading`    | Fluid 28–36px / 1.2  |
| Card/dialog title | `ns-card-title` | 20px / 1.3, semibold |
| Body              | `ns-copy`       | 16px / 1.6, max 65ch |
| Introduction      | `ns-lead`       | Fluid 16–18px / 1.6  |
| Field label       | `ns-label`      | 14px / 1.4, semibold |
| Secondary/caption | `ns-caption`    | 14px / 1.5           |

Sizes use rem units. Heading level follows document structure, not appearance.

Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 80px; 20px is the mobile padding exception. `ns-container` caps the outer width at 1200px with 20px gutters, increasing to 32px at 768px. `ns-section` uses 48px vertical padding, increasing to 80px at 768px. Avoid nested section padding.

Cards use 20/24px padding. Forms use 24px between groups and 8px around labels/help. Use 16/24px grid gaps, 24–32px between content groups, and `ns-actions` for wrapping actions with 12px gaps.

## Color, surfaces, and depth

| Semantic role    | Dark-theme value                  | Use                                       |
| ---------------- | --------------------------------- | ----------------------------------------- |
| Background       | `background`, #014b3f             | Page and dialog                           |
| Surface          | `surface`, #07493e                | Quiet grouped content and controls        |
| Card             | `card`, #0a5a4c                   | Meaningful content groups                 |
| Elevated surface | `popover`, #0d4f44                | Menus and popovers                        |
| Primary          | `primary`, #f8a724                | Main actions with dark foreground         |
| Secondary        | `secondary`, #fae9c7              | Restrained emphasis                       |
| Neutral text     | `foreground` / `muted-foreground` | White / #d1d5db                           |
| Success          | `success`, #72d19c                | Icon/accent with explicit message         |
| Warning          | `warning`, #f8a724                | Icon/accent with explicit message         |
| Danger           | `destructive`, #f97316            | Accent; readable foreground text on green |
| Information      | `information`                     | Alias to secondary; no new blue palette   |

Use 1px decorative `border-border` borders. Public fields and essential outlined controls use `control-border`: `#69756e` in the retained light theme and white at 50% in dark mode. Keep 12px control radii, 16px cards/dialogs, and `ns-feature` for 24px feature frames. `ns-elevated`, `ns-modal`, and `ns-overlay` provide the shared elevation layers. Pills are for roles/categories. Standard cards stay flat.

## Component recipes

- **Button — EXTEND:** local Button accepts `size="public"` (48px minimum) or `size="public-icon"` (44px minimum). Pair with `variant="public-primary"` or `"public-secondary"` within `.newskin`. Existing compact defaults and `asChild` remain intact. Existing native/HeroUI controls can retain `ns-primary`/`ns-secondary`; use semantic links for navigation.
- **Input — EXTEND:** native `ns-field`, or HeroUI's existing input with matching slots. 48px minimum, 16px text, visible label, linked help/error, and visible focus. Search, clear, and password behavior stay with their feature.
- **Select — KEEP:** existing admin native selects remain untouched. Future public native selects can use `ns-field`; no custom select required.
- **Card — EXTEND:** `ns-surface`, optionally `ns-feature`. Choose semantic article/section/div according to content; informational cards are not implicitly clickable.
- **Navigation — EXTEND:** retain HeroUI navigation, lg desktop breakpoint, mobile menu, active indicator, and accessible locale control.
- **Badge — EXTEND:** local Badge `size="public"` gives 14px wrapping text and natural height. Use for noninteractive roles; category controls remain buttons.
- **Alert — EXTEND:** `ns-alert` with `data-tone="information|success|warning|danger"`; include a decorative icon and explicit text. Use role=alert for new urgent errors or role=status for routine feedback. Messages inherit readable foreground text, not white-on-orange fills.
- **Modal — KEEP/EXTEND:** `AccessibleDialog` retains Radix behavior and accepts optional `description`, linked to the dialog. Use `ns-dialog-body` and `ns-actions` for new body/action compositions.
- **Drawer — KEEP:** `SideSheet` continues composing AccessibleDialog, with full-width mobile layout and inset desktop layout.
- **EmptyState — EXTEND:** `ns-empty` supplies shared spacing for later adoption. Retain each feature's title, explanation, and existing recovery behavior. No fabricated actions.
- **LoadingState — EXTEND:** retain existing loader lifecycles. Localized status text, stable control labels, and reduced-motion alternatives; route progress is not data-fetch progress.

`ns-primary` uses primary-hover/active; quiet controls use card/background interaction states. Keyboard focus uses a 2px ring with 4px offset. Native disabled controls prevent activation and use 60% opacity. `ns-field[aria-invalid="true"]` uses a danger border; associate errors without changing validation rules. Selection must also use aria-current, aria-pressed, or native semantics. Do not infer disabled behavior from CSS alone, especially on links.

## Preservation and verification

Keep existing separators, utilities, and language state. Hero, rundown, gallery, directory, donation, contact, FAQ, login, and map remain PAGE-SPECIFIC compositions. Replace legacy gradient heading/Sheet recipes only when encountered in public usage; do not delete unrelated unused code.

Use existing sm/md/lg breakpoints, preserving successful grids. Verify five public routes at 1440/768/375/320px in both languages, 200% text enlargement, reduced motion, keyboard navigation, dialog focus return, empty/error/loading states, and task interactions. Require 4.5:1 normal text and 3:1 large text/essential boundaries. Run typecheck, relevant lint, and production build; record existing failures separately.
