# Group 4 benchmark: Fluent 2, Chakra UI, Ark UI, Park UI

Researched on 13 October 2026 with web search and page fetches only (no browser). Pages that render content with client JavaScript (live previews, theme panels) were read from their server HTML, Markdown exports or source, so interactive details are reported from page text where noted. Performance is measured separately.

Scores: 1 is poor, 5 is best in class.

## Microsoft Fluent 2 (fluent2.microsoft.design and the Fluent UI React v9 Storybook)

### Scores

| Criterion | Score | Evidence | Link |
|---|---|---|---|
| 1. Time to first working component | 3 | The React path is 4 steps: install `@fluentui/react-components`, import `FluentProvider` and `webLightTheme`, pass the theme, render a `Button` inside the provider. About 5 to 8 minutes including a Vite project. React needs a bundler; the Web Components path (3 steps, `setTheme(webLightTheme)`) can run from a CDN. iOS and Android have 2 steps each; Windows only links out to Microsoft Learn. | https://fluent2.microsoft.design/get-started/develop |
| 2. Search | 2 | The guidance site has a header search box with a `/` shortcut. Code docs live in a separate Storybook whose sidebar search filters story titles only. No search spans both sites, no prop or token search, no AI answers. | https://fluent2.microsoft.design/ |
| 3. Information architecture | 2 | Design guidance, platform component pages, the React API (Storybook), the Web Components API (a second Storybook) and WinUI (Microsoft Learn) are separate properties. A component page switches only between web/react and web/web-components. Home page entry points: Design, Develop, Components by platform (Web, iOS, Android, Windows). | https://fluent2.microsoft.design/components/web/react/core/button/usage |
| 4. Component page template | 3 | Guidance page order: Preview, Resources (React Storybook, Web Components Storybook, WAI APG pattern, migration Storybook), Types, Behavior, Layout, Accessibility, Content. Storybook page order: title and summary, Best practices (Layout, Content), Props table, then stories (Appearance, Default, Disabled, Icon, Loading, Shape, Size, With Long Text). No anatomy, no parts or state attribute docs. No tabs: guidance is one long page. | https://storybooks.fluentui.dev/react/llms/components-button-button.txt |
| 5. Playground and live code | 3 | Guidance pages embed a preview with "Open in CodeSandbox". Storybook gives controls per story. Users have reported the CodeSandbox links not working. | https://github.com/microsoft/fluentui/discussions/23183 |
| 6. Theming tools | 3 | A Theme Designer in Storybook builds a brand ramp from a key colour and exports `BrandVariants` for `createLightTheme`/`createDarkTheme`. The guidance site's design tokens page explains global and alias tokens with static screenshots only, no token table. Themes cover light, dark and high contrast. | https://storybooks.fluentui.dev/react/llms.txt and https://fluent2.microsoft.design/design-tokens |
| 7. Accessibility guidance | 3 | A site-wide accessibility page (states WCAG 2.1 AA target) plus a prose Accessibility section on each component (contrast ratios, tooltip and `aria-describedby` advice) and a link to the WAI APG pattern. No keyboard tables, no WCAG criterion mapping per component. | https://fluent2.microsoft.design/accessibility |
| 8. Performance | n/a | Measured separately. | |
| 9. What feels premium | 4 | Content design guidance on every component ("Apply versus Save", buttons that end a task). Multi-platform imagery on the home page. Accessibility Figma plugins (focus order, contrast checker) offered as resources. The Storybook publishes an llms.txt with one text file per component. | https://fluent2.microsoft.design/components/web/react/core/button/usage |
| 10. What annoys users | 2 | A user found the "versioning/numbering/naming confusing" and asked for edit links from the Fluent 2 site to GitHub. Others said the v8 to v9 mapping table "is a nightmare" because so many components are missing, and that sandbox links failed. A Power Apps developer said the only v9 documentation they found covered theming. | https://github.com/microsoft/fluentui/discussions/29609, https://github.com/microsoft/fluentui/discussions/23183, https://community.powerapps.com/t5/Power-Apps-Pro-Dev-ISV/FluentUI-v9-and-virtual/m-p/2564582 |

### Home page structure

1. Header: logo, search (`/`), "Employee sign-in", skip link.
2. Hero: "Let the flow" with a rotating word (work, ideas, creativity, tasks).
3. Two cards: Design (Figma UI kits) and Develop (installation guides), each "Get started".
4. Components: four platform tiles, Web, iOS, Android, Windows.
5. Newsworthy: three articles on microsoft.design.
6. Resources: four Figma community plugins (focus order, contrast checker, content reel, icon scaling).
7. Footer: Fluent 1, Microsoft Design, Inclusive Design, social links, legal.

### Steal

A "Content" section on every component page that tells writers what labels to use (verbs for buttons, Apply versus Save, how to end a task). It suits Saral's plain-words docs rules and costs no code.

### Avoid

Splitting guidance and code API across separate sites with separate search and different naming. Readers cannot tell which site is current, and the guidance site has no edit link back to the source.

## Chakra UI v3 (chakra-ui.com)

### Scores

| Criterion | Score | Evidence | Link |
|---|---|---|---|
| 1. Time to first working component | 3 | 5 steps after creating a project: install `@chakra-ui/react @emotion/react`, run `npx @chakra-ui/cli snippet add`, wrap the app in the generated `Provider` (Chakra plus `next-themes`), edit `tsconfig` (`moduleResolution: Bundler`, `@/*` path alias), then import components. Node 20 minimum. About 8 to 12 minutes. React only; Emotion is a runtime dependency; a StackBlitz starter is the zero-install route. | https://chakra-ui.com/docs/get-started/installation |
| 2. Search | 3 | ⌘K search with a client-side index (`fuse.js` and `match-sorter` in the site's package.json, no Algolia). No evidence it indexes props or tokens; no AI answer box on the site, though an MCP server and llms.txt files exist. | https://raw.githubusercontent.com/chakra-ui/chakra-ui/main/apps/www/package.json |
| 3. Information architecture | 4 | Top tabs: Get Started, Components, Charts, Styling, Theming. Get Started groups: Overview (Installation, Migration, CLI, Figma, Contributing, Playground, Changelog), AI for Agents (MCP Server, LLMs.txt, AI Skills), Frameworks, Environments (Shadow DOM, Iframe). Theming groups: Concepts, Design Tokens, Compositions, Customization. Two levels deep, clear. | https://chakra-ui.com/docs/theming/overview |
| 4. Component page template | 4 | Order: breadcrumb, title and summary, resource links (Source, Storybook, Recipe, Ark), an AI tip linking to Agent Skills, Copy Page, Usage, Examples (each with Preview/Code tabs and a StackBlitz link), Guides, Customization, Props (Prop, Default, Type), Explorer, Component Anatomy, previous/next, on-this-page. No data attribute docs. | https://chakra-ui.com/docs/components/accordion |
| 5. Playground and live code | 4 | Every example opens in StackBlitz. A Playground page previews many components at once with a theme panel. No in-page code editing. | https://chakra-ui.com/playground |
| 6. Theming tools | 4 | Playground theme panel: accent and gray palette, font family (Inter, Outfit, Geist, Figtree), radius from none to 2xl. `npx @chakra-ui/cli typegen ./theme.ts` keeps theme types in sync. Token pages are prose and code, not an interactive token table. | https://chakra-ui.com/playground |
| 7. Accessibility guidance | 2 | Button and Accordion pages have no accessibility, keyboard or ARIA section; the Accordion links to Ark, which has the keyboard table. | https://chakra-ui.com/docs/components/button |
| 8. Performance | n/a | Measured separately. | |
| 9. What feels premium | 4 | The Explorer ("Click on parts in the sidebar to highlight them in the preview") and an anatomy diagram ("Hover to highlight, click to select parts"). llms.txt split by topic (components, charts, styling, theming, v3 migration). The MCP server has a `v2_to_v3_code_review` tool. | https://chakra-ui.com/docs/components/accordion, https://chakra-ui.com/llms.txt, https://chakra-ui.com/docs/get-started/ai/mcp-server |
| 10. What annoys users | 2 | A developer called the v3 migration guide "far from complete" (missing renames, prop changes, Toast switch). Chakra's own post admits users felt snippets "were required to make components work". A Japanese team reported a 3 month upgrade touching 259 files. Paid Pro banners sit on the home page and every docs page. | https://dev.to/theoforger/sprint-5-chakra-ui-v3-migration-4pfi, https://chakra-ui.com/blog/refactoring-snippets, https://zenn.dev/anyland/articles/3d2b09eb8198a3 |

### Home page structure

1. Announcement bar for the paid Pro components.
2. Hero: "component system for building products with speed", Start Building, `npm i @chakra-ui/react`.
3. Component showcase (Slider, Pin Input, Tabs, Menu, Switch) and the Chakra, Ark, Zag family.
4. Product teams line.
5. Design system: Tokens, Typography, Recipes, each with code.
6. "Built for developers, by developers".
7. Stats (downloads, stars, Discord members).
8. Testimonials, then sponsor tiers and donation links.
9. Framework support and templates.
10. Second Pro upsell, footer.

### Steal

The anatomy explorer: list the parts beside a live preview and highlight a part on hover or click. Saral already puts `data-scope` and `data-part` on every part, so the docs site can outline `[data-part="x"]` with a few lines of docs-only script, with no change to components.

### Avoid

Making optional setup look mandatory. Chakra's first docs pushed a CLI snippet step and `tsconfig` edits, users read them as required, and the team had to rewrite the docs to show complete code. Also avoid shipping a major version with a migration guide that lists only part of the breaking changes.

## Ark UI (ark-ui.com)

### Scores

| Criterion | Score | Evidence | Link |
|---|---|---|---|
| 1. Time to first working component | 4 | 5 short steps: have a framework project, `npm install @ark-ui/react`, copy the Slider example (`index.tsx`, `slider.module.css`, `global.css`), style it with `[data-scope='slider'][data-part='root']`, done. About 5 minutes. Needs React, Solid, Vue or Svelte; no CSS framework or codegen. | https://ark-ui.com/docs/overview/getting-started |
| 2. Search | 3 | ⌘K search with a client-side `match-sorter` index, no AI answers. The team's January 2026 docs post lists "better search" as still to do. | https://ark-ui.com/blog/we-improved-the-docs |
| 3. Information architecture | 4 | Sidebar: Overview, Guides, AI for agents, Collections, Components, Utilities, plus version links (v5, v4, v3). The framework (React, Solid, Vue, Svelte) is chosen in the header and carried in the URL (`/react/docs/components/accordion`), so links share the right framework. | https://ark-ui.com/llms.txt |
| 4. Component page template | 5 | Order: title and summary, Copy Page menu, live preview, Anatomy (a code block of part nesting: `Accordion.Root` > `Item` > `ItemTrigger` > `ItemIndicator`, `ItemContent`), Examples (each with Show Code), Guides, API Reference (per part: Props table with columns Prop, Default, Type, descriptions under each name; then a data attributes table with columns Attribute, Description), Context table (Property, Type), Accessibility (Keyboard Support table: Key, Description). Every part's data attribute table lists `data-scope` and `data-part` first, then state: Root `data-orientation`; Item `data-state` ("open" or "closed"), `data-focus`, `data-disabled`, `data-orientation`; ItemTrigger adds `data-controls`. The anatomy block itself shows no attributes. | https://ark-ui.com/docs/components/accordion |
| 5. Playground and live code | 3 | Live previews with code collapsed by default and a toggle between full setup (CSS module and global CSS tabs) and bare logic. No in-page editing or share links. | https://ark-ui.com/blog/we-improved-the-docs |
| 6. Theming tools | 2 | Headless by design, so no theme builder. The styling guide shows state selectors such as `[data-scope='accordion'][data-part='item'][data-state='open']`; examples now use swappable CSS variable tokens with dark mode. | https://ark-ui.com/docs/guides/styling |
| 7. Accessibility guidance | 4 | A Keyboard Support table on each component (Space, Enter, Tab, Shift+Tab, arrows, Home, End for Accordion). No ARIA role table and no WCAG mapping; behaviour detail lives in Zag.js. | https://ark-ui.com/docs/components/accordion |
| 8. Performance | n/a | Measured separately. | |
| 9. What feels premium | 4 | Per-framework llms files (`llms-react.txt` and others) and per-page Markdown at `/llms.txt/{slug}?framework=vue`. Copy Page menu with View as markdown, Open in ChatGPT, Open in Claude. MCP server `@ark-ui/mcp` with a `styling_guide` tool covering data attributes. Framework switch in the URL. | https://ark-ui.com/docs/ai/mcp-server |
| 10. What annoys users | 3 | A user found the docs "somewhat lacking" for building components; the maintainer's answer was to check Zag.js for detail. The generated Svelte llms file shows "Example not found" in the Slider setup. Every docs page ends with a contact form with a "What is 0 + 0?" check. | https://github.com/chakra-ui/ark/discussions/2795, https://ark-ui.com/llms-svelte.txt |

### Home page structure

1. Top nav: Docs, Showcase, Blog, Plus, Search (⌘K), GitHub.
2. Banner for the newest component.
3. Hero: "Unstyled UI components for your Design System", 45+ components for four frameworks.
4. Get Started and Show Components.
5. Framework tabs with the same Slider in each framework.
6. Feature cards: headless, framework agnostic, accessible by default, state machine powered.
7. Showcase grid, state machine section, contributors, footer, contact form.

### Steal

The per-part data attribute table (Attribute, Description) under each part's props, with `data-scope` and `data-part` listed first and every state value spelled out. Saral should go one step further: show the attributes inside the anatomy block too, and generate both from the spec so they cannot drift. Also put the framework (or "HTML") in the URL, not in a cookie.

### Avoid

Sending readers to another project's docs for the real detail (Ark points to Zag.js). Saral's core and adapters must share one page per component. Also avoid an anatomy block that shows only JSX nesting: for a parts API, the attributes are the API.

## Park UI (park-ui.com)

### Scores

| Criterion | Score | Evidence | Link |
|---|---|---|---|
| 1. Time to first working component | 2 | A Panda CSS project must exist first (separate guide). Then `npm install @ark-ui/react lucide-react`, `npx @park-ui/cli init`, `panda codegen`, `npx @park-ui/cli add button`, import from `@/components/ui`. About 15 to 20 minutes from a blank folder. React or Solid only; Panda and codegen are required. | https://park-ui.com/docs/installation |
| 2. Search | 3 | "Search..." with a K shortcut; client-side `match-sorter` with `fumadocs-core`. No AI answers. | https://raw.githubusercontent.com/chakra-ui/park-ui/main/website/package.json |
| 3. Information architecture | 3 | Getting started (Introduction, Installation, Theming, Migration, Figma Kit, About), then components grouped by job: buttons, data display, disclosure, feedback, forms, layout, navigation, overlays, typography. React and Solid switch. Older Panda, Tailwind and React docs trees still turn up in search with diverging changelogs. | https://park-ui.com/docs |
| 4. Component page template | 3 | Order: title with Copy Page, description, source and Toggle code, Installation (CLI and Manual tabs; Add Component, Integrate Recipe), Usage, Examples, Props (variant, size, defaults, types), previous/next. No anatomy, no data attributes, no accessibility; links to the Ark page instead. | https://park-ui.com/docs/components/button |
| 5. Playground and live code | 2 | Previews with a code toggle. No sandbox, no editing, no share links. | https://park-ui.com/docs/components/button |
| 6. Theming tools | 3 | A "Make it yours" control sits next to Get Started on the home page (it renders client side, so its options were not verified here). The docs configure one accent and one gray (Radix scales) plus radius in the preset; the theming page shows static radius, shadow and colour scales with 12 steps per mode; `npx @park-ui/cli add teal` adds palettes. | https://park-ui.com/, https://park-ui.com/docs/theming, https://park-ui.com/docs/panda/theme/customize |
| 7. Accessibility guidance | 1 | No accessibility, keyboard or ARIA content on Button or Accordion pages. | https://park-ui.com/docs/components/accordion |
| 8. Performance | n/a | Measured separately. | |
| 9. What feels premium | 3 | The home page is a wall of real composed blocks (sign-up, pricing card, payment form, product card, share dialog) that show the system in use. Components ship as source code you own. | https://park-ui.com/ |
| 10. What annoys users | 2 | Breaking config changes between versions (0.43 removed the accent concept and renamed `borderRadius` to `radius`) while older docs trees still show the old API. No llms.txt (404) and no MCP server. | https://park-ui.com/docs/overview/changelog |

### Home page structure

1. Announcement: Park UI joined the Chakra UI organisation.
2. Hero: "Build your own Design System", built on Ark UI and Panda CSS.
3. Get Started and Make it yours, React and Solid switch.
4. Unlabelled grid of composed blocks: sign-up, notifications, pricing, payment, product, share, report issue, login.
5. Footer.

### Steal

Show the system as finished, realistic compositions on the home page (a payment form, a sign-up card) built only from documented components. It proves the components fit together better than a component list does.

### Avoid

Requiring a build tool and code generation before the first render. Saral's promise is plain CSS and native HTML, so the quick start should work by linking one stylesheet in a plain HTML file.

## Cross-cutting: what makes component docs great or terrible (2024 to 2026)

Most sources are practitioner posts and vendor blogs; forum threads were sparse in search. Treat counts as directional.

1. **Complete, copyable code beats setup steps.** Chakra rewrote its docs to show code that imports straight from the package after users assumed CLI snippets were mandatory. Readers want each example to work when pasted. https://chakra-ui.com/blog/refactoring-snippets
2. **Search is table stakes.** A Stripe docs review says good search "is a must nowadays"; Ark lists "better search" as unfinished work. All three Chakra-family sites use a title-level client index, none search props or tokens. https://dev.to/tpom6oh/what-are-great-developer-docs-looking-at-stripe-here-let-s-discuss-1eo9
3. **Live, testable examples with sandbox export.** Supernova notes that without an easy way to test props or grab code, reuse stalls. Ant Design is praised for copying any example into CodePen or StackBlitz. https://www.supernova.io/guide-the-engineering-leaders-guide-to-storybook/2-1-signs-youre-underusing-storybook, https://dev.to/bnevilleoneill/comparing-popular-react-component-libraries-3160
4. **Docs that drift from code lose trust.** Hand-updated Storybooks "drift out of sync fast"; the common fix is generating props tables and token lists from the source of truth and assigning owners. https://www.supernova.io/guide-the-engineering-leaders-guide-to-storybook/2-1-signs-youre-underusing-storybook, https://ones.com/blog/why-your-design-system-documentation-fails-and-how-to-fix-it/
5. **Complete migration guides, ideally with codemods.** The Chakra v3 complaints are about what the guide left out, not what it said. https://dev.to/theoforger/sprint-5-chakra-ui-v3-migration-4pfi
6. **One home for guidance and API.** Storybook serves engineers but is weak for designers and product people, so teams pair it with a narrative site; when the two are separate, as with Fluent, readers get lost between them. https://help.zeroheight.com/hc/en-us/articles/36473744204955, https://github.com/microsoft/fluentui/discussions/29609
7. **Accessibility guidance per component.** Missing accessibility guidance is listed as a critical documentation gap; only Ark in this group ships keyboard tables. https://ones.com/blog/why-your-design-system-documentation-fails-and-how-to-fix-it/
8. **Consistent, clear, useful, honest.** GOV.UK's research with designers and developers found these four qualities decide whether people trust a component page; Polaris and Carbon are praised for when-to-use and when-not-to-use reasoning. https://designnotes.blog.gov.uk/2018/11/05/how-we-document-components-and-patterns-in-the-gov-uk-design-system/, https://www.alwaystwisted.com/articles/my-favourite-design-systems
9. **Docs should render without JavaScript.** Bug reports about docs that show only "Loading..." without scripts, and long-running threads arguing that reading text should never need JS; the agreed fix is static HTML with progressive enhancement. Fetching Fluent's Storybook without JS returned only its title. https://bugreports-test.qt.io/browse/QTWEBSITE-980, https://mail.haskell.org/pipermail/cabal-devel/2018-June/010437.html
10. **Docs for coding agents, with honest expectations.** Copy page as Markdown and "Open in ChatGPT/Claude" menus are now common (PostHog, Ark, Chakra). MCP servers exist because models write code against outdated APIs (the problem Context7 targets). But llms.txt is rarely fetched by crawlers: an Ahrefs log study found 97% of files received no visits and Google says it ignores the file; the real readers are coding assistants that are pointed at it. Doc chatbots can invent flags and endpoints, so any AI answer needs citations and an "I don't know". https://posthog.com/docs/ai-engineering/markdown-llms-txt.md, https://upstash.com/blog/context7-mcp.md, https://ppc.land/llms-txt-adoption-rises-8-8x-but-97-of-files-get-zero-ai-requests/, https://biel.ai/glossary/hallucination, https://www.kapa.ai/library/how-to-reduce-hallucinations-in-a-documentation-chatbot

### Machine-readable docs in this group

| System | llms.txt | MCP server | Copy page as Markdown |
|---|---|---|---|
| Fluent 2 | Yes on the React Storybook only, with one `.txt` per component (https://storybooks.fluentui.dev/react/llms.txt). The guidance site returns 404. | No official server found | Not found |
| Chakra UI | Yes, plus topic files: `llms-full.txt`, `llms-components.txt`, `llms-charts.txt`, `llms-styling.txt`, `llms-theming.txt`, `llms-v3-migration.txt` | Yes, `@chakra-ui/react-mcp` (component props and examples, theme, v2 to v3 code review; Pro tools need a licence key) | Yes, Copy Page button |
| Ark UI | Yes, per framework (`llms-react.txt` and others) and per page (`/llms.txt/components/accordion?framework=vue`) | Yes, `@ark-ui/mcp` (list components, list and get examples, styling guide) | Yes: View as markdown, Open in ChatGPT, Open in Claude |
| Park UI | No (404) | No | Copy Page button present (behaviour not verified) |

### What this means for Saral

- Saral's specs are the natural source for per-page Markdown, llms.txt and a small MCP server: generate them, do not hand-write them.
- A data attribute table per part (Ark) plus a hover-to-highlight anatomy (Chakra) together cover the parts API better than any single system here.
- Keyboard tables and a Content section on every component would put Saral ahead of three of the four.
- A plain HTML quick start with one stylesheet would beat every system here on time to first component.
