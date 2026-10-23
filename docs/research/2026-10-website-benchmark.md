# The best docs sites win on one page, not on one feature

Nineteen design-system and product docs sites were benchmarked on 13 October 2026 against ten criteria: time to a first working component, search, information architecture, the component page, playground, theming tools, accessibility guidance, performance, what feels premium, and what annoys people. No site leads on all ten. Radix, Stripe, Mantine and GOV.UK come out on top, each for a different reason: Radix for its parts and data-attribute tables, Stripe for the shortest route to a real result, Mantine for the most complete component page, GOV.UK for an honest page order that ends with research, known issues and dated changes. The weak spots are shared. Most sites are heavy (a median of about 2.5 MB for one component page, and up to 13 MB), three show little or no text without JavaScript, only a handful put a keyboard table on every component, and nearly every site sends readers to another site for something: code (Material), behaviour (shadcn/ui, Chakra, Park UI), API (Fluent), or tokens (Polaris). Saral can beat every one of them by being the one site that keeps everything about a component on one static page, generated from its spec, that reads with JavaScript off and weighs under 150 kB. Its current portal already weighs 112 kB, the lightest of all 22 pages measured, but loses its speed to a render-blocking font request.

## How this was done

- **Reading.** Four research passes read each site's quick start, a component page (usually Button or Checkbox), its token or colour pages and its home page, and searched GitHub, Hacker News, blogs and forums for complaints about the docs. Reddit could not be reached, so complaints come from the other sources. Full notes, with a score, evidence and a link for every cell, are in [`website/benchmark/`](website/benchmark/): [group 1](website/benchmark/group-1.md) (Tailwind, Material 3, Radix, Base UI, shadcn/ui), [group 2](website/benchmark/group-2.md) (Geist, Linear, Stripe, Apple HIG, Mantine), [group 3](website/benchmark/group-3.md) (GOV.UK, Carbon, Polaris, Primer, Atlassian), [group 4](website/benchmark/group-4.md) (Fluent 2, Chakra, Ark, Park UI, plus what developers say about docs in general).
- **Measuring.** One representative page per site was loaded with the repo's own Playwright (Chromium, 1280 by 800, cold cache, no throttling, one run) by [`website/measure-docs.mjs`](website/measure-docs.mjs). It records bytes transferred, JavaScript bytes, requests, largest contentful paint, and how much page text is left with JavaScript off. Raw numbers are in [`website/measurements.json`](website/measurements.json). One run on one network is a snapshot, not a lab study; bytes and the no-JavaScript test are stable, LCP is not.
- **Scoring.** 1 to 5, where 5 is best in class. "Few annoyances" is scored so that 5 means few and mild complaints. The performance score comes from the measurement: 5 up to 250 kB, 4 up to 1.2 MB, 3 up to 2.6 MB, 2 up to 5 MB, 1 above, and one point off when less than half the text survives without JavaScript. "n/s" means the cell needed a browser the research pass did not use.
- **Linear and Stripe** are product docs, so their first column measures time to a first success (a first issue, a first test payment) and their page column measures the article template.

## Scorecard

| System | First component | Search | IA | Component page | Playground | Theming | Accessibility | Performance | Premium | Few annoyances | Mean |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Radix | 3 | 3 | 4 | 5 | 3 | 5 | 4 | 3 | 5 | 3 | 3.8 |
| Stripe docs | 5 | 4 | 4 | 5 | 5 | 3 | 2 | 1 | 5 | 3 | 3.7 |
| Mantine | 3 | 4 | 4 | 5 | 4 | 4 | 4 | 3 | 3 | 3 | 3.7 |
| GOV.UK Design System | 4 | 3 | 5 | 5 | 2 | 1 | 4 | 5 | 5 | 3 | 3.7 |
| GitHub Primer | 4 | 3 | 4 | 4 | 5 | 3 | 4 | 2 | 4 | 3 | 3.6 |
| Ark UI | 4 | 3 | 4 | 5 | 3 | 2 | 4 | 4 | 4 | 3 | 3.6 |
| Tailwind CSS | 5 | 4 | 4 | 4 | 4 | 3 | 2 | 1 | 5 | 3 | 3.5 |
| Linear (docs) | 4 | n/s | 4 | 3 | 3 | 4 | 2 | 3 | 5 | 3 | 3.4 |
| shadcn/ui | 4 | 4 | 4 | 4 | 3 | 5 | 2 | 1 | 5 | 2 | 3.4 |
| IBM Carbon | 4 | 3 | 3 | 4 | 4 | 3 | 4 | 1 | 4 | 3 | 3.3 |
| Base UI | 3 | 3 | 4 | 4 | 4 | 1 | 3 | 3 | 4 | 3 | 3.2 |
| Atlassian | 2 | 4 | 3 | 4 | 4 | 4 | 3 | 2 | 4 | 2 | 3.2 |
| Chakra UI | 3 | 3 | 4 | 4 | 4 | 4 | 2 | 2 | 4 | 2 | 3.2 |
| Material 3 | 2 | 2 | 3 | 4 | 2 | 5 | 4 | 1 | 4 | 2 | 2.9 |
| Microsoft Fluent 2 | 3 | 2 | 2 | 3 | 3 | 3 | 3 | 4 | 4 | 2 | 2.9 |
| Vercel Geist | 1 | n/s | 4 | 3 | 2 | 3 | 3 | 4 | 4 | 2 | 2.9 |
| Apple HIG | 2 | n/s | 5 | 4 | 1 | 3 | 4 | 1 | 4 | 2 | 2.9 |
| Park UI | 2 | 3 | 3 | 3 | 2 | 3 | 1 | 4 | 3 | 2 | 2.6 |
| Shopify Polaris | 2 | 3 | 2 | 3 | 1 | 1 | 2 | 3 | 3 | 1 | 2.1 |

The mean hides the useful part. The best score in each column belongs to a different system, so the plan below takes the best page pattern from each and refuses the failure that pulled each one down.

## Performance, measured

| System | Page measured | Transfer | JavaScript | Requests | LCP | Text readable without JS |
|---|---|---|---|---|---|---|
| Saral (current) | [saral-ds.netlify.app/components/button.html](https://saral-ds.netlify.app/components/button.html) | 112 kB | 1 kB | 8 | 1,872 ms | 98% |
| GOV.UK Design System | [design-system.service.gov.uk/components/button/](https://design-system.service.gov.uk/components/button/) | 196 kB | 55 kB | 50 | 640 ms | 100% |
| Web Awesome | [webawesome.com/docs/components/button](https://webawesome.com/docs/components/button) | 700 kB | 372 kB | 273 | 7,336 ms | 100% |
| Shopify Polaris (React, archived) | [polaris-react.shopify.com/components/actions/button](https://polaris-react.shopify.com/components/actions/button) | 887 kB | 619 kB | 123 | 2,640 ms | 100% |
| Ark UI | [ark-ui.com/docs/components/checkbox](https://ark-ui.com/docs/components/checkbox) | 971 kB | 749 kB | 74 | 692 ms | 97% |
| Microsoft Fluent 2 | [fluent2.microsoft.design/components/web/react/core/button/usage](https://fluent2.microsoft.design/components/web/react/core/button/usage) | 1,043 kB | 303 kB | 84 | 1,916 ms | 90% |
| Park UI | [park-ui.com/docs/components/button](https://park-ui.com/docs/components/button) | 1,130 kB | 492 kB | 102 | 1,396 ms | 100% |
| Vercel Geist | [vercel.com/geist/button](https://vercel.com/geist/button) | 1,179 kB | 777 kB | 87 | 1,296 ms | 100% |
| Shopify Polaris (web components) | [shopify.dev/docs/api/app-home/polaris-web-components/actions/button](https://shopify.dev/docs/api/app-home/polaris-web-components/actions/button) | 1,531 kB | 1,040 kB | 167 | 1,592 ms | 98% |
| Radix Primitives | [www.radix-ui.com/primitives/docs/components/checkbox](https://www.radix-ui.com/primitives/docs/components/checkbox) | 2,137 kB | 1,250 kB | 171 | 1,264 ms | 100% |
| Mantine | [mantine.dev/core/button/](https://mantine.dev/core/button/) | 2,232 kB | 2,069 kB | 191 | 928 ms | 98% |
| Base UI | [base-ui.com/react/components/checkbox](https://base-ui.com/react/components/checkbox) | 2,507 kB | 998 kB | 180 | 1,484 ms | 100% |
| Linear docs | [linear.app/docs](https://linear.app/docs) | 2,562 kB | 1,206 kB | 380 | 1,096 ms | 100% |
| GitHub Primer | [primer.style/product/components/button/](https://primer.style/product/components/button/) | 2,753 kB | 784 kB | 154 | 2,588 ms | 100% |
| Material 3 | [m3.material.io/components/buttons/overview](https://m3.material.io/components/buttons/overview) | 3,301 kB | 1,514 kB | 42 | 7,216 ms | 1% |
| Apple HIG | [developer.apple.com/design/human-interface-guidelines/buttons](https://developer.apple.com/design/human-interface-guidelines/buttons) | 3,404 kB | 323 kB | 57 | 1,848 ms | 1% |
| Atlassian | [atlassian.design/components/button/examples](https://atlassian.design/components/button/examples) | 3,909 kB | 3,680 kB | 23 | 1,636 ms | 97% |
| Chakra UI | [chakra-ui.com/docs/components/button](https://chakra-ui.com/docs/components/button) | 4,730 kB | 3,817 kB | 94 | 572 ms | 100% |
| shadcn/ui | [ui.shadcn.com/docs/components/button](https://ui.shadcn.com/docs/components/button) | 7,021 kB | 4,863 kB | 259 | 948 ms | 100% |
| Stripe docs | [docs.stripe.com/payments/quickstart](https://docs.stripe.com/payments/quickstart) | 8,326 kB | 7,267 kB | 305 | 2,812 ms | 15% |
| IBM Carbon | [carbondesignsystem.com/components/button/usage/](https://carbondesignsystem.com/components/button/usage/) | 10,610 kB | 8,566 kB | 244 | 10,488 ms | 98% |
| Tailwind CSS | [tailwindcss.com/docs/installation/using-vite](https://tailwindcss.com/docs/installation/using-vite) | 13,116 kB | 571 kB | 235 | 1,488 ms | 100% |

Web Awesome (formerly Shoelace) was measured after the master plan named it Saral's nearest alternative; it was not scored on the other criteria. Its docs text survives without JavaScript, but its largest paint came after 7 seconds in this run.

Three things stand out. Only GOV.UK and Saral stay under 250 kB; every other system ships close to 1 MB or more for one page, mostly JavaScript. Material 3 and Apple HIG show about 1% of their text without JavaScript, and Stripe 15%. And Saral's portal, at 112 kB and 1 kB of script, still paints later than GOV.UK (1.9 s against 0.6 s) because it waits on a stylesheet from Google Fonts before it can draw text. Hosting the fonts with the site and preloading one file fixes that; it is in the Sprint 8 plan.

## Findings by criterion

### Time to a first working component

The fastest routes need no build step. Tailwind's Play CDN is one script tag, about 2 minutes ([Tailwind](https://tailwindcss.com/docs/installation/play-cdn)). Stripe's anonymous sandbox gives working keys with no account ([Stripe](https://docs.stripe.com/get-started)). GOV.UK's precompiled files route needs no Node at all ([GOV.UK](https://frontend.design-system.service.gov.uk/install-using-precompiled-files/)). The slowest need a CSS engine and code generation first: Park UI needs a Panda CSS project and `panda codegen`, about 15 to 20 minutes ([Park UI](https://park-ui.com/docs/installation)); Atlassian needs Babel plugins in a fixed order and one of two bundlers, about 20 to 30 minutes ([Atlassian](https://atlassian.design/get-started/develop)). Geist documents import paths for packages that return 404 on the public registry ([npm](https://registry.npmjs.org/@vercel%2fgeistcn)). Chakra's users read optional CLI snippets as required, and the team rewrote its docs to show complete code ([Chakra](https://chakra-ui.com/blog/refactoring-snippets)).

**For Saral:** one HTML file, one stylesheet, one component, in under a minute. The getting-started page ends with a complete file to copy. Nothing on the site may document a package that is not yet published without saying so.

### Search

Every code-first site has a Ctrl K or slash shortcut, but nearly all index titles and headings only: Algolia DocSearch at Tailwind, cmdk at shadcn/ui, lunr at GOV.UK and Carbon, match-sorter at Base UI, Ark and Park UI. None of the nineteen searches props, parts and tokens together. Atlassian comes closest with a token picker that filters by name and shows light and dark values and the version each token arrived in ([Atlassian](https://atlassian.design/components/tokens/all-tokens)). AI effort has moved to MCP servers and Markdown copies (Carbon, Atlassian, Chakra, Ark, shadcn/ui, Mantine) rather than chat boxes. llms.txt is read by coding assistants, not crawlers; one log study found 97% of llms.txt files got no visits ([PPC Land](https://ppc.land/llms-txt-adoption-rises-8-8x-but-97-of-files-get-zero-ai-requests/)).

**For Saral:** a static index built at build time from pages and specs, so a search for `data-pending`, `surface.raised` or "error message" lands on the right row. No hosted search service. A Markdown twin of every page and an llms.txt generated from the same source; an MCP server later, as the master plan says.

### Information architecture

Apple HIG and GOV.UK have the clearest structures: Getting started, Foundations, Patterns, Components, Inputs, Technologies at Apple ([Apple](https://developer.apple.com/design/human-interface-guidelines)); Get started, Styles, Components, Patterns, Community, Accessibility at GOV.UK ([GOV.UK](https://design-system.service.gov.uk/)). Both treat patterns as first-class. The weakest split one system across several sites: Fluent spreads guidance, two Storybooks and Microsoft Learn with no shared search ([Fluent discussion](https://github.com/microsoft/fluentui/discussions/29609)); Material keeps guidance on m3.material.io and code on material-web.dev, which is in maintenance mode ([Material Web](https://github.com/material-components/material-web/discussions/5642)). Polaris retired its React site by redirecting every deep link to one index page ([Shopify forum](https://community.shopify.dev/t/is-anyone-else-disappointed-with-polaris-web-components-so-many-missing-features/23687)). Ark puts the chosen framework in the URL, so a shared link opens in the right framework ([Ark](https://ark-ui.com/llms.txt)).

**For Saral:** six sections, one site, one search. Patterns sit beside components. Old URLs never redirect to a generic page; a moved page leaves a stub that names its replacement.

### The component page

The best pages follow one order every time. GOV.UK: example, when to use, when not to use, how it works, research, known issues and gaps, recent changes, help improve this component ([GOV.UK Checkboxes](https://design-system.service.gov.uk/components/checkboxes/)). Radix and Ark give each part a props table and then a data-attribute table that lists `data-scope` and `data-part` first and every state value after ([Ark Accordion](https://ark-ui.com/docs/components/accordion), [Radix Checkbox](https://www.radix-ui.com/primitives/docs/components/checkbox)). Chakra's anatomy explorer outlines a part in the live preview when you hover its name ([Chakra Accordion](https://chakra-ui.com/docs/components/accordion)). Mantine opens every page with the same header row: Source, LLM docs, Edit, Package ([Mantine Button](https://mantine.dev/core/button/)). Stripe's component pages carry content guidelines: verb plus noun, sentence case, no punctuation ([Stripe Apps Button](https://docs.stripe.com/stripe-apps/components/button.md?app-sdk-version=9)). Apple ends every page with a dated change log ([Apple Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)). Polaris adds an honest Limitations section ([Polaris Button](https://shopify.dev/docs/api/app-home/polaris-web-components/actions/button)). The failure is delegation: shadcn/ui, Chakra and Park UI link out to another library for behaviour and keyboard detail.

**For Saral:** one long page, not tabs, so Ctrl F and search find everything. GOV.UK's order, with Ark's parts and attribute tables, Chakra's highlight-on-hover anatomy, Stripe's writing section, Apple's dated changes and Polaris's limits. Every section generated from `specs/*.json`.

### Playground and live code

Primer is the only design system with examples you can edit in the page, with Copy, Reset and Open in StackBlitz ([Primer Button](https://primer.style/product/components/button/)). Stripe puts the reader's own test keys into samples and runs a shell in the page ([Stripe](https://docs.stripe.com/checkout/quickstart)). Mantine's configurator rewrites the shown code as you change props. Most others send readers to StackBlitz or CodeSandbox, which are heavy and fail in places (Fluent users reported broken sandbox links, [discussion](https://github.com/microsoft/fluentui/discussions/23183)).

**For Saral:** components are HTML, so the playground can run inside the page with no server: an editor, a preview frame, theme and width controls, a checks panel, and the whole state in the URL.

### Theming tools

Material Theme Builder ([Material](https://m3.material.io/blog/material-theme-builder)), Radix Colors with its custom palette page ([Radix](https://www.radix-ui.com/colors/custom)) and shadcn/ui's /create ([InfoQ](https://www.infoq.com/news/2026/02/shadcn-ui-builder)) turn a few choices into a full token set. Geist gives every step of its colour scale a stated job, from default background to primary text ([Geist](https://vercel.com/geist/colors)). Linear cut a theme from 98 variables to three inputs, base, accent and contrast, in a perceptual colour space ([Linear](https://linear.app/blog/how-we-redesigned-the-linear-ui)). None of them shows the contrast ratio of every pair it generates.

**For Saral:** the theme builder (M5) takes one brand colour, fills every role, and runs Saral's own `checks.mjs` in the browser, showing every pair and its ratio before export. No other builder does this.

### Accessibility guidance

Radix, Ark and Mantine (for complex components) give a keyboard table per component. Carbon publishes an accessibility testing status per component, tied to a release ([Carbon Button](https://carbondesignsystem.com/components/button/accessibility/)). Primer adds a "How to test the component" checklist ([Primer](https://primer.style/product/components/button/accessibility/)). GOV.UK's assistive-technology results live in blog posts rather than on component pages ([GOV.UK blog](https://accessibility.blog.gov.uk/2018/02/28/how-weve-made-gov-uk-elements-even-more-accessible)). shadcn/ui, Chakra, Park UI and Polaris have no accessibility section on their component pages.

**For Saral:** every page has a keyboard table, ARIA notes, iOS and Android notes, the WCAG criteria it meets, and a testing table tied to the release: axe results in every theme and mode from CI, keyboard, and the manual screen-reader log already kept in each spec.

### What feels premium

Across the group the same few things read as quality: the home page is built from the product itself (Radix, shadcn/ui, Park UI); copy is short and plain; code copies cleanly; nothing on the page fights for attention (Linear's "structure should be felt, not seen", [Linear](https://linear.app/now/behind-the-latest-design-refresh)); and the docs are run as a product (Stripe puts docs on its engineering career ladder, [Mintlify](https://mintlify.com/blog/stripe-docs)). Two warnings: the Linear look has become a cliché through copying ([LogRocket](https://blog.logrocket.com/ux-design/linear-design)), and Base UI's faint demo inputs made people judge the library by them ([Hacker News](https://news.ycombinator.com/item?id=46245401)).

**For Saral:** a look of its own, from its own story; demos at full contrast in real themes; and the honesty GOV.UK earns trust with.

### What annoys people

Setup that fails quietly (Mantine without its CSS import, [fixdevs](https://fixdevs.com/blog/mantine-not-working/)); docs that assume a framework without saying so (Radix and shadcn/ui never say React on the landing page, [Hacker News](https://news.ycombinator.com/item?id=46688971)); incomplete migration guides (Chakra v3, [dev.to](https://dev.to/theoforger/sprint-5-chakra-ui-v3-migration-4pfi)); upsell banners on docs pages (Chakra Pro); docs tied to sales (Tailwind's maintainer linked docs traffic to revenue when declining an llms.txt pull request, [Neowin](https://www.neowin.net/news/tailwind-lays-off-75-employees-as-ai-kills-majority-of-its-revenue/)); and broken links after a migration (Polaris).

**For Saral:** no promotion of any kind on the site, which matches the owner's rule that open-core and business content stay in the repo. Every example says which layer it uses (HTML, React). Every breaking change ships with a complete guide.

## What Saral takes, and what it refuses

| Take | From | Saral version |
|---|---|---|
| Fixed component page order ending in research, known issues, dated changes, help improve | GOV.UK | Generated from the spec and the changelog |
| Per-part data-attribute table, `data-scope` and `data-part` first | Ark, Radix | Also shown inside the anatomy, from `specs/*.json` |
| Hover a part name to outline it in the preview | Chakra | A few lines of site-only script on `[data-part]` |
| Writing section on every component | Stripe, Fluent | From the spec's `content` field |
| Dated change log per page | Apple | Filtered from `CHANGELOG.md` |
| Accessibility testing table tied to a release | Carbon | From CI axe runs and the spec's screen-reader log |
| Limitations section | Polaris | A new `limits` field in the spec |
| A job for every colour role | Geist | One line per role in `tokens/roles.json` |
| Theme from a few inputs | Linear, Radix, Material | Theme builder that runs `checks.mjs` live |
| Editable examples with share links | Primer, Tailwind Play | In-page playground, state in the URL |
| Token picker with light and dark side by side | Atlassian | Filterable tokens page with every pair's ratio |
| Markdown twin of every page, llms.txt | Base UI, Radix, Ark, Mantine | Generated at build time |
| Framework in the URL | Ark | `?use=html` or `?use=react`, remembered |

| Refuse | Seen at | Why |
|---|---|---|
| Docs that need JavaScript to show text | Material 3, Apple HIG, Stripe | Saral's own rule is native first; its site must read with JavaScript off |
| Guidance and code on different sites | Material, Fluent, Carbon's Storybooks | Readers get lost; search splits |
| Linking out for behaviour or keyboard detail | shadcn/ui, Chakra, Park UI | Saral owns its core, so it owns the page |
| A build tool before the first render | Park UI, Atlassian | Saral is CSS and HTML |
| Promotion, upsell or business content | Chakra, Tailwind | The owner's rule; also the most cited annoyance |
| Redirecting old deep links to one index | Polaris | Moved pages leave a stub naming the replacement |
| Megabytes of script for a static page | Carbon, Stripe, shadcn/ui, Tailwind | Budget: 150 kB first load |
| Faint demo styling | Base UI | Demos use real themes at full contrast |

## What this means for the new site

The site's job is to prove the system. A docs site that is static, light, readable with JavaScript off, styled only by Saral's own tokens and components, and generated from the same specs as the code is itself the strongest argument for Saral. The information architecture, templates, identity directions and Sprint 8 plan built on this research are in [`../spec/2026-10-13-website-plan.md`](../spec/2026-10-13-website-plan.md).
