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
