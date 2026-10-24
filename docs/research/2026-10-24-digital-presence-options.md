# Digital presence: five options, and one site or two

Date: 2026-10-24. Builds on the benchmark of 19 docs sites (`2026-10-website-benchmark.md`) and the website plan (`../spec/2026-10-13-website-plan.md`). Purpose: choose how the website and the docs look, and whether the landing page and the docs live on one site, so the rollout can start.

Two consumer websites will use Saral as soon as the packages are published: consumer A, a personal website, and consumer B, a studio website. They have different stacks and completely different brand guidelines. They are the best proof Saral can have, so every option below uses them.

## One site or two: what the best systems do

| System | Landing and docs | Live examples |
|---|---|---|
| Tailwind CSS | One domain; docs under `/docs` | Inline on each page |
| shadcn/ui | One site; the home page is the docs entry | Inline, plus a blocks gallery |
| Radix | One domain; a short landing, each product under its own path | Inline |
| GOV.UK Design System | One site; docs are the site | Inline, each example opens on its own page |
| IBM Carbon, GitHub Primer, Microsoft Fluent 2 | One docs site | A separate Storybook for developers |
| Stripe | Separate: marketing site and a docs subdomain | Inline in the docs |

**Pattern.** Every design system in the benchmark keeps its landing page and its docs on one domain. Only product companies (Stripe) split marketing from docs, because their marketing sells something else. The big systems that do split something off split the *test bench* (Storybook), not the docs.

**Recommendation: one site, with a separate lab.**

- One domain. The landing page is the front door of the docs, not a second site: one search, one version number, one navigation, one place for search engines and coding assistants to read.
- Examples stay inline on each component page, live, with JavaScript on and off, as now.
- A **lab** under `/lab` holds what is not documentation: the playground and theme builder (M5), the fixtures, and the two consumer websites shown as live case studies (each theme next to its brand guide, without naming either site until the owner decides; AGENTS.md rule 9).
- The consumer websites themselves stay on their own domains. They install Saral from the registries, never from the docs site.

## Five visual options

Each option keeps the decided pitch ("Build it plain. Make it yours.") and Saral's rules: semantic tokens only, native elements, no em dashes, works without JavaScript, first load at or under 150 kB.

### 1. Neel (the direction already chosen for the S8 site)

- **Look.** One indigo, dipped many times; a calm serif for headings, a plain sans for text; cool white and deep blue-black. Quiet, editorial.
- **Home.** The pitch, then the same parts in every theme, then the six scripts.
- **Docs.** Two columns: navigation and page. Component pages open with a live example.
- **Best for.** Trust: public services, banks, auditors.
- **Risk.** Can feel conservative next to developer brands.

### 2. Two brands, one system

- **Look.** A neutral frame (white, near-black, one hairline grey) so the brands inside it carry the colour.
- **Home.** A split hero: the same page rendered twice, once in consumer A's theme and once in consumer B's, with a single switch between "parts" and "brand". The message is the pitch, shown rather than said.
- **Docs.** Every example has a theme picker with Mor, Kosh and the two consumer themes.
- **Best for.** Proving "Make it yours" at a glance; turning the two consumers into the story.
- **Risk.** Depends on both consumers going live first; needs the owner's word before either is shown.

### 3. Spec sheet

- **Look.** Technical datasheet: a strict grid, monospaced labels, tables for parts and states, a single signal colour for status. Close to Radix and Base UI.
- **Home.** Short: the pitch, an install line, and a table of every component with its status, size and JavaScript cost.
- **Docs.** Each component page reads like a datasheet: anatomy diagram, state matrix, keyboard table, contrast pairs.
- **Best for.** Developers and coding assistants; the spec contract is the hero.
- **Risk.** Cold for designers and service owners.

### 4. Plain sheet

- **Look.** GOV.UK clarity: large plain type, one column, black on white, one accent for links and focus. No decoration.
- **Home.** The pitch and three links. The docs index is the next screen.
- **Docs.** One column, long pages, every example opens on its own page that also works as a test fixture.
- **Best for.** Speed and accessibility; the lightest of the five, close to the current 112 kB.
- **Risk.** Least "premium"; nothing shows the theming story unless a page is opened.

### 5. Kolam

- **Look.** A grid of dots and one continuous line: ink on rice white, round shapes. The grid becomes the spacing scale on the page; the line becomes focus rings and dividers.
- **Home.** The pitch over a dot grid that resolves into the components; the six scripts appear on the same grid.
- **Docs.** The token pages draw the space and radius scales as dot grids.
- **Best for.** A distinct identity that carries Saral's roots without naming them.
- **Risk.** The motif can tip into decoration; needs restraint and a reduced-motion version.

## Comparison

| | Neel | Two brands | Spec sheet | Plain sheet | Kolam |
|---|---|---|---|---|---|
| Shows theming | Medium | Strong | Weak | Weak | Medium |
| Trust for regulated teams | Strong | Medium | Medium | Strong | Medium |
| Developer appeal | Medium | Strong | Strong | Medium | Medium |
| Distinct identity | Medium | Medium | Low | Low | Strong |
| Weight and speed | Good | Good | Good | Best | Good |
| Ready to build | Yes (mock exists) | After consumers launch | Yes | Yes | Mock exists |

**Recommendation.** Build Neel for the frame (already decided), and borrow the **Two brands** hero for the home page once both consumers are live and the owner agrees to show them. Use the **Spec sheet** structure for component pages, because it is what the specs already contain.

## Ten more options from other tools

The owner asked for five options each from ChatGPT and Gemini, for fifteen in total. This session has no access to the owner's browser, so the prompt below is ready to paste into each tool. Bring the answers back and they will be added here, scored on the same table.

> I am designing the website and documentation for Saral, an open-source design system: themeable tokens and native HTML components that work in any stack, any script (including right to left) and before JavaScript loads. Headline: "Build it plain. Make it yours." It will be used first by two very different websites with different brand guidelines. Give me five distinct visual directions for the website and docs. For each: a name, the look (colour, type, shape, motion), what the home page shows first, how a component docs page is laid out, who it suits best, and its main risk. Then say whether the landing page and the docs should be one site or two, and where live demos and the playground should live. Avoid these five, which I already have: an indigo editorial look, a split-screen two-brand hero, a technical datasheet, a plain government-style sheet, and a dot-grid pattern. Plain words, no hype.

## Sources

- [11 best design system examples in 2026, designsystems.surf](https://designsystems.surf/articles/11-best-design-system-examples-in-2026)
- [15 best design system examples in 2026, UXPin](https://uxpin.com/studio/blog/best-design-system-examples)
- [5 design system documentation examples, ONES](https://ones.com/blog/5-design-system-documentation-examples-that-set-the-standard/)
- [Structuring separate design systems, Supernova](https://supernova.io/guide-scaling-your-product-development-with-supernova/4-1-real-world-examples-of-structuring-separate-design-systems)
- The 19-site benchmark in this folder, with measured page weights.
