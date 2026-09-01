# Design sources of record

| Field | Value |
| --- | --- |
| Scope | The Figma file of record and its approved node inventory |
| Status vocabulary | See [`README.md`](README.md) |
| Last updated | 2026-09-01 |

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
| Components page | `4:3` |
| Desktop page | `4:4` · Home frame `6:2` |
| Tablet page | `4:5` · Home frame `7:377` |
| Mobile page | `4:6` · Home frame `8:87` |
| Responsive QA page | `4:7` |
| Dark-mode page | `4:8` |
| Button component set | `21:110` |
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

## DS-05 — Routes without approved frames · `locked`

Some routes were delivered without approved frames and cannot carry a parity claim. See
[`booking.md`](booking.md) BK-02. Do not report measured Figma parity for a route with no
approved source.
