# Newskin Objective

Evolve the existing website into a calm, polished, green-led local church experience. Keep it immediately recognizable while making practical information easier to find, repeated components more consistent, and every public page more usable across devices. Preserve business behavior, content meaning, routes, localization, and established Seventh-day Adventist identity.

# Visual Personality

Warm, sincere, contemporary, welcoming, calm, and trustworthy. Let real people, worship, service, youth, and family activities provide the personality. Use clear hierarchy, readable information, purposeful space, and restrained emphasis rather than spectacle.

# Target Audiences

- Existing members seeking schedules, people, events, and church information quickly.
- Youth and families looking for a community they can recognize themselves in.
- First-time visitors deciding when, where, and how to attend.
- People unfamiliar with the Seventh-day Adventist Church who need welcoming, plain-language context.

# Existing Patterns to Preserve

- The green-and-gold identity, church logo, church name, and familiar navigation labels.
- Real congregation photography, the photographic homepage hero, varied gallery proportions, and member portraits with their existing fallback.
- Existing content sequence where it supports comprehension, including worship information, beliefs, community activities, directory search, gallery categories, donation details, contact information, and FAQ content.
- Existing routes, destination links, Indonesian and English support, image optimization, reduced-motion behavior, and theme behavior.
- Shared components, HeroUI controls, local UI primitives, hooks, utilities, and semantic tokens whenever they fit the need.

# Patterns to Modernize

- Strengthen heading hierarchy and connect introductions more closely to their content.
- Make worship time, location, contact methods, search, filters, donation details, and other primary tasks easier to scan and reach.
- Use a consistent primary, secondary, and tertiary action hierarchy. Donation should use the shared palette instead of an isolated accent.
- Refine cards, buttons, fields, navigation states, dialogs, empty states, error states, and loading feedback into a coherent system.
- Reduce excessive scroll distance, post-hero gaps, decorative wrappers, repeated heading pills, and sections with equal visual weight.
- Improve localization consistency, image cropping, keyboard behavior, focus return, and recovery messages.

# Typography Direction

Retain Inter and the existing font-loading mechanism. Use fluid sizing between breakpoints.

| Role              | Desktop target | Mobile target | Guidance                                |
| ----------------- | -------------: | ------------: | --------------------------------------- |
| Homepage title    |           64px |          36px | Bold, approximately 1.1 line height     |
| Other page titles |           48px |          32px | Bold and compact                        |
| Section headings  |           36px |          28px | Semibold, approximately 1.2 line height |
| Card headings     |           20px |          20px | Semibold                                |
| Body text         |        16–18px |          16px | Regular, approximately 1.6 line height  |
| Supporting text   |           14px |          14px | Use readable contrast                   |

Keep paragraphs near 60–70 characters wide. Reserve uppercase for short functional labels. Use solid-color headings by default and cream emphasis sparingly.

# Color Direction

- Deep green `#014b3f` is the primary page identity.
- Supporting greens distinguish content groups and cards.
- Warm cream `#fae9c7` supports selected headings, icons, and gentle emphasis.
- Gold `#f8a724` marks primary actions and restrained accents.
- White and existing muted-text tokens provide readable hierarchy.

Use semantic tokens from `styles/globals.css` rather than repeating literal colors. Meet contrast requirements without relying on low-opacity text. Keep the experience predominantly green; do not introduce a new theme switcher or large unrelated color fields.

# Spacing and Layout Principles

Use the shared scale: 4, 8, 12, 16, 24, 32, 48, 64, and 80px.

- Major sections: about 80px vertically on desktop and 48px on mobile.
- Heading to description: 12–16px; introduction to content: 24–32px.
- Card padding: 24px desktop and 20px mobile.
- Grid gaps: 24px desktop and 16px mobile.
- Page gutters: 24–32px desktop and 20px mobile.
- Standard content width: about 1200px, while preserving intentional full-width imagery.

Use larger gaps to mark a new topic. Avoid viewport-sized empty areas, excessive post-hero spacing, and layouts that make short tasks feel long.

# Surface and Component Treatment

Use three clear layers: page background, content surface, and overlay.

- Standard cards use a solid supporting green, subtle border, and 16px radius.
- Feature panels and image frames use up to 24px radius.
- Buttons and inputs use 10–12px radius and at least 44px touch targets; primary controls target 48px height.
- Primary actions use gold with dark text. Secondary actions use a quiet, high-contrast border treatment. Tertiary actions are recognizable text links.
- Pills are for categories, roles, and compact states, not decorative headings.
- Shadows remain restrained, with stronger elevation reserved for menus and overlays.
- Translucency is limited to controls over photography. Avoid stacked gradients, glow effects, and repeated glass surfaces.
- Use cards only when they group meaningful content; prefer plain text or rows when a container adds no value.

# Photography Guidance

Prioritize existing photographs of the congregation, worship, youth, families, and church activities. Protect faces when cropping across breakpoints and apply only enough overlay for legible text. Preserve the gallery’s varied proportions and the existing portrait fallback. Use meaningful descriptions and appropriate loading behavior. Do not replace authentic community imagery with stock-business or generated imagery, apply artificial tinting, or sacrifice people to decorative crops.

# Responsive Principles

- Treat mobile as a complete reading and task experience rather than a reduced desktop layout.
- Keep successful single-column layouts and scale spacing with typography to control page length.
- Show desktop navigation from the `lg` breakpoint and use the existing menu below it. Keep menu rows spacious and the close action obvious.
- Keep search close to results, make gallery filters deliberate and usable, and allow long names, labels, account details, and controls to wrap without clipping.
- Essential content must not depend on hover, swiping, or scroll animation.
- Verify meaningful changes at 1440px, 768px, 375px, and 320px, including both languages, reduced motion, and enlarged text.
- Avoid horizontal overflow, floating action bars, and extra navigation layers.

# Accessibility Principles

- Meet WCAG AA contrast: 4.5:1 for normal text and 3:1 for large text.
- Provide visible keyboard focus, meaningful labels, coherent headings, and one main landmark per page.
- Dialogs must provide semantics, initial focus, focus containment, Escape dismissal, and focus return.
- Content must remain available with reduced motion and without animation.
- Support 200% text enlargement and reflow down to 320px.
- Keep Indonesian and English controls, pagination, feedback, and recovery messages complete and understandable.
- Communicate loading, empty, success, and error states with text or structure, not color alone.

# Seventh-day Adventist Identity Considerations

- Preserve the official church logo, local congregation name, established beliefs, Sabbath worship information, and existing doctrinal content.
- Explain church-specific information warmly and clearly for visitors who may not know Adventist terminology.
- Present faith, worship, service, family, and community as lived experiences through authentic local content.
- Keep the tone invitational and grounded. Do not invent testimonials, attendance statistics, ministry claims, or promotional proof.
- Give practical visit information clear prominence without making the church feel commercial.

# Patterns to Avoid

- A SaaS dashboard, startup landing page, corporate bank, entertainment site, or generic AI-generated template aesthetic.
- Experimental identity changes, unrelated structural redesigns, or visual novelty without a clear user benefit.
- Excessive gradients, glass effects, glows, decorative heading pills, tiny labels, oversized blank space, and unnecessary card wrappers.
- Multiple equally dominant calls to action, isolated accent colors, stock-business imagery, and invented marketing content.
- Hardcoded styles when a semantic token or shared variant exists.
- UI that clips at narrow widths, hides essential information behind hover or animation, weakens contrast, or reduces comfortable touch targets.

## Newskin Design

For Newskin implementation work, read:

`docs/newskin-design-direction.md`
