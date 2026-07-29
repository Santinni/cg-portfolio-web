# Codeguy — Brand Decision Log

| Field | Value |
| --- | --- |
| Brand | Codeguy |
| Owner | Karel Kutchan |
| Version | 1.0 |
| Last updated | 2026-07-29 |
| Scope | Brand strategy, naming, voice, color, typography, geometry, logo status, imagery, accessibility, localization, source governance |
| Companion document | `docs/brand/brand-guidelines.md` |

This log records **what was decided, why, and what would reopen it**. The guidelines say what to do; this log says how settled it is. When the two appear to disagree about status, this log governs.

---

## 1. Status vocabulary

| Status | Meaning | How to treat it |
| --- | --- | --- |
| `locked` | Decided and stable. | Follow it. Changing it requires owner approval and a version bump. |
| `provisional` | Working decision, adopted deliberately, expected to be revisited. | Follow it, but do not build hard dependencies on it or present it as final. |
| `open` | Not decided. | Do not invent an answer. Use an explicitly interim solution and flag it. |
| `deprecated` | Formerly used, now withdrawn. | Do not use in new work. Replace on contact. |

---

## 2. Decisions

| ID | Status | Decision | Rationale | Source / evidence | Review trigger |
| --- | --- | --- | --- | --- | --- |
| BD-01 | `locked` | Brand name is `Codeguy` in prose and as the product name; single capital, one word. | One canonical spelling removes ambiguity across site, CV, documents and code. | Current implementation and approved naming | Legal name change or a rebrand decision |
| BD-02 | `deprecated` | `CodeGuy` and `CodeGuy.cz` are withdrawn as spellings. | Inconsistent casing weakened a name that appears in nearly every surface. | Audit of existing spellings | None — replace wherever found |
| BD-03 | `locked` | Primary domain is `codeguy.cz`, lowercase in body copy. | Owned domain and the brand's stable public address. | Live domain | Domain change or added primary domain |
| BD-04 | `locked` | Positioning: Senior Frontend Engineer based in Prague, more than ten years in web development, senior/lead work across React, TypeScript, Next.js, component systems, accessibility, testing and code review. | Accurate, verifiable and matches the decisions the target audiences actually make. | Verified professional history | Material change in role, seniority, stack or location |
| BD-05 | `locked` | Brand promise is the existing headline, fixed in both languages: "I build frontend systems for products that have to last." / "Stavím frontendové systémy pro produkty, které musí vydržet." Supporting idea: architecture, accessibility and long-term maintainability are part of delivery, not follow-up work. | The line already exists, tests well against the actual offer, and needs no new claim invented on top of it. | Current headline and supporting copy, EN and CS | A positioning change under BD-04 |
| BD-06 | `locked` | Four ordered principles: 1) Architecture with a reason, 2) Accessibility by default, 3) Quality that supports delivery, 4) Leadership through clarity — with Czech equivalents. | Ordering makes them usable for resolving real conflicts, not just decorative. | Current working principles, EN and CS | A shift in how the work is actually practised |
| BD-07 | `locked` | Voice is precise, technically credible, senior and decisive without arrogance; clear about trade-offs and ownership; evidence-led; concise, calm and direct. Named hype vocabulary is banned. | Differentiates on credibility, which is what technical leaders and peers assess. | Current voice evidence | Audience or channel change that the voice demonstrably fails |
| BD-08 | `locked` | Never inflate or invent clients, results, metrics, roles or years. Numbers require a stated basis; client names require permission. | The brand's core claim is durability and honesty; a single fabricated metric invalidates it. | Explicit brand requirement | None |
| BD-09 | `locked` | English and Czech are both primary, written natively rather than machine-translated, and equivalent in intent rather than word-parallel. | Prague-based practice serving both local and international audiences; literal translation reads as unprofessional in Czech. | Existing bilingual EN/CS copy | Adding a third language, or dropping one market |
| BD-10 | `locked` | Canonical primary brand teal is `#0A6E80`, with light hover `#085A6A` and pressed `#064854`. | Establishes one reference brand value for print, documents and any single-value context. | Semantic CSS and approved Figma | Contrast failure or a deliberate palette revision |
| BD-11 | `locked` | Dark mode expresses the same brand color adaptively as cyan `#22D3EE`, hover `#67E8F9`, pressed `#06B6D4`. | The teal is insufficiently legible on the dark page surface; the adaptive value preserves the brand's role while meeting contrast. | Semantic CSS and approved Figma | Change to dark surface values or a contrast failure |
| BD-12 | `locked` | Light and dark are one identity expressed through semantic, adaptive tokens — not two brands or two palettes. Reference color by role, never by raw hue name. | Prevents the two modes drifting into separate identities and keeps implementation token-driven. | Semantic CSS token architecture | A fundamental change to the theming model |
| BD-13 | `deprecated` | Legacy yellow `#FACC15` and hover `#FBBF24` are withdrawn from all new brand and product work. | They belong to the previous identity and clash with the teal/cyan system. | Legacy identity vs. current semantic CSS | None — replace with brand tokens on contact |
| BD-14 | `locked` | Contrast minimums: 4.5:1 for body and small text, 3:1 for large text and meaningful non-text UI, verified in both modes. Color is never the sole carrier of meaning. | Accessibility is the second principle and an identity-quality requirement. | Brand accessibility requirement | Stricter standard adopted, or a specific pair failing |
| BD-15 | `locked` | Primary typeface is Inter, latin + latin-ext, at weights 300/400/500/600/700. Monospace is reserved for literal code and technical content using a system stack. | Inter is already implemented, has full Czech diacritic coverage in latin-ext, and suits a technical, typography-led system. | Semantic CSS and approved Figma | Licensing, rendering or performance problem, or a typographic redesign |
| BD-16 | `locked` | Responsive type tiers as specified: display 40/48 → 64/68; H1 36/44 → 48/56; H2 30/38 → 36/44; body 16/24; body large 17/27 → 18/28; label 11/16 → 12/16. | Already implemented and validated across breakpoints in the approved design. | Semantic CSS and approved Figma | Breakpoint change or a legibility issue in production |
| BD-17 | `locked` | Spacing scale 4/8/12/16/20/24/32/40/48/64/80/96/128 px. Radii 0/4/8 px, with pill reserved for semantic chips and tags or explicitly approved patterns. Minimum touch target 44 px. Large button: 52 px high, 4 px radius, 20 px inline padding, 8 px icon gap. | Restrained geometry supports the minimal, technical, typography-led character and keeps implementation consistent. | Semantic CSS and approved Figma | Component-system revision or a usability finding |
| BD-18 | `locked` | Visual character is minimal, technical and typography-led: generous whitespace, limited decoration. Focus, contrast, keyboard behaviour and reduced motion are identity-quality requirements. | Restraint reads as senior and lets the work carry the message; treating a11y as identity prevents it being cut under delivery pressure. | Approved Figma and brand requirements | A strategic repositioning |
| BD-19 | `locked` | Primary digital identifier is the `CODEGUY` wordmark: Inter Semi Bold 600, 18/24, zero tracking, rendered as live text in the primary text token. | Already implemented, adapts across modes for free, stays accessible and scalable, and needs no unfinished asset. | Current navigation implementation | Completion of the secondary mark system, or a typographic identity change |
| BD-20 | `open` | Final production geometry, clearspace, minimum sizes and light/dark assets for a secondary CG mark are **not decided**. No new logo is to be invented or redrawn. | The existing monogram conflicts with the current color system; a replacement requires a proper design pass, not a documentation guess. | Existing CG monogram assets vs. current identity | Start of a dedicated mark design engagement |
| BD-21 | `provisional` | Until BD-20 closes, small square contexts (favicon, PWA icon, avatar) use an explicitly interim typographic or `CODEGUY`-derived treatment on a brand-token background, labelled interim. | These contexts cannot be left empty, but an interim solution must not harden into de facto identity. | Practical requirement pending BD-20 | BD-20 resolution |
| BD-22 | `deprecated` | Legacy assets are withdrawn as current identity: existing CG monogram, yellow favicon set, `public/icon.svg`, `src/assets/icons/codeguy-logo.svg`, current favicons and PWA icons, `public/kklogo.svg`. Each needs an explicit replace / redraw / retire decision. | They encode the legacy yellow identity. They may stay in the repository for continuity but must never be described as approved. | Repository audit against current identity | Per-asset migration decision, each logged separately |
| BD-23 | `open` | The PWA manifest's white theme and background values are unresolved against the adaptive light/dark surface tokens; browser chrome must be audited during implementation. | White chrome contradicts the dark-mode page surface `#08090C` and breaks the single-identity principle at the OS boundary. | Current manifest vs. semantic surface tokens | The manifest and browser-chrome audit |
| BD-24 | `provisional` | Imagery is evidence-led: real product UI (with permission), real code, structural diagrams in brand tokens, and a plain professional portrait. No stock developer photography, abstract tech gradients, fabricated dashboards, or generic terminal/bracket/cursor motifs without a defensible reason. | The work is the proof, but this direction has not yet been tested across all intended brand applications. | Brand voice and current visual character | After the first portfolio, social and document application set is reviewed |
| BD-25 | `locked` | Design source of truth is the approved Figma file `cs38WzlXKY9xfDYBinoKel`, "Codeguy Portfolio — Final Design" (Foundations, Components, responsive screens, light/dark). Brand guidance is added as a dedicated page in that same file so it reuses the real variables and styles. | Keeping brand and product in one file prevents the brand page drifting from shipped tokens. | Approved Figma file | File restructure or migration to another tool |
| BD-26 | `locked` | Implementation source of truth for exact values is the repository's semantic CSS tokens. `docs/brand/brand-guidelines.md` governs intent, permission and status. | Separates "what the value is" from "what it means and whether it is allowed", so neither document has to duplicate the other. | Repository structure | A change to the token architecture |
| BD-27 | `deprecated` | `docs/project-brief.md` is historical input only, not the visual source of truth. Its legacy dark/yellow system, yellow CG mark, pill/floating controls and older content architecture do not describe current work. | It predates the current identity; leaving its status ambiguous is the main risk of legacy patterns re-entering new work. | `docs/project-brief.md` vs. current semantic CSS and Figma | Rewrite or explicit archival of that file |
| BD-28 | `locked` | Karel Kutchan owns brand strategy, voice, color, typography and logo status. No sub-brands, product names or service labels are created under Codeguy. | Single-person professional brand; a sub-brand structure would add governance overhead with no audience benefit. | Brand governance requirement | Change in business structure, such as forming a studio |

---

## 3. Change procedure and ownership

**Owner:** Karel Kutchan. All status changes require the owner's approval.

**To change a decision:**

1. Identify the decision by ID and state which review trigger has fired.
2. Propose the change with rationale and the evidence behind it.
3. Check consequences — particularly contrast in both modes (BD-14), the single-identity principle (BD-12), and Czech coverage (BD-09, BD-15).
4. Get owner approval.
5. Update this log **and** `docs/brand/brand-guidelines.md` in the same change. Keep the superseded row with its final status rather than deleting it, so history stays readable.
6. Update the guidelines' version and `Last updated` date. Changes to strategy, voice, color, typography or logo status are a minor version bump; a repositioning or visual-system replacement is a major one.
7. Where the change affects the design system, update the approved Figma file and semantic CSS tokens so the three sources stay aligned.

**Adding a decision:** use the next free `BD-nn`, assign a status from §1, and always record a review trigger. A decision with no review trigger cannot be maintained.

**Closing an `open` item:** move it to `locked` or `provisional`, record the rationale and evidence, and clear the corresponding line from the guidelines' open-work checklist (§14) in the same change.

**For external AI agents and contributors:** treat `locked` as binding, `provisional` as usable but not final, `open` as "do not invent an answer — ask or flag it", and `deprecated` as "never in new work". If a requested change would contradict a `locked` decision, say so and reference the ID rather than complying silently.
