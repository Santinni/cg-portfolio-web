# Post-Launch Work Backlog

Recorded 2026-08-06. Planning only — nothing in this document is authorized for
implementation until its open decisions are resolved and it is promoted into a
dedicated implementation plan.

## Status Legend

- `[ ]` pending
- `[-]` in progress
- `[x]` completed and controller-verified
- `[!]` blocked or requires an explicit decision

---

## BL-001 — Reset Tracker Page (Codex Resets Equivalent)

**Requested outcome:** the site should provide the same information that
`https://codex-resets.com/` provides.

### What The Reference Site Provides

`codex-resets.com` describes itself as "the most important tweet tracker in
software". Its premise: Codex usage limits reset when `@thsottiaux` announces it
on X, and the site watches that feed so readers do not have to. The observed
information model is:

- Subscription channels for new events: browser (push), Telegram, email.
- A primary "time since the last event" readout — a relative age ("5 days ago")
  plus the exact timestamp of the last announcement ("Aug 1, 2026, 5:32 AM").
- Aggregate statistics over the full event history:
  - total number of resets (observed: 40);
  - average interval between resets (observed: 8.2d);
  - longest wait between resets (observed: 67.7d).
- A contribution-graph style heatmap of the last 26 weeks — one cell per day,
  Mon/Wed/Fri row labels, month labels along the top — showing when the
  announcement happened and how long the wait was.

### Work Items

- [ ] Decide the subject of our tracker (see open decisions) and write the
      one-sentence promise of the page.
- [ ] Decide the data source and ingestion mechanism; document rate limits,
      cost and terms-of-service constraints before any implementation.
- [ ] Define the event model (event timestamp, source URL, ingestion timestamp,
      verification state) and where it is stored — Payload collection versus a
      static/JSON snapshot.
- [ ] Define the derived statistics contract: total count, mean interval,
      maximum interval, time since last event, all computed from the event model
      rather than hardcoded.
- [ ] Design the page against the existing design system — no new visual
      language. Reuse `Section`, `Eyebrow`, `PageIntro` and existing tokens.
- [ ] Specify the heatmap as an accessible component: it must not be
      colour-only. Needs a text equivalent (table or list), per-cell accessible
      names, keyboard reachability and light/dark contrast that passes WCAG 2.1
      AA. Verify against `docs/brand/brand-guidelines.md`.
- [ ] Decide whether subscription channels (browser push / Telegram / email) are
      in scope for the first cut, or whether the first cut is read-only.
- [ ] Localize all copy for `en` and `cs`, including relative-time and
      interval formatting via `Intl` with the request locale.
- [ ] Add route metadata, canonical URL, sitemap entry and navigation placement.
- [ ] Add regression coverage: statistics computed from a fixed fixture, empty
      state, stale-data state, ingestion failure state.

### Open Decisions

- [!] **Subject.** Do we track the same subject as the reference site (OpenAI
      Codex limit resets, sourced from a specific X account), or the equivalent
      event for the tooling we actually use and write about? This choice decides
      the data source, the legal posture and whether the page is a tribute or a
      duplicate of someone else's product.
- [!] **Data source.** X/Twitter API access is paid and its terms restrict
      redistribution; scraping is not an acceptable production dependency.
      Identify a source we can rely on and afford, or the page cannot ship.
- [!] **Originality and attribution.** If we mirror the reference site's subject
      and presentation, decide how we credit `codex-resets.com` and what makes
      our version worth visiting. Do not ship an unattributed copy.
- [!] **Freshness contract.** What does the page show when ingestion is stale or
      broken? An implicitly stale "5 days ago" is a factual claim we would be
      making incorrectly.
- [ ] **Placement.** Standalone route, an Insights article with a live widget,
      or a labs/experiments area? This affects navigation and sitemap.

### Risks

- The value of the reference site is a live feed. Anything we ship without a
  reliable ingestion path degrades into a stale page that damages credibility.
- Push/Telegram/email subscriptions introduce a subscriber datastore, consent,
  unsubscribe and GDPR obligations that the site currently does not have.

---

Pojďme nad tím vším, i včetně toho zadání, udělat brainstorming a případně to zadání, které už máme doručené, eh— — Curriculum Vitae Component Revision (DRY And Visual Unification)

**Requested outcome:** parts of `/curriculum-vitae` are written separately when
they should reuse shared components; contact-style links (email, websites,
profiles) should look and behave the same across the whole site.

### Confirmed Baseline (verified 2026-08-06)

- `src/app/[locale]/(frontend)/(pages)/curriculum-vitae/page.tsx` is 310 lines
  with a 470-line colocated CSS module — by far the most self-contained page in
  the app.
- Every other route composes `Section`, `Eyebrow`, `PageIntro` and `Timeline`
  from `src/components/site/`. The CV page imports none of them and instead
  defines its own `.section`, `.sectionHeading`, `.eyebrow`, `.sectionIntro`
  and `.timeline*` styles locally.
- The CV hero renders raw `<a className={styles.contactLink}>` elements for
  email, LinkedIn and GitHub, while `src/components/site/ContactLink.tsx`
  already exists and is used by `/contact`. The two presentations of the same
  three contact methods are therefore unrelated in code and in appearance.
- The CV has its own timeline markup for experience while `/experience` renders
  the shared `Timeline` component over comparable data.

### Work Items

- [ ] Audit the CV page section by section and classify each block as
      (a) already covered by a shared component, (b) a legitimate CV-only
      component, or (c) a candidate to be promoted into `src/components/site/`.
      Record the classification before touching code.
- [ ] Replace CV-local section/heading/eyebrow markup with `Section`, `Eyebrow`
      and `PageIntro` where the classification says (a), and delete the
      superseded CSS rules rather than leaving them orphaned.
- [ ] Decide whether the CV experience timeline and the `/experience` timeline
      are the same component with different density, or genuinely different
      presentations. If the same, extend `Timeline` rather than forking it.
- [ ] Unify contact links site-wide. Define one component contract that serves
      the CV hero, the contact page, the footer and any future contact surface,
      including external-link semantics (`target`, `rel`, the arrow affordance)
      and the 44px minimum target size already asserted by `ContactLink`.
- [ ] Reconcile the visual result with `docs/brand/brand-guidelines.md` and the
      approved CV Figma frames (`124:369`, `132:399`, `131:593`, `136:190`,
      `136:283`). Where unification changes the approved CV design, record the
      deviation as an explicit brand decision instead of silently diverging.
- [ ] Keep the existing CV regression suite green
      (`src/__tests__/e2e/curriculum-vitae.spec.ts`,
      `src/__tests__/unit/curriculum-vitae-i18n.test.ts`) and add coverage for
      the newly shared components at both locales, in light and dark mode.
- [ ] Re-verify print/PDF-adjacent behavior and the floating Download Action
      after the refactor; they depend on `data-cv-download` hooks in the page.

### Open Decisions

- [!] **Figma authority.** The CV frames were approved as a distinct layout.
      Unification is a deliberate departure from measured Figma parity. Confirm
      that consistency now outranks the approved CV mockups; otherwise the scope
      shrinks to contact links only.
- [ ] **Refactor depth.** Minimal (contact links + section primitives) or full
      (timeline, cards, download section too)? Recommendation: do the minimal
      pass first, verify it, then decide on the timeline separately — the
      timeline is the highest-risk piece because the two pages carry different
      data shapes.

### Risks

- The CV is the page most likely to be opened by a recruiter. A refactor with no
  visual regression evidence is not acceptable here; screenshots at 390/768/1440
  in both locales and both themes are required before and after.

---

## BL-003 — Stronger Identity On The Homepage

**Requested outcome:** the homepage should state identity more clearly, and
probably link straight to contacts, so a visitor immediately knows whose site
they landed on.

### Confirmed Baseline (verified 2026-08-06)

- The home hero (`(home)/blocks/hero/index.tsx`) renders an eyebrow
  ("SENIOR FRONTEND ENGINEER / PRAGUE"), a headline about building frontend
  systems, two paragraphs and two CTAs — "Read flagship case" and
  "View experience".
- The name "Karel Kutchan" does not appear in the hero at all. No portrait, and
  no direct contact affordance above the fold.
- The only contact CTA on the homepage is the final CTA block at the bottom.
- The mobile menu already carries a profile fragment (role + specialties), so a
  name/role identity model partly exists but is not surfaced on the homepage.

### Work Items

- [ ] Decide the identity model for the hero: name, role, location, and whether
      a portrait or brand mark is part of it.
- [ ] Introduce the name into the hero copy for `en` and `cs`, keeping the
      existing eyebrow/headline hierarchy readable rather than stacking a second
      competing headline.
- [ ] Decide the CTA set. Adding a third button risks diluting the existing two;
      evaluate replacing the secondary CTA with a contact link, or adding a
      lower-weight inline contact link beside the CTA row.
- [ ] Reuse the unified contact-link component from BL-002 if inline contact
      links land in the hero — do not introduce a third link style.
- [ ] Verify heading hierarchy, landmark semantics and focus order stay correct
      after the change.
- [ ] Verify the hero still fits at 390/768/1440 without overflow, in light and
      dark mode, and that the compact copy variants remain coherent.
- [ ] Consider `Person` structured data on the homepage once the identity model
      is explicit — factual fields only.
- [ ] Update homepage regression coverage for the new identity content.

### Open Decisions

- [ ] **Portrait.** Do we introduce a photograph? None is currently used in the
      redesigned homepage, and adding one changes the brand's tone.
- [ ] **Contact prominence.** Direct email exposure in the hero versus a link to
      `/contact`. The launch plan publishes `karel@codeguy.cz` but withholds the
      phone number; that boundary stays.

### Dependencies

- BL-003 should follow BL-002's contact-link unification so the hero consumes
  the unified component instead of creating a fourth variant.

---

## Suggested Sequence

1. BL-002 minimal pass — contact links and section primitives on the CV.
2. BL-003 — homepage identity, consuming the unified contact link.
3. BL-002 remaining scope — timeline and card unification, if approved.
4. BL-001 — only after its data-source and originality decisions are resolved.

## Required Validation Per Item

Each item follows the standing repository gates before it is called complete:
`pnpm format:check`, `pnpm typecheck`, `pnpm lint`, `pnpm test:unit`,
`pnpm test`, `pnpm build`, targeted Playwright checks, and screenshots at 390,
768 and 1440 px in both locales and both themes.
