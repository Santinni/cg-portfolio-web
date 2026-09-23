# Curriculum Vitae decisions

| Field | Value |
| --- | --- |
| Scope | `/curriculum-vitae`, `/cs/curriculum-vitae`, the generated CV PDFs and the download controls |
| Status vocabulary | See [`README.md`](README.md) |
| Last updated | 2026-09-03 |

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

**Copy amendment, 2026-09-12 (COD-92).** The download section no longer describes the
file's format or the profile it was written for: the "English · React profile" eyebrow and
the "... curriculum vitae in PDF format" description were withdrawn on Karel's decision,
because a visitor needs neither and such meta-copy is not to appear anywhere on the site.
The eyebrow now reads `languageLabel · roleLabel` ("English · Senior Frontend Engineer"),
and the description says what the reader takes away and for whom (a team being staffed or
a partner being sought for a project). The locale-first routing, the distinct profile
versions and the stable URLs above are unchanged; the profile distinction lives in this
record, not in the UI. `curriculum-vitae-i18n.test.ts` keeps format and profile words out
of the catalog.

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

**Amended 2026-09-03, same day, superseded before merge.** The arrow widened the CV contact
row past the 350 px content column at 390 px, wrapping `GitHub` onto a second line and
growing the hero by 52 px. The first fix made the `inline` variant density-switched: icon
density below 768 px, label and arrow restored above it. That shipped and was verified, then
was replaced the same day by the decision below — recorded here because the underlying
measurement, and the reason a same-width gap fix wasn't enough, are still the evidence for
what follows. Full detail in `docs/audits/2026-09-03-cv-contact-wrap.md`.

**Final form.** In the `inline` variant, LinkedIn and GitHub always render as their brand
mark alone in a 44×44 target — monochrome, `--text-primary`, not the platform's brand
colour — with no arrow and no visible label, at every width from 320 px to desktop. E-mail
is untouched: underlined text, no icon. There is no responsive switch left: a direct channel
is a value worth reading, a profile is a destination recognized by a globally known mark,
and that distinction holds as much at 1440 px as at 390 px, so one rule replaced two.

This is presentation only, and the distinction matters: the rendered element,
`data-contact-method`, href, target, rel and text content are identical at every width, so
the single contract this decision protects is intact and `/contact` (the `row` variant)
is untouched — that page is a browsed directory where every method keeps its label
regardless of width. Direct channels never enter icon-only rendering — an e-mail address is
named by its value, and no glyph replaces it, which is why only `linkedin` and `github`
render as a mark.

Because the label is hidden with `clip` rather than `display: none`, the choice is
load-bearing rather than cosmetic: `display: none` would remove the accessible name. That is
asserted, not merely intended — `renders external profiles as an icon-only brand target at
every width` in `src/__tests__/e2e/curriculum-vitae.spec.ts` checks the accessible name, the
single brand glyph, a 44×44 target (within the suite's ±0.5 px `expectPx` tolerance) and a
non-null but ≤1 px label box, for both
profiles across 1440/768/390/430/320 in both locales. The focus ring has its own test per
theme, because without a visible label it is the only cue a keyboard user gets.

The component tests in `src/__tests__/components/contact-link.test.tsx` prove which branch
the component takes, not the rendered result: this project's Vitest config sets no
`css.include`, so CSS Modules are not processed there and a class name assertion cannot fail
on a missing rule. Rendered proof lives in the Playwright specs and the pinned pixel suite.

**Known departure from the Figma file of record.** The approved `Contact Link` component
(`21:273`) has no icon-only state today; its `Social` kind always shows a leading
external-link icon plus a visible label, and the "Contact row" block (`131:601`) inside the
approved mobile CV frame (`131:593`) shows LinkedIn and GitHub wrapping onto a second row
with full labels intact — a different, independently-arrived-at answer to the same
narrow-width problem. This decision knowingly diverges from both. The Figma component gained
`Kind=LinkedIn Icon` and `Kind=GitHub Icon` variants on 2026-09-03; the CV frames themselves
still need updating before the file and the shipped page agree again. Until then, this
document and `docs/audits/2026-09-03-cv-contact-wrap.md` are the source of truth for what
shipped.

The shipped `.contactList` column gap is `--space-16`, where the Figma row specifies 12 px.
Recorded here so the difference is a decision, not a drift.

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

## CV-09 — Curriculum vitae is a primary navigation destination · `locked`

**Decision.** `Curriculum vitae` (Czech `Životopis`) is an item of the shared primary
navigation, placed directly after Experience and before About, in the desktop menu and the
mobile dialog alike. The item opens the page; it never downloads a PDF. Download actions stay
on the page itself (CV-03, CV-05).

**Why.** The CV had been reachable only by URL since the CV rollout removed it from the
navigation pending the PDF decision (CV-03). With locale-first downloads settled, hiding the
page cost recruiters the most-opened route on the site. One entry in the navigation's shared
route-key source feeds both menus, so the item cannot drift between desktop and mobile.

**Implementation status: met.** COD-78 (BL-002b), PR #52: `navItems` in
`src/app/(frontend)/components/ui/navigation/index.tsx`, catalog key
`navigation.items.curriculumVitae`, exact-route `aria-current` (the route has no child
routes, so the prefix match is safe), keyboard activation and drawer close covered in
`launch.spec.ts`, order and current-state in `navigation.test.tsx`.

**What would reopen it.** A navigation redesign in Figma (component set `21:357`), or a
decision to make the CV a download rather than a page.

## CV-10 — One "Current role" badge; parallel engagements show only "present" · `locked`

**Decision.** The timeline badge ("Current role" / "Aktuální role") marks the single entry
named by `currentExperienceId` in `src/content/curriculum-vitae.ts`, not every entry whose
`end` is `null`. An ongoing parallel engagement renders "present" in its period and nothing
else. Entries stay in reverse chronological order of `start`, so a parallel engagement that
began later sits above the primary role.

**Why.** On 2026-09-13 the Národní knihovna ČR contract (Seeder, since 2026-02) joined the
timeline next to the BlueGhost lead role. Two badges would have said "current role" twice,
and the badge exists to answer "what is he now", which has one answer; the period already
tells the reader the contract is ongoing.

**What would reopen it.** The primary role changing (move `currentExperienceId`), or a
decision to present parallel engagements as a distinct kind of entry.

## CV-11 — The CV timeline and cards stay CV-only · `locked`

**Decision.** The `/curriculum-vitae` experience timeline, the highlight cards and the
download block keep their own components. They are not variants of the shared `Timeline`
(`/experience`) or of any shared card, and BL-002 work item 3 is closed without a refactor.

**Why.** The COD-84 decision brief (2026-09-11) measured the two timelines and found different
information contracts, not different densities: the shared `Timeline` renders NDA-safe
role/description pairs by design, the CV renders dated engagements with employer, badge and
stack (CV-10). The cards and the download block have a single consumer. Sharing would trade
one fork for a component with two modes and no second user. Karel decided on 2026-09-23.

**What would reopen it.** A second surface that needs dated engagements with employer and
stack, or the Experience page adopting the CV's information contract.

## CV-06 — CV content stays out of Payload · `provisional`

**Decision.** Static HTML CV copy lives in the `curriculumVitae` namespace in both
translation catalogs. Locale-neutral periods, company identifiers, URLs and other
structured facts live in the shared content model.

**Why.** The CV changes rarely and is generated into a PDF from the same source. Moving it
into the CMS would split one fact across two systems.

**What would reopen it.** A decision to let someone edit the CV without a deploy.
