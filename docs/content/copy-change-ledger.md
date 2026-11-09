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

## COPY-20260729-002 — Add compact Home Hero supporting copy

- Status: implemented
- Change type: responsive-variant
- Surface: visitor-visible
- Proposed date: 2026-07-29
- Implemented date: 2026-07-29
- Owner: Karel Kutchan
- Author: Codeguy portfolio implementation team
- Reviewer: Codex controller and independent Hero parity review
- Pull request: Pending
- Commit: Planned as `fix(home): align Hero responsive contract`
- Routes and locales: `/` and `/cs`; compact presentation below 1024 CSS pixels
- Source boundary: Figma-reference, next-intl, owner-approved-brief
- Message keys or public CMS fields: `home.hero.paragraphsCompact.experience`,
  `home.hero.paragraphsCompact.quality`
- Rendering location:
  `src/app/[locale]/(frontend)/(pages)/(home)/blocks/hero/index.tsx`, Hero
  supporting paragraphs
- Figma file and node: `cs38WzlXKY9xfDYBinoKel`; tablet `7:377`, mobile
  `8:87`, responsive QA `8:140` and `8:193`
- Original source: existing approved desktop catalog copy remains the factual
  source; the compact English alternatives are supplied by the approved
  2026-07-29 Home parity implementation packet; Czech is a natural professional
  localization authored by the implementation team
- Original purpose: explain current lead-level experience, relevant product
  contexts, and the engineering qualities included in delivery without forcing
  compact layouts to carry desktop-length presentation detail
- Audience and user intent: prospective employers, collaborators, and clients
  scanning the Home introduction on tablet and mobile

### Original (verbatim)

#### English

```text
More than ten years in web development, currently in a lead frontend role. I work with React, TypeScript and Next.js across customer portals, internal enterprise applications and the component libraries underneath them.
Architecture, accessibility and long-term maintainability are part of the delivery, not follow-up work.
```

#### Czech

```text
Webům se věnuji přes deset let a dnes působím jako vedoucí frontend vývoje. S Reactem, TypeScriptem a Next.js pracuji na zákaznických portálech, interních podnikových aplikacích i komponentových knihovnách, na kterých stojí.
Architektura, přístupnost a dlouhodobá udržitelnost jsou součástí dodávky, ne práce odložená na později.
```

### Replacement (verbatim)

The original strings remain the desktop presentation. The following responsive
variants are added for compact layouts.

#### English

```text
More than ten years in web development, currently in a lead frontend role. I work with React, TypeScript and Next.js across customer portals, enterprise applications and component systems.
Architecture, accessibility and maintainability are part of the delivery.
```

#### Czech

```text
Webům se věnuji přes deset let a nyní působím ve vedoucí frontendové roli. S Reactem, TypeScriptem a Next.js pracuji na zákaznických portálech, podnikových aplikacích a komponentových systémech.
Architektura, přístupnost a udržovatelnost jsou součástí dodávky.
```

### Rationale

- Problem being solved: desktop supporting copy makes the approved compact Hero
  taller and denser than Figma nodes `7:377`, `8:87`, `8:140`, and `8:193`.
- Why this wording was selected: the supplied English removes only desktop-level
  qualifiers while preserving the role, tenure, technologies, product contexts,
  architecture, accessibility, and maintainability claims; Czech expresses the
  same facts naturally rather than translating word for word.
- Alternatives rejected: truncation would hide meaning and harm accessibility;
  client-side viewport branching would make rendering fragile; replacing the
  desktop catalog values would discard approved wide-screen copy.
- Meaning intentionally preserved: more than ten years in web development,
  current lead frontend responsibility, React/TypeScript/Next.js experience,
  portal/enterprise/component-system work, and delivery-level architecture,
  accessibility, and maintainability.
- Meaning intentionally changed: compact copy omits the internal qualifier,
  component-library dependency detail, long-term qualifier, and the contrast
  with follow-up work solely to reduce presentation length.

### Fact And Claim Controls

- Claims affected: tenure, current lead role, technologies, product contexts,
  and engineering-quality responsibilities.
- Evidence source and checked date: existing owner-approved Home copy and the
  approved Home parity packet, checked 2026-07-29.
- Time-sensitive review: the current lead-role claim must be reconfirmed if the
  owner's position changes; the experience duration must remain accurate.
- NDA or client review: not applicable; no employer, client, product, metric, or
  confidential implementation is named.
- Owner approval: Karel Kutchan explicitly authorized implementation of the
  redesign parity plan on 2026-07-29; separate approval of the Czech phrasing is
  not recorded.

### Impact Review

- Internationalization: matching semantic keys and non-empty values are added
  to both catalogs; desktop keys and locale-neutral technology names remain
  unchanged.
- Accessibility: both variants remain semantic paragraph text; CSS exposes one
  complete variant at a time without truncation or client viewport logic.
- Responsive layout: desktop copy remains active at 1440; compact alternatives
  are validated at 768, 430, 390, and 320 CSS pixels against the cited nodes.
- SEO and metadata: no metadata, canonical, hreflang, Open Graph, robots,
  structured-data, or sitemap change.
- CMS or data boundary: static portfolio presentation copy remains in next-intl;
  no Payload field, schema, or migration changes.
- Privacy and confidentiality: only existing public professional positioning is
  restated.

### Verification

- Automated tests: the expanded focused Hero Chromium contract passed 10/10;
  the nearby Home CTA regression contract passed 7/7; catalog parity/non-empty
  validation passed 3/3; TypeScript and targeted Biome checks passed.
- Routes and locales: verified English `/` and Czech `/cs`, including correct
  Czech document language and visible locale-specific supporting copy.
- Themes, viewports, and interaction states: deterministic light-theme checks
  prove both active strings visible and both inactive strings attached and
  hidden for English and Czech at 1440, 768, 430, 390, and 320 CSS pixels. Czech
  non-overlap, CTA containment, and visible-descendant overflow pass at all five
  widths. English headline wrapping and normalized Hero section heights match
  the cited Figma frames. The comparison accounts for the documented topology
  difference: Figma places Hero after an in-flow 72/64 px header, while the web
  header is fixed and Hero carries the equivalent offset in its top padding.
- Manual content review: exact supplied English compact copy preserved; Czech
  was reviewed for meaning and professional phrasing by the implementation team.
- Result: compact Hero copy selection, containment, typography, wrapping, and
  node-backed vertical-size parity are green on the targeted Chromium contract.
- Residual risk: the raw browser Hero box includes the intentional fixed-header
  offset described above; comparisons must continue to normalize it. The 320 px
  headline differs from the integer Figma frame by 1.25 px because its 36 px ×
  112% line height produces fractional CSS pixels. Czech has no canonical Figma
  text frame and therefore targets semantic fidelity and containment rather
  than matching English element height.

### Lifecycle

- Supersedes: none; desktop strings remain active at wide viewports.
- Reverted by: none
- Related entries: `COPY-20260729-001`
- Notes: append a new entry rather than rewriting this record if any factual
  claim or breakpoint-specific presentation changes.

## COPY-20260729-003 — Add compact Flagship summary and restore system-map presentation

- Status: implemented
- Change type: responsive-variant and presentation-format
- Surface: visitor-visible
- Proposed date: 2026-07-29
- Implemented date: 2026-07-29
- Owner: Karel Kutchan
- Author: Codeguy portfolio implementation team
- Reviewer: Codex controller and independent Flagship parity review
- Pull request: Pending
- Commit: Planned as `fix(home): rebuild Flagship case composition`
- Routes and locales: `/` and `/cs`; compact summary below 1024 CSS pixels;
  desktop system-map presentation from 1024 CSS pixels
- Source boundary: Figma-reference, next-intl, owner-approved-brief
- Message keys or public CMS fields: `home.flagship.summaryCompact`,
  `home.flagship.systemMap.sharedComponents.label`
- Rendering location:
  `src/app/[locale]/(frontend)/(pages)/(home)/blocks/flagship-case/index.tsx`
- Figma file and nodes: `cs38WzlXKY9xfDYBinoKel`; desktop `6:21`, tablet
  `7:391`, mobile `8:101`, 320 px `8:154`, 430 px `8:207`, dark desktop
  `8:265`
- Original source: existing approved desktop catalog summary remains the
  factual source; the compact English summary and system-map presentation are
  supplied by the approved Figma nodes; Czech is a natural professional
  localization authored by the implementation team
- Original purpose: summarize frontend leadership across architecture,
  components, delivery quality and accessibility, then show the relationship
  between product UI, shared components and engineering foundations
- Audience and user intent: prospective employers, collaborators and clients
  scanning the flagship case on Home before deciding whether to open the full
  case study

### Original (verbatim)

The desktop summaries remain active and unchanged.

#### English

```text
Frontend leadership for a customer-facing energy product: architecture, component foundations, delivery quality and accessibility across a growing application.
```

#### Czech

```text
Vedení frontend vývoje zákaznického produktu pro energetiku: architektura, komponentové základy, kvalita dodávky a přístupnost v rostoucí aplikaci.
```

The existing system-map shared-component labels used uppercase presentation in
the catalog:

```text
SHARED COMPONENTS
SDÍLENÉ KOMPONENTY
```

### Replacement (verbatim)

The original summary strings remain the desktop presentation. The following
responsive variants are added for compact layouts.

#### English

```text
Frontend leadership for a customer-facing product and the component foundations beneath it.
```

#### Czech

```text
Vedení frontendového vývoje produktu pro zákazníky a komponentových základů, na kterých stojí.
```

The system-map label keeps the same fact but moves casing into its intended
sentence-style visual presentation and adds decorative bidirectional arrows in
the component:

```text
Shared components
Sdílené komponenty
```

### Rationale

- Problem being solved: the desktop paragraph, technology stack and two neutral
  cards remained visible or structurally dominant at compact widths and did not
  match the approved Flagship frames. The previous `aria-hidden` map also hid
  unique relationship details from assistive technology.
- Why this wording was selected: the English compact sentence is exact Figma
  copy. The Czech sentence preserves frontend leadership, the customer-facing
  product context and the component-foundation relationship without adding a
  client, metric, technology or delivery claim.
- Alternatives rejected: truncation would hide meaning; client-side viewport
  branching would make server rendering fragile; replacing the desktop summary
  would remove approved detail; leaving the map `aria-hidden` would keep unique
  content unavailable to screen-reader users.
- Meaning intentionally preserved: frontend leadership, a customer-facing
  product and component foundations underneath it. Desktop continues to carry
  the energy, architecture, delivery-quality, accessibility and growing-product
  details.
- Meaning intentionally changed: compact presentation omits the energy domain
  and the detailed responsibility list solely to match the shorter approved
  responsive design. System-map label casing changes presentation, not meaning.

### Fact And Claim Controls

- Claims affected: frontend leadership, customer-facing product work,
  component foundations and the detailed desktop responsibility areas.
- Evidence source and checked date: approved Figma nodes and existing
  owner-approved Home copy, checked 2026-07-29.
- Time-sensitive review: the leadership-positioning claim must be reconfirmed if
  the owner's role changes.
- NDA or client review: not applicable; no employer, client, product name,
  metric or confidential implementation is introduced.
- Owner approval: Karel Kutchan explicitly authorized implementation of the
  redesign parity plan on 2026-07-29; separate approval of the Czech phrasing is
  not recorded.

### Impact Review

- Internationalization: matching non-empty `summaryCompact` keys are added to
  both catalogs; locale-neutral stack facts and route identifiers stay outside
  the catalogs.
- Accessibility: CSS exposes one complete summary at a time. The visible
  desktop system map becomes semantic list content; decorative arrows are
  hidden from assistive technology.
- Responsive layout: desktop summary remains active with stack and map; compact
  layouts use the shorter summary and hide stack and map.
- SEO and metadata: both semantically equivalent responsive summaries are in
  server-rendered HTML, with one hidden by CSS; no metadata, canonical,
  hreflang, Open Graph, robots, structured-data or sitemap change.
- CMS or data boundary: static portfolio presentation copy remains in next-intl;
  no Payload field, schema or migration changes.
- Privacy and confidentiality: only existing public professional positioning is
  restated.

### Verification

- Automated tests: the focused Flagship Chromium contract passed 11/11; nearby
  Home CTA and section-tone regressions passed 19/19; catalog parity/non-empty
  validation passed 3/3; TypeScript and targeted Biome checks passed.
- Routes and locales: verified English `/` and Czech `/cs`, including correct
  document language, locale-specific compact copy and localized case-study
  destinations.
- Themes, viewports and interaction states: verified the exact desktop geometry,
  typography, semantic map and light/dark tokens at 1440 CSS pixels; verified
  compact type, copy, visibility, focus, containment and visible-descendant
  overflow at 768, 430, 390 and 320 CSS pixels in both locales.
- Manual content review: exact English Figma compact copy preserved; Czech was
  reviewed for semantic fidelity and professional phrasing by the
  implementation team.
- Result: implementation is green on the focused browser, catalog, type,
  formatting and nearby CTA/tone regression checks described above.
- Residual risk: Czech has no canonical Figma text frame and therefore targets
  semantic fidelity and containment rather than exact English line count.

### Lifecycle

- Supersedes: none; desktop strings remain active at wide viewports.
- Reverted by: none
- Related entries: `COPY-20260729-002`
- Notes: append a new entry rather than rewriting this record if any factual
  claim, compact wording or breakpoint-specific presentation changes.

## COPY-20260729-004 — Restore Selected Work hierarchy and compact Home summaries

- Status: implemented
- Change type: hierarchy-restoration and responsive-variant
- Surface: visitor-visible
- Proposed date: 2026-07-29
- Implemented date: 2026-07-29
- Owner: Karel Kutchan
- Author: Codeguy portfolio implementation team
- Reviewer: Codex controller and independent Selected Work parity review
- Pull request: Pending
- Commit: Planned as `fix(home): restore Selected Work responsive composition`
- Routes and locales: `/` and `/cs`; compact summaries below 1024 CSS pixels
- Source boundary: Figma-reference, next-intl, owner-approved-brief
- Message keys or public CMS fields: `home.selectedWork.eyebrow`,
  `home.selectedWork.title`,
  `home.selectedWork.cards.<key>.summaryCompact`
- Rendering location:
  `src/app/[locale]/(frontend)/(pages)/(home)/blocks/selected-work/index.tsx`
- Figma file and nodes: `cs38WzlXKY9xfDYBinoKel`; desktop `6:35`, tablet
  `7:397`, mobile `8:107`, 320 px `8:160`, 430 px `8:213`, dark desktop
  `8:279`, dark mobile `8:345`; compact cards `44:314`, `44:323`, `44:332`
- Original source: existing catalog copy remains the factual source for the
  shared Work cards; the section hierarchy and compact English summaries are
  supplied by the approved Figma nodes; Czech compact variants are natural
  professional localizations authored by the implementation team
- Original purpose: identify the selected-work section and summarize each case
  study consistently on Home and the full Work index
- Audience and user intent: prospective employers, collaborators and clients
  scanning representative work before opening an available case study

### Original (verbatim)

The former Home section headings are retained as eyebrow labels:

```text
Selected work
Vybrané projekty
```

The shared Work-card summaries remain active on `/work`, `/cs/work` and the
wide Home presentation.

#### English

```text
Reusable frontend architecture for enterprise maintenance workflows.
Frontend foundations for a complex distributed-energy product.
Practical accessibility improvements inside an established product.
```

#### Czech

```text
Znovupoužitelná frontendová architektura pro podnikové procesy údržby.
Frontendové základy komplexního produktu pro distribuovanou energetiku.
Praktická zlepšení přístupnosti v zavedeném produktu.
```

### Replacement (verbatim)

The original Home labels move to the eyebrow role and gain the approved
headline hierarchy.

#### English

```text
SELECTED WORK
Complex products. Clear frontend decisions.
```

#### Czech

```text
VYBRANÉ PROJEKTY
Komplexní produkty. Jasná frontendová rozhodnutí.
```

The original shared summaries remain unchanged. Home adds these compact
presentation alternatives below 1024 CSS pixels.

#### English compact summaries

```text
Reusable architecture for specialist workflows.
Frontend foundations for an evolving energy product.
Inclusive behavior inside an established product.
```

#### Czech compact summaries

```text
Znovupoužitelná architektura pro odborné pracovní postupy.
Frontendové základy pro vyvíjející se energetický produkt.
Přístupné chování v zavedeném produktu.
```

### Rationale

- Problem being solved: Home rendered the section label as its only heading,
  omitted the approved explanatory headline and reused wide card summaries at
  every viewport. At 320 CSS pixels the cards also kept the Standard density
  instead of the approved Compact, content-driven presentation.
- Why this wording was selected: the English hierarchy and compact summaries
  are exact Figma copy. Czech preserves the same project scope and professional
  tone without literal constructions that would sound unnatural.
- Alternatives rejected: overwriting `work.cards` would silently alter the
  full Work index; truncation would remove meaning; client-side viewport logic
  would make server rendering fragile; linking the pending accessibility card
  would claim a case-study route that does not exist.
- Meaning intentionally preserved: reusable architecture, specialist or
  enterprise workflows, frontend foundations for an energy product and
  accessibility work in an established product.
- Meaning intentionally changed: compact presentation omits detail solely to
  match the approved responsive design. It introduces no employer, client,
  product, metric, outcome or technology claim.

### Fact And Claim Controls

- Claims affected: professional experience across enterprise workflows, an
  energy product and accessibility improvement work.
- Evidence source and checked date: approved Figma nodes and existing
  owner-approved public portfolio copy, checked 2026-07-29.
- Time-sensitive review: review if the represented project set or availability
  of the pending accessibility case study changes.
- NDA or client review: not applicable; no employer, client, confidential
  product name, metric or implementation detail is introduced.
- Owner approval: Karel Kutchan explicitly authorized implementation of the
  redesign parity plan on 2026-07-29; separate approval of the Czech phrasing is
  not recorded.

### Impact Review

- Internationalization: matching, non-empty semantic keys are added to both
  catalogs; the original shared facts remain under `work.cards`.
- Accessibility: the eyebrow remains a paragraph, the explanatory headline is
  the section H2 and card titles remain H3. CSS exposes one complete summary at
  a time. The pending card remains static localized status text with no link.
- Responsive layout: Standard cards remain 284 px high with 24 px padding at
  1440, 768, 430 and 390 CSS pixels. Only the Home responsive density switches
  to 16 px padding and content-driven Compact height at 320 CSS pixels.
- SEO and metadata: no metadata, canonical, hreflang, Open Graph, robots,
  structured-data or sitemap change.
- CMS or data boundary: static Home presentation copy remains in next-intl; no
  Payload field, schema, migration or `src/content/work.ts` change.
- Privacy and confidentiality: only existing public professional positioning is
  restated.

### Verification

- Automated tests: the focused Selected Work Chromium contract passed 12/12;
  WorkCard action, hover, focus, forced-colors and unchanged Work-index
  regressions passed 14/14; WorkCard component and catalog parity/non-empty
  validation passed 8/8; TypeScript and targeted Biome checks passed.
- Routes and locales: verified English `/` and Czech `/cs`, plus unchanged
  default WorkCard behavior and localized destinations on `/work` and
  `/cs/work`.
- Themes, viewports and interaction states: verified light geometry, type,
  responsive copy, pending semantics and containment at 1440, 768, 430, 390
  and 320 CSS pixels; verified dark semantic card tokens at 1440 and 390 CSS
  pixels; verified link hover, keyboard focus and forced-colors focus.
- Manual content review: English is exact Figma copy; Czech was reviewed for
  semantic fidelity and professional phrasing by the implementation team.
- Result: the implementation is green on the focused browser, component,
  catalog, type, formatting and diff checks described above.
- Residual risk: Czech has no canonical Figma text frame and therefore targets
  semantic fidelity and containment rather than exact English line count.

### Lifecycle

- Supersedes: none; shared Work-page strings remain active and unchanged.
- Reverted by: none
- Related entries: `COPY-20260729-003`
- Notes: append a new entry rather than rewriting this record if the pending
  case-study status, compact wording or breakpoint-specific presentation
  changes.

## COPY-20260729-005 — Add compact Home Principles descriptions

- Status: implemented
- Change type: responsive-variant
- Surface: visitor-visible
- Proposed date: 2026-07-29
- Implemented date: 2026-07-29
- Owner: Karel Kutchan
- Author: Codeguy portfolio implementation team
- Reviewer: Codex controller and independent Principles parity review
- Pull request: Pending
- Commit: Planned as `fix(home): align Principles responsive contract`
- Routes and locales: `/` and `/cs`; compact descriptions below 1024 CSS pixels
- Source boundary: Figma-reference, next-intl, owner-approved-brief
- Message keys or public CMS fields:
  `home.principles.items.<key>.descriptionCompact`
- Rendering location:
  `src/app/[locale]/(frontend)/(pages)/(home)/blocks/principles/index.tsx`
- Figma file and nodes: `cs38WzlXKY9xfDYBinoKel`; desktop `6:54`, tablet
  `7:415`, mobile `8:125`, 320 px `8:178`, 430 px `8:231`, dark desktop
  `8:298`, dark mobile `8:363`
- Original source: existing owner-approved desktop catalog descriptions remain
  the factual source; compact English descriptions are exact approved Figma
  copy; Czech compact variants are natural professional localizations authored
  by the implementation team
- Original purpose: summarize how architecture, accessibility, delivery
  quality and leadership reduce risk and help teams make reliable decisions
- Audience and user intent: prospective employers, collaborators and clients
  scanning the engineering principles on a compact Home viewport

### Original (verbatim)

The following descriptions remain unchanged in the desktop presentation.

#### English

```text
Choose boundaries and patterns that reduce product risk.
Build inclusive behavior into components and reviews.
Use tests, tooling and feedback where they protect change.
Make trade-offs visible and help teams move with confidence.
```

#### Czech

```text
Volím hranice a vzory, které snižují produktová rizika.
Přístupné chování začleňuji přímo do komponent a revizí.
Testy, nástroje a zpětnou vazbu používám tam, kde chrání změnu.
Zviditelňuji kompromisy a pomáhám týmům postupovat s jistotou.
```

### Replacement (verbatim)

The original strings remain the wide-screen presentation. The following
responsive variants are added below 1024 CSS pixels.

#### English compact descriptions

```text
Reduce product risk.
Build inclusion into components.
Protect the changes that matter.
Make trade-offs visible.
```

#### Czech compact descriptions

```text
Snižuji produktová rizika.
Přístupnost začleňuji do komponent.
Chráním změny, na kterých záleží.
Zviditelňuji kompromisy.
```

### Rationale

- Problem being solved: the desktop descriptions made the compact Principles
  section denser than approved Figma nodes `7:415`, `8:125`, `8:178` and
  `8:231`, while the existing Home typography did not reproduce the approved
  48/32 px heading and 20/19 px item hierarchy.
- Why this wording was selected: English is exact Figma copy. Czech keeps the
  same first-person professional voice as the existing desktop catalog and
  preserves each principle's central meaning without mechanical translation.
- Alternatives rejected: overwriting the desktop strings would discard useful
  explanation; truncation would hide meaning from assistive technology;
  client-side viewport branching would make server rendering fragile; forcing
  viewport-unit width through the stable scrollbar gutter would reduce the
  genuinely visible right gutter and mask an overflow risk.
- Meaning intentionally preserved: reducing product risk, component-level
  accessibility, protecting important changes and making trade-offs visible.
- Meaning intentionally changed: compact presentation omits implementation
  detail about boundaries, reviews, tooling, feedback and team confidence only
  to match the approved responsive information density.

### Fact And Claim Controls

- Claims affected: engineering methods around architecture, accessibility,
  testing, feedback and leadership clarity.
- Evidence source and checked date: approved Figma nodes and existing
  owner-approved public portfolio copy, checked 2026-07-29.
- Time-sensitive review: review if these statements no longer represent the
  owner's current working practices.
- NDA or client review: not applicable; no employer, client, confidential
  product, metric or implementation detail is introduced.
- Owner approval: Karel Kutchan explicitly authorized implementation of the
  redesign parity plan on 2026-07-29; separate approval of the Czech phrasing is
  not recorded.

### Impact Review

- Internationalization: matching, non-empty semantic keys are added to both
  catalogs; all desktop descriptions remain unchanged.
- Accessibility: every item remains an H3 followed by one semantic paragraph;
  CSS exposes one complete description variant at a time without truncation or
  client viewport logic. The light-desktop Figma binding `#0a6e80` on
  `#08090c` measures only 3.37:1 for the 12 px eyebrow, so the implementation
  intentionally retains `--accent-on-contrast: #22d3ee`, measured at 11.02:1
  in light mode and 9.66:1 in dark mode.
- Responsive layout: exact Figma typography, padding, rhythm and layout are
  measured at 1440, 768, 430, 390 and 320 CSS pixels. The global
  `scrollbar-gutter: stable` can reserve 15 px on Windows Chromium. At 390 and
  320 this safely narrows the content and may add a natural text line; the
  implementation preserves symmetric visible gutters and permits content-led
  section growth instead of extending text beneath the scrollbar.
- SEO and metadata: no title, description, canonical, hreflang, Open Graph,
  robots, structured-data or sitemap change.
- CMS or data boundary: static Home presentation copy remains in next-intl; no
  Payload field, schema or migration change.
- Privacy and confidentiality: only existing public engineering principles are
  restated.

### Verification

- Automated tests: the focused Principles Chromium contract passed 9/9;
  catalog parity and non-empty validation passed 3/3; TypeScript and targeted
  Biome validation passed.
- Routes and locales: verified English `/` and Czech `/cs`, including document
  language and the active full description variant at every target width.
- Themes, viewports and interaction states: verified light geometry, type,
  description switching, heading hierarchy, symmetric visible gutters and
  descendant overflow at 1440, 768, 430, 390 and 320 CSS pixels. Verified the
  semantic contrast palette and WCAG text contrast at 1440 and 390 CSS pixels
  in both light and dark modes.
- Manual content review: English is exact Figma copy; Czech was reviewed for
  semantic fidelity and professional phrasing by the implementation team.
- Result: Principles is green on the focused browser, catalog, type,
  formatting and diff validation described above.
- Residual risk: Czech has no canonical Figma text frame and therefore targets
  semantic fidelity and containment rather than exact English height. The
  stable-scrollbar topology can make the safe 390/320 layout taller than the
  scrollbar-free Figma frame; changing that global policy belongs to a
  separate cross-page decision.

### Lifecycle

- Supersedes: none; desktop strings remain active and unchanged.
- Reverted by: none
- Related entries: `COPY-20260729-004`
- Notes: append a new entry rather than rewriting this record if any principle,
  compact wording, breakpoint or scrollbar policy changes.

## COPY-20261106-001 — Reposition the role label from frontend to software engineering

- Status: implemented
- Change type: replace
- Surface: visitor-visible
- Proposed date: 2026-11-06
- Implemented date: 2026-11-06
- Owner: Karel Kutchan
- Author: Codeguy portfolio implementation team
- Reviewer: Karel Kutchan (owner decision, direction 3: "brand engineer")
- Pull request: Pending
- Commit: Planned as `feat(brand): reposition the site from frontend to software engineering`
- Routes and locales: every route in `/` and `/cs` (eyebrow, mobile menu, footer), the 503 error screen, the web app manifest
- Source boundary: owner-approved-brief, next-intl
- Message keys or public CMS fields: `home.hero.eyebrow`, `navigation.mobileMenu.profile.role`, `footer.role`; plus `src/app/manifest.json` (`name`) and `errors/503.html` footer
- Rendering location: `(home)/blocks/hero/index.tsx`, `components/ui/navigation`, `src/components/site/SiteFooter`, `errors/503.html`
- Figma file and node: `cs38WzlXKY9xfDYBinoKel`, `Hero` component set `286:3362` (still carries the previous role text; reconciliation pending)
- Original source: BD-04 positioning (2026-07-29), COPY-20260729-001 (mobile menu role)
- Original purpose: name the role beside the identity so a visitor knows whose site it is and what he does
- Audience and user intent: recruiters and hiring managers deciding in seconds whether the profile matches the role they staff

### Original (verbatim)

#### English

```text
<identity>{name}</identity> / SENIOR FRONTEND ENGINEER / PRAGUE
Senior / Lead Frontend Engineer
Senior Frontend Engineer · Prague
Karel Kutchan — Senior Frontend Engineer
Karel Kutchan · Senior Frontend Engineer · Praha
```

#### Czech

```text
<identity>{name}</identity> / SENIOR FRONTEND VÝVOJÁŘ / PRAHA
Seniorní frontend vývojář / vedoucí frontendu
Senior Frontend Engineer · Praha
```

### Replacement (verbatim)

#### English

```text
<identity>{name}</identity> / SENIOR SOFTWARE ENGINEER / PRAGUE
Senior Software Engineer
Senior Software Engineer · Prague
Karel Kutchan — Senior Software Engineer
Karel Kutchan · Senior Software Engineer · Praha
```

#### Czech

```text
<identity>{name}</identity> / SENIOR SOFTWARE ENGINEER / PRAHA
Senior Software Engineer
Senior Software Engineer · Praha
```

### Rationale

- Problem being solved: the lead frontend engagement ended in April 2026 and the verified record now spans full-stack delivery and requirements work; "frontend" understated it and "Lead" in the mobile menu claimed a role no longer held.
- Why this wording was selected: "Senior Software Engineer" is accurate, verifiable, and 24 characters in the eyebrow, the same as before, so the eyebrow keeps its line count at every width (HP-01). The mobile menu drops "Lead" and matches the footer.
- Alternatives rejected: "Software Engineer" (understates seniority against the roles sought); "Software Engineer & Architect" (exceeds the verified record, BD-08).
- Meaning intentionally preserved: identity, city, seniority.
- Meaning intentionally changed: discipline widened from frontend to software engineering; no present-tense leadership claim.

### Fact And Claim Controls

- Claims affected: role label and seniority.
- Evidence source and checked date: `src/content/curriculum-vitae.ts` and the CV catalogs, 2026-11-06.
- Time-sensitive review: reconfirm with the next role change.
- NDA or client review: none; no client is named.
- Owner approval: Karel Kutchan, 2026-11-06 (plan approval).

### Impact Review

- Internationalization: the Czech role label uses the English title, as the footer already did; `i18n-messages.test.ts` key parity holds.
- Accessibility: no change to accessible names beyond the text itself.
- Responsive layout: eyebrow length unchanged (24 characters); `eyebrowLines` constants untouched.
- SEO and metadata: handled in COPY-20261106-008.
- CMS or data boundary: none.
- Privacy and confidentiality: none.

### Verification

- Automated tests: `approved-copy.test.ts`, `navigation.test.tsx`, `site-footer.test.tsx`; Playwright `launch.spec.ts`, `navigation-geometry.spec.ts`, `home-hero-anchoring.spec.ts`.
- Routes and locales: `/`, `/cs`, mobile menu, footer, 503 screen.
- Themes, viewports, and interaction states: eyebrow at 1440/768/430/390/320 in the pinned run.
- Manual content review: owner read-through of the plan table.
- Result: Vitest green; pinned Playwright run of 2026-11-06 green (53/53 across `home-hero-anchoring`, `home-integrated-parity`, `home-experience-anchoring`, `home-final-cta-anchoring`); `eyebrowLines` unchanged at every width.
- Residual risk: the Figma `Hero` component lags the shipped text until reconciled.

### Lifecycle

- Supersedes: COPY-20260729-001 (mobile menu role).
- Reverted by: none.
- Related entries: COPY-20261106-002 to -009.
- Notes: measured hero numbers are in COPY-20261106-003.

## COPY-20261106-002 — Change one word of the brand headline

- Status: implemented
- Change type: replace
- Surface: visitor-visible
- Proposed date: 2026-11-06
- Implemented date: 2026-11-06
- Owner: Karel Kutchan
- Author: Codeguy portfolio implementation team
- Reviewer: Karel Kutchan
- Pull request: Pending
- Commit: Planned as `feat(brand): reposition the site from frontend to software engineering`
- Routes and locales: `/`, `/cs`
- Source boundary: owner-approved-brief, next-intl
- Message keys or public CMS fields: `home.hero.headline`
- Rendering location: `(home)/blocks/hero/index.tsx` (`h1`)
- Figma file and node: `Hero` component set `286:3362` (reconciliation pending)
- Original source: BD-05 brand promise
- Original purpose: the brand promise, fixed in both languages
- Audience and user intent: every visitor; the one sentence the site is remembered by

### Original (verbatim)

#### English

```text
I build frontend systems for products that have to last.
```

#### Czech

```text
Stavím frontendové systémy pro produkty, které musí vydržet.
```

### Replacement (verbatim)

#### English

```text
I build software systems for products that have to last.
```

#### Czech

```text
Stavím softwarové systémy pro produkty, které musí vydržet.
```

### Rationale

- Problem being solved: the promise named frontend only; BD-29 widens the positioning.
- Why this wording was selected: one word changes, the promise stays recognizable and the same length (57 English characters), so the two-line headline at 1440 and 768 px holds.
- Alternatives rejected: a new headline (would discard a line that tests well against the offer).
- Meaning intentionally preserved: durability as the promise.
- Meaning intentionally changed: scope of "systems".

### Fact And Claim Controls

- Claims affected: none beyond scope of work.
- Evidence source and checked date: BD-29, 2026-11-06.
- Time-sensitive review: none.
- NDA or client review: none.
- Owner approval: Karel Kutchan, 2026-11-06.

### Impact Review

- Internationalization: Czech keeps natural word order.
- Accessibility: `h1` name changes accordingly; asserted in `home-accessibility.spec.ts` and `i18n-routing.spec.ts`.
- Responsive layout: `headlineHeight` constants (two lines at 1440/768, four below) are kept, not re-measured; a third line would mean the copy, not the constant, is wrong.
- SEO and metadata: none directly.
- CMS or data boundary: none.
- Privacy and confidentiality: none.

### Verification

- Automated tests: `approved-copy.test.ts`; Playwright `home-hero-anchoring` (`headlineHeight`), `home-accessibility`, `i18n-routing`.
- Routes and locales: `/`, `/cs`.
- Themes, viewports, and interaction states: 1440/768/430/390/320, light and dark.
- Manual content review: owner.
- Result: pinned run of 2026-11-06: two lines at 1440 and 768 px and four lines at 430 and 390 px as before; at 320 px the headline takes five 36 px lines (201.6 px) instead of four (160 px), because "I build software" no longer fits the first line of the 280 px column.
- Residual risk: the 320 px Figma frame `8:140` shows four lines; recorded as a reconciliation item in HP-01.

### Lifecycle

- Supersedes: none (BD-05 is superseded in the brand log).
- Reverted by: none.
- Related entries: COPY-20261106-001, -003.
- Notes: `docs/brand/brand-guidelines.md` §2.2 updated in the same change.

## COPY-20261106-003 — Rewrite the hero paragraphs for the widened positioning

- Status: implemented
- Change type: replace
- Surface: visitor-visible
- Proposed date: 2026-11-06
- Implemented date: 2026-11-06
- Owner: Karel Kutchan
- Author: Codeguy portfolio implementation team
- Reviewer: Karel Kutchan (wording conditions 1, 5, 6 of the plan review)
- Pull request: Pending
- Commit: Planned as `feat(brand): reposition the site from frontend to software engineering`
- Routes and locales: `/`, `/cs`; wide variant at and above 1024 px, compact variant below
- Source boundary: owner-approved-brief, next-intl
- Message keys or public CMS fields: `home.hero.paragraphs.experience`, `home.hero.paragraphs.quality`, `home.hero.paragraphsCompact.experience`, `home.hero.paragraphsCompact.quality`
- Rendering location: `(home)/blocks/hero/index.tsx`, variant chosen by CSS in `Hero.module.css`
- Figma file and node: `Hero` component set `286:3362` (reconciliation pending)
- Original source: BD-04 positioning, COPY-20260729-002 (compact variants)
- Original purpose: state experience and working stance under the headline
- Audience and user intent: recruiters and hiring managers reading the first screen

### Original (verbatim)

#### English

```text
More than ten years in web development, currently in a lead frontend role. I work with React, TypeScript and Next.js across customer portals, internal enterprise applications and the component libraries underneath them.
Architecture, accessibility and long-term maintainability are part of the delivery, not follow-up work.
More than ten years in web development, currently in a lead frontend role. I work with React, TypeScript and Next.js across customer portals, enterprise applications and component systems.
Architecture, accessibility and maintainability are part of the delivery.
```

#### Czech

```text
Webům se věnuji přes deset let a dnes působím jako vedoucí frontend vývoje. S Reactem, TypeScriptem a Next.js pracuji na zákaznických portálech, interních podnikových aplikacích i komponentových knihovnách, na kterých stojí.
Architektura, přístupnost a dlouhodobá udržitelnost jsou součástí dodávky, ne práce odložená na později.
Webům se věnuji přes deset let a nyní působím ve vedoucí frontendové roli. S Reactem, TypeScriptem a Next.js pracuji na zákaznických portálech, podnikových aplikacích a komponentových systémech.
Architektura, přístupnost a udržovatelnost jsou součástí dodávky.
```

### Replacement (verbatim)

#### English

```text
More than ten years in web development, in recent years owning frontend architecture and leading a team. I work with React, TypeScript and Next.js, design data models and APIs, and take solutions from analysis with the client through to production.
Architecture, accessibility, maintainability and working with AI are part of the delivery, not follow-up work.
More than ten years in web development, lately owning frontend architecture and leading a team. React, TypeScript and Next.js, data models and APIs, from analysis to production.
Architecture, accessibility, maintainability and AI are part of the delivery.
```

#### Czech

```text
Webům se věnuji přes deset let, poslední roky s odpovědností za frontendovou architekturu a vedení týmu. Pracuji s Reactem, TypeScriptem a Next.js, navrhuji datové modely i API a řešení dotahuji od analýzy se zadavatelem po nasazení.
Architektura, přístupnost, udržitelnost a práce s AI jsou součástí dodávky, ne práce odložená na později.
Webům se věnuji přes deset let, poslední roky s odpovědností za frontendovou architekturu a vedení týmu. React, TypeScript a Next.js, datové modely i API, od analýzy po nasazení.
Architektura, přístupnost, udržitelnost a práce s AI jsou součástí dodávky.
```

### Rationale

- Problem being solved: "currently in a lead frontend role" / "dnes působím jako vedoucí frontend vývoje" was untrue after April 2026; the paragraph also said nothing about data models, APIs, analysis or AI.
- Why this wording was selected: the lead period is stated in the past ("in recent years owning", „poslední roky s odpovědností"), the stack stays named, and the added scope is the verified one. The AI clause has no time anchor ("dnes i" was rejected because it would tie the sentence to a state again). The compact quality line is 76 English characters to keep one line at 768 px.
- Alternatives rejected: present-tense "vedu" in the Czech compact variant (false); "today, working with AI" (time-bound).
- Meaning intentionally preserved: ten years, React/TypeScript/Next.js, delivery stance.
- Meaning intentionally changed: leadership in the past tense; data models, APIs, analysis with clients and AI added.

### Fact And Claim Controls

- Claims affected: lead role (2025-03 to 2026-04), data-model and API design (Seeder, Moje MND), analysis with clients, AI-assisted delivery introduced at BlueGhost.
- Evidence source and checked date: `src/content/curriculum-vitae.ts`, CV catalogs and the owner's account of the BlueGhost AI work, 2026-11-06.
- Time-sensitive review: "in recent years" ages; review in 2027.
- NDA or client review: no client is named in the hero.
- Owner approval: Karel Kutchan, 2026-11-06.

### Impact Review

- Internationalization: Czech written as professional Czech, not a calque.
- Accessibility: paragraph text only.
- Responsive layout: the wide `experience` paragraph grows from 215 to 250 characters and the wide `quality` from 103 to 112; the pinned run decides whether the hero gains a line at 1440 (26.1 px per line) or below 1024 (24.65 px per line). Constants in `home-hero-anchoring.spec.ts` and `home-integrated-parity.spec.ts` are updated from that run only.
- SEO and metadata: none.
- CMS or data boundary: none.
- Privacy and confidentiality: none.

### Verification

- Automated tests: `approved-copy.test.ts`, `home-hero.test.tsx`; Playwright `home-hero-anchoring`, `home-integrated-parity`, `home-cta-parity`.
- Routes and locales: `/`, `/cs`.
- Themes, viewports, and interaction states: 1440/768/430/390/320, light and dark; Czech compact variant checked for overflow at 320.
- Manual content review: owner.
- Result: Vitest green. Pinned measurement of 2026-11-06 (Chromium, `mcr.microsoft.com/playwright:v1.62.0-noble`): hero height unchanged at 1440 (785), 768 (648), 430 (839) and 390 (863) px, so the longer paragraphs did not add a line at any of these widths; `availabilityLines` 1/2/2/3/3 unchanged. At 320 px the hero is 922.32 px (was 882): the extra 40.32 px is one 36 px headline line (COPY-20261106-002), not paragraph growth. Integrated geometry at 320 moves by the same 40.32 px (hero 986.32, main 3892.32); all other widths unchanged.
- Residual risk: machine-dependent wrapping at 390 px (see `docs/audits/2026-07-29-redesign-parity.md`).

### Lifecycle

- Supersedes: COPY-20260729-002.
- Reverted by: none.
- Related entries: COPY-20261106-001, -002, -004.
- Notes: constants updated in `home-hero-anchoring.spec.ts` and `home-integrated-parity.spec.ts` (320 px only), with the derivation comments extended.

## COPY-20261106-004 — Widen the availability line and move analysis to the contact intro

- Status: implemented
- Change type: replace
- Surface: visitor-visible
- Proposed date: 2026-11-06
- Implemented date: 2026-11-06
- Owner: Karel Kutchan
- Author: Codeguy portfolio implementation team
- Reviewer: Karel Kutchan (condition 3 of the plan review)
- Pull request: Pending
- Commit: Planned as `feat(brand): reposition the site from frontend to software engineering`
- Routes and locales: `/`, `/cs`, `/contact`, `/cs/contact`
- Source boundary: owner-approved-brief, next-intl
- Message keys or public CMS fields: `home.hero.availability`, `contact.hero.availability`, `contact.hero.intro`, `contact.metadata.description`
- Rendering location: `(home)/blocks/hero/index.tsx`, `contact/page.tsx` via `PageIntro`
- Figma file and node: `Hero` component set `286:3362`; Contact hero frame (reconciliation pending)
- Original source: HP-03 (locked 2026-09-13)
- Original purpose: answer "is he available, for what, and where" in one line
- Audience and user intent: recruiters qualifying the profile

### Original (verbatim)

#### English

```text
Open to senior and lead frontend roles in Prague or remote (EU), employee or contract.
I am primarily looking for the right senior or lead frontend role. Selected consulting conversations are welcome when the fit is specific.
Contact Karel Kutchan about senior or lead frontend roles and selected consulting conversations.
```

#### Czech

```text
Otevřený seniorním a lead frontend rolím v Praze nebo remote (EU), zaměstnanecky i na kontrakt.
Hledám především správnou seniorní nebo vedoucí frontendovou roli. Rád proberu i vybrané možnosti konzultací, pokud si konkrétně sedneme.
Kontaktujte Karla Kutchana ohledně seniorních či vedoucích frontendových rolí a vybraných konzultací.
```

### Replacement (verbatim)

#### English

```text
Open to senior and lead engineering roles in Prague or remote (EU), employee or contract.
I am primarily looking for the right senior or lead role in engineering, architecture or analysis. Selected consulting conversations are welcome when the fit is specific.
Contact Karel Kutchan about senior or lead engineering roles and selected consulting conversations.
```

#### Czech

```text
Otevřený seniorním a lead inženýrským rolím v Praze nebo remote (EU), zaměstnanecky i na kontrakt.
Hledám především správnou seniorní nebo vedoucí roli ve vývoji, architektuře nebo analýze. Rád proberu i vybrané možnosti konzultací, pokud si konkrétně sedneme.
Kontaktujte Karla Kutchana ohledně seniorních či vedoucích inženýrských rolí a vybraných konzultací.
```

### Rationale

- Problem being solved: the line limited openness to frontend roles.
- Why this wording was selected: one word changes and the English line stays at 88 characters, inside the ≤ 92 budget derived from the 86-character line measured as one line at 1440 px; HP-03's one-line contract holds. Architecture and analysis are named in the contact intro, which no spec measures.
- Alternatives rejected: naming engineering, architecture and analysis in the availability line (118 characters, two lines at 1440, three at 430, four at 320).
- Meaning intentionally preserved: Prague or remote EU, employee or contract.
- Meaning intentionally changed: discipline widened.

### Fact And Claim Controls

- Claims affected: availability.
- Evidence source and checked date: owner statement, 2026-11-06.
- Time-sensitive review: reconfirm on any role or location change (HP-03).
- NDA or client review: none.
- Owner approval: Karel Kutchan, 2026-11-06.

### Impact Review

- Internationalization: both copies kept identical per locale (`approved-copy.test.ts`, `home-hero.test.tsx`).
- Accessibility: none.
- Responsive layout: `availabilityLines` 1/2/2/3/3 kept; confirmed by the pinned run. `/contact` renders the line in `PageIntro` (720 px, body-lg), not measured.
- SEO and metadata: contact description updated here.
- CMS or data boundary: none.
- Privacy and confidentiality: none.

### Verification

- Automated tests: `approved-copy.test.ts` (HP-03 identity check), `home-hero.test.tsx`; Playwright `home-hero-anchoring` (`availabilityLines`), `home-cta-parity`.
- Routes and locales: `/`, `/cs`, `/contact`, `/cs/contact`.
- Themes, viewports, and interaction states: 1440/768/430/390/320.
- Manual content review: owner.
- Result: Vitest green; pinned run of 2026-11-06 confirms one line at 1440 px and 2/2/3/3 lines below.
- Residual risk: none.

### Lifecycle

- Supersedes: none (HP-03 wording of 2026-09-13 has no ledger entry; amended in `docs/decisions/homepage.md`).
- Reverted by: none.
- Related entries: COPY-20261106-003.
- Notes: none.

## COPY-20261106-005 — Rewrite the About intro

- Status: implemented
- Change type: replace
- Surface: visitor-visible
- Proposed date: 2026-11-06
- Implemented date: 2026-11-06
- Owner: Karel Kutchan
- Author: Codeguy portfolio implementation team
- Reviewer: Karel Kutchan (AI paragraph supplied by the owner)
- Pull request: Pending
- Commit: Planned as `feat(brand): reposition the site from frontend to software engineering`
- Routes and locales: `/about`, `/cs/about`
- Source boundary: owner-approved-brief, next-intl
- Message keys or public CMS fields: `about.hero.intro`, `about.metadata.description`
- Rendering location: `about/page.tsx` via `PageIntro`
- Figma file and node: About hero frame (reconciliation pending)
- Original source: BD-04 positioning
- Original purpose: introduce the person behind the site
- Audience and user intent: visitors who want to know who they would work with

### Original (verbatim)

#### English

```text
I am a Prague-based senior frontend engineer with more than ten years in web development. I currently work in a lead frontend role, helping teams turn product requirements into maintainable systems.
About Karel Kutchan, a Prague-based senior frontend engineer focused on product delivery, architecture and team clarity.
```

#### Czech

```text
Jsem senior frontend vývojář z Prahy a webům se věnuji přes deset let. Dnes působím jako vedoucí frontend vývoje a pomáhám týmům převádět produktové požadavky do udržitelných systémů.
Karel Kutchan je senior frontend vývojář z Prahy zaměřený na dodávku produktů, architekturu a srozumitelnou spolupráci v týmu.
```

### Replacement (verbatim)

#### English

```text
I am a Prague-based software engineer with more than ten years in web development. I led frontend engineering for a product team and worked through requirements with backend, UX and project management. I introduced AI tooling to the team: agent rules, agentic CLI workflows, Figma-to-code and onboarding colleagues. The result is not less work, but more solutions delivered with fewer rounds of rework, always under code review.
About Karel Kutchan, a Prague-based senior software engineer focused on product delivery, architecture and team clarity.
```

#### Czech

```text
Jsem software engineer z Prahy a webům se věnuji přes deset let. Vedl jsem frontend vývoj produktového týmu a zadání jsem řešil s backendem, UX i projektovým vedením. Do týmu jsem zavedl práci s AI nástroji: pravidla pro agenty, agentní workflow v CLI, převod návrhu z Figmy do kódu a zaučení kolegů. Výsledkem není méně práce, ale víc doručených řešení s menším počtem vratek, vždy pod code review.
Karel Kutchan je senior software engineer z Prahy zaměřený na dodávku produktů, architekturu a srozumitelnou spolupráci v týmu.
```

### Rationale

- Problem being solved: present-tense lead claim; nothing about the AI work or the cross-functional requirements work.
- Why this wording was selected: the owner's own account, kept sober and under code review (BD-08: no metric is invented; "fewer rounds of rework" is the owner's observation, stated as such).
- Alternatives rejected: a shorter intro without the AI paragraph (would leave the most differentiating recent work unsaid).
- Meaning intentionally preserved: Prague, ten years, maintainable systems.
- Meaning intentionally changed: lead role in the past tense; AI tooling named; requirements work with backend, UX and project management named.

### Fact And Claim Controls

- Claims affected: led frontend engineering (BlueGhost, 2025-03 to 2026-04); AI tooling introduced (agent rules, CLI workflows, Figma-to-code, onboarding); outcome statement.
- Evidence source and checked date: owner statement relayed 2026-11-06; CV catalog `curriculumVitae.experience.entries.blueghost.descriptions.ai`.
- Time-sensitive review: 2027, or on the next role.
- NDA or client review: no client named.
- Owner approval: Karel Kutchan, 2026-11-06.

### Impact Review

- Internationalization: Czech authored natively.
- Accessibility: none.
- Responsive layout: not measured by any spec (`docs/audits/2026-09-11-page-hero-inventory.md`: no test asserts hero geometry on `/about`); `launch.spec.ts` checks horizontal overflow at 390 and 1440.
- SEO and metadata: about description updated here.
- CMS or data boundary: none.
- Privacy and confidentiality: none.

### Verification

- Automated tests: `i18n-messages.test.ts`; Playwright `launch.spec.ts`.
- Routes and locales: `/about`, `/cs/about`.
- Themes, viewports, and interaction states: manual at 1440, 768, 390, 320.
- Manual content review: owner.
- Result: Vitest green.
- Residual risk: intro is four sentences; `PageIntro` is a 720 px measure, acceptable.

### Lifecycle

- Supersedes: none.
- Reverted by: none.
- Related entries: COPY-20261106-001.
- Notes: none.

## COPY-20261106-006 — Reframe the Home Experience snapshot

- Status: implemented
- Change type: replace
- Surface: visitor-visible
- Proposed date: 2026-11-06
- Implemented date: 2026-11-06
- Owner: Karel Kutchan
- Author: Codeguy portfolio implementation team
- Reviewer: Karel Kutchan
- Pull request: Pending
- Commit: Planned as `feat(brand): reposition the site from frontend to software engineering`
- Routes and locales: `/`, `/cs`; section visible at and above 1024 px
- Source boundary: owner-approved-brief, next-intl
- Message keys or public CMS fields: `home.experience.title`, `home.experience.description`
- Rendering location: `(home)/blocks/experience-snapshot/index.tsx`
- Figma file and node: Home desktop frame `6:2`, Experience section (two-line description; reconciliation pending)
- Original source: Figma-reference copy of 2026-07
- Original purpose: summarise the career arc before the link to `/experience`
- Audience and user intent: desktop visitors scanning the home page

### Original (verbatim)

#### English

```text
From implementation to frontend leadership.
Web development since 2014. Today I lead frontend work across architecture, component systems, accessibility, testing and code review.
```

#### Czech

```text
Od implementace k vedení frontend vývoje.
Webovému vývoji se věnuji od roku 2014. Dnes vedu frontendovou práci v oblasti architektury, komponentových systémů, přístupnosti, testování a code review.
```

### Replacement (verbatim)

#### English

```text
From implementation to architecture and leadership.
Web development since 2014, from frontend implementation to architecture, team leadership and analysis with clients, from data model to interface.
```

#### Czech

```text
Od implementace k architektuře a vedení.
Webovému vývoji se věnuji od roku 2014, od frontendové implementace k architektuře, vedení týmu a analýze se zadavatelem, od datového modelu po rozhraní.
```

### Rationale

- Problem being solved: "Today I lead frontend work" was untrue after April 2026.
- Why this wording was selected: describes the path, not a current state; the English description is 146 characters, inside the ≤ 160 budget that keeps the two-line description and the section's 565 px height at 1440.
- Alternatives rejected: the longer "Today I work across the whole solution…" sentence (215 characters, three lines, 591.1 px).
- Meaning intentionally preserved: since 2014; architecture.
- Meaning intentionally changed: leadership as a stage reached, not a present role; analysis with clients and data model added.

### Fact And Claim Controls

- Claims affected: career arc.
- Evidence source and checked date: CV facts, 2026-11-06.
- Time-sensitive review: none.
- NDA or client review: none.
- Owner approval: Karel Kutchan, 2026-11-06.

### Impact Review

- Internationalization: Czech sentence authored natively.
- Accessibility: `h2` name changes; asserted in `home-accessibility.spec.ts`.
- Responsive layout: section hidden below 1024 px; 565 px at 1440 to be confirmed by the pinned run; if it moves, `home-experience-anchoring.spec.ts` and the Final CTA `top` in `home-integrated-parity.spec.ts` move with it.
- SEO and metadata: none.
- CMS or data boundary: none.
- Privacy and confidentiality: none.

### Verification

- Automated tests: Playwright `home-experience-anchoring`, `home-accessibility`, `home-integrated-parity`.
- Routes and locales: `/`, `/cs`.
- Themes, viewports, and interaction states: 1440 light and dark; 1023/1024 boundary.
- Manual content review: owner.
- Result: pinned run of 2026-11-06: section height 565 px unchanged (two-line title, two-line description).
- Residual risk: none.

### Lifecycle

- Supersedes: none.
- Reverted by: none.
- Related entries: COPY-20261106-003.
- Notes: none.

## COPY-20261106-007 — Widen the final call to action

- Status: implemented
- Change type: replace
- Surface: visitor-visible
- Proposed date: 2026-11-06
- Implemented date: 2026-11-06
- Owner: Karel Kutchan
- Author: Codeguy portfolio implementation team
- Reviewer: Karel Kutchan
- Pull request: Pending
- Commit: Planned as `feat(brand): reposition the site from frontend to software engineering`
- Routes and locales: `/`, `/cs`
- Source boundary: owner-approved-brief, next-intl
- Message keys or public CMS fields: `home.finalCta.heading`
- Rendering location: `(home)/blocks/final-cta`
- Figma file and node: Home frames, Final CTA section (reconciliation pending)
- Original source: Figma-reference copy of 2026-07
- Original purpose: the closing question before the contact action
- Audience and user intent: hiring managers at the end of the page

### Original (verbatim)

#### English

```text
Looking for a senior frontend engineer who can own the system behind the interface?
```

#### Czech

```text
Hledáte senior frontend vývojáře, který převezme odpovědnost za systém pod rozhraním?
```

### Replacement (verbatim)

#### English

```text
Looking for a senior engineer who can own the system behind the interface?
```

#### Czech

```text
Hledáte seniorního inženýra, který převezme odpovědnost za systém pod rozhraním?
```

### Rationale

- Problem being solved: the question limited the offer to frontend.
- Why this wording was selected: one noun phrase changes; the "system behind the interface" idea is kept.
- Alternatives rejected: naming architecture or analysis in the question (longer, changes the pinned heights for little gain).
- Meaning intentionally preserved: ownership of the system.
- Meaning intentionally changed: discipline widened.

### Fact And Claim Controls

- Claims affected: none.
- Evidence source and checked date: BD-29, 2026-11-06.
- Time-sensitive review: none.
- NDA or client review: none.
- Owner approval: Karel Kutchan, 2026-11-06.

### Impact Review

- Internationalization: none.
- Accessibility: `h2` name changes; asserted in `home-accessibility.spec.ts`.
- Responsive layout: `home-final-cta-anchoring.spec.ts` pins the section at 482/292/380/380; the shorter English heading (74 characters, was 83) may drop a line, which the pinned run decides.
- SEO and metadata: none.
- CMS or data boundary: none.
- Privacy and confidentiality: none.

### Verification

- Automated tests: Playwright `home-final-cta-anchoring`, `home-accessibility`, `home-integrated-parity`.
- Routes and locales: `/`, `/cs`.
- Themes, viewports, and interaction states: 1440/768/390/320.
- Manual content review: owner.
- Result: pinned run of 2026-11-06: section heights 482/292/380/380 unchanged; the shorter heading keeps its line count.
- Residual risk: none.

### Lifecycle

- Supersedes: none.
- Reverted by: none.
- Related entries: COPY-20261106-003.
- Notes: none.

## COPY-20261106-008 — Page metadata, manifest and Experience page intro

- Status: implemented
- Change type: metadata
- Surface: metadata
- Proposed date: 2026-11-06
- Implemented date: 2026-11-06
- Owner: Karel Kutchan
- Author: Codeguy portfolio implementation team
- Reviewer: Karel Kutchan
- Pull request: Pending
- Commit: Planned as `feat(brand): reposition the site from frontend to software engineering`
- Routes and locales: `/`, `/cs`, `/about`, `/cs/about`, `/experience`, `/cs/experience`, `/contact`, `/cs/contact`; web app manifest
- Source boundary: owner-approved-brief, next-intl
- Message keys or public CMS fields: `home.metadata.title`, `home.metadata.description`, `experience.metadata.description`, `experience.hero.intro`; `src/app/manifest.json` (`name`, `description`). About and contact descriptions are recorded in COPY-20261106-005 and -004.
- Rendering location: `src/i18n/metadata.ts` (`createLocalizedMetadata`), `experience/page.tsx`, `src/app/manifest.json`
- Figma file and node: None (metadata is not designed in Figma)
- Original source: BD-04 positioning
- Original purpose: search snippets and the installed-app name
- Audience and user intent: search engines and visitors arriving from results

### Original (verbatim)

#### English

```text
Karel Kutchan — Senior Frontend Engineer
Karel Kutchan is a senior frontend engineer based in Prague, building resilient frontend systems with React, TypeScript and Next.js.
More than ten years of frontend engineering across customer portals, enterprise applications, energy products and component systems.
Senior frontend engineering across customer portals, enterprise applications, energy products and component systems.
```

#### Czech

```text
Karel Kutchan — Senior frontend vývojář
Karel Kutchan je senior frontend vývojář z Prahy. V Reactu, TypeScriptu a Next.js staví odolné frontendové systémy.
Přes deset let frontendového vývoje zákaznických portálů, podnikových aplikací, energetických produktů a komponentových systémů.
Seniorní frontendový vývoj zákaznických portálů, podnikových aplikací, energetických produktů a komponentových systémů.
```

### Replacement (verbatim)

#### English

```text
Karel Kutchan — Senior Software Engineer
Karel Kutchan is a senior software engineer based in Prague, building resilient web systems with React, TypeScript and Next.js, from data model to interface.
More than ten years of software engineering across customer portals, enterprise applications, energy products and component systems.
Senior software engineering across customer portals, enterprise applications, energy products and component systems.
```

#### Czech

```text
Karel Kutchan — Senior software engineer
Karel Kutchan je senior software engineer z Prahy. S Reactem, TypeScriptem a Next.js staví odolné webové systémy od datového modelu po rozhraní.
Přes deset let softwarového vývoje zákaznických portálů, podnikových aplikací, energetických produktů a komponentových systémů.
Seniorní softwarový vývoj zákaznických portálů, podnikových aplikací, energetických produktů a komponentových systémů.
```

### Rationale

- Problem being solved: search snippets and the manifest named the old positioning.
- Why this wording was selected: mirrors BD-29 in snippet length; the home description stays under 160 characters.
- Alternatives rejected: leaving metadata for a later pass (search results would contradict the page).
- Meaning intentionally preserved: Prague, stack, ten years.
- Meaning intentionally changed: discipline widened; "from data model to interface" added.

### Fact And Claim Controls

- Claims affected: role label.
- Evidence source and checked date: BD-29, 2026-11-06.
- Time-sensitive review: none.
- NDA or client review: none.
- Owner approval: Karel Kutchan, 2026-11-06.

### Impact Review

- Internationalization: both catalogs.
- Accessibility: none.
- Responsive layout: `experience.hero.intro` is a `PageIntro` lead, not measured.
- SEO and metadata: title template `%s | Codeguy` unchanged; `i18n-seo.spec.ts` updated.
- CMS or data boundary: none.
- Privacy and confidentiality: none.

### Verification

- Automated tests: `i18n-metadata.test.ts`; Playwright `i18n-seo.spec.ts`.
- Routes and locales: as listed.
- Themes, viewports, and interaction states: None (metadata).
- Manual content review: owner.
- Result: Vitest green.
- Residual risk: none.

### Lifecycle

- Supersedes: none.
- Reverted by: none.
- Related entries: COPY-20261106-001, -004, -005.
- Notes: none.

## COPY-20261106-009 — CV catalog role and profile wording

- Status: implemented
- Change type: replace
- Surface: visitor-visible
- Proposed date: 2026-11-06
- Implemented date: 2026-11-06
- Owner: Karel Kutchan
- Author: Codeguy portfolio implementation team
- Reviewer: Karel Kutchan
- Pull request: Pending
- Commit: Planned as `feat(brand): reposition the site from frontend to software engineering`
- Routes and locales: `/curriculum-vitae`, `/cs/curriculum-vitae`; both generated PDFs under `/curriculum-vitae/`
- Source boundary: owner-approved-brief, next-intl
- Message keys or public CMS fields: `curriculumVitae.hero.role`, `curriculumVitae.hero.intro`, `curriculumVitae.highlights.title`, `curriculumVitae.download.roleLabel`, `curriculumVitae.metadata.description`, `curriculumVitae.experience.intro`, first sentence of `curriculumVitae.profile.paragraphs.experience`
- Rendering location: `curriculum-vitae` page, download eyebrow (`languageLabel · roleLabel`), `tools/cv-pdf/render.mjs` (masthead and profile)
- Figma file and node: CV frames `124:369`, `132:399`, `131:593`, `136:190`, `136:283` (still show the previous role; reconciliation pending)
- Original source: CV-03 copy amendment (2026-09-12), BD-04
- Original purpose: name the role on the CV page and in the PDF masthead
- Audience and user intent: recruiters opening the CV from a sent link

### Original (verbatim)

#### English

```text
Senior Frontend Engineer
Prague-based Senior Frontend Engineer with more than ten years in web development and recent lead frontend experience.
Senior frontend engineering with increasing product and team ownership.
Senior Frontend Engineer
Karel Kutchan — Senior Frontend Engineer with more than ten years in web development.
Selected frontend roles in reverse chronological order.
Senior Frontend Engineer with more than ten years of commercial experience.
```

#### Czech

```text
Senior frontend engineer
Senior frontend engineer z Prahy s více než deseti lety zkušeností ve webovém vývoji a nedávnou zkušeností z vedení frontend vývoje.
Seniorní frontendová práce s rostoucí odpovědností za produkt i tým.
Senior Frontend Engineer
Karel Kutchan — Senior frontend engineer s více než deseti lety zkušeností ve webovém vývoji.
Vybrané frontendové role v obráceném chronologickém pořadí.
Senior frontend engineer s více než deseti lety komerční praxe.
```

### Replacement (verbatim)

#### English

```text
Senior Software Engineer
Prague-based Senior Software Engineer with more than ten years in web development and recent lead frontend experience.
Senior software engineering with increasing product and team ownership.
Senior Software Engineer
Karel Kutchan — Senior Software Engineer with more than ten years in web development.
Selected roles in reverse chronological order.
Senior Software Engineer with more than ten years of commercial experience.
```

#### Czech

```text
Senior software engineer
Senior software engineer z Prahy s více než deseti lety zkušeností ve webovém vývoji a nedávnou zkušeností z vedení frontend vývoje.
Seniorní inženýrská práce s rostoucí odpovědností za produkt i tým.
Senior Software Engineer
Karel Kutchan — Senior software engineer s více než deseti lety zkušeností ve webovém vývoji.
Vybrané role v obráceném chronologickém pořadí.
Senior software engineer s více než deseti lety komerční praxe.
```

### Rationale

- Problem being solved: the CV page and PDF masthead named the old positioning; the timeline intro said "frontend roles" although the current engagement is full-stack.
- Why this wording was selected: role label aligned with BD-29; facts in the profile paragraph (BlueGhost until April 2026, Seeder since February 2026) untouched.
- Alternatives rejected: leaving the CV at the old label (the PDF would contradict the site that links it).
- Meaning intentionally preserved: all dates, employers, stack.
- Meaning intentionally changed: role noun.

### Fact And Claim Controls

- Claims affected: role label.
- Evidence source and checked date: `src/content/curriculum-vitae.ts`, 2026-11-06.
- Time-sensitive review: none.
- NDA or client review: none.
- Owner approval: Karel Kutchan, 2026-11-06.

### Impact Review

- Internationalization: the Czech download eyebrow keeps the English title, as before.
- Accessibility: download accessible name unchanged ("Download CV — Karel Kutchan").
- Responsive layout: CV page not geometry-pinned for copy; PDF regenerated (3 pages each, as before).
- SEO and metadata: CV description updated; `i18n-seo.spec.ts` updated.
- CMS or data boundary: none (CV-06).
- Privacy and confidentiality: none.

### Verification

- Automated tests: `curriculum-vitae-i18n.test.ts` (`roleLabel`, download wording rule), `cv-pdf-layout.test.ts`; Playwright `curriculum-vitae.spec.ts`, `i18n-seo.spec.ts`.
- Routes and locales: `/curriculum-vitae`, `/cs/curriculum-vitae`, both PDFs.
- Themes, viewports, and interaction states: CV page in both themes; PDF opened and page count checked.
- Manual content review: owner.
- Result: Vitest green; PDFs regenerated 2026-11-06.
- Residual risk: Figma CV frames lag the shipped role text.

### Lifecycle

- Supersedes: none.
- Reverted by: none.
- Related entries: COPY-20261106-001, -008.
- Notes: `docs/decisions/curriculum-vitae.md` CV-03 amended in the same change.
