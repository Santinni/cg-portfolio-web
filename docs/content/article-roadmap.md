# Codeguy Article Roadmap

Status: planning only. This roadmap orders research and drafting candidates; it
does not authorize drafting, publication, or unsupported public claims.

## Source Of Truth

`docs/content/article-backlog.md` is the source of truth for:

- exact article status;
- evidence requirements;
- the Global Definition Of Ready for drafting;
- publication gates;
- risks, owner approval, and claim limitations.

This roadmap deliberately does not introduce a parallel readiness vocabulary.
Every linked ART-001 through ART-008 article currently has the backlog status
`evidence-needed` and may move forward only through the status vocabulary and
gates defined in the backlog.

## Editorial Boundary

- Payload CMS articles are English-first and currently English-only. Czech titles
  are working research labels, not approved Czech articles or Czech `hreflang`
  alternates.
- Do not invent client outcomes, performance improvements, scale, ownership,
  accessibility conformance, leadership impact, or business results.
- Client, employer, product, incident, and infrastructure details require the
  evidence, confidentiality, NDA, claim, and owner review assigned in the
  backlog.
- The repository does not seed Authors, Topics, or Posts. Editorial CMS setup,
  preview, and publication remain separate gates even after an article satisfies
  the Global Definition Of Ready.

## Pillar Hypotheses

The groups below are editorial hypotheses, not validated SEO architecture.
Keyword research, live SERP review, competitor/content-gap analysis, and relevant
Search Console evidence must confirm intent, naming, priority, and
cannibalization risk before titles, slugs, or pillar relationships are approved.

### Internationalization And Technical SEO

- [ART-004](article-backlog.md#art-004--localizing-a-nextjs-portfolio-without-changing-its-english-urls)
  is the provisional broad migration article.
- [ART-005](article-backlog.md#art-005--how-to-keep-localized-404s-real-in-the-nextjs-app-router)
  is the provisional localized HTTP-status article.
- [ART-006](article-backlog.md#art-006--localized-ui-english-only-articles-an-honest-hreflang-strategy)
  is the provisional editorial-language and metadata article.

Research must prove that their promises are distinct enough to avoid competing
for the same query. Internal linking and final sequencing are not approved until
that evidence exists.

### Figma, Design Systems, And Runtime Evidence

- [ART-001](article-backlog.md#art-001--a-reproducible-figma-to-web-audit-evidence-before-confidence)
  is the provisional audit-method article.
- [ART-002](article-backlog.md#art-002--from-54-figma-variants-to-one-tested-react-button-contract)
  is the provisional component-contract article.
- [ART-003](article-backlog.md#art-003--a-mobile-navigation-that-survives-resize-escape-and-focus-restoration)
  is the provisional navigation lifecycle article.

Research must determine whether ART-002 and ART-003 support a broader audit
intent or deserve independent search targets.

### Delivery And Reliability

- [ART-007](article-backlog.md#art-007--keeping-a-portfolio-useful-when-its-cms-is-unavailable)
  covers the static/dynamic content failure boundary.
- [ART-008](article-backlog.md#art-008--immutable-docker-delivery-for-a-small-nextjs-and-payload-site)
  covers immutable artifacts, host verification, readiness, and rollback limits.

Research must separate general architecture intent from operational tutorial
intent. Sanitized deployment evidence and owner approval remain mandatory.

## Candidate Ideas To Triage

The following ideas are outside the canonical backlog. They have no ART ID, no
backlog status, and no claim that they satisfy the Global Definition Of Ready.
Before research or drafting, each accepted idea must receive a complete backlog
entry with audience, unique promise, evidence contract, risks, approval boundary,
outline, and readiness criteria.

- **Responsive Copy Without Deleting the Original Message** / **Responzivní copy
  bez mazání původního sdělení** — candidate for responsive content,
  localization, provenance, and accessibility evidence after the Home work is
  complete.
- **Building a Customer Portal as a Frontend System, Not a Collection of
  Screens** / **Zákaznický portál jako frontendový systém, ne sbírka obrazovek**
  — candidate requiring owner-confirmed scope, publishable artifacts, outcome
  evidence, and NDA/confidentiality approval. Home, Work, and `seed.ts` copy are
  discovery leads only; every relevant `seed.ts` statement is pending NDA,
  confidentiality, factual-claim, and owner-scope review.
- **Accessibility Refactoring with React Aria Inside an Existing Product** /
  **Refaktoring přístupnosti pomocí React Aria v existujícím produktu** —
  candidate requiring verified barriers, implementation scope, validation,
  limitations, artifacts, and client approval.
- **Making Frontend Decisions Repeatable Across a Team** / **Jak dělat
  frontendová rozhodnutí opakovatelná napříč týmem** — candidate requiring
  first-hand decisions, alternatives, communication artifacts, follow-up,
  evidence of effects, and confidentiality review.

## Research And Draft Sequence

The first research sequence is provisionally **1 -> 2 -> 6**, mapped to
**ART-004 -> ART-005 -> ART-006**.

1. Research ART-004 as the broad URL-contract problem.
2. Research ART-005 as the narrower localized real-404 problem.
3. Research ART-006 as the English-only editorial and `hreflang` problem.

This is not a publication schedule. Each item may enter drafting only after it
individually satisfies the backlog's Global Definition Of Ready. The order may
change when keyword, SERP, competitor, Search Console, or cannibalization
research contradicts the hypothesis.

Before publication, every article must satisfy the backlog's complete publication
gates, including:

- unique reviewed title, description, canonical URL, and honest search intent;
- Article and Breadcrumb structured data;
- accessibility, heading, link, code-overflow, media, and language review;
- metadata, canonical, `noindex`, share URL, sitemap, and production-like preview;
- post-publication Search Console observation without invented ranking or volume
  claims.

## Ordering After The Initial Research

Subject to the same Definition Of Ready and research gates:

1. Complete the Figma/Home evidence required by ART-001, ART-002, and ART-003.
2. Produce controlled failure/recovery and sanitized operational evidence for
   ART-007 and ART-008.
3. Triage the four candidate ideas above. Promote only accepted candidates into
   the canonical backlog before considering outlines or priority.

No item in this roadmap is `draft-ready`, `approved`, or authorized for
publication merely because it appears earlier in the ordering.
