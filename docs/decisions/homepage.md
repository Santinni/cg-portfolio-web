# Homepage decisions

| Field | Value |
| --- | --- |
| Owner | Karel Kutchan |
| Scope | The `/` hero: identity, headline, actions, availability line; the Worked-with row beneath it |
| Created | 2026-09-11 |
| Delivered by | COD-79 (BL-003), COD-86, COD-87 — PR #56 |

## HP-01 — The hero states the identity in its eyebrow row · `locked`

**Decision.** The hero's eyebrow row reads `Karel Kutchan / <role> / <city>` in both
locales, as one catalog message with an `<identity>` chunk around the name. The locked brand
headline stays the only `h1`. No portrait, no brand mark, no second headline.

**Why.** Before BL-003 the name appeared only in SEO metadata; a visitor landing on `/` could
not tell whose site it was without scrolling. The eyebrow already carried the role and city,
so the name joins the row it belongs to instead of competing with the headline.

**Approved frames.** Desktop `6:11` (identity row `6:12`), tablet `7:382`, mobile `8:92`,
430 px `8:198`, 320 px `8:145`, dark desktop `8:255`. The row wraps to two lines only at
320 px in Figma; in a browser it also wraps at 390 px, which the parity specs accept as
line-box growth.

**What would reopen it.** A portrait or brand mark entering the hero, or a change to the
brand headline (BD entries in `docs/brand/brand-decision-log.md`).

## HP-02 — The hero offers exactly two actions: flagship case, book an intro call · `locked`

**Decision.** The primary action is the flagship case study. The second action is a
`secondary`, `large` button to `/contact/book` ("Book an intro call" / "Domluvit úvodní
hovor"), the same booking route the contact page and the final CTA already lead to. Both
actions are 52 px buttons from the approved set (DS-03). There is no third action; the
former secondary "View experience" button is gone from the hero, and the hero carries no
`mailto:` link.

**Why.** BL-003 asked for a direct path to contact above the fold. On 2026-09-11 Karel first
chose a visible `mailto:` rendered by the inline `ContactLink` token, because the locked
wording was "a visible direct e-mail action" and the address is published on every other
contact surface. The same day, after review, he reversed it: an underlined text token reads
as visually weak beside a 52 px button, `mailto:` hands the visitor to whatever mail client
the device has (often none), and recruiters reach for a booking or contact action before
they write an e-mail. The e-mail stays on `/contact` and the CV, and returns to `/` in a
site footer (COD-91); the hero itself routes contact through the booking page.

**Recorded deltas against Figma.** The approved frames still show the e-mail token in the
hero action row and must be updated to the two-button row under DS-04's "Figma holds the
resulting design" rule: desktop `6:11`, tablet `7:382`, mobile `8:92`, 430 px `8:198`,
320 px `8:145`, dark desktop `8:255`. Until they are, the file and the shipped hero
disagree and the parity specs pin the shipped geometry. The primary button renders
`ArrowRight` while the Figma button has no glyph — a reconciliation item between the file
and the contract, not a defect.

**Deferred.** `Person` structured data was considered and not added: the repository has no
JSON-LD pattern to extend, and inventing one is a separate decision.

**What would reopen it.** Publishing the phone number, a decision to put a direct channel
(e-mail or otherwise) back into the hero, or the booking route being withdrawn (BK entries
in `booking.md`).

## HP-03 — The hero states availability in one line under the actions · `locked`

**Decision.** Below the action row the hero renders one plain paragraph, in both locales,
naming what Karel is open to:

> Open to senior and lead frontend roles in Prague or
> remote (EU), employee or contract.

It is set in the body tier (16 px / 24 px) in the secondary text colour, on the paragraphs'
measure, spaced by the hero's own column gap. It contains no link. The same sentence appears
on `/contact` as the second lead paragraph of the page intro; the two catalog copies
(`home.hero.availability`, `contact.hero.availability`) are kept identical by a test.

**Why.** A recruiter's first question after "whose site is this" is "is he available, for
what, and where". The headline and paragraphs answer what he does; nothing above the fold
answered the availability question. A factual line, not a badge or a status pill, keeps the
hero's restraint (HP-01).

**Status.** Locked on 2026-09-13. Karel confirmed the wording in both locales and removed the
employer from it: the line states openness (employee and contract roles, Prague or remote EU),
not where he works today. The same day the employer left every self-description on the site
(CV hero intro, the "Lead role" profile card); the CV and Experience timelines still name it
as a fact of the record, and the PDF CV keeps it in its profile paragraph. A change in the
role or location reopens the line.

**What would reopen it.** Karel changing role or location, withdrawing from the market, or
choosing to show availability as a status element rather than a sentence.

## HP-04 — A "Worked with" row of seven monochrome marks follows the hero · `locked`

**Decision.** Directly under the hero, before the flagship case, a low section labelled
"WORKED WITH" / "SPOLUPRACOVAL JSEM S" shows seven marks at a uniform height (20 px below
1024 px, 24 px above): Národní knihovna ČR, E.ON, MND, Kontent.ai, Skype, Jobs.cz, eMan. The marks are rendered as
masks filled with the secondary text colour, so they are monochrome in both themes, and they
are static — no links, no hover state. Company names are brand names and live in
`src/content/workedWith.ts`, not the catalogs; each mark exposes its name as an image label.
The eyebrow-styled `h2` is the section's only heading and its accessible name, so assistive
technology hears the label once.

**Why.** The hero names the role; the row shows the employers and clients the CV already
names, so the claim is backed before the visitor scrolls to the case studies. E.ON and MND
were clients served through eMan, and the CV states them as such.

**No approved frame.** The row has no Figma source (DS-05). Its geometry is token-derived —
block padding from the spacing scale, the label tier for the heading, icon tokens for the
mark heights — and the parity specs pin that derived geometry, not a Figma measurement.

**Status.** Rights confirmed by Karel on 2026-09-12 for every mark, including E.ON and MND as
clients reached through eMan. Skype was added the same day (simple-icons 12 glyph, CC0; the
brand was retired in 2025 and later icon sets dropped it). LMC was considered and left out:
lmc.eu now serves the Alma Career identity the company adopted in 2024, so no LMC-era mark
exists to show, and Jobs.cz already represents that employer's product in the row.
Národní knihovna ČR was added on 2026-09-13 as the current client (Seeder, the Web Archive's
curatorial platform, CV entry `nkp`), first in the row; the mark is the library's own wordmark
from nkp.cz, used with Karel's confirmation as its contractor.

**What would reopen it.** A rights objection, a new employer or client worth naming, or a
decision to link the marks to the case studies (which would make the row a navigation
element and change its accessibility contract).
