# Curriculum Vitae shared-primitive audit

## Reproduction

- Inspection date: 2026-09-02
- Git base: `dev` at `6cfb61a`
- Files read: `src/app/[locale]/(frontend)/(pages)/curriculum-vitae/page.tsx` (313 lines),
  `.../curriculum-vitae/page.module.css` (470 lines), `src/components/site/*`,
  `src/content/contact.ts`, `src/content/site.ts`
- Scope: BL-002 minimal pass (COD-77). Classification was written before any code changed,
  because the page is the most self-contained route in the app and the cost of a wrong
  "this is duplication" call is a redesign, not a refactor.

## Classification

Each block is (a) already covered by a shared component, (b) a legitimate CV-only block, or
(c) a promotion candidate that a later pass owns.

| Block | Source | Class | Outcome in this pass |
| --- | --- | --- | --- |
| Hero shell (`.hero`, `.heroInner`) | `page.tsx:66-113` | (b) | Kept. `PageIntro` is a fixed eyebrow/title/intro triple; the CV hero also carries the role line, the contact block and two actions. Forcing it through `PageIntro` would mean adding three optional slots to a primitive used by four other routes. |
| Hero eyebrow | `page.tsx:68` | (a) | Swapped to `Eyebrow`. |
| Person name (`h1`), role, intro | `page.tsx:69-71` | (b) | Kept. 64/68 px name is the approved CV type scale, not the shared `h1`. |
| Contact rows (`<address>` with three raw anchors) | `page.tsx:73-92` | (a) | Swapped to `ContactLink`, values read from `@/content/contact`. |
| Hero actions | `page.tsx:94-105` | (a) | Already `DownloadAction` + `Button`. Unchanged. |
| Section shells `#cv-profile`, `#cv-skills`, `#cv-experience`, `#cv-projects`, `#cv-education` | `page.tsx:110-284` | (a) | Swapped to `Section`. Local tones map 1:1 — `.subtleSection` → `tone="subtle"`, `.raisedSection` → `tone="raised"`, bare `.section` → `tone="page"`; both use `--section-block` and the same surface tokens. |
| Section eyebrows | five occurrences | (a) | Swapped to `Eyebrow`. |
| `.sectionHeading` heading grid | `page.module.css:106-131` | (c) | Kept CV-local. Experience and Contact each carry their own `.sectionHeading`, so a `SectionHeading` primitive is a real candidate — but promoting it touches three routes and belongs with the hero consolidation work (COD-82), not here. |
| Highlight and project cards | `page.tsx:117-127`, `:230-250` | (c) | Out of scope by the issue; COD-84 owns the card system. |
| CV timeline | `page.tsx:143-200` | (c) | `Timeline` exists but takes role/description pairs only; CV entries add period, company and the current-role badge. COD-84. |
| Earlier-experience footnote | `page.tsx:201-224` | (b) | Deliberately quieter than a timeline entry. |
| Education and languages layout | `page.tsx:255-291` | (b) | Two-column CV-only layout. |
| Download section `#cv-download` | `page.tsx:293-311` | (c) | Structure untouched — COD-84 owns the refactor. Only its eyebrow element moved to `Eyebrow`, so the class it shared with the rest of the page could be deleted rather than left orphaned. |
| Floating download | `page.tsx:313-321` | (b) | Fixed-position CV affordance; test hooks preserved. |

## Contact contract

One contract now serves every contact surface:

- `src/content/site.ts` holds the destinations (`contact.email`, `.linkedin`, `.github`).
- `src/content/contact.ts` derives `contactMethods` from them, so a destination cannot
  drift between the CV page and `/contact`. It previously repeated the e-mail address and
  both profile URLs as literals.
- `src/components/site/ContactLink.tsx` renders them in two variants:
  - `row` — the labelled, bordered row used by `/contact`;
  - `inline` — the compact hero token used by the CV, and available to the homepage
    identity row (BL-003, COD-79) and a future footer without a second component.
- Inline text rule: an external profile shows its **label** ("LinkedIn"), a direct channel
  shows its **value** (the e-mail address, "Prague, Czech Republic"). A profile is named by
  its platform; a direct channel is named by the address the visitor will use.

Order stays per surface: the approved CV hero leads with the non-interactive location,
`/contact` keeps the model order. Order is layout, not contract.

Both variants keep real anchor semantics, a 44 px minimum target, the global focus ring,
`target="_blank" rel="noopener noreferrer"` for external profiles only, and a
non-interactive element for location. `mailto:` never opens in a new tab. `DownloadAction`
stays a separate primitive (CV-05).

## Brand deltas

Measured against `docs/brand/brand-guidelines.md` and the approved CV frames
(`124:369`, `132:399`, `131:593`, `136:190`, `136:283`).

- **Inline contact links gain the arrow affordance.** External profile links on the CV hero
  now carry the same `ArrowUpRight` glyph the `/contact` rows use. The approved CV frames
  show underlined text without a glyph. Taken deliberately: one contract cannot signal
  "leaves the site" on one surface and stay silent on another. Recorded here as a
  deviation rather than shipped quietly.
- **Eyebrow colour is preserved, not unified.** The shared `Eyebrow` renders
  `--text-secondary`; the CV eyebrow is `--action-primary` in the approved frames. The CV
  keeps its accent through a local class rather than changing the primitive for five
  routes.
- Contact typography, spacing and hero geometry are unchanged.

## Not re-verified here

The Figma frames were not re-fetched for this pass; the geometry contract in
`docs/audits/2026-07-30-cv-redesign-baseline.md` is still the reference, and no geometry
token changed. Visual proof at 390/768/1440 in both locales and both themes is a
Playwright-backed step and is listed as outstanding in the delivery note on COD-77.
