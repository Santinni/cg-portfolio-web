# Codeguy — Brand Identity Guidelines

| Field | Value |
| --- | --- |
| Brand | Codeguy |
| Domain | codeguy.cz |
| Owner | Karel Kutchan |
| Version | 1.0 |
| Last updated | 2026-07-29 |
| Status | Current for strategy, voice, color, typography and digital UI expression. Logo system remains partially provisional. |
| Languages | English (primary), Czech (primary) |

---

## 1. Purpose and scope

This manual is the working reference for how Codeguy is expressed in words, type, color, layout and code. It covers the personal portfolio, CV, case studies, technical articles, social/OG assets and professional documents.

It is written to be used, not admired. Designers, developers, writers and external AI agents should be able to answer a concrete question here — which teal, which weight, which Czech phrasing, which asset is legacy — without asking.

Three things this manual deliberately does not do:

- It does not invent a logo system. Where the mark is unfinished, it says so.
- It does not create new business claims. Every claim traces to verified evidence.
- It does not replace the design source of truth. Figma and the semantic CSS tokens remain authoritative for exact values; this manual explains intent and governs use.

Status labels used throughout: **approved**, **provisional**, **open**, **deprecated**. Treat anything unlabelled as approved.

---

## 2. Brand foundation

### 2.1 Positioning

Karel Kutchan is a Senior Frontend Engineer based in Prague, with more than ten years in web development. Current work is senior/lead frontend engineering across React, TypeScript, Next.js, component systems, accessibility, testing and code review.

The brand is a professional identity, not a studio or agency persona. Codeguy is how that engineer's work is presented; Karel Kutchan is who does it. Both names appear together, never in competition.

### 2.2 Brand promise

The promise is the existing headline. Do not paraphrase it into something stronger.

> **EN:** I build frontend systems for products that have to last.
>
> **CS:** Stavím frontendové systémy pro produkty, které musí vydržet.

The supporting idea that makes it concrete:

> **EN:** Architecture, accessibility and long-term maintainability are part of delivery, not follow-up work.
>
> **CS:** Architektura, přístupnost a dlouhodobá udržitelnost jsou součástí dodávky, ne práce odložená na později.

The headline is the primary claim across all surfaces. Supporting copy may restate its logic in context, but the headline itself is fixed wording in both languages.

### 2.3 Audiences

Ordered by decision weight, not volume.

| Audience | What they need to reach a decision | Where they meet the brand |
| --- | --- | --- |
| Prospective product teams and technical leaders | Evidence of architectural judgement, delivery reliability and code-review depth | Portfolio, case studies, articles |
| Recruiters and HR | Fast role fit: seniority, stack, location, availability, language | CV, portfolio landing, professional profiles |
| Selected consulting clients | Scope clarity, ownership, trade-off honesty | Portfolio, direct documents, case studies |
| Frontend peers | Technical substance worth engaging with | Articles, code, component work |

One voice serves all four. Depth changes; register does not. Never write "down" to recruiters or perform complexity for peers.

### 2.4 Values and principles

Ordered. When two principles pull against each other, the higher one wins.

1. **Architecture with a reason** — *Architektura s důvodem*  
   Structural choices are justified by the problem, not by preference or novelty. A pattern that cannot be explained is not ready to ship.
2. **Accessibility by default** — *Přístupnost od začátku*  
   Focus, contrast, keyboard behaviour and reduced motion are part of the definition of done.
3. **Quality that supports delivery** — *Kvalita podporující dodávku*  
   Testing and review exist to make shipping safer and faster, not to slow it down. Quality that blocks delivery is a design failure.
4. **Leadership through clarity** — *Vedení skrze srozumitelnost*  
   Influence comes from making complex work understandable to the people who have to decide about it.

These principles also govern the brand itself. A guideline that cannot be justified, that harms accessibility, that obstructs delivery, or that obscures meaning should be changed.

---

## 3. Naming and brand architecture

| Use | Correct | Notes |
| --- | --- | --- |
| Prose and product name | `Codeguy` | Canonical. Single capital, one word. |
| Domain | `codeguy.cz` | Lowercase in body copy. |
| Navigation wordmark | `CODEGUY` | Uppercase is a typographic treatment of the wordmark, not an alternate spelling. |
| Person | `Karel Kutchan` | Full name on first reference in any document. |

**Deprecated spellings.** `CodeGuy` and `CodeGuy.cz` are inconsistent with the current identity. Do not use them in new work. Where they appear in existing files, correct them as those files are touched.

### Relationship between the two names

Codeguy is the brand surface. Karel Kutchan is the professional identity behind it. In practice:

- The site and social handles carry **Codeguy**.
- The CV, contracts, invoices and formal correspondence lead with **Karel Kutchan**, with Codeguy and codeguy.cz as supporting identifiers.
- Case studies and articles are authored by **Karel Kutchan**, published on Codeguy.

Do not construct sub-brands, product names or service labels under Codeguy. There is one brand.

---

## 4. Voice and tone

### 4.1 Core rules

The voice is precise, senior and calm. Decisive without arrogance, evidence-led, honest about trade-offs and ownership.

- Lead with the outcome or the decision, then the reasoning.
- Name the trade-off. Work with no cost described reads as marketing.
- Prefer plain language. Use a technical term when it is the precise term, not to signal expertise.
- State what you did and what you did not do. Scope honesty is part of seniority.
- Keep sentences short enough to be read once.

**Never use:** "rockstar", "ninja", "guru", "world-class", "revolutionary", or comparable hype. No fabricated metrics. No unnamed claims presented as proof. Never frame accessibility, testing or maintenance as optional extras.

Tone shifts by surface, voice does not: the CV is compressed and factual, case studies are structured and reflective, articles are explanatory, UI microcopy is minimal and literal.

### 4.2 English examples

| Don't | Do |
| --- | --- |
| A world-class frontend engineer delivering revolutionary user experiences. | Senior Frontend Engineer working on React and TypeScript product systems, with more than ten years in web development. |
| Improved performance by 300%. | Reduced the main-bundle size by removing three overlapping date libraries; the specific figures are available on request. |
| Passionate about clean code and best practices. | I treat architecture, accessibility and maintainability as part of delivery, not as follow-up work. |
| We also added accessibility. | Keyboard navigation and focus handling were part of the component contract from the first version. |
| Led a team to crush aggressive deadlines. | Led frontend delivery for the release, including code review and the accessibility pass. |

### 4.3 Czech examples

| Don't | Do |
| --- | --- |
| Špičkový frontend developer s revolučním přístupem k UX. | Senior frontend engineer se zaměřením na produktové systémy v Reactu a TypeScriptu, více než deset let ve webovém vývoji. |
| Zvýšil jsem výkon o 300 %. | Zmenšil jsem hlavní bundle odstraněním tří překrývajících se knihoven pro práci s daty; konkrétní čísla rád doplním. |
| Jsem zapálený do čistého kódu a best practices. | Architekturu, přístupnost a udržitelnost považuji za součást dodávky, ne za práci odloženou na později. |
| Přidali jsme i přístupnost. | Ovládání klávesnicí a práce s fokusem byly součástí kontraktu komponenty od první verze. |
| Vedl jsem tým a zvládli jsme nemožné termíny. | Vedl jsem frontendovou část releasu včetně code review a kontroly přístupnosti. |

Czech is written as professional Czech, not translated English. Avoid literal calques, keep declension natural, and let sentence structure differ from the English original where good Czech requires it. Intent must be equivalent; wording need not be parallel. Retain established English technical terms (`frontend`, `code review`, `bundle`, `React`) rather than forcing Czech substitutes.

### 4.4 Claims and evidence policy

Never inflate or invent clients, results, metrics, roles or years.

- **Approved standing claims:** more than ten years in web development; senior/lead frontend work across React, TypeScript, Next.js, component systems, accessibility, testing and code review; based in Prague.
- **Numbers** require a real source and a stated basis (what was measured, how, over what period). A number without a basis is not evidence.
- **Client names** appear only with permission. Otherwise describe the context generically ("a B2B SaaS product team") without hinting at identity.
- **Role language** must match what was actually held. "Led" means led; "contributed to" means contributed to.
- If a claim cannot be substantiated on request, remove it rather than soften it.

---

## 5. Logo and wordmark

### 5.1 Primary wordmark — approved

The `CODEGUY` wordmark is the current primary digital identifier.

| Property | Value |
| --- | --- |
| Text | `CODEGUY` (uppercase) |
| Family | Inter |
| Weight | Semi Bold 600 |
| Size / line height | 18 / 24 |
| Tracking | 0 |
| Color | Primary text token — ink in light mode, white in dark mode |

The wordmark is set type, not an image. Render it as text so it inherits the theme, scales with the type system and stays accessible. Do not letterspace it, condense it, outline it, add a gradient, place it on a busy background, or substitute another family.

On brand surfaces the wordmark may be paired with `Karel Kutchan` in secondary text at label or body scale. Keep at least 8 px between them and never merge them into a single lockup graphic.

### 5.2 Secondary CG mark — provisional / open

A compact secondary mark is needed for favicons, PWA icons, avatars and small square contexts. Its final form is **not decided**.

Open, and not to be assumed in new work:

- final production geometry of the CG mark
- clearspace rules
- minimum sizes
- separate light and dark asset variants

Do not invent, redraw or approximate this mark. Until it is resolved, small square contexts should use the simplest defensible interim treatment available — a `CODEGUY`-derived or plain typographic placeholder on a brand-token background — and be flagged as interim rather than published as final identity.

### 5.3 Legacy asset warning — deprecated

The following are **legacy** and conflict with the current teal/cyan system. Do not treat them as current, and do not reuse them in new brand or product work:

- existing CG monogram assets
- the yellow favicon and derived icon set
- `public/icon.svg`
- `src/assets/icons/codeguy-logo.svg`
- current favicons and PWA icons
- `public/kklogo.svg`

Each of these needs an explicit migration decision — replace, redraw or retire. Until that decision is recorded, they may remain in the repository for continuity but must not be described as approved identity. See §15.

---

## 6. Color system

Light and dark are **one identity expressed through semantic, adaptive tokens** — not two brands and not two palettes. The brand's hue adapts so that its role stays constant: the same token means "brand action" in both modes, and it resolves to the value that is legible and correct for that mode.

Always reference color by semantic role. Never write raw hue names ("the teal", "the cyan") into code, design specs or copy.

### 6.1 Brand color

| Role | Light | Dark |
| --- | --- | --- |
| Brand (canonical) | `#0A6E80` | `#22D3EE` |
| Brand hover | `#085A6A` | `#67E8F9` |
| Brand pressed | `#064854` | `#06B6D4` |

`#0A6E80` is the canonical primary brand teal and the reference value for the brand as a whole — print, documents and any single-value context. `#22D3EE` is the adaptive dark-mode expression of that same brand color, chosen for legibility on dark surfaces. Stating one without the other misrepresents the system.

### 6.2 Neutrals, surfaces, text and borders

| Role | Light | Dark |
| --- | --- | --- |
| Surface — page | `#FFFFFF` | `#08090C` |
| Surface — raised | `#F8FAFF` | `#151A22` |
| Surface — subtle / accent band | `#F1F4F8` | `#0C2D38` |
| Text — primary | `#08090C` | `#FFFFFF` |
| Text — secondary | `#4A5963` | `#9AA6B2` |
| Border — default | `#D8DEE8` | `#29313D` |
| Border — strong / control | `#7C8D99` | `#5F6975` |

Core ink is `#08090C` and white is `#FFFFFF`. Both are structural anchors: ink is the light-mode text and dark-mode page, white is the light-mode page and dark-mode text.

### 6.3 Deprecated yellow

`#FACC15` and its hover `#FBBF24` belong to the legacy identity. They are **deprecated** for all new brand and product work. Do not use them for accents, links, focus, highlights, illustration or icons. Where they persist in legacy assets, replace them with the brand tokens as part of migration.

### 6.4 Accessibility and contrast rule

Contrast is an identity requirement, not an engineering afterthought.

- Body and small text: minimum **4.5:1** against its surface.
- Large text (roughly 24 px+, or 19 px+ bold) and meaningful non-text UI such as icons, borders of controls and focus indicators: minimum **3:1**.
- Verify every color pair **in both modes**. A pass in light mode is not a pass.
- Never use color as the only carrier of meaning. Pair it with text, icon or shape.
- Focus indicators must be visible against every surface they can appear on, in both modes.

If a chosen pair fails, change the pair — do not lower the bar.

---

## 7. Typography

**Primary family:** Inter, latin + latin-ext. The latin-ext subset is required for Czech diacritics and is not optional.

**Weights in use:** 300, 400, 500, 600 (where the wordmark or navigation requires it), 700. Do not introduce other weights or synthesise bold/italic.

**Monospace** is reserved for literal code and technical content — identifiers, commands, file paths, tokens — using a system monospace stack. It is not a decorative or brand voice.

### 7.1 Responsive type tiers

| Tier | Compact | Wide |
| --- | --- | --- |
| Display | 40 / 48 | 64 / 68 |
| H1 | 36 / 44 | 48 / 56 |
| H2 | 30 / 38 | 36 / 44 |
| Body large | 17 / 27 | 18 / 28 |
| Body | 16 / 24 | 16 / 24 |
| Label | 11 / 16 | 12 / 16 |

Values are size / line-height in px.

### 7.2 Practice

- Composition is typography-led. Hierarchy comes from scale, weight and space — not from rules, boxes or color blocks.
- One display or H1 per view. Two competing headlines means the page has no argument.
- Body copy sits at a comfortable measure; long full-width paragraphs are a layout error.
- Czech runs longer than English. Design headlines and labels to survive roughly 20–30% more characters without reflowing into a broken hierarchy.
- Never centre long-form body text, and never justify it.

---

## 8. Layout, geometry, iconography and motion

The visual character is minimal, technical and typography-led: generous whitespace, limited decoration, clear structure. Restraint is the expression, not an absence of design.

### 8.1 Spacing

Scale: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128` px. Use the scale — no arbitrary intermediate values.

Space carries the hierarchy. Related elements sit close; sections are separated by clearly larger steps from the upper end of the scale.

### 8.2 Radii and shape

- Core radii: `0`, `4`, `8` px.
- `4` px is the working default for controls and cards.
- Pill radius is reserved for semantic chips and tags, or explicitly approved patterns. It is not a general button or container style.
- Prefer borders and surface steps over shadows. Where elevation is needed, keep it subtle and consistent.

### 8.3 Controls

| Property | Value |
| --- | --- |
| Minimum touch target | 44 px |
| Large button height | 52 px |
| Large button radius | 4 px |
| Large button inline padding | 20 px |
| Large button icon gap | 8 px |

The 44 px minimum applies to the interactive area, which may exceed the visible bounds of a small control.

### 8.4 Iconography

Icons are functional: consistent stroke weight, geometric, aligned to the type they sit beside, sized from the spacing scale. They label and clarify — they do not decorate.

Avoid generic developer clichés — terminal windows, angle brackets, blinking cursors, `{}` motifs — unless there is a defensible, specific brand reason. They are a substitute for a point of view, not a point of view.

### 8.5 Motion

Motion clarifies state change and nothing else. Keep transitions short and easing calm. No parallax, no attention-seeking entrance animation, no motion that delays interaction.

`prefers-reduced-motion` must be honoured everywhere. Reduced motion means the interface still communicates every state change — through opacity, position or immediate change — never that information disappears.

Focus, contrast, keyboard behaviour and reduced motion are **identity-quality requirements**. A surface that fails them is off-brand regardless of how it looks.

---

## 9. Imagery and evidence — provisional

This direction is usable for current work but remains provisional until it has been tested across portfolio, social and document applications. The brand's evidence is the work, not stock photography.

**Preferred, in order:**

1. Real product UI — actual screens from actual work, with permission and any sensitive data removed.
2. Real code and component examples, set in the monospace stack.
3. Structural diagrams — architecture, component relationships, data flow — drawn in brand tokens and type.
4. A professional portrait of Karel Kutchan, plain and current, for CV and profile contexts.

**Avoid:** generic stock developer photography, abstract "tech" gradients and particle meshes, fake dashboards, decorative code that says nothing, and mockups that imply client work that did not happen.

Screenshots must be honest: no invented metrics in a chart, no fabricated client branding, no composited result that never shipped. If a screen cannot be shown, describe the work in words instead. A well-written paragraph is better evidence than a misleading image.

All imagery needs meaningful alternative text. Decorative images should be marked decorative rather than given filler descriptions.

---

## 10. Application examples

### 10.1 Portfolio UI

- Wordmark `CODEGUY` in navigation, Inter 600, 18/24, zero tracking, primary text token.
- Headline uses the fixed positioning line in the active language at display scale.
- Full light/dark support via semantic tokens, with no mode-specific hardcoded colors.
- Language switch between English and Czech is visible and reachable by keyboard.
- Primary actions use the large button spec; secondary actions use border-strong with the brand token for text.
- Generous section spacing from the upper spacing scale; no decorative dividers where space will do.

### 10.2 CV and PDF

- Inter throughout, with latin-ext for Czech. Body at 16/24 or body-large; headings from the H1/H2 tiers.
- **Karel Kutchan** leads; `Codeguy` and `codeguy.cz` are supporting identifiers.
- Print and PDF use the light-mode palette with canonical brand teal `#0A6E80` as the only accent. Do not use the dark-mode cyan in print — it is the dark-surface expression of the brand, not a print color.
- Role, stack and period stated factually. No skill-percentage bars, no star ratings, no invented metrics.
- Keep separate English and Czech versions rather than mixing languages in one document.
- PDFs should be tagged and text-selectable, not exported as flat images.

### 10.3 Case studies and articles

Case studies follow a consistent shape: context, constraint, decision, trade-off, outcome, what would be done differently. The trade-off and the honest retrospective are what make them credible.

- Attribute scope precisely — what was owned personally versus delivered by the team.
- Code samples in the monospace stack with a language label.
- Articles are explanatory rather than promotional; they teach a decision instead of advertising a service.
- Both languages where the audience justifies it; a partial translation should not be published as complete.

### 10.4 Social, OG and professional documents

- OG images are typography-led: the claim or article title set in Inter on a brand surface token, with `codeguy.cz` as a small identifier. No stock imagery, no decorative code.
- Verify OG text contrast at the size it actually renders in feed previews.
- Avatars and small square contexts are affected by the **open** secondary mark decision (§5.2) — use an interim treatment and do not publish it as final identity.
- Profile bios use the positioning language in the platform's language, kept within the approved standing claims.
- Proposals, invoices and formal documents lead with **Karel Kutchan**, use light-mode tokens and the canonical teal, and stay factual in tone.

---

## 11. Accessibility and localization

### 11.1 Accessibility

Accessibility is the second principle and a definition-of-done item. Required on every surface:

- Contrast per §6.4, verified in both modes.
- Visible, sufficiently contrasting focus indicators on every interactive element — never `outline: none` without an equivalent replacement.
- Full keyboard operability: logical order, no traps, working escape from overlays, correct focus return after dismissal.
- Semantic HTML first; ARIA only where semantics genuinely fall short.
- 44 px minimum touch targets.
- `prefers-reduced-motion` honoured without loss of information.
- Meaningful alternative text; decorative images marked as such.
- Never rely on color alone to convey meaning.

### 11.2 Localization

English and Czech are both primary. Neither is a translation of the other in status.

- Set the correct `lang` attribute per document and per switched region.
- Load Inter with latin-ext. Verify `ě š č ř ž ý á í é ú ů ď ť ň` render and align correctly, including in the wordmark context and at display sizes.
- Czech text runs longer; test headlines, labels, buttons and navigation for reflow and truncation.
- Czech uses a comma decimal separator and non-breaking space before units and `%`. Dates and number formats follow the locale.
- Write Czech natively — see §4.3. Machine translation is a starting draft, never the published text.
- Keep an equivalent quality bar in both languages. If a page cannot be properly localized yet, label it clearly rather than shipping a degraded version.
- Keep the URL language strategy consistent across the site, and make the language switch discoverable and keyboard-accessible.

---

## 12. Do / don't summary

| Do | Don't |
| --- | --- |
| Write `Codeguy` in prose, `CODEGUY` as the navigation wordmark | Use `CodeGuy` or `CodeGuy.cz` |
| Reference color by semantic token role | Hardcode hexes or say "the teal" in specs |
| Treat `#0A6E80` and `#22D3EE` as one adaptive brand color | Present light and dark as two identities |
| Verify contrast in both modes | Assume a light-mode pass covers dark |
| Use Inter with latin-ext | Ship Czech without diacritic support |
| Use the spacing scale and 0/4/8 radii | Invent spacing values or apply pill radius broadly |
| Show real work, honestly scoped | Use stock developer imagery or fabricated dashboards |
| State trade-offs and actual ownership | Claim credit for team-wide outcomes |
| Keep numbers sourced and explained | Publish metrics without a basis |
| Treat focus, contrast, keyboard and reduced motion as identity requirements | Frame accessibility or testing as extras |
| Render the wordmark as live text | Recreate it as an image or a new lockup |
| Flag the CG mark as provisional | Publish an invented monogram as final |
| Retire legacy yellow assets on contact | Reuse `#FACC15` in new work |

---

## 13. Canonical sources and governance

| Source | Role | Status |
| --- | --- | --- |
| Figma `cs38WzlXKY9xfDYBinoKel` — "Codeguy Portfolio — Final Design" | Design source of truth: Foundations, Components, responsive screens, light/dark modes. Brand guidance lives as a dedicated page in this same file so it reuses the real design-system variables and styles. | Approved |
| Semantic CSS tokens in the repository | Implementation source of truth for color, type and spacing values | Approved |
| `docs/brand/brand-guidelines.md` (this file) | Brand intent, rules and usage | Approved |
| `docs/brand/brand-decision-log.md` | Decision status, rationale and review triggers | Approved |
| `docs/project-brief.md` | Historical input only — legacy dark/yellow system, yellow CG mark, pill/floating controls, older content architecture | Not current; historical reference |
| Legacy icon, favicon, PWA and logo assets (§5.3) | Awaiting explicit migration decisions | Deprecated |

**Precedence.** For exact values, the semantic CSS tokens and the approved Figma file govern. For intent, permission and status, this manual governs. Where they disagree, treat it as a defect and resolve it explicitly rather than choosing silently. `docs/project-brief.md` never overrides either.

**Owner:** Karel Kutchan. All changes to brand strategy, voice, color, typography or logo status require the owner's approval and a corresponding entry in the decision log.

---

## 14. Open work and migration checklist

Items that are unresolved. None may be described as approved until closed and logged.

**Logo system**

- [ ] Decide final production geometry for the secondary CG mark.
- [ ] Define its clearspace and minimum sizes.
- [ ] Produce light and dark asset variants.
- [ ] Define the interim treatment for favicons, PWA icons and avatars until the above lands.

**Legacy asset migration** — each needs an explicit replace / redraw / retire decision:

- [ ] `public/icon.svg`
- [ ] `src/assets/icons/codeguy-logo.svg`
- [ ] Favicon set
- [ ] PWA icon set
- [ ] `public/kklogo.svg`
- [ ] Any remaining yellow-identity assets

**Implementation audits**

- [ ] Audit the PWA manifest: theme and background colors are currently white, so adaptive browser chrome needs review against light/dark surface tokens.
- [ ] Sweep for deprecated `CodeGuy` / `CodeGuy.cz` spellings.
- [ ] Sweep for `#FACC15` / `#FBBF24` usage in code and assets.
- [ ] Verify contrast for all token pairs in both modes.
- [ ] Verify Inter latin-ext coverage across all Czech surfaces, including OG and PDF output.

**Documentation**

- [ ] Add the brand guidance page to the approved Figma file, bound to real variables and styles.
- [ ] Reconcile or clearly archive `docs/project-brief.md` so its legacy system is not mistaken for current.
- [ ] Confirm the Czech examples in §4.3 with a native review pass.
