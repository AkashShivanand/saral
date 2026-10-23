# Docs benchmark, group 1

Systems: Tailwind CSS, Material 3, Radix, Base UI, shadcn/ui.

Method: official pages read with a web fetcher on 2026-10-13, plus web search for complaints. No browser was used, so motion, hover states and timings are not observed first hand. Where a claim could not be confirmed from a page, it says so. Performance is "measured separately" for every system: no public, cited figure for any of these docs sites turned up.

Scale: 1 to 5, where 5 is best in class.

---

## Tailwind CSS

Scope: tailwindcss.com v4.3 docs, Tailwind Play, Tailwind Plus (paid UI blocks and the Elements library).

| # | Criterion | Score | Evidence | Link |
|---|---|---|---|---|
| 1 | Time to first working component | 5 | Play CDN is one step: paste a script tag and use classes, about 2 minutes from the home page (Get started, Installation, Play CDN). The Vite path is 6 numbered steps, about 5 to 8 minutes, and needs Node and a bundler. Play CDN is marked development only. Tailwind ships no components in the free docs, so "component" here means a styled element. | https://tailwindcss.com/docs/installation/play-cdn , https://tailwindcss.com/docs/installation/using-vite |
| 2 | Search | 4 | Algolia DocSearch (`@docsearch/react` in the site's package.json), opened with ⌘K or Ctrl K. Pages are one per utility, so class names like `p-4` land on the right page. No AI answer feature confirmed. | https://github.com/tailwindlabs/tailwindcss.com/blob/main/package.json |
| 3 | Information architecture | 4 | Top bar: Docs, Play, Blog, Showcase, Partners, Plus. Sidebar has 18 groups in this order: Getting started, Core concepts, Base styles, Layout, Flexbox and Grid, Spacing, Sizing, Typography, Backgrounds, Borders, Effects, Filters, Tables, Transitions and Animation, Transforms, Interactivity, SVG, Accessibility. Two levels deep, organised like a CSS reference. Tokens live in "Theme variables" under Core concepts. A v4.3 badge sits by the logo; older majors live on their own subdomains. | https://tailwindcss.com/docs/theme |
| 4 | Component page template | 4 | Utility page order: Quick reference table (Class to Styles, "Show more"), Examples (basic, per side, logical properties with LTR and RTL demos, custom value, responsive), Customizing your theme. Examples pair a live render with code; some use HTML and Generated CSS tabs; anti-patterns are labelled "Won't work". Right rail "On this page". Copy buttons could not be confirmed from page text. | https://tailwindcss.com/docs/padding , https://tailwindcss.com/docs/hover-focus-and-other-states |
| 5 | Playground and live code | 4 | Tailwind Play is a separate site with split layouts, a version label (v4.3.3), a responsive preview toggle and a Share button that copies a link. In-page docs examples are not editable. | https://play.tailwindcss.com/ |
| 6 | Theming tools | 3 | No theme builder. The Colors page lets you click a swatch to copy its OKLCH value, Shift click for hex. Theme variables page prints the full default `@theme` block, so every token is visible as a CSS variable. | https://tailwindcss.com/docs/colors |
| 7 | Accessibility guidance | 2 | Covers tools, not components: `aria-*` variants, `motion-reduce`, `contrast-more`, `forced-colors`, `pointer-coarse`, `sr-only`. No keyboard tables in the free docs. Tailwind Plus Elements claims ARIA, focus and keyboard handling, but its docs sit behind a login. | https://tailwindcss.com/docs/hover-focus-and-other-states , https://tailwindcss.com/blog/vanilla-js-support-for-tailwind-plus |
| 8 | Performance | n/a | Measured separately. | |
| 9 | What feels premium | 5 | Home page demos are real CSS features you can poke: LTR and RTL toggle, easing curves, container queries, P3 swatches, dark previews. Shiki highlighting, tight type, quiet sidebar, swatch click to copy. Copy voice is short and confident. | https://tailwindcss.com/ |
| 10 | What annoys users | 3 | The maintainer declined an `llms.txt` pull request, saying docs traffic is down about 40% and the docs are the funnel to paid products (reported by Neowin). Early v4 docs assumed a build step, per HN. Beta getting-started links were "buried, and also broken" (HN, v4 beta thread). Elements docs require a paid login. | https://www.neowin.net/news/tailwind-lays-off-75-employees-as-ai-kills-majority-of-its-revenue/ , https://news.ycombinator.com/item?id=42799136 , https://news.ycombinator.com/item?id=42210553 |

**Home page structure.** Nav with version badge and ⌘K search. Hero: one-line promise, one-paragraph subhead naming real class names, one "Get started" button, beside a live card built from utilities with its markup shown. Proof: sponsor logo grid ("Supported by the best"). Then a long "Built for the modern web" run of feature demos (responsive, filters, dark mode, CSS variables, P3, grid, transitions, cascade layers, logical properties, container queries, 3D). Then "Ship faster and smaller" with a tabbed code panel. Then a showcase grid of sites in the wild. Footer.

**Steal.** The utility page's quick reference table (name on the left, exact CSS it produces on the right) as the first block on every token and part page. For Saral: each component page opens with a table of `data-part` names and the token roles each one reads, so the contract is visible before any prose. Also steal click a swatch to copy the value.

**Avoid.** Docs as a sales funnel. Tailwind's own maintainer tied docs traffic to revenue, and then refused a plain text export. Saral should ship `llms.txt` and a Markdown copy of every page from day one, and keep every behaviour doc public.

---

## Material 3

Scope: m3.material.io (guidelines), material-web.dev (Google's web components, in maintenance mode), with a note on MUI.

| # | Criterion | Score | Evidence | Link |
|---|---|---|---|---|
| 1 | Time to first working component | 2 | m3.material.io has no code. A web developer must find Develop, Web, then material-web.dev, whose CDN path is 4 steps (font, import map to esm.run, module script, tags), about 10 minutes. The npm path needs Rollup to resolve bare specifiers. The web library is "in maintenance mode" and M3 Expressive is not implemented on web. | https://material-web.dev/about/quick-start/ , https://m3.material.io/develop/web |
| 2 | Search | 2 | Not verified. The site is client-rendered: a plain fetch returns only the page title, so the search UI could not be inspected. No code, props or token search is possible because guidance pages carry no code. | https://m3.material.io/ |
| 3 | Information architecture | 3 | Guidance is split from code. Home leads with news (Google I/O 2026, M3 Expressive), then components, then "Next steps" (Get started, Figma kit) and "Develop". Foundations and Styles (color, type, shape, motion) sit apart from Components. Navigation rail plus a drawer that opens on hover, per a write-up of the redesign. No version switcher; M2 lives on m2.material.io. | https://victorwynne.com/material-design-3/ , https://en.wikipedia.org/wiki/Material_Design |
| 4 | Component page template | 4 | Four tabs: Overview, Specs, Guidelines, Accessibility. Overview: one line, key points, variants image, Availability and resources table (Flutter, Compose, Android Views, Web, Figma kit), dated "M3 Expressive update", Differences from M2. Specs: variants, configurations, tokens and specs (token set picker), numbered anatomy, color role table, states, shape morph, measurements, baseline tokens. Guidelines: usage, anatomy, color styles, adaptive design, each with Do, Don't and Caution images. Every heading has "Copy link". | https://m3.material.io/components/buttons/overview , https://m3.material.io/components/buttons/specs , https://m3.material.io/components/buttons/guidelines |
| 5 | Playground and live code | 2 | No live code on m3.material.io. material-web.dev pages open with an embedded interactive demo and link to a lit.dev playground. | https://material-web.dev/components/button/ |
| 6 | Theming tools | 5 | Material Theme Builder (web and Figma plugin) builds a full scheme from one source color or an image, with dynamic color; it exports tokens as DSP and theming code for Compose and Views, and recently Figma variables. The color system documents 26+ roles and three contrast levels (standard, medium, high, added May 2025). CSS export could not be confirmed from an official page. | https://m3.material.io/blog/material-theme-builder , https://m3.material.io/styles/color/overview |
| 7 | Accessibility guidance | 4 | Each component has an Accessibility tab: use cases, interaction and style (3:1 contrast for buttons, 200% text scaling), a keyboard table (Tab, Space or Enter), and labelling. Targets of 48 by 48 dp sit in Specs. No WCAG criterion mapping seen. | https://m3.material.io/components/buttons/accessibility |
| 8 | Performance | n/a | Measured separately. Note only: content needs JavaScript to render at all, observed directly. | |
| 9 | What feels premium | 4 | Big, confident illustration and motion work, dated "What's new" notes on each page, numbered anatomy diagrams, token set pickers in spec tables, Do and Don't images that show the mistake rather than describe it. | https://m3.material.io/components/buttons/specs |
| 10 | What annoys users | 2 | The official web library went into maintenance mode; commenters called it a shame Google paused it, and a community fork says it "just can't wait" for Google. Developers who arrive from guidance pages find no code and a web library that lags the spec. Old material.io links broke and needed mass updates in other docs. MUI, the popular React implementation, still links to Material Design 2. | https://github.com/material-components/material-web/discussions/5642 , https://cdn.jsdelivr.net/gh/material-esm/material@3.0.6/README.md , https://github.com/flutter/website/issues/8586 , https://mui.com/material-ui/react-checkbox/ |

**Home page structure.** No classic hero button. Opens with a news block (Google I/O 2026, what's new). Then "M3 Expressive: Design with emotion" with cards (Figma kit, motion physics, shape library, a type article). Then "Expressive components" highlights with "See all". Then "How to apply" (blog, video). Then "Latest in Material and Google Design". Then "Next steps" (Get started, Figma kit) and "Develop". Proof is implicit: it is Google's own system.

**Steal.** The four-tab component page with a dedicated Accessibility tab and a numbered anatomy diagram, plus the Availability and resources table that states, per platform, what exists and what does not. For Saral, that table maps cleanly to its contract: rows for tokens, CSS, core, Web Component and React adapter, each with a status. Also steal the dated "what changed" block at the top of a page.

**Avoid.** Splitting guidance from code across sites and letting the code fall behind the spec. Also avoid a client-rendered docs site: a plain fetch of m3.material.io gets only a title, which hurts no-JavaScript readers, crawlers and AI tools alike. Saral's portal should be static HTML that reads fully without JavaScript, which matches its own "native first" rule.

---

## Radix

Scope: radix-ui.com Primitives, Themes, Colors, Themes playground.

| # | Criterion | Score | Evidence | Link |
|---|---|---|---|---|
| 1 | Time to first working component | 3 | Primitives: install `radix-ui`, import parts, write all styles yourself, about 10 to 15 minutes in an existing React app. Themes: 4 steps (install, import CSS, wrap in `Theme`, use a component), about 5 to 10 minutes. React is assumed throughout and never stated as a requirement on the getting started page. | https://www.radix-ui.com/primitives/docs/overview/getting-started , https://www.radix-ui.com/themes/docs/overview/getting-started |
| 2 | Search | 3 | Custom search built on Algolia Autocomplete plus MiniSearch, per the site's package.json. Searches docs pages. No AI answers seen. | https://github.com/radix-ui/website/blob/main/package.json |
| 3 | Information architecture | 4 | Four products in the top bar: Themes, Primitives, Icons, Colors, plus Playground and Blog. Primitives sidebar: Overview, Guides, Components, Utilities. Themes docs flow from Getting started to Styling, Layout, Theme, Color, Dark mode, Typography. Each primitive page shows its own package version (for example 1.3.12) rather than a site-wide switcher. | https://www.radix-ui.com/primitives/docs/components/checkbox |
| 4 | Component page template | 5 | Primitives page order: title and one line, live demo with `index.jsx` and `styles.css` tabs and "Expand code", Features list, a meta row (version, package size, View source, Report an issue, ARIA design pattern, View as Markdown), Anatomy, API reference per part (Prop, Type, Default table, then a data attributes table such as `[data-state]`, `[data-disabled]`), Examples, Accessibility (WAI-ARIA pattern link and keyboard table), Previous and Next, Edit on GitHub. Themes pages are shorter: preview, one props table, examples, link back to the primitive. | https://www.radix-ui.com/primitives/docs/components/checkbox , https://www.radix-ui.com/themes/docs/components/checkbox |
| 5 | Playground and live code | 3 | Demos show code but are not editable in page; the site bundles the StackBlitz SDK. The Themes playground is a showcase of every component with a theme panel, not a code editor. | https://www.radix-ui.com/themes/playground |
| 6 | Theming tools | 5 | Radix Colors: 12-step scales where each step has a job (backgrounds, interactive, borders, solids, text), alpha variants, P3, APCA-based contrast targets, dark mode by class. A custom palette page generates scales from accent, gray and background. Themes panel tunes accent, gray, appearance, radius, scaling and copies the theme. | https://www.radix-ui.com/colors , https://www.radix-ui.com/colors/custom |
| 7 | Accessibility guidance | 4 | Every primitive page ends with an Accessibility section linking the WAI-ARIA pattern it follows and a keyboard table. An overview page covers focus management and labelling and says testing spans common assistive tech, without naming any. Themes pages have no accessibility section. | https://www.radix-ui.com/primitives/docs/overview/accessibility |
| 8 | Performance | n/a | Measured separately. One HN user reported the live example lagged on Firefox for Android; anecdotal. | https://news.ycombinator.com/item?id=37096111 |
| 9 | What feels premium | 5 | The home page is the product: a wall of real app fragments (invites, pricing, invoice approval, KPIs, to-do) built from Themes. Calm typography, clear part tables, a per-component meta row with package size. HN commenters praised the live examples and transitions. | https://www.radix-ui.com/ , https://news.ycombinator.com/item?id=37096111 |
| 10 | What annoys users | 3 | Docs "assume readers already know Radix", per an HN commenter. An open Themes issue asks for better docs on customising CSS variables (#488). A HN commenter noted the landing page never says it is React only. Wider worry about maintenance after the original team moved on. | https://news.ycombinator.com/item?id=37096111 , https://github.com/radix-ui/themes/issues/488 , https://news.ycombinator.com/item?id=46688971 , https://dev.to/mashuktamim/is-your-shadcn-ui-project-at-risk-a-deep-dive-into-radixs-future-45ei |

**Home page structure.** Nav (Themes, Primitives, Icons, Colors, Documentation, Playground, Blog, GitHub) and a release banner. Hero: "Start building your app now", one sentence, a 5-line code snippet, "Get started" and "Playground". No logo wall. The rest of the page is a dense grid of realistic UI built with the library, which works as the proof.

**Steal.** The per-part API table with a separate data attributes table. Saral already has `data-scope` and `data-part`; a Radix-style table per part (attribute, values, when set) is the natural home for `data-invalid` and `data-pending`. Also steal the meta row: version, size, source, report an issue, ARIA pattern, View as Markdown.

**Avoid.** Assuming a framework without saying so. Radix examples are all JSX and the getting started page never names React. Saral should lead every example with plain HTML and CSS, and put the React adapter in a clearly labelled second tab.

---

## Base UI

Scope: base-ui.com (React), v1.0 stable since 11 December 2025.

| # | Criterion | Score | Evidence | Link |
|---|---|---|---|---|
| 1 | Time to first working component | 3 | Quick start: install one package, add a root style for portals (stacking context), add a backdrop fix for iOS 26 Safari, then assemble a component. About 10 to 15 minutes in an existing React app. Each demo also opens in StackBlitz, which is the zero install route. | https://base-ui.com/react/overview/quick-start |
| 2 | Search | 3 | Custom client-side search (the docs package uses `match-sorter`, no Algolia), opened with ⌘K. Searches page titles and content; no AI answers seen. | https://github.com/mui/base-ui/blob/master/docs/package.json |
| 3 | Information architecture | 4 | Sidebar: Overview, Handbook, Components, Utils. Handbook holds styling, composition, forms and an `llms.txt` link. Releases are documented per version. Flat and short. | https://base-ui.com/react/handbook/styling |
| 4 | Component page template | 4 | Order: live demo with a CSS Modules and Tailwind choice, file tabs (`index.tsx`, `index.module.css`), "Show code" and StackBlitz; Usage guidelines; Anatomy; Examples (labelling, rendering as a native button, form integration); API reference per part (props table, then data attributes table). "View as Markdown" and "View source" links. No per-component keyboard table. | https://base-ui.com/react/components/checkbox |
| 5 | Playground and live code | 4 | Every demo opens in StackBlitz with both styling flavours available. Not editable in page. | https://base-ui.com/react/components/checkbox |
| 6 | Theming tools | 1 | None, by design: unstyled. The styling handbook documents `className` as a function of state, data attributes, CSS variables, Tailwind, CSS Modules and CSS-in-JS. | https://base-ui.com/react/handbook/styling |
| 7 | Accessibility guidance | 3 | One overview page: WAI-ARIA keyboard support, focus props (`initialFocus`, `finalFocus`), labelling via Field and Fieldset, developer owns focus rings and contrast, recommends APCA. Component pages carry a usage guideline line but no keyboard table. | https://base-ui.com/react/overview/accessibility |
| 8 | Performance | n/a | Measured separately. | |
| 9 | What feels premium | 4 | Restraint: text-forward pages, two styling flavours side by side, Markdown copy of every page, a home page that names the team ("So you know who to blame"). Copy has a light, dry voice. | https://base-ui.com/ |
| 10 | What annoys users | 3 | A HN commenter called the input demos "barely visible thin light gray lines"; another replied the example CSS is minimal on purpose. Release notes moved the package name in 1.0, which breaks copied install lines. Stable 1.0 arrived about a year after the date first planned. | https://news.ycombinator.com/item?id=46245401 , https://app.unpkg.com/@base-ui/react@1.6.0/files/docs/react/overview/releases/v1-0-0.md , https://mui.com/blog/base-ui-2024-plans/ |

**Home page structure.** Hero: "Unstyled UI components for building accessible user interfaces", a credit line naming the teams behind Radix, Floating UI and Material UI, and one "Documentation" button. Then short value paragraphs (composable, no visual opinions, built to last). Proof: "Made for the makers" logo row. Then a team roster. Then a fine print footer.

**Steal.** "View as Markdown" on every page and an `llms.txt` in the Handbook, plus demos that offer two styling flavours of the same component. For Saral the two flavours would be plain CSS with tokens, and the React adapter, from the same spec.

**Avoid.** Demo styling so faint that people judge the library by it. Saral's demos should use its real tokens at full contrast, since the demo is the first thing a reader sees and the axe checks already exist.

---

## shadcn/ui

Scope: ui.shadcn.com, including /create, theming, colors, llms.txt.

| # | Criterion | Score | Evidence | Link |
|---|---|---|---|---|
| 1 | Time to first working component | 4 | Vite path is 4 steps: `shadcn init -t vite`, `shadcn add card`, import, render. About 5 to 8 minutes. Needs Node, React, Tailwind and a bundler; the CLI scaffolds them. /create builds a preset visually and hands you one command. | https://ui.shadcn.com/docs/installation/vite , https://ui.shadcn.com/docs/installation |
| 2 | Search | 4 | Command menu built on `cmdk` inside a Fumadocs site, ⌘K. Finds docs, components and blocks. The site also ships `llms.txt` (about 111 links) and an MCP server page, so AI tools get a direct route. | https://github.com/shadcn-ui/ui/blob/main/apps/v4/package.json , https://ui.shadcn.com/llms.txt |
| 3 | Information architecture | 4 | Top bar: Docs, Components, Blocks, Charts, Directory, Typeset, Create. Sidebar groups: Sections, Components, Get Started, Forms, Utilities, Registry, plus helper packages. Older majors live on v2 and v3 subdomains with a "Switch to latest" banner. | https://v3.shadcn.com/docs/tailwind-v4 |
| 4 | Component page template | 4 | Order: title, "Copy Page", Previous and Next; one line; library tabs (Base UI, React Aria, Radix UI); preview with View Code and Copy; Installation (CLI and Manual tabs, pnpm, npm, yarn, bun); Usage; Examples (states, group, table, RTL with a language switch); API reference that only links to the underlying library. No accessibility section. | https://ui.shadcn.com/docs/components/checkbox |
| 5 | Playground and live code | 3 | No in-page editing and no sandbox links on component pages. "Open in v0" exists under Registry. The deploy callout points to Vercel. | https://ui.shadcn.com/docs/components/checkbox |
| 6 | Theming tools | 5 | /create picks library, style (Vega, Nova, Maia, Lyra, Mira), base color, theme, icons, font, radius and menu colors, with a shuffle, and outputs a preset string for the CLI. Theming page documents a clear surface and `-foreground` token pairing in OKLCH with `.dark` overrides. Colors page copies HEX, RGB, HSL, variables and classes. | https://www.infoq.com/news/2026/02/shadcn-ui-builder , https://ui.shadcn.com/docs/theming , https://ui.shadcn.com/colors |
| 7 | Accessibility guidance | 2 | No accessibility section on component pages; keyboard behaviour is delegated by a link to Base UI or Radix docs. An RTL example is a plus. | https://ui.shadcn.com/docs/components/checkbox |
| 8 | Performance | n/a | Measured separately. | |
| 9 | What feels premium | 5 | Home page is a full dashboard in light and dark built from the components. Very consistent spacing, neutral palette, code blocks with package manager tabs, a "Copy Page" for AI tools, visual preset builder with named styles. | https://ui.shadcn.com/ |
| 10 | What annoys users | 2 | Docs explain how but not why: an author found no context for the radio button design in the docs (HN). The landing page never says it is React only (HN). Docs now default to Base UI examples, which confuses Radix projects after the July 2026 switch. Copied code means bug fixes do not arrive through `npm update`. | https://news.ycombinator.com/item?id=46688971 , https://news.ycombinator.com/item?id=48791328 , https://blog.openreplay.com/shadcn-ui-radix-base-ui-switch/ , https://leonardomontini.dev/shadcn-ui-use-with-caution |

**Home page structure.** Announcement badge above the hero. Hero: "The Foundation for your Design System", one-line subhead, "Get Started" and "View Components". Then a large dashboard preview in light and dark, then a grid of demo cards (savings, charts, forms, settings, chat, notifications). Proof is the GitHub star count in the nav. Minimal footer.

**Steal.** The token pairing rule: every surface token has a matching `-foreground` token, documented as a rule rather than a list. Saral's `tokens/roles.json` could state the pairs and the docs could show each pair rendered with its contrast ratio. Also steal "Copy Page" and package manager tabs on install commands.

**Avoid.** Delegating behaviour and accessibility docs to another library's site. A shadcn API reference is a link out. Saral owns its core, so every component page should carry its own keyboard table, ARIA notes and state attributes, generated from the spec in `specs/`.

---

## Cross-system summary

The five sites split into two camps. Guidance sites (Material 3) are strongest on structure: tabs per component, numbered anatomy, Do and Don't images, a dedicated Accessibility tab and a per-platform availability table, but they keep code elsewhere and render only with JavaScript. Code sites (Tailwind, Radix, Base UI, shadcn/ui) are strongest on speed and craft: ⌘K search on every one, live demos with code, copy buttons, and home pages where the product is the proof. Only Radix puts a keyboard table on every component page; Base UI and shadcn/ui push it to an overview page or another site, and Tailwind covers accessibility only as utilities. Theming tools are the clearest gap between leaders and the rest: Material Theme Builder, Radix Colors and shadcn's /create each turn a few choices into a full token set, while Tailwind and Base UI offer none. The newest pattern is pages written for machines as well as people: Radix and Base UI offer "View as Markdown", Base UI and shadcn/ui ship `llms.txt`, shadcn/ui adds "Copy Page" and an MCP server, while Tailwind publicly declined to. For Saral, the strongest combined template is: a Material-style page with Overview, Usage, Accessibility and API sections; a Radix-style parts table with data attributes; a Tailwind-style quick reference of parts to token roles; demos in plain HTML first with React second; a static, no-JavaScript-required portal; and Markdown plus `llms.txt` for every page.
