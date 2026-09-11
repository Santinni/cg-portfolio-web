# Homepage decisions

| Field | Value |
| --- | --- |
| Owner | Karel Kutchan |
| Scope | The `/` hero: identity, headline, actions |
| Created | 2026-09-11 |
| Delivered by | COD-79 (BL-003), PR #56 |

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

## HP-02 — The hero offers exactly two actions: flagship case, direct e-mail · `locked`

**Decision.** The primary action is the flagship case study. The second action is the
direct e-mail channel rendered by the shared `ContactLink` in its `inline` variant, reading
the address from `contactMethods`. There is no third action, and the former secondary
"View experience" button is gone from the hero.

**Why.** BL-003 asked for a direct path to contact above the fold. Karel chose a visible
`mailto:` over a link to `/contact` on 2026-09-11 because the locked wording was "a visible
direct e-mail action", `karel@codeguy.cz` is published on every other contact surface, and
only the phone number is withheld (CV-04). Reusing the inline contact token keeps one
contact contract site-wide (CV-05) instead of a fourth link style.

**Recorded deltas against Figma.** The Figma e-mail token (`185:503`) carries a mail glyph,
teal text and 12 px padding; the shipped inline variant is the underlined text token CV-05
defines. Height (44 px), gap (16 px desktop, 24 px stacked) and alignment match, width does
not. The primary button renders `ArrowRight` while the Figma button has no glyph. Both are
reconciliation items between the file and the contract, not defects.

**Deferred.** `Person` structured data was considered and not added: the repository has no
JSON-LD pattern to extend, and inventing one is a separate decision.

**What would reopen it.** Publishing the phone number, a decision to route the hero's contact
action through `/contact`, or a Figma update that changes the token to match CV-05 (which
would then close the recorded delta).
