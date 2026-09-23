# Site chrome decisions

| Field | Value |
| --- | --- |
| Owner | Karel Kutchan |
| Scope | Chrome shared by every localized route: the site footer (the header and navigation are recorded in the brand log and DS-02) |
| Created | 2026-09-23 |
| Delivered by | COD-91 |

## SC-01 — One site footer is the global entry to contact, the CV and booking · `locked`

**Decision.** Every localized route ends with one `<footer>` (the page's single `contentinfo`
landmark) rendered from the locale layout after `<main>`. It has three columns from 768 px —
brand, contact, next step — stacked below, and a meta row:

- **Brand**: the `CODEGUY` wordmark (BD-19: Inter 600, no lockup, at least 8 px from the
  name), the name, and the role · city line in the secondary text colour.
- **Contact**: an eyebrow heading and `ContactLink` rows in the `list` variant — e-mail
  (`mailto:`, same tab), LinkedIn and GitHub (new tab, `rel="noopener noreferrer"`). The
  non-interactive location is not a row here (CV-05); it closes the meta row instead. The
  phone number stays out (CV-04).
- **Next step**: an eyebrow heading and two text links — *Curriculum vitae* to the CV page
  (CV-09: a page, never a download) and *Book an intro call* to the booking route.
- **Meta**: `© <year> Karel Kutchan` and the location, side by side from 768 px.

Surface `surface/raised`, no divider (the brand rule prefers space to rules); block padding
`--space-48` from 1280 px and `--space-32` below; column gap 48 / 32, stack gap 24; every
link is a 44 px target. Copy lives under `footer.*` in both catalogs; the name comes from
`home.hero.identity.name`, the location from `contact.methods.location.value`.

**Why.** The structural review of 2026-09-11 found `/work` and `/about` to be dead ends for
contact, and HP-02 moved the e-mail out of the hero. The footer is the one place where the
address, the profiles, the CV and the booking route are reachable from every page without
adding a third hero action or repeating the navigation.

**Approved frames.** Figma component set `Site Footer` (`272:59`, variants `Width=1440 /
768 / 390` × `Theme=Light / Dark`; the dark variants carry the explicit Dark mode of the
Semantic Color collection so both themes are visible where the component lives) in
`02 - Components`; instances close every Home frame — desktop `272:616`,
tablet `272:963`, mobile `272:1308`, 320 px `272:1486`, 430 px `272:1516`, dark desktop
`272:1992`, dark mobile `272:2022` (both `Theme=Dark`). Karel approved the proposal on
2026-09-23 and asked for it to be a component rather than pasted frames, with the dark
theme kept visible in the set.

**Tests.** `site-footer.spec.ts` (functional, every engine) pins the landmark, the link
semantics, the locale-prefixed routes and the 44 px targets; the Home accessibility
contract keeps counting named regions page-wide, which is why the footer has no `section`
elements. The whole-page visual baselines (CV, 404) include the footer.

**What would reopen it.** A second global entry (a sticky contact bar, a newsletter), a
decision to repeat the primary navigation in the footer, or publishing the phone number.
