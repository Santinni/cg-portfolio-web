# Copy Change Ledger

Status: append-only governance record and entry template.

## Purpose

This ledger preserves why public-facing words change, not only what the current
implementation says. It records the original wording verbatim, where and why it
was used, the replacement, the evidence behind factual claims, and the checks
performed before release.

Add an entry before, or in the same commit as, a change to live copy. Do not use
this document to reconstruct undocumented history retrospectively.

## Sources Of Authority

Use the narrowest current source that owns the text:

1. The approved Figma node is the visual and layout authority for redesign work.
2. `messages/en.json` and `messages/cs.json` own code-managed public copy.
3. Files under `src/content` own locale-neutral facts, identifiers, links, and
   structures, not translated presentation copy.
4. Public Payload revisions own published article, topic, author, and media
   editorial content.
5. An explicitly approved owner brief can authorize factual or positioning
   changes that are not defined by Figma.

`docs/project-brief.md` describes an obsolete version of the site. It is useful
as historical context only and is not an authority for current copy, design,
localization, metadata, or content architecture.

## Scope

Create a ledger entry for every live code- or catalog-managed:

- addition, replacement, or removal of visitor-visible text;
- responsive or context-specific wording variant;
- translation correction that changes wording or meaning;
- accessible name, alternative text, visually hidden text, live-region message,
  or other accessibility-only copy;
- title, description, Open Graph copy, social image alternative text, or other
  metadata copy;
- public error, validation, loading, empty, or unavailable state;
- factual claim, role description, experience statement, availability statement,
  or client/employer attribution.

For public Payload editorial content, record changed public fragments when the
change affects a title, excerpt, metadata, positioning, factual claim, CTA, or
other meaningful public contract. Payload versions remain the full editorial
history for article bodies.

Routine code formatting and changes to locale-neutral identifiers, URLs, slugs,
technology names, or structured data do not require an entry unless they also
change visitor-visible meaning.

## Append-Only Rules

1. Use one entry for one semantic decision. A matched English/Czech pair belongs
   in the same entry; unrelated wording decisions do not.
2. Assign IDs in the form `COPY-YYYYMMDD-NNN`, with the sequence restarting each
   day.
3. Never delete or rewrite an approved, implemented, reverted, or superseded
   entry. Append a correcting entry and connect both records with `Supersedes`
   or `Reverted by`.
4. Preserve the original wording exactly, including punctuation, capitalization,
   interpolation variables, and meaningful whitespace. Use `<none>` for an
   addition and `<removed>` for a removal.
5. Identify locations with stable repository paths plus message keys, component
   names, semantic elements, selectors, routes, or public Payload fields. Line
   numbers may be supplemental but are not sufficient because they drift.
6. Record the original purpose and user task. Similar-looking strings can have
   different accessibility, navigation, conversion, or search purposes.
7. Do not copy secrets, private drafts, client-confidential material, private
   production data, or unpublished Payload content into Git. For a CMS change,
   reference the public slug, field, and public revision timestamp and quote only
   the changed public fragment.
8. Record a Figma node when copy is added or changed to satisfy a design. Figma
   wording is not permission to invent or publish an unverified factual claim.
9. An entry can be marked `implemented` only after the listed code, catalog, and
   verification work exists. A proposed record is not authorization to publish.

## Controlled Vocabularies

### Status

- `proposed`: the decision is being evaluated and is not approved for release.
- `approved`: wording and required claim/NDA review are approved, but the live
  implementation is not yet verified.
- `implemented`: the approved wording is implemented and the recorded checks
  passed.
- `reverted`: a later change restored or replaced this decision.
- `superseded`: a later entry replaced this decision without treating it as a
  regression.

### Change Type

- `add`
- `replace`
- `remove`
- `responsive-variant`
- `translation-correction`
- `metadata`
- `accessibility`
- `cms-public-editorial`

### Surface

- `visitor-visible`
- `accessibility-only`
- `metadata`
- `formatted-data`
- `cms-editorial`

List multiple values when a decision spans surfaces.

### Source Boundary

- `next-intl`
- `locale-neutral-data`
- `Payload-public`
- `Figma-reference`
- `owner-approved-brief`

List every boundary involved; do not move copy into a boundary that does not own
it merely to simplify a component.

## Required Safeguards

### Internationalization

- Reuse a stable semantic key or add matching, non-empty English and Czech keys.
- Preserve recursive catalog-key and ICU-placeholder parity.
- Treat the English and Czech values as equivalent communication, not as
  character-for-character translations.
- Use natural professional Czech with correct diacritics.
- Keep URLs, slugs, brand names, personal names, and technology names
  locale-neutral unless an approved product decision explicitly changes them.
- Do not imply that English-only CMS articles or the current language-specific
  PDF CV have a Czech translation.

### Accessibility

- Record whether the copy forms an accessible name, description, status, heading,
  link purpose, image alternative, or language change.
- Keep visible and accessible labels aligned unless a documented user need
  requires additional context.
- Do not remove useful context merely to shorten an `aria-label` or visually
  hidden string.
- Mark embedded English editorial fragments with the correct language when they
  appear inside Czech UI.
- Test changes to announcements, labels, dialogs, navigation, and error states
  with their real semantics and keyboard behavior. A string snapshot alone is
  not accessibility proof.

### Responsive Content

- Treat wrapping and content height as behavior in both English and Czech.
- A compact variant must preserve the purpose, facts, and user task of the wide
  wording. It is a related variant, not permission to omit material meaning.
- Record which viewport or component state selects each variant.
- Ensure visually hidden duplicate variants are not both exposed to assistive
  technology.
- Verify representative desktop, tablet, and mobile widths when the changed text
  can affect layout.

### SEO And Metadata

- Record impacts on the document title, description, canonical URL, language
  alternates, Open Graph copy, social-image alternative text, structured data,
  and search intent.
- Keep metadata factual, specific, and consistent with the rendered page.
- Do not create Czech article hreflang for English-only Payload content.
- Do not invent keyword volume, rankings, testimonials, outcomes, or performance
  claims. Treat search intent as a hypothesis until supported by research or
  Search Console evidence.
- Verify raw metadata and response behavior, not only what a browser tab displays.

### Facts, Claims, And Confidentiality

- Identify every fact or claim whose truth, timing, scope, or attribution changes.
- Link or describe a dated, reviewable source without placing confidential
  evidence in the repository.
- Reconfirm time-sensitive wording such as current role, availability, years of
  experience, and present-tense leadership claims.
- Require owner approval for personal positioning and availability statements.
- Require NDA/client approval before naming or attributing client, employer,
  product, result, metric, or unpublished work.
- Use narrower wording when evidence supports only a narrower claim.

### CMS Editorial Content

- Record only public editorial fragments in this repository.
- Use a stable public slug and field name rather than a private database ID.
- Reference the public Payload revision timestamp. Do not duplicate an entire
  article solely to track one changed fragment.
- Keep article body, title, excerpt, author, topic, and media content English-only
  until the separately approved Payload localization migration exists.
- A CMS edit still requires metadata, media-alt, link, heading, claim, and preview
  review before publication.

## Entry Template

Copy the complete template for each decision. Do not remove fields; use `None`
with a short reason when a field genuinely does not apply.

````md
## COPY-YYYYMMDD-NNN — Short decision title

- Status: proposed
- Change type:
- Surface:
- Proposed date:
- Implemented date:
- Owner:
- Author:
- Reviewer:
- Pull request:
- Commit:
- Routes and locales:
- Source boundary:
- Message keys or public CMS fields:
- Rendering location:
- Figma file and node:
- Original source:
- Original purpose:
- Audience and user intent:

### Original (verbatim)

#### English

```text
...
```

#### Czech

```text
...
```

### Replacement (verbatim)

#### English

```text
...
```

#### Czech

```text
...
```

### Rationale

- Problem being solved:
- Why this wording was selected:
- Alternatives rejected:
- Meaning intentionally preserved:
- Meaning intentionally changed:

### Fact And Claim Controls

- Claims affected:
- Evidence source and checked date:
- Time-sensitive review:
- NDA or client review:
- Owner approval:

### Impact Review

- Internationalization:
- Accessibility:
- Responsive layout:
- SEO and metadata:
- CMS or data boundary:
- Privacy and confidentiality:

### Verification

- Automated tests:
- Routes and locales:
- Themes, viewports, and interaction states:
- Manual content review:
- Result:
- Residual risk:

### Lifecycle

- Supersedes:
- Reverted by:
- Related entries:
- Notes:
````

## Applying The Template

- For a newly added mobile-menu label, use `<none>` as the original, record the
  navigation action it names, add matching semantic catalog keys, and verify the
  accessible name and both localized menus.
- For compact mobile wording, use `responsive-variant`, preserve both the wide
  and compact values in the record, and verify that only the active variant is
  exposed to assistive technology.
- For deletion of unused legacy copy, quote the removed wording, identify the
  unused component and its historical purpose, and use `<removed>` as the
  replacement. Do not translate dead code solely to delete it later.
- For a public CMS claim edit, quote only the changed public fragment and
  reference its public slug, field, and revision timestamp. Keep private draft
  history in Payload.

## COPY-20260729-001 — Add professional context to the mobile menu

- Status: implemented
- Change type: add
- Surface: visitor-visible
- Proposed date: 2026-07-29
- Implemented date: 2026-07-29
- Owner: Karel Kutchan
- Author: Codeguy portfolio implementation team
- Reviewer: Codex controller plus independent read-only agent review
- Pull request: Pending
- Commit: Same commit as this entry:
  `feat(navigation): compose localized mobile menu`
- Routes and locales: all public routes; English and Czech; compact navigation
  below 1024 CSS pixels
- Source boundary: Figma-reference, next-intl, owner-approved-brief
- Message keys or public CMS fields:
  `navigation.mobileMenu.profile.role`,
  `navigation.mobileMenu.profile.specialties`
- Rendering location:
  `src/app/(frontend)/components/ui/navigation/index.tsx`, mobile dialog footer
- Figma file and node:
  `cs38WzlXKY9xfDYBinoKel`, `27:49` (`Prototype / Menu / 390×844`)
- Original source: approved Figma redesign for the exact English copy plus the
  owner's explicit 2026-07-29 instruction to implement the redesign; the Czech
  localization was authored by the implementation team
- Original purpose: no previous footer copy existed; the new text gives visitors
  concise professional and technical context while the primary navigation is open
- Audience and user intent: prospective employers, collaborators, and clients
  scanning the mobile navigation before choosing a destination

### Original (verbatim)

#### English

```text
<none>
```

#### Czech

```text
<none>
```

### Replacement (verbatim)

#### English

```text
Senior / Lead Frontend Engineer
Prague · React · TypeScript · Accessibility
```

#### Czech

```text
Seniorní frontend vývojář / vedoucí frontendu
Praha · React · TypeScript · Přístupnost
```

### Rationale

- Problem being solved: the previously implemented mobile dialog lacked the
  approved professional-context footer from Figma node `27:49`.
- Why this wording was selected: English preserves the approved Figma copy
  exactly; Czech communicates the same role, location, technologies, and
  accessibility focus in concise professional Czech.
- Alternatives rejected: leaving English copy in Czech UI would violate the
  localization contract; a literal mixed-language Czech job title would be less
  natural; omitting the footer would leave a confirmed redesign mismatch.
- Meaning intentionally preserved: seniority, frontend leadership, Prague,
  React, TypeScript, and accessibility.
- Meaning intentionally changed: none; the Czech wording is a localization of
  the English professional positioning.

### Fact And Claim Controls

- Claims affected: current senior/lead frontend positioning, Prague location,
  React and TypeScript experience, and accessibility focus.
- Evidence source and checked date: owner-approved Figma redesign and existing
  public lead-positioning copy in the portfolio, checked 2026-07-29.
- Time-sensitive review: the Lead claim must be reconfirmed if reused after the
  owner's current professional position changes.
- NDA or client review: not applicable; no client, employer, product, outcome, or
  confidential work is named.
- Owner approval: Karel Kutchan's explicit 2026-07-29 instruction authorizes the
  redesign implementation and the underlying public senior/lead positioning.
  The exact Czech localization was not supplied or separately language-approved
  by the owner.

### Impact Review

- Internationalization: matching semantic keys and non-empty values are added to
  both catalogs; locale-neutral technology names remain unchanged.
- Accessibility: the profile is informational text, not an interactive label;
  its role and specialties are separate paragraphs, and English and Czech are
  rendered under the correct document language.
- Responsive layout: English is measured against the approved 390×844 node;
  Czech wrapping is verified at 390; 768 behavior uses the repository's 48px
  inferred compact gutter and is not claimed as exact Figma parity.
- SEO and metadata: no title, description, canonical, hreflang, Open Graph,
  structured-data, robots, or sitemap change.
- CMS or data boundary: static navigation copy remains in next-intl catalogs; no
  Payload field or schema change.
- Privacy and confidentiality: the text contains only already public
  professional positioning.

### Verification

- Automated tests: 20/20 targeted component and catalog tests passed; targeted
  Chromium checks passed 4/4 for composition, geometry, short-height scrolling,
  and states plus 2/2 for dialog lifecycle and utility behavior; TypeScript and
  the repository lint command passed. The repository-wide format check still
  reports unrelated baseline deviations; all files in this packet that are
  covered by Biome pass its targeted format check.
- Routes and locales: verified English `/`, Czech `/cs`, English `/work`, and
  locale switching from `/work?source=mobile-menu#case-studies` to the equivalent
  Czech route while preserving the query and fragment.
- Themes, viewports, and interaction states: verified light 390×844 geometry,
  Czech wrapping and scroll reachability at 390×568, inferred Czech 768×900
  composition, dark and forced-colors presentation, explicit close, Escape,
  route close, 768→1024 breakpoint close, focus return, theme persistence, and
  language switching.
- Manual content review: exact English Figma copy confirmed; the Czech value was
  authored and semantically reviewed by the implementation team, but separate
  owner language approval is not recorded.
- Result: implemented and green on the targeted component, catalog, Chromium,
  type, lint, and packet-format validation described above.
- Residual risk: the role claim is time-sensitive; utility controls retained in
  the dialog are an intentional product deviation from Figma node `27:49`.

### Lifecycle

- Supersedes: none
- Reverted by: none
- Related entries: none
- Notes: append a new entry rather than rewriting this record if the role,
  location, technology focus, or accessibility positioning changes.
