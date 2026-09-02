# Curriculum Vitae decisions

| Field | Value |
| --- | --- |
| Scope | `/curriculum-vitae`, `/cs/curriculum-vitae`, the generated CV PDFs and the download controls |
| Status vocabulary | See [`README.md`](README.md) |
| Last updated | 2026-09-01 |

## CV-01 — The CV keeps its own direct public routes · `locked`

**Decision.** `/curriculum-vitae` and its localized Czech route `/cs/curriculum-vitae`
stay as direct public routes.

**Why.** The CV is the page a recruiter is most likely to open from a link that was sent
to them. A stable, guessable, unprefixed URL that survives is worth more than tidier
route nesting.

**What would reopen it.** A change to the site's public URL strategy, which would have
to account for links already sent out.

## CV-02 — Approved design frames · `locked`

Use these nodes for CV work. Verify a node still matches the shipped view before
implementing against it.

| Surface | Node |
| --- | --- |
| Desktop light | `124:369` |
| Tablet light | `132:399` |
| Mobile light | `131:593` |
| Desktop dark | `136:190` |
| Mobile dark | `136:283` |
| Download Action component set | `122:181` (10 variants with approved prototype reactions) |

The frames still contain `8+ years` and a non-canonical e-mail. Those are factual defects
in the mockup; the confirmed public identity overrides them.

Measured geometry lives in `docs/audits/2026-07-30-cv-redesign-baseline.md`, including
an approved icon-size deviation from the Figma glyph. Look the values up there; do not
restate them in this record, so there is only one number to keep correct.

## CV-03 — Downloads are locale-first, and the two CVs are different profiles · `locked`

**Decision.** The English UI downloads the English PDF; the Czech UI downloads the Czech
PDF. No language-selection dialog appears in the normal download flow. Every download
control uses the same localized label — "Download CV" / "Stáhnout životopis" — from one
catalog entry, `curriculumVitae.download.label`. The label does not name the file format
or the PDF language: locale-first routing already settles which file the visitor gets,
and per-page label variants would fragment one action into several.

**Why.** The English React-focused CV and the Czech general-profile CV are **distinct
profile versions, not translations of one another**. UI copy that implies language-only
equivalence would misrepresent what the visitor is getting.

**Stable asset URLs.** These paths are locked, because they have been sent out in
applications and must keep resolving:

| Path | Serves |
| --- | --- |
| `/curriculum-vitae/CV_Karel_Kutchan.pdf` | the English React profile |
| `/curriculum-vitae/CV_Karel_Kutchan_CS.pdf` | the Czech general profile |

Regenerating the file behind a path is expected. Renaming or moving a path is not.

**What would reopen it.** A redesign of the PDF profile model — at which point an
alternate-language selector could be reconsidered.

**Implementation status: met.** All four download controls — three on the CV page, one on
Experience — resolve the file from `curriculumVitae.pdfByLocale[locale]`, render
`DownloadAction`, and share `curriculumVitae.download.label` plus
`curriculumVitae.download.accessibilityLabel`. The accessible name names the person and
nothing else ("Download CV — Karel Kutchan"); it must contain the visible label verbatim,
because `aria-label` replaces the accessible name and WCAG 2.5.3 Label in Name is what
lets voice control reach the control by its visible words.

`src/__tests__/unit/download-action-usage.test.ts` enforces these rules over every
rendered usage, so a new download control cannot pick its own copy or drop the accessible
name. `src/__tests__/e2e/experience-cv-download.spec.ts` and
`src/__tests__/e2e/curriculum-vitae.spec.ts` hold the locale-first download contract for
both routes.

The language and profile of the file stay visible where the download is *described* — the
CV page download section carries a `languageLabel · profileLabel` eyebrow — not in the
button that performs it.

The uniform-label clause was added on 2026-09-01 under COD-76, replacing an earlier
requirement that each label state the PDF language or profile variant. That earlier
wording had produced per-page copy variants ("Download English PDF") that read as
different actions.

## CV-04 — Phone number boundary · `locked`

**Decision.** The phone number stays out of the HTML pages and the homepage hero. It is
deliberately present in the generated CV PDF, which is publicly downloadable.

**Why.** The PDF is the artifact a recruiter keeps and acts on, and a CV without a phone
number is weaker for that purpose. The HTML pages are indexed and scraped, which is a
different exposure profile.

**Do not** describe the phone number as "withheld" without that qualification — it is
withheld from one surface, not from the public.

## CV-05 — Contact and download primitives stay semantically separate · `locked`

**Decision.** `ContactLink` handles e-mail and external profile navigation.
`DownloadAction` is the only CV download primitive. Location is non-interactive metadata
with no destination. Do not merge them into one universal action component, and do not
open `mailto:` in a new tab.

**Why.** They are different user intents with different accessible semantics. A single
component would have to branch on intent internally and would get the semantics wrong for
at least one of them.

**Implementation status: met.** Unified on 2026-09-02 under COD-77. One component,
`src/components/site/ContactLink.tsx`, serves every contact surface in two variants: `row`
for `/contact` and `inline` for the CV hero, with the homepage identity row (COD-79) and a
future footer covered by the same contract. Destinations come from `contactMethods` in
`src/content/contact.ts`, which now derives them from the single `contact` object in
`src/content/site.ts` instead of repeating the address and both profile URLs.

Inline text names an external profile by its platform label and a direct channel by its
value, because inline space fits one string per method and those are the strings a visitor
uses. `src/__tests__/components/contact-link.test.tsx` holds the semantics in both
locales, `src/__tests__/unit/contact-link-usage.test.ts` stops a surface from reintroducing
a bespoke anchor, and `src/__tests__/e2e/curriculum-vitae.spec.ts` asserts the rendered
hero contract.

**Approved deviation.** Inline external profile links now carry the same `ArrowUpRight`
affordance as the `/contact` rows; the approved CV frames show underlined text with no
glyph. One contract cannot signal "this leaves the site" on one surface and stay silent on
another. Recorded in `docs/audits/2026-09-02-cv-shared-primitive-audit.md`.

## CV-07 — The expanding download interaction is preserved, from the approved variant · `locked`

**Decision.** Keep the recognizable expanding download interaction, implemented from the
Download Action component set with semantic tokens, the 4 px system radius, accessible
focus and keyboard behaviour, and a label that stays understandable on touch devices.
Do not reuse the legacy pill styling in `ExpandingButton.module.css` as the visual
contract. Where the Download Action shares properties with ordinary buttons, use the
existing Button system and semantic control tokens; keep the CV-specific expansion
behaviour in a narrow component rather than altering unrelated buttons.

**Why.** The interaction is recognizable and was approved; the legacy pill styling it
superficially resembles was not.

**What would reopen it.** A newer approved Download Action variant in the design file of
record, or a usability finding against the expansion behaviour.

## CV-08 — The historical PDFs are a record, not a reference · `locked`

**Decision.** `docs/Karel_Kutchan_CV.pdf` and
`docs/Karel_Kutchan_CV_Frontend_React_Engineer_2026.pdf` are historical Google Docs
exports, kept only as a record of what was previously sent out. They are not design
references: they use Arial/Play and navy `#1F4E79`, which conflict with the current
identity. The assets under `public/curriculum-vitae/` are generated, not legacy.

**Why.** They look authoritative and are the wrong identity. Someone reaching for "the
CV design" could easily reach for one of them.

**What would reopen it.** Nothing about their status. Delete them only if the record of
what was previously sent out stops being useful.

## CV-06 — CV content stays out of Payload · `provisional`

**Decision.** Static HTML CV copy lives in the `curriculumVitae` namespace in both
translation catalogs. Locale-neutral periods, company identifiers, URLs and other
structured facts live in the shared content model.

**Why.** The CV changes rarely and is generated into a PDF from the same source. Moving it
into the CMS would split one fact across two systems.

**What would reopen it.** A decision to let someone edit the CV without a deploy.
