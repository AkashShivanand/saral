# Benchmark group 2: Geist, Linear, Stripe docs, Apple HIG, Mantine

Researched 13 October 2026 with WebSearch and WebFetch only. No browser was used.

Method notes:

- Scores run from 1 to 5, where 5 is best in class. "n/s" means not scored: the evidence could not be gathered without a browser, and guessing would mislead.
- Several sites (Geist, Stripe docs, parts of Linear) now serve Markdown to non-browser clients. That makes their content easy to read but hides page chrome such as search boxes, theme toggles and copy buttons. Where a claim about chrome could not be confirmed, the row says so.
- Linear and Stripe docs are product docs, not component libraries. For them, criterion 1 measures "time to first success" (first issue, first API call or checkout) and criterion 4 measures the article template.
- Performance is "measured separately" throughout. No public, cited figure was found for any of the five sites.

---

## Vercel Geist

| # | Criterion | Score | Evidence | Link |
|---|---|---|---|---|
| 1 | Time to first working component | 1 | The intro names `@vercel/geistcn` and `@vercel/geistcn-assets` and shows import paths, but gives no install command. Both names return 404 from the public npm registry, so a fresh project cannot render a Geist component. Steps: not possible from public sources. | https://vercel.com/geist/introduction, https://registry.npmjs.org/@vercel%2fgeistcn |
| 2 | Search | n/s | Search UI could not be inspected. Notable instead: every page is available as Markdown by adding `.md` to the URL or sending `Accept: text/markdown`, which serves agents and AI search. | https://vercel.com/geist |
| 3 | Information architecture | 4 | Flat and short: Foundations (Colors, Typography, Materials, Grid), Assets (Icons, Typeface, logotype), Components at `/geist/<name>`. One level deep. Foundations come first and are clearly separate from components. | https://vercel.com/geist/introduction |
| 4 | Component page template | 3 | Button: title and intro, then one section per example (Sizes, Shapes, Prefix and suffix, Loading, Disabled, Link, Custom), each with a TSX block, then Best practices. Modal adds Best practices subsections: When to use, Behavior, Content, Accessibility. No props table on Button, Modal or Switch. | https://vercel.com/geist/button, https://vercel.com/geist/modal |
| 5 | Playground and live code | 2 | Examples pair a preview with code. No editable sandbox, share link or CodeSandbox export was found. | https://vercel.com/geist/button |
| 6 | Theming tools | 3 | Colors page: 10 scales of 10 steps each, and every step has a job (100 default background, 200 hover, 300 active, 400 border, ... 900 secondary text, 1000 primary text). Uses P3 where supported, right-click to copy. Materials page names surface and floating presets (`material-base` to `material-fullscreen`) with radius and lift. No theme builder. | https://vercel.com/geist/colors, https://vercel.com/geist/materials |
| 7 | Accessibility guidance | 3 | Good prose inside Best practices: Modal says trap focus, return focus to the trigger, label with `aria-labelledby`, default focus to Cancel on destructive dialogs. Switch explains it uses radio semantics. No keyboard tables, no WCAG mapping. | https://vercel.com/geist/modal, https://vercel.com/geist/switch |
| 8 | Performance | measured separately | No public figure found. | |
| 9 | What feels premium | 4 | Own typeface pair (Geist Sans and Geist Mono) tuned for 12 to 14px dense UI with tabular numbers; very restrained palette where status colours carry meaning; short 100ms transitions and no decorative motion; dark mode treated as the default. Typography is a named class scale (`text-copy-14`, `text-label-14-mono`) with stated use for each size. | https://blakecrosley.com/guides/design/vercel, https://vercel.com/geist/typography |
| 10 | What annoys users | 2 | A February 2026 community thread says there is "no documentation explaining how to actually install Geist Icons". Vercel staff replied the icons are "only for use in Vercel-owned UIs". An earlier thread says there is no plan to release a component library. The site documents imports for packages the public cannot install. | https://community.vercel.com/t/geist-icons-lack-clear-installation-import-and-usage-documentation/34481, https://community.vercel.com/t/vercel-geist-design-system/2313 |

**Home page structure:** title "Geist Design System", one paragraph naming what it covers and the two packages, Foundations list, Assets list (logotype downloads in black and white, icons, typeface), a Components import example, then a "Markdown for agents" note. Plain lists, no hero art (as seen in the Markdown rendition).

**Steal:** give every step of a colour scale a stated job (default background, hover, active, border, ... primary text). Saral's semantic roles already do this at the role level; publishing the step-to-job table on the colour page makes the scale self-explaining.

**Avoid:** documenting import paths and component APIs for packages people cannot install. If something in Saral is not yet published, say so on the page.

---

## Linear (docs, Method, design language)

| # | Criterion | Score | Evidence | Link |
|---|---|---|---|---|
| 1 | Time to first success (product docs: first issue) | 4 | Start guide offers a demo workspace where changes stay in the browser and reset on refresh, so a first issue takes about 1 to 2 minutes with no account (account-free status is implied, not stated). With an account: sign up, then press `C` to create an issue, about 3 to 5 minutes. API: create a personal key, POST to one GraphQL endpoint; the schema is explorable in Apollo Studio with no login. | https://linear.app/docs/start-guide, https://linear.app/docs/creating-issues, https://developers.linear.app/docs/graphql/working-with-the-graphql-api |
| 2 | Search | n/s | Docs search could not be inspected. In the app, `/` opens search and Cmd or Ctrl + K opens the command menu; the docs teach these shortcuts inline. | https://linear.app/enablement/guide/navigating-linear |
| 3 | Information architecture | 4 | Top nav: Docs, Developers, Learn, Contact support. Docs sidebar in order: Getting started, Intake, Projects and initiatives, Issues and cycles, Coding and review, Agents and automation, Insights and outcomes, Working in Linear, Integrations, Administration, Importers. Ordered by workflow, not by feature name. The Method is a separate numbered book (1 Introduction, 2 Direction, 3 Building). | https://linear.app/docs, https://linear.app/method |
| 4 | Article template | 3 | H1, one-line intro, a screenshot, Overview, then task sections (Creating issues, via email, recurring, drafts, editing, moving), then collapsible FAQ. Shortcuts appear inline as code with platform variants (`Cmd/Ctrl` + `K`). No props or code tabs, as expected for product docs. | https://linear.app/docs/creating-issues |
| 5 | Playground and live code | 3 | The resettable demo workspace is the playground for the product. Apollo Studio is the playground for the API. Neither is embedded in the article. | https://linear.app/docs/start-guide |
| 6 | Theming tools | 4 | In-product, not in docs: the 2024 redesign moved theme generation from HSL to LCH and cut a theme from 98 variables to 3 (base, accent, contrast). The contrast input produces high-contrast themes. The March 2026 refresh added an internal tool with hue, chroma and lightness controls per token and exports tokens as JSON to Figma. | https://linear.app/blog/how-we-redesigned-the-linear-ui, https://linear.app/now/behind-the-latest-design-refresh |
| 7 | Accessibility guidance | 2 | The contrast variable is a real accessibility feature, but the docs carry little accessibility guidance and there is no public component system to document. | https://linear.app/blog/how-we-redesigned-the-linear-ui |
| 8 | Performance | measured separately | Third-party speed claims (optimistic UI, caching) cite no figures. | https://925studios.co/blog/linear-design-breakdown |
| 9 | What feels premium | 5 | Inter Display for headings and Inter for text; LCH colour so equal lightness looks equal; stated principles "don't compete for attention" and "structure should be felt, not seen" (fewer dividers, dimmed sidebar, smaller icons, warmer and less saturated grays). The Method is short: one H3 and one paragraph per principle, about a few hundred words per page, in a direct second-person voice. | https://linear.app/now/behind-the-latest-design-refresh, https://linear.app/method/introduction |
| 10 | What annoys users | 3 | Few complaints about the docs themselves were found. The common complaint is about imitation: the "Linear look" (dark background, blurred gradients, glowing motion) is now so common that sites blur together, and LogRocket says its appeal "is starting to wear off due to oversaturation". | https://blog.logrocket.com/ux-design/linear-design, https://designthisweek.substack.com/p/twid-linear-style-is-now-illegal, https://rectangle.substack.com/p/the-linear-effect |

**Home page structure:** announcement banner, hero "The product development system for teams and agents" with a one-line subhead, a large product mockup, three short points (Purpose-built, Powered by agents, Designed for speed), feature sections (Intake, Planning and monitoring, AI and automations, Build review and ship), a changelog preview, customer logos, three quotes, a "40,000 teams" claim, closing CTAs (Get started, Contact sales, Open app, Download), footer. Docs home: Popular (Start guide, Import, Projects, GitHub) and Linear basics.

**Steal:** derive a full theme from three inputs (base, accent, contrast) in a perceptual colour space, with contrast as a first-class input. This fits Saral's token pipeline and makes a high-contrast mode a by-product rather than a separate theme.

**Avoid:** copying a signature look. The Linear style became a cliché through imitation; Saral's portal should look like Saral, quiet and plain, not like a dark gradient SaaS page.

---

## Stripe docs (and the Stripe Apps UI toolkit)

| # | Criterion | Score | Evidence | Link |
|---|---|---|---|---|
| 1 | Time to first success (product docs: first API call or checkout) | 5 | Get started offers two paths: create an account, or `stripe sandbox create` for an anonymous sandbox with working keys and no registration. Checkout quickstart is about 6 steps (install library, create session, success page, checkout button, set env, run) with a download of complete project files and test cards such as 4242 4242 4242 4242. Estimate 10 to 15 minutes to a working checkout. Signed-in readers get their own test keys inside samples. | https://docs.stripe.com/get-started, https://docs.stripe.com/checkout/quickstart |
| 2 | Search | 4 | The header shows "Ask AI", but the provider and shortcut could not be confirmed without a browser. Other ways in: every page has a `.md` version, and `stripe docs` reads the docs in a terminal. | https://docs.stripe.com/, https://docs.stripe.com/building-with-llms.md |
| 3 | Information architecture | 4 | Home: Start here (agent skills), quick links by use case (accept payments, invoices, in person, subscriptions, usage pricing, customer portal), then Browse by product: Payments, Revenue, Risk, Data, Embedded finance, Money management, Prebuilt components. Clear, but the number of products is itself a source of confusion (see row 10). | https://docs.stripe.com/ |
| 4 | Article template | 5 | Stripe Apps Button: H1 and one-line purpose, import line, preview, props table (name, required or optional, type, description, links to related types), CSS sub-props, Content guidelines (verb plus noun, descriptive, sentence case, no punctuation, second person), then usage per variant (primary, secondary, destructive), sizes, disabled, icons, full width, allowed `href` values, pending, See also. Guides use three columns with prose and code side by side, and hovering prose highlights the matching code. Version switcher for SDK v8 and v9. | https://docs.stripe.com/stripe-apps/components/button.md?app-sdk-version=9, https://www.moesif.com/blog/best-practices/api-product-management/the-stripe-developer-experience-and-docs-teardown/ |
| 5 | Playground and live code | 5 | Samples carry the reader's own test key when signed in (placeholder comments say so when signed out). Language choice re-renders every sample. Quickstarts download a full project. Workbench Shell runs CLI commands in the browser, and its API Explorer builds a call visually and prints SDK code. | https://docs.stripe.com/checkout/quickstart, https://docs.stripe.com/stripe-shell/keyboard-shortcuts, https://mintlify.com/blog/stripe-docs |
| 6 | Theming tools | 3 | Stripe Apps exposes typed tokens through a `css` prop (spacing `xxsmall` 2px to `xxlarge` 48px, fractional widths, `keyline`, `font`). Editors autocomplete token values. Custom styling is deliberately limited; only the app indicator takes any brand colour. No theme builder for the toolkit. | https://docs.stripe.com/stripe-apps/style, https://docs.stripe.com/stripe-apps/design |
| 7 | Accessibility guidance | 2 | The design page states styling is limited "to ensure a high accessibility bar", especially colour contrast. No per-component keyboard tables or WCAG mapping were found on the component pages. | https://docs.stripe.com/stripe-apps/design |
| 8 | Performance | measured separately | No public figure found. | |
| 9 | What feels premium | 5 | Docs built as a product: Stripe's docs lead says they should feel "like an application rather than a traditional user manual". Markdoc, a Markdown dialect with a few dozen custom tags, makes interactive parts consistent across writers. Hover linking between prose and code, persistent language choice, personalised keys. Culture: documentation is on the engineering career ladder and assessed in performance reviews. | https://mintlify.com/blog/stripe-docs, https://brianlovin.com/hn/31341083 |
| 10 | What annoys users | 3 | Too many overlapping products make it hard to know where to start (a Stripe employee in the thread said the docs are being reworked for this). On Hacker News: "The documentation is geared towards people using checkout", and the docs do not explain "which events should trigger which product decisions". | https://www.indiehackers.com/post/alternatives-to-stripe-5ddf2965d8, https://hn.nuxt.dev/item/47830575 |

**Home page structure:** H1 "Documentation" and one line, "Read this page in your terminal" note, Start here (agent skills and a one-line CLI quickstart), nine use-case quick links in three groups, then Browse by product in seven groups. No marketing hero.

**Steal:** a "Content guidelines" section on every component page (label formula, sentence case, punctuation, voice). Saral already has copy rules for its own docs; giving each component the copy rules for the text it holds is cheap and rare among design systems.

**Avoid:** several overlapping ways to do the same job with docs that favour one of them. For each Saral component, show one recommended path first (native HTML and CSS), then the React adapter, and never let the two drift.

---

## Apple Human Interface Guidelines

| # | Criterion | Score | Evidence | Link |
|---|---|---|---|---|
| 1 | Time to first working component | 2 | Guidance only, no install. Each component page links to the code (SwiftUI `Button`, UIKit `UIButton`, AppKit `NSButton`), but rendering one needs Xcode, which the HIG does not walk through. Steps from the HIG home: about 4 clicks to the developer docs, then an Xcode install, so well over 30 minutes for a fresh machine. | https://developer.apple.com/design/human-interface-guidelines/buttons |
| 2 | Search | n/s | The page content is rendered by JavaScript and could not be inspected. Site-wide developer search exists; whether it reaches inside HIG text was not verified. | https://developer.apple.com/design/human-interface-guidelines |
| 3 | Information architecture | 5 | Six groups in order: Getting started, Foundations, Patterns, Components, Inputs, Technologies. The home page also features Design fundamentals, Foundations of design (Accessibility, App icons, Color, Layout, Materials, Typography) and New and updated. Patterns and Inputs as their own groups is unusual and useful. | https://developer.apple.com/design/human-interface-guidelines |
| 4 | Component page template | 4 | Buttons: Best practices, Style, Content, Role, Platform considerations (iOS and iPadOS, macOS with push, square, help and image buttons, visionOS, watchOS), Resources (Related, Developer documentation), Change log. The change log lists six dated entries, newest December 2025. Do and don't guidance is in bold prose, not paired images. No code. | https://developer.apple.com/design/human-interface-guidelines/buttons |
| 5 | Playground and live code | 1 | None. | |
| 6 | Theming tools | 3 | Color page has a System colors table with four columns: light, dark, increased contrast light, increased contrast dark, for 12 colours, each linked to its SwiftUI API, and it warns not to hard-code the values. Values sit in image alt text rather than copyable text. No builder. | https://developer.apple.com/design/human-interface-guidelines/color |
| 7 | Accessibility guidance | 4 | Accessibility page grouped by need: Vision, Hearing, Mobility, Speech, Cognitive. Cites WCAG AA: 4.5:1 for text up to 17pt, 3:1 at 18pt or bold, and mentions APCA. Dated change log. No per-component keyboard tables. | https://developer.apple.com/design/human-interface-guidelines/accessibility |
| 8 | Performance | measured separately | No public figure for the HIG. Related: DocC pages were criticised as JavaScript-heavy and unreadable with JavaScript off. | https://www.jessesquires.com/blog/2021/06/29/apple-docc-great-but-useless-for-oss/ |
| 9 | What feels premium | 4 | One template applied to every page, platform differences handled in a fixed section rather than scattered, a dated change log on each page, calm plain voice, and custom artwork for each topic. | https://developer.apple.com/design/human-interface-guidelines/buttons |
| 10 | What annoys users | 2 | No download: 512 Pixels was "a little sad" it cannot be saved like the 1987 PDF. Liquid Glass drew contrast criticism (one agency measured 1.5:1 in places), and critics argue newer Apple UI contradicts the HIG's own advice on menu icons. DocC rendering needs JavaScript. | https://512pixels.net/2022/06/new-hig-who-dis/, https://infinum.com/blog/apples-ios-26-liquid-glass-sleek-shiny-and-questionably-accessible/, https://heise.de/-11131777 |

**Home page structure:** one-line abstract ("guidance and best practices ... for any Apple platform"), the six topic groups as cards, then featured rows: Design fundamentals, Foundations of design, New and updated.

**Steal:** a dated change log at the foot of every component page. Saral already logs every change in `CHANGELOG.md`; surfacing the entries for one component on its page lets readers see what moved since they last looked.

**Avoid:** docs that need JavaScript to show text. Saral tests components with JavaScript on and off; the portal should meet the same bar, so every page reads as plain HTML.

---

## Mantine

| # | Criterion | Score | Evidence | Link |
|---|---|---|---|---|
| 1 | Time to first working component | 3 | Template route (vite or next template): clone, install, run, about 3 to 5 minutes. Manual route has 8 steps: install `@mantine/core` and `@mantine/hooks`, install three PostCSS packages, write `postcss.config.cjs`, import `styles.css`, wrap in `MantineProvider`, add `ColorSchemeScript` for SSR, then render. About 10 to 15 minutes. | https://mantine.dev/getting-started/ |
| 2 | Search | 4 | Built with its own `@mantine/spotlight` component, opened with Ctrl or Cmd + K. No AI answers in search, but strong AI access: `llms.txt`, a 1.8MB full-docs file updated each release, an "LLM docs" link on every component page, agent skills, and an MCP server package. Whether search covers props was not verified. | https://mantine.dev/x/spotlight, https://mantine.dev/llms/guides-llms.md |
| 3 | Information architecture | 4 | Top tabs: Get started, Theming and Styles, Hooks, Form, Components, Extensions. Component sidebar: Layout, Inputs, Combobox, Buttons, Navigation, Feedback, Overlays, Data display, Typography, Miscellaneous. Old majors live on subdomains (v7, v8), with migration guides. | https://mantine.dev/core/button/ |
| 4 | Component page template | 5 | Header: name, one-line description, metadata links (Source, LLM docs, Edit this page, Package). Tabs: Documentation, Props, Styles API. Then Usage (a configurator), one section per feature, Styles API, TypeScript, Accessibility, Keyboard interactions, previous and next links. | https://mantine.dev/core/button/, https://mantine.dev/core/accordion/ |
| 5 | Playground and live code | 4 | The Usage demo has controls (variant, colour, size, radius) that rewrite the shown code. Demos have file tabs (`Demo.tsx`, `Demo.module.css`) and Expand code. Code is not editable in the page and no share link was found. | https://mantine.dev/core/button/ |
| 6 | Theming tools | 4 | Colors generator: enter a base colour or pick a preset, get 10 shades with hex values, preview Button in four variants, copy the array or a URL, see `createTheme` code. Dark colour scheme is covered with a live toggle on the home page. | https://mantine.dev/colors-generator/, https://mantine.dev/ |
| 7 | Accessibility guidance | 4 | Complex components state the WAI-ARIA pattern they follow and give a keyboard table (Accordion: ArrowDown, ArrowUp, Home, End, Space and Enter). Simple ones like Button have no accessibility section. No WCAG mapping. | https://mantine.dev/core/accordion/ |
| 8 | Performance | measured separately | No public figure found. | |
| 9 | What feels premium | 3 | Breadth and consistency more than polish: every page has the same header row and tabs, live controls everywhere, a home page made of working demos. Visually plain. | https://mantine.dev/ |
| 10 | What annoys users | 3 | Few direct complaints about the docs; Reddit mostly praises them. The pain is setup and upgrades: v7 removed `createStyles` and `sx`, which Medplum's guide calls a time-consuming migration, and a troubleshooting post notes components render unstyled when `styles.css` is not imported or PostCSS is missing. | https://medplum.com/docs/react/mantine-6x-to-7x, https://fixdevs.com/blog/mantine-not-working/, https://mantine.dev/guides/6x-to-7x |

**Home page structure:** hero "A fully featured React components library" with Get started and GitHub, sponsor row, AI workflow (LLM docs, skills, MCP), Components (120+) with live grid, Hooks (70+), Flexible styling, Dark colour scheme demo, Combobox demos, Extensions, Form library, Mantine UI promotion, stats and testimonials, Join the community, framework guides, footer.

**Steal:** the fixed header row plus tabs on every component page. For Saral this maps neatly to: Source, Spec, Markdown for agents, Edit; tabs for Usage, Parts (every `data-scope` and `data-part`, the equivalent of Mantine's Styles API), Props or attributes, and Accessibility with a keyboard table.

**Avoid:** setup that fails silently. Mantine renders unstyled if one CSS import or the PostCSS step is missing. Saral should work from one CSS file with no build step, and the first page should show that working in one copy-paste.

---

## Cross-system summary

The two sites most often called the best win for different reasons. Stripe wins on doing: the shortest route to a real result (anonymous sandboxes, your own keys inside samples, downloadable projects, a shell in the page), a fixed set of authoring tags that keeps hundreds of pages consistent, and a culture that rewards writing. Linear wins on restraint: few dividers, muted navigation, perceptual colour, and short numbered prose in the Method, with a theme generated from three inputs. Among the component systems, Mantine has the most complete page template (metadata row, Documentation, Props and Styles API tabs, keyboard tables), Apple has the clearest information architecture and the best habit (a dated change log on every page), and Geist has the sharpest foundations (a job for every colour step, named materials) but cannot be installed by the public, which is the most common complaint about it. Three trends cut across the group: docs served as Markdown for agents (Geist, Stripe, Mantine), keyboard and accessibility detail that lives only on complex components, and no site publishing performance figures. For Saral, the strongest combination is Mantine's page skeleton with a Parts tab for the data-scope and data-part API, Stripe's per-component content guidelines and one recommended path, Apple's per-page change log, and a portal that reads fully with JavaScript off.
