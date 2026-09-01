# Product and architecture decisions

| Field | Value |
| --- | --- |
| Owner | Karel Kutchan |
| Scope | Routes, content boundaries, third-party surfaces, localization strategy, design sources |
| Created | 2026-09-01 |
| Companion documents | `AGENTS.md`, `docs/audits/`, `docs/brand/brand-decision-log.md` |

These records say **what was decided, why, and what would reopen it**. They are the
answer to "what am I allowed to change?".

## Why this directory exists

`AGENTS.md` is for how to work in this repository: commands, gates, conventions,
workflow. Product requirements and design specifications do not belong there, and while
they lived there they were indistinguishable from working instructions — an agent could
not tell a settled product decision from a lint rule.

Four homes, one question each:

| Home | Holds | Answers |
| --- | --- | --- |
| `AGENTS.md` | how to work here | "how do I do things in this repo?" |
| `docs/decisions/` | what was decided and must hold | "what am I allowed to change?" |
| `docs/audits/` | what was measured, dated | "what was actually true when checked?" |
| `docs/plans/` | live plans only | "what work is still outstanding?" |

## Status vocabulary

The same four states as `docs/brand/brand-decision-log.md`, restated here so a reader of
these records does not have to jump. That log remains the governing definition and the
sole home of **brand** decisions; if the two ever disagree, it wins.

| Status | Meaning | How to treat it |
| --- | --- | --- |
| `locked` | Decided and stable. | Follow it. Changing it requires owner approval and a version bump. |
| `provisional` | Working decision, deliberately adopted, expected to be revisited. | Follow it, but do not build hard dependencies on it or present it as final. |
| `open` | Not decided. | Do not invent an answer. Use an explicitly interim solution and flag it. |
| `deprecated` | Formerly used, now withdrawn. | Do not use in new work. Replace on contact. |

Plans do not use this vocabulary. A plan is `open` or `provisional` only, because a
delivered plan is deleted rather than archived.

## Records

| Record | Covers |
| --- | --- |
| [`booking.md`](booking.md) | `/contact/book` and its third-party scheduler |
| [`curriculum-vitae.md`](curriculum-vitae.md) | CV routes, approved frames, PDF and download contract |
| [`localization.md`](localization.md) | Locale strategy, routing bridge, Payload content boundary |
| [`design-sources.md`](design-sources.md) | Figma file of record and approved node inventory |
| `../brand/brand-decision-log.md` | Brand identity and control geometry — governs; referenced from these records, never restated |

## Writing a record

State the decision, its status and why it was taken. Add what would reopen it wherever a
reopening is plausible — that field is what stops a settled decision from being reversed
in passing. Omit it only where nothing realistic would reopen the decision, such as a
record of what a file simply is.

Where a decision rests on a measurement, cite the audit and its date rather than
restating the number — the audit is where measurements live. A route with no audit may
carry its own dated measurement inline, as `booking.md` does; move it to an audit as
soon as one exists.

**Say when a decision is not yet implemented.** A record states what must hold, which is
not the same as what currently holds. Where the two differ, add an explicit
implementation-status note pointing at the open work, so nobody reads the target as a
description of the shipped product.
