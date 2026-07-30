# Evidence-Gated Article Backlog

Status: planning only. An item in this backlog is not authorized for publication.

## Editorial Boundary

- Payload editorial content is English-first and currently English-only.
- Czech article translation and Czech article `hreflang` remain deferred until an
  approved Payload localization migration exists.
- Working titles and search intent are hypotheses until editorial, keyword, and
  Search Console research confirms them.
- Every factual, technical, employer, client, outcome, and performance claim
  requires reviewable evidence and any necessary owner, NDA, or client approval.

## Status Vocabulary

- `idea`
- `evidence-needed`
- `draft-ready`
- `drafting`
- `editorial-review`
- `claim-review`
- `approved`
- `scheduled`
- `published`
- `retired`

## Global Definition Of Ready

Before an article can move to `drafting`:

- its unique promise and intended reader are explicit;
- every factual or quantitative claim has an identified evidence source;
- employer, client, product, and NDA boundaries are documented;
- the topic taxonomy is approved rather than forced into a misleading category;
- the outline adds first-hand technical evidence instead of paraphrasing generic
  documentation;
- unresolved limitations are part of the planned article, not hidden.

Before publication:

- use a unique title, description, canonical URL, and honest search intent;
- add Article and Breadcrumb structured data before calling the editorial launch
  complete;
- verify heading order, descriptive links, keyboard behavior, contrast, and code
  overflow;
- provide text equivalents for diagrams and correct alt/decorative semantics,
  captions, and credits for media;
- mark English fragments with `lang="en"` when rendered inside Czech UI;
- verify the 1200×630 social crop and its alternative text;
- review metadata, canonical, `noindex`, links, share URL, and sitemap entry in a
  production-like preview;
- observe the published URL in Search Console without inventing ranking or
  keyword-volume claims.

The current topic filter exposes architecture, performance, design systems, and
accessibility. Delivery, localization, and SEO articles need an explicit taxonomy
decision; do not silently place them under architecture.

## ART-001 — A Reproducible Figma-To-Web Audit: Evidence Before Confidence

- Slug: `reproducible-figma-to-web-audit`
- Priority: P1
- Status: `evidence-needed`
- Audience: frontend leads, design-system leads, design engineers, and QA leads
- User/search intent: learn a defensible method for comparing an approved design
  with a rendered product
- Unique promise: a repeatable evidence contract that separates measured
  mismatches from visual opinion
- Proposed topics: design systems, QA, frontend architecture
- Locale priority: English first; Czech deferred
- CTA: request a defensible frontend or design-system audit

### Evidence Required

- a dated audit commit and stable Figma node IDs;
- computed browser measurements at 1440, 768, and 390 CSS pixels;
- representative before/after evidence and documented coverage limits;
- a severity and confidence model;
- sanitized examples with confidential or client-identifying data removed.

### Outline

1. Why screenshots alone are insufficient.
2. The design and runtime evidence contract.
3. Component, state, and screen inventory.
4. Computed values and responsive comparison.
5. Severity, confidence, and coverage.
6. Fix, retest, and residual-risk loop.
7. Limits of the method.

### Risks And Approval

- Do not imply complete parity when only selected nodes or viewports were tested.
- Require NDA/client review for any recognizable work.
- Ready when the dated audit, browser matrix, and publishable examples exist.

## ART-002 — From 54 Figma Variants To One Tested React Button Contract

- Slug: `figma-button-variants-react-contract`
- Priority: P1
- Status: `evidence-needed`
- Audience: frontend and design-system engineers
- User/search intent: turn a large design variant matrix into a stable component
  API
- Unique promise: connect the full design contract to semantics, migration, and
  real-browser state evidence
- Proposed topics: design systems, React, accessibility, testing
- Locale priority: English first; Czech deferred
- CTA: discuss a component-library or design-system audit

### Evidence Required

- Figma node `21:110` and its 3 variants × 6 states × 3 sizes;
- exact tokens, final API, compatibility decisions, and code diff;
- unit coverage for native semantics, disabled, and loading behavior;
- computed hover, active, focus, disabled, and loading states;
- a documented call-site migration.

### Outline

1. Normalize the matrix before designing the API.
2. Choose semantic variants and sizes.
3. Map tokens and interaction states.
4. Preserve native disabled and loading semantics.
5. Handle legacy compatibility without freezing the API.
6. Divide unit, browser, and visual proof.

### Risks And Approval

- Do not call the component accessible from unit tests alone.
- Include keyboard, focus, contrast, forced-colors, and real-browser evidence.
- Ready when the state matrix and compatibility migration are complete.

## ART-003 — A Mobile Navigation That Survives Resize, Escape And Focus Restoration

- Slug: `accessible-native-dialog-mobile-navigation`
- Priority: P1
- Status: `evidence-needed`
- Audience: senior frontend and accessibility engineers
- User/search intent: implement robust native-dialog navigation across responsive
  lifecycle edges
- Unique promise: explain the state, focus, and resize cases commonly omitted
  from menu tutorials
- Proposed topics: accessibility, frontend architecture, browser APIs
- Locale priority: English first; Czech deferred
- CTA: request an accessibility-focused frontend review

### Evidence Required

- approved Navigation, Icon Button, and open-menu Figma nodes;
- tests for open, explicit close, Escape, navigation, resize, and scroll lock;
- focus restoration and hidden-trigger evidence;
- reduced-motion, keyboard, browser, and manual accessibility notes.

### Outline

1. Keep a stable SSR DOM.
2. Let native `dialog.open` own the truth.
3. Mirror state for ARIA and scroll lock.
4. Handle Escape, explicit close, and link navigation.
5. Close safely across the desktop breakpoint.
6. Explain why a custom focus trap was unnecessary.
7. State browser and assistive-technology limits.

### Risks And Approval

- Do not promise universal screen-reader behavior from Chromium alone.
- Do not assume Next.js moves focus after navigation.
- Ready when browser and manual keyboard evidence are documented.

## ART-004 — Localizing A Next.js Portfolio Without Changing Its English URLs

- Slug: `nextjs-i18n-stable-english-urls`
- Priority: P1
- Status: `evidence-needed`
- Audience: Next.js platform and frontend engineers
- User/search intent: add a prefixed locale while preserving existing unprefixed
  public links
- Unique promise: a tested URL contract for `/`, `/cs`, redirects, and language
  switching
- Proposed topics: internationalization, Next.js, technical SEO
- Locale priority: English first; Czech deferred
- CTA: discuss a low-risk localization migration

### Evidence Required

- version-stamped Next.js 16.2.11 and next-intl 4.13.4 behavior;
- `/`, `/cs`, `/en`, query-preserving switcher, API, and admin route evidence;
- canonical, language-alternate, and redirect tests.

### Outline

1. Define URL invariants before routing.
2. Use an as-needed locale prefix.
3. Bridge route groups and dynamic adapters.
4. Preserve query strings in language switching.
5. Keep API and admin boundaries out of locale routing.
6. Verify canonical and alternate metadata.
7. Document trade-offs and migration limits.

### Risks And Approval

- Do not present this repository topology as a universal Next.js recipe.
- Reconfirm behavior when framework versions change.
- Ready when the taxonomy is approved and the final sources and code examples
  have been reviewed.

## ART-005 — How To Keep Localized 404s Real In The Next.js App Router

- Slug: `nextjs-localized-real-404-status`
- Priority: P1
- Status: `evidence-needed`
- Audience: Next.js and technical SEO engineers
- User/search intent: avoid streamed localized not-found pages that return a soft
  HTTP 200
- Unique promise: test status, language, indexing, and route-class differences
  at the raw response boundary
- Proposed topics: Next.js, SEO, internationalization, testing
- Locale priority: English first; Czech deferred
- CTA: request a routing and SEO correctness review

### Evidence Required

- raw status, body, `lang`, and `noindex` test matrix;
- finite versus runtime-dynamic route examples;
- a loading-boundary reproduction;
- the unresolved missing-CMS-article raw-language limitation.

### Outline

1. How a soft 404 appears.
2. Why localized streaming changes the failure mode.
3. Separate finite and runtime-dynamic routes.
4. Place the global not-found boundary.
5. Test raw status, language, and indexing.
6. Preserve the unresolved CMS edge honestly.

### Risks And Approval

- Prominently disclose the remaining runtime-CMS limitation.
- Do not claim universal search-ranking outcomes.
- Ready when the taxonomy is approved and the version-specific evidence and
  limitations have been reviewed.

## ART-006 — Localized UI, English-Only Articles: An Honest Hreflang Strategy

- Slug: `localized-ui-english-only-content-hreflang`
- Priority: P1
- Status: `evidence-needed`
- Audience: internationalized product teams and technical SEO teams
- User/search intent: localize application chrome without publishing false
  translated editorial alternates
- Unique promise: separate interface locale from editorial-content locale in
  metadata, routing, and language semantics
- Proposed topics: internationalization, technical SEO, content architecture
- Locale priority: English first; Czech deferred until the strategy itself can be
  translated without implying Czech articles exist
- CTA: review an international content architecture

### Evidence Required

- current canonical, alternate, redirect, and sitemap behavior;
- list-page versus detail-page rules;
- browser and raw-response tests;
- an explicit migration trigger for localized CMS content.

### Outline

1. UI locale is not editorial locale.
2. Localize lists without fabricating detail translations.
3. Choose redirect and canonical behavior.
4. Emit honest `hreflang` and sitemap entries.
5. Mark embedded English fragments correctly.
6. Define the threshold for a localized CMS migration.

### Risks And Approval

- Never create a Czech article alternate before a real translation exists.
- Verify English fragments in Czech UI carry correct language metadata.
- Ready when the taxonomy is approved and the metadata evidence has been
  reviewed.

## ART-007 — Keeping A Portfolio Useful When Its CMS Is Unavailable

- Slug: `static-portfolio-core-payload-cms-boundary`
- Priority: P2
- Status: `evidence-needed`
- Audience: small-team full-stack and frontend architects
- User/search intent: isolate dependable identity pages from dynamic editorial
  dependencies
- Unique promise: a measured failure boundary rather than a vague resilience
  claim
- Proposed topics: architecture, Payload CMS, reliability
- Locale priority: English first; Czech deferred
- CTA: discuss a resilient content and application boundary

### Evidence Required

- a dependency map and CMS-offline test;
- static Home and Work behavior while the CMS is unavailable;
- Insights error and recovery behavior;
- sitemap fallback and recovery observations.

### Outline

1. Define the failure budget.
2. Separate static identity from dynamic editorial content.
3. Isolate CMS calls and failure states.
4. Preserve useful routes and honest SEO behavior.
5. Test recovery and stale data.
6. Explain when this architecture is the wrong choice.

### Risks And Approval

- Do not claim uptime or resilience without controlled outage evidence.
- Sanitize production incidents and infrastructure details.
- Ready when CMS-offline and recovery tests exist.

## ART-008 — Immutable Docker Delivery For A Small Next.js And Payload Site

- Slug: `immutable-docker-nextjs-payload-delivery`
- Priority: P2
- Status: `evidence-needed`
- Audience: frontend leads who also own VPS delivery
- User/search intent: build once, verify the host contract, deploy safely, and
  retain a rollback path
- Unique promise: connect immutable artifacts with the real SSH, health-check,
  and rollback failures encountered by a small site
- Proposed topics: delivery, Docker, GitHub Actions, Next.js, Payload
- Locale priority: English first; Czech deferred
- CTA: review a small-team CI/CD and rollback design

### Evidence Required

- sanitized workflow and deployment configuration;
- immutable image digest and successful deployment log;
- the SSH host-key fingerprint mismatch lesson;
- health checks and an actually rehearsed rollback.

### Outline

1. Threat and failure model.
2. Build one immutable artifact.
3. Define the CI and host contract.
4. Verify SSH host identity.
5. Stage Compose and Caddy configuration.
6. Gate rollout on health.
7. Rehearse rollback.
8. Record operational lessons.

### Risks And Approval

- Remove IPs, fingerprints, secrets, usernames, and private logs.
- Never paste production credentials.
- Do not claim rollback works until it has been rehearsed.
- Ready when a sanitized successful deployment and rollback rehearsal exist.
