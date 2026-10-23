# Roadmap

Where Saral is going, and roughly when. Dates are targets, not promises. If a date moves, this page changes and the reason goes in the [changelog](../CHANGELOG.md).

Today: version 0.3, with tokens and nine components (Field, Checkbox, Radio group, Select, Button, Link, Notice, Tag and Card).

## Milestones

| Milestone | What you get | Done when | Target |
|---|---|---|---|
| First npm release (0.4) | `npm i @saral/css @saral/core @saral/react`, a CDN link, `llms.txt` and a schema for the specs | A clean install works and every package shows its provenance on npm | 15 Nov 2026 |
| Form patterns (0.5) | The first form patterns, Figma variables and the core of the theme generator | Every pattern passes axe with JavaScript on and off, and renders correctly in every script the homepage shows | 10 Jan 2027 |
| New docs site (beta) | A new look, new page templates, search, and a live view that checks the contrast of any colours you pick | axe passes in every theme and mode | 7 Feb 2027 |
| 1.0 release candidate (0.9) | About 20 components, 8 form patterns, and Web Components for all of them | Every test passes in Chromium, Firefox and WebKit | 4 Apr 2027 |
| Playground and theme builder | Try Saral in the browser; put in one brand colour and get a checked theme out | Share links open the same state, and every theme passes the contrast checks | 2 May 2027 |
| 1.0 | Stable releases on npm, a Figma Community file, and the accessibility statement, security policy and support policy | Every 1.0 exit criterion is met | 13 Jun 2027 |

## Components by 1.0

- **Have now:** Field, Checkbox, Radio group, Select, Button, Link, Notice, Tag, Card.
- **Next:** Textarea, Switch, File input, Fieldset, Date input.
- **Then:** Dialog, Toast, Accordion, Breadcrumb, Pagination, Skip link, Progress, Table.

Each one uses the native element where there is one, and works with JavaScript off where the element allows it.

## After 1.0

Each of these comes when someone asks for it:

- Popover, Tooltip, Menu and Tabs;
- combobox and date picker;
- an MCP server, so coding assistants can read Saral's specs directly;
- native components for mobile platforms;
- tokens on other registries, and adapters for other frameworks.

To ask for one, [open an issue](https://github.com/AkashShivanand/saral/issues) and say what you are building. Requests decide the order.
