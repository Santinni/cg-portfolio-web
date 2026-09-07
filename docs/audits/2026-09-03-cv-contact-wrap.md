# CV contact row: measured wrap at 390 px, and why it ends in icon-only profiles

> The measurement below is unchanged from the first pass. The fix it led to is not — see
> "Decision" for the revision made the same day, before merge, after reading Figma directly.

## Reproduction

- Date: 2026-09-03
- Method: full-page Playwright screenshots of `/curriculum-vitae` and `/cs/curriculum-vitae`
  at 1440 / 768 / 390 px, light and dark, captured twice — once from `6cfb61a` (the last
  commit before the BL-002 refactor) in a temporary worktree, once from `dev` at `e6d89e7`.
- Environment: the pinned image from `compose.e2e.yaml`
  (`mcr.microsoft.com/playwright:v1.62.0-noble`), both runs. Nothing was captured on
  Windows, because text wrapping decides this layout and wrapping follows the font stack.
- Comparison: Playwright snapshot diffing, plus per-row pixel analysis to separate an
  intrinsic change from a vertical displacement.

This is the before/after evidence that the BL-002 delivery note recorded as missing, and
that the backlog's Risks section required for this page.

## Result

All twelve pairs differ. Two distinct signatures:

| Viewport | Page height | What actually changed |
| --- | --- | --- |
| 1440 | unchanged | One band, y 463–480, x 574–679. 861 px in light, ~521 in dark. |
| 768 | unchanged | The same single band, 503–522 px. |
| 390 | **7876 → 7928 px** | Band at y 591–608, then everything below y 637 displaced by exactly 52 px, with zero residual. |

Czech behaves identically (8004 → 8056 px). Dark differs from light only in antialiasing
counts.

**Desktop and tablet are clean.** The single band is the `ArrowUpRight` glyph that the
COD-77 audit records as a deliberate deviation. Nothing else on those widths moved.

**390 is not clean.** The contact links no longer fit one line:

- before — `karel@codeguy.cz` · `LinkedIn` · `GitHub` on one line;
- after — `GitHub ↗` wraps to a second line.

The 52 px is exact and explains itself: `--touch-target-min` (44) + the `--space-8` row
gap of `.contactList`.

## Why it happened

The content column at 390 px is 350 px wide. Measured from the captures:

- the three links occupied **316 px**, leaving 34 px of slack;
- each arrow adds 20 px (`--icon-16` plus `--space-4`), so two arrows add **40 px**.

The row therefore overflows by roughly **6 px**, and buys a 52 px line for it. The wrap was
never a typography problem; `.contactList` was carrying a desktop column gap of
`var(--space-24)` — 48 px of a 350 px line spent on air.

## Correction to the COD-77 audit

`docs/audits/2026-09-02-cv-shared-primitive-audit.md` states, under "Brand deltas", that
"Contact typography, spacing and hero geometry are unchanged." At 390 px that is false, and
this document supersedes it. The arrow deviation was recorded; its layout consequence was
not, because nothing in the suite could see it.

## Why the existing suite missed it

`src/__tests__/e2e/curriculum-vitae.spec.ts` asserts no horizontal overflow, the 44 px
target, computed colours and per-element geometry across 32 cases. A change that reflows one
line into two violates none of them: nothing overflows, every target keeps its size, and no
single element's geometry changes. Line count and block height were not asserted, so the
whole suite stayed green through a visible layout change.

## Decision

The first pass fixed only the overflow: icon density below 768 px, text density above it,
chosen from three options rendered side by side at 390 px. That shipped, was verified in the
pinned container, and is superseded by what follows — kept here because the reasoning that
ruled out the alternatives still holds.

Rejected alternatives, from the first pass:

- **Narrowing the gap alone** (24 → 16 px) fixes the wrap with about 10 px of headroom. A
  longer domain or a different font fallback consumes that, so it patches the symptom
  without reserve.
- **Suppressing the arrow below the tablet step** restores the single line but breaks what
  BL-002 bought: one contact contract that signals "leaves the site" identically on every
  surface.

**Revised same day, before merge.** Reading the approved Figma file (`21:273` Contact Link,
and `131:601` "Contact row" — the contact block inside the approved mobile CV frame
`131:593`) surfaced two things the first pass didn't have:

- The Figma-approved column gap for this exact row is `8px 12px`, not the `--space-24` the
  page carried over from desktop. Recomputed against the measured content width (308 px of
  links and arrows, two gaps), 12 px alone fits in 332 px against a 350 px column — 18 px of
  headroom, no icon density required. The wrap traced back to an unrelated gap mismatch that
  predates this audit, not to the arrow alone.
- The approved Contact Link has no compact or icon-only state at all today; Social always
  shows label plus a leading external-link icon (icon before label, not after — a separate,
  pre-existing divergence this work doesn't touch).

Neither finding was reason to adopt Figma's 12 px gap as the whole fix. Once icon-only was on
the table as a real option — not a fallback forced by 6 px of overflow, but a considered hierarchy call —
it read as the better solution on its own terms: e-mail is the one channel worth reading and
acting on, LinkedIn and GitHub are destinations recognized by a globally known mark, and
splitting the row that way is true at 1440 px as much as at 390 px. So the final shape drops
the responsive switch entirely.

**Final decision.** In the `inline` variant, an external profile (LinkedIn, GitHub) always
renders as its brand mark alone in a 44×44 target, monochrome (`--text-primary`, not the
platform's brand colour) — no arrow, no visible label, at every width. E-mail is untouched:
underlined text, no icon, unchanged from before this audit. The label is clipped, not
removed, so it remains the anchor's accessible name and its text content; nothing about
`data-contact-method`, href, target or rel changes. The `row` variant (`/contact`) is
untouched — that page is a browsed directory where every method reads the same way, so the
label stays visible there regardless of width.

`.contactList` also moved from `var(--space-24)` to `var(--space-16)` as its column gap, at
every width. With two fixed 44 px targets the row no longer overflows at any plausible gap,
so this is a rhythm choice rather than a fix: 24 px read as disconnected once the profiles
became adjacent icon buttons. It is still a third value away from the `12 px` the Figma row
specifies — a deliberate, recorded divergence like the two below, not an oversight.

**Also in this change, and not caused by it.** Two copy changes and one asset change landed
alongside because they were requested while this work was open, and each has a visible effect
on the same surface:

- `messages/en.json` — `"Prague, Czech Republic"` → `"Prague, Czechia"`, matching the string
  the Figma frame already used. `messages/cs.json` keeps `"Praha, Česká republika"`: the
  Czech short form (`Česko`) is a separate register decision, not the same call as the
  English one.
- `messages/{en,cs}.json` — the four booking entry-point actions became `"Book a call"` /
  `"Domluvit hovor"`. The eyebrows and body copy around them still say *conversation* /
  *rozhovor*; unifying that register is an open question, not a decision this document makes.
- `src/app/(frontend)/components/icons/BrandIcons.tsx` — `LinkedInIcon` was replaced. The
  previous glyph was a condensed 24-viewBox mark with a `transform`; the current one is the
  official-proportion mark, taken from the reference supplied in the request. That reference
  is not committed here, so the match is not reproducible from this repository alone — what
  is checkable is the change itself: a 24-unit viewBox with a `transform` became a
  260.366-unit viewBox with none. It is also
  imported by `(home)/sections/contact/index.tsx`, which no page renders today.

This is a deliberate departure from the approved Figma Contact Link, not an implementation
detail — see "Consequences" below for what that means for the design file, and
`docs/decisions/curriculum-vitae.md` (CV-05) for the binding record.

## Consequences to carry forward

- Figma's `Contact Link` component (`21:273`) has no variant for this yet. It needs a new
  state added under `Kind=Social`, documented as an approved deviation with the reasoning
  above, not silently overwritten.
- The "Contact row" block (`131:601`) inside the approved mobile CV frame (`131:593`)
  currently shows LinkedIn and GitHub wrapping onto a second row with full labels — the
  design file's own answer to narrow widths, arrived at independently of this audit. The CV
  frames at all three widths need updating to the icon-only row, or the file and the shipped
  page disagree.
- `docs/decisions/design-sources.md` (DS-02) does not list the `Contact Link` component set
  (`21:273`) in its approved node inventory, although two documents now treat it as the node
  of record. Add it there, or the inventory stops being the inventory.
- `ContactLink` `inline` is the variant BL-003 (COD-79) will put in the homepage hero, so
  the density rule now lives in the component and the homepage inherits it rather than
  inventing a fourth link style.
- The Figma Social icon leads with the icon before the label; this codebase's `row` variant
  (still label-then-icon) was already diverging from that before today. Out of scope here,
  flagged so it isn't mistaken for something this change introduced.
- ~~Line count and hero block height are the assertions that would have caught the original
  wrap. They're worth adding regardless of which fix shipped, because they name the failure
  instead of relying on a screenshot to notice it.~~ **Added 2026-09-07**, after a review
  pass found this bullet had been written as a recommendation and left unimplemented while
  the visual spec's header already described the guard as if it existed. `keeps the hero
  contact block to its approved row count at every width` in
  `src/__tests__/e2e/curriculum-vitae.spec.ts` now pins the row count and the block height at
  all five widths in both locales, against measured values:

  | Width | Rows | Block height |
  | --- | --- | --- |
  | 1440 / 768 | 1 | 44 px |
  | 430 / 390 | 2 | 96 px |
  | 320 | 3 | 148 px |

  Heights are exactly `rows x 44 + (rows - 1) x 8` -- `--touch-target-min` per row and
  `--space-8` between rows, which is where the original 52 px came from. Both locales wrap at
  the same widths despite the Czech location string being ~54 px wider. This matters because
  the pixel baselines do **not** run in GitHub Actions (`PINNED_VISUAL` is set only in
  `compose.e2e.yaml`), so before this the wrap class of regression had no automated guard on
  any path CI actually takes.

## Follow-ups this audit did not resolve

Raised by review on 2026-09-07 and left open deliberately, because each is a decision rather
than a correction:

- **`accessibility.externalLink` is authored and unused.** `messages/{en,cs}.json` carry
  "Opens in a new tab" / "Otevře se v nové kartě" under `curriculumVitae.accessibility`, with
  no consumer anywhere in `src/`. These links still set `target="_blank"`, and this change
  removed the arrow that was the only cue -- a cue screen readers never got, since it was
  `aria-hidden`. Wiring the string into the clipped label would cost no pixels, but it
  changes the accessible name from `LinkedIn` to `LinkedIn Opens in a new tab`, which CV-05
  currently binds and three tests assert. Needs a decision, not a patch.
- **`--border-default` gives the icon target ~1.35:1 (light) and ~1.5:1 (dark) against the
  page.** The 20 px glyph itself is `--text-primary` at ~19.6:1, so the control is
  perceivable; what is hard to perceive is the *extent* of the 44 px hit area, and the hover
  state changes only that border colour. `--border-strong` or a `--surface-subtle` fill (what
  `IconButton` does) would fix it, but this is a token-level design call affecting more than
  this component.
- **CI does not run the pinned suite at all.** The 13 baselines are collected and skipped in
  `.github/workflows/ci.yml`, so glyph identity, monochrome colour and border are guarded
  only when someone remembers `pnpm test:e2e:pinned`. The row-count assertion above moves the
  layout contract onto the CI-visible suite; adding a docker job would be the fuller fix.
