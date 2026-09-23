# Design sources of record

| Field | Value |
| --- | --- |
| Scope | The Figma file of record and its approved node inventory |
| Status vocabulary | See [`README.md`](README.md) |
| Last updated | 2026-09-23 |

## DS-01 — Figma file of record · `locked`

**Decision.** The approved portfolio design is:

| Field | Value |
| --- | --- |
| URL | https://www.figma.com/design/cs38WzlXKY9xfDYBinoKel/Codeguy-Portfolio---Final-Design |
| File key | `cs38WzlXKY9xfDYBinoKel` |

This file is the visual source of truth for redesign work.

**Why.** One approved file, so that "matches the design" means something checkable.

## DS-02 — Approved node inventory · `locked`

| Surface | Node |
| --- | --- |
| Components page | `4:3` — every Home block is a component set with `Width` × `Theme=Light / Dark` variants (dark variants carry the explicit Dark mode of the Semantic Color collection); each set sits in its own section, sections stacked without overlap |
| Desktop page | `4:4` · Home frame `6:2` — instances only, top to bottom: Navigation, Hero, Worked with, Flagship case, Selected work, Principles, Experience snapshot, Final CTA, Site footer |
| Tablet page | `4:5` · Home frame `7:377` (instances, no Experience snapshot: the block is hidden below 1024 px) |
| Mobile page | `4:6` · Home frame `8:87` |
| Responsive QA page | `4:7` · Home frames `8:140` (320) and `8:193` (430), plain instances of the fluid `Width=390` variants (Selected work uses `Width=320` at 320) |
| Dark-mode page | `4:8` · Home frames `8:246` (1440), `291:858` (768), `8:325` (390), `291:1087` (430), `291:1316` (320) — `Theme=Dark` instances throughout, heights equal to the light twins |
| Dark previews of base sets | frames `<Set> / Dark preview` beside each set on `4:3` with the Dark mode pinned: Button `291:2274`, Icon Button `291:2392`, Link `291:4848`, Work Card `291:4899`, Contact Link `291:5003`, Tag `291:5076`, Timeline Item `291:5089`, Article Card `291:5114`, Code Block `291:5178`, Callout `291:5191`, CV Download Action `291:5201`, Marks `291:5247` — one instance per variant, so the dark theme is reviewable without a second axis on 54-variant sets |
| Navigation component set | `21:357` — extended 2026-09-23: desktop variants full-bleed 1440 with the locale switcher and theme toggle, `Theme=Dark` variants, section `286:3364` |
| Hero component set | `286:3362`, section `286:3363` — HP-01…HP-03 |
| Worked with component set | `282:2805`, section `281:212`; marks in section `260:178` — HP-04 |
| Flagship case component set | `286:2966`, section `286:2967` |
| Selected work component set | `287:3649`, section `287:3650` (eight variants: `Width=1440 / 768 / 390 / 320`; Work Card `21:248` gained `Action` / `Pending` properties for the pending case) |
| Principles component set | `286:3136`, section `286:3137` |
| Experience snapshot component set | `286:2511`, section `286:2876` (1440 only) |
| Final CTA component set | `286:2998`, section `286:3011` |
| Site Footer component set | `272:59`, section `272:60` — SC-01 in [`site-chrome.md`](site-chrome.md) |
| Button component set | `21:110` |
| Contact Link component set | `21:273` — gained `Kind=LinkedIn Icon` and `Kind=GitHub Icon` on 2026-09-03; see CV-05 |
| Brand Identity page `11 - Brand Identity` | `146:2` · chapter frames `146:3`, `147:2`, `149:2`, `150:2`, `151:2`, `153:15` |

The Brand Identity page is the visual working reference for the identity; its governing
decisions live in `docs/brand/brand-decision-log.md`, which takes precedence over the
frames when the two disagree about status.

Route-specific nodes live with their own record — CV frames in
[`curriculum-vitae.md`](curriculum-vitae.md).

Measured geometry belongs in `docs/audits/`, not here. This record says which nodes are
approved; the audits say what was measured against them and when.

## DS-03 — Control geometry is governed by the brand decision log · `locked`

**Decision.** Start from component set `21:110` for buttons. The geometry itself —
spacing scale, radii, minimum touch target and large-button dimensions — is BD-17 in
`docs/brand/brand-decision-log.md`. That entry governs, including its reopening
condition. Do not restate the values here or in `AGENTS.md`.

**Why.** Button geometry is part of the brand's restrained geometric system, not a
per-route design choice, and the brand log already owns it. A second copy would drift.

## DS-04 — Implementation plans do not go into Figma · `locked`

**Decision.** Figma holds the resulting product design — screens, components, states,
prototypes and handoff annotations. Plans, backlogs, orchestration notes and decision
records stay in this repository.

**Why.** A design file that accumulates process documentation stops being a design file,
and the process documentation stops being reviewable or diffable.

**Enforcement.** `.agents/skills/figma-product-delivery/SKILL.md`.

## DS-05 — Routes and blocks without approved frames · `locked`

Some routes and blocks were delivered without approved frames and cannot carry a parity
claim. (The Home "Worked with" row left this table on 2026-09-23, COD-179, when its frames
were approved; see HP-04 in [`homepage.md`](homepage.md).) An audit of the file against
production on 2026-09-23 (COD-180) found the Home blocks pasted as frames and the dark
mode held as two frames; the same day every block became a component set with `Theme`
variants and the dark page gained its 768 / 430 / 320 frames, so the only block without a
compact frame is the *Experience snapshot*, which the site hides below 1024 px by design. Do not report measured Figma parity for a surface with no approved source.

| Surface | Record |
| --- | --- |
| `/contact/book` | [`booking.md`](booking.md) BK-02 |

For these the parity specs pin token-derived geometry, and the decision record says which
tokens. Adding an approved frame later moves the surface out of this table and into DS-02
or the route's own record.

## DS-06 — Insights topic filters are design-system Button links · `locked`

**Decision.** The Insights topic filters render as the design-system `Button` in its `SM`
size through `renders="link"`: the selected filter is `secondary`, the others `quiet`, 36 px
high with a 4 px radius and 8 px gaps, hugging their labels. The list wraps on narrow
widths; it never scrolls horizontally and carries no fixed height, so Czech labels can grow.
Semantics are unchanged: each control is a next-intl link with `aria-current="page"` on the
selected one, filtering is the server-rendered `?topic=` navigation, and no control becomes a
button, gains `aria-pressed` or joins a tablist.

**Why.** Figma `74:291` (desktop), `76:10` (tablet) and `76:211` (mobile, two rows 8 px
apart) show the shared Button, not the rounded pill the first implementation styled by hand,
and a second chip-like control would have duplicated the Button contract. The 44 px target
belongs to the anchor, extended through an invisible pseudo-element, not to the row around
it, so the rows keep the approved 8 px rhythm.

**Implementation status: met.** COD-80, `src/app/[locale]/(frontend)/(pages)/insights/InsightFilters.tsx`
with `insight-filters.test.tsx` and `insights-filters.spec.ts`. The links carry
`prefetch={false}` because a prefetched entry left a bare `/insights` → `?topic=` navigation
without a page fetch; that is a navigation contract, not a style, and the component test
pins it.

**What would reopen it.** A Figma change to the filter control, or a locale whose labels
cannot wrap into two rows at 350 px.
