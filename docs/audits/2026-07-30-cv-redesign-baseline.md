# Curriculum Vitae Redesign Baseline

## Reproduction

- Inspection date: 2026-07-30
- Git commit: `2d5c55b`
- Branch: `feat/curriculum-vitae-redesign`
- Local server: `http://localhost:3000`
- English route: `/curriculum-vitae`
- Czech route: `/cs/curriculum-vitae`
- Figma file: `cs38WzlXKY9xfDYBinoKel`
- Figma nodes:
  - desktop light `124:369`;
  - tablet light `132:399`;
  - mobile light `131:593`;
  - desktop dark `136:190`;
  - mobile dark `136:283`;
  - Download Action `122:181`;
  - Button `21:110`.
- Browser: Chromium through Playwright MCP.
- Viewport height: `900px`.
- Before screenshots:
  - local ignored artifacts under `test-results/cv-before/`;
  - English light at 1440, 768 and 390 px;
  - Czech dark at 1440, 768 and 390 px.

## Confirmed Figma Contract

| Surface | Desktop | Tablet | Mobile |
| --- | ---: | ---: | ---: |
| Frame width | 1440px | 768px | 390px |
| Page inline gutter | 120px | 48px | 20px |
| Section block padding | 96px | 72px | 64px |
| Section heading/content gap | 32px | 32px | 32px |
| Person name | 64/68px, bold | 64/68px, bold | 64/68px, bold |
| Role title | 24/32px, semibold | 24/32px, semibold | 24/32px, semibold |
| Intro | 18/28px | 18/28px | 18/28px |

Download Action `122:181`:

- compact geometry `52 × 52px`;
- expanded geometry uses a `20px` icon, `8px` gap and `20px` inline padding;
- radius `4px`;
- default `--action-primary`;
- hover `--action-hover`;
- active `--action-pressed`;
- focus uses `--focus-ring`;
- compact-to-expanded transition is `200ms ease-out`;
- active transition is `100ms`;
- reduced motion removes width animation and preserves state clarity;
- coarse pointers require a stable understandable label.

The Figma frames still contain `8+ years` and the non-canonical email. Those strings are factual defects in the mockup. The approved implementation plan and confirmed public identity override them.

## Browser Baseline

| Finding | Route / state | Expected | Actual | Type | Severity | Smallest fix |
| --- | --- | --- | --- | --- | --- | --- |
| Light surface does not render | EN, light, 1440/768/390 | `--surface-page` light background | CV content remains `rgb(10, 15, 28)` | measured mismatch | high | CV CSS semantic surface tokens |
| Desktop gutter is too small | EN light and CS dark, 1440 | `120px` | `16px` outer padding, inner content starts about `136px` only because of the legacy max-width container | measured mismatch | high | page shell / shared Container |
| Tablet gutter is too small | EN light and CS dark, 768 | `48px` | `16px` | measured mismatch | high | responsive page gutter |
| Mobile gutter is too small | EN light and CS dark, 390 | `20px` | `16px` | measured mismatch | medium | responsive page gutter |
| Desktop section rhythm is too tight | 1440 | `96px` block padding | `64px` | measured mismatch | high | section composition |
| Tablet section rhythm is too tight | 768 | `72px` | `64px` | measured mismatch | medium | section composition |
| Download Action is undersized | all measured states | `52px` | `48px` | measured mismatch | high | new Download Action |
| Download Action is pill-shaped | all measured states | `4px` | `9999px` | measured mismatch | high | new Download Action |
| Download Action uses deprecated yellow | all measured states | semantic teal/cyan action color | `rgb(250, 204, 21)` | measured mismatch | high | new Download Action |
| Download Action label overflows viewport | EN/CS, 1440/768/390, default | no visible descendant overflow; stable touch label | opacity-hidden label extends 211px EN / 236px CS beyond the viewport | measured mismatch | high | pointer-aware action layout |
| Heading typography is inconsistent | 1440 | 64/68px bold person name in hero | generic CV `h1` is 60/24px weight 300; name is an `h2` | measured mismatch | high | semantic hero rebuild |
| Mobile heading typography is inconsistent | 390 | 64/68px bold person name | generic CV `h1` is 36/24px weight 300 | measured mismatch | high | semantic hero rebuild |
| Czech download maps to English asset | CS all states | distinct Czech PDF and label | stable English asset and “PDF v angličtině” | missing implementation | high | locale PDF map and asset |
| Current content is stale | EN/CS all states | Senior, 10+ years, BlueGhost current | Frontend Developer / mid-level / eight years / Kontent current | missing implementation | critical | structured facts and catalogs |
| Contact identity conflicts | EN/CS all states | `karel@codeguy.cz` | `karel.kutchan@email.cz` | measured content defect | high | centralized contact source |

## Route And Asset Baseline

| URL | Status | Content type | Size |
| --- | ---: | --- | ---: |
| `/curriculum-vitae` | 200 | `text/html; charset=utf-8` | not recorded |
| `/cs/curriculum-vitae` | 200 | `text/html; charset=utf-8` | not recorded |
| `/curriculum-vitae/CV_Karel_Kutchan.pdf` | 200 | `application/pdf` | 147266 bytes |
| `/curriculum-vitae/CV_Karel_Kutchan_CS.pdf` | missing | not available | not available |

The existing public PDF is the legacy English file. Local `pdftotext` checks confirmed that the two source inputs under `docs/` contain the intended Czech general and English React profiles, BlueGhost from 03/2025 and Kontent.ai ending 02/2025.

## Coverage Matrix

| Locale | Theme | 1440 | 768 | 390 |
| --- | --- | --- | --- | --- |
| English | light | measured + screenshot | measured + screenshot | measured + screenshot |
| English | dark | unverified before implementation | unverified before implementation | unverified before implementation |
| Czech | light | unverified before implementation | unverified before implementation | unverified before implementation |
| Czech | dark | measured + screenshot | measured + screenshot | measured + screenshot |

The final acceptance pass must cover every locale/theme/viewport cell, plus 430 and 320 px overflow checks and Download Action default, hover, active, focus, reduced-motion and coarse-pointer states.

## Production Acceptance After Implementation

- Build: optimized Next.js standalone artifact produced from the feature-branch working tree on 2026-07-30.
- Server: `http://127.0.0.1:3100`.
- Screenshot evidence: ignored artifacts under `test-results/cv-after-production/`, named after the five approved Figma nodes.
- Browser: headless Chromium with production assets, loaded fonts and reduced motion for stable screenshots.

| Figma node / surface | Tested state | Expected | Measured web result | Classification |
| --- | --- | --- | --- | --- |
| `124:369` desktop light | EN, 1440px, light | 120px gutter; 96px section padding; 64/68px name | matching responsive tokens; name `64/68px`, weight `700` | fixed |
| `132:399` tablet light | EN, 768px, light | 48px gutter; 72px section padding | matching responsive tokens and contained content | fixed |
| `131:593` mobile light | EN, 390px, light | 20px gutter; 64px section padding; full reflow | matching responsive tokens; no visible descendant overflow | fixed |
| `136:190` desktop dark | EN, 1440px, dark | dark semantic surfaces and adaptive cyan action | matching semantic dark surfaces; action uses the adaptive action token | fixed |
| `136:283` mobile dark | EN, 390px, dark | dark mobile reflow and touch-readable action | contained layout; fixed action label remains visible on coarse pointers | fixed |
| `122:181` Download Action | default/fine hover/active/focus/coarse/reduced motion | 52px height, 4px radius, understandable label | `52px`, `4px`; right/bottom anchored; keyboard focus, pointer and motion policies verified | fixed |
| Figma factual strings | all frames | visually preserved hierarchy with current facts | Senior Frontend Engineer, 10+ years, BlueGhost current, canonical public email | accepted factual override |

The five production screenshots were visually inspected after the measured checks. They contain no development overlay. The hierarchy, alternating semantic surfaces, card/timeline construction, responsive wrapping and Download Action placement follow the approved frames. Exact facts and localized text intentionally change line lengths from the stale Figma copy.

### Final Coverage Matrix

| Locale | Theme | 1440 | 768 | 390 | Extra reflow |
| --- | --- | --- | --- | --- | --- |
| English | light | measured + screenshot | measured + screenshot | measured + screenshot | 430 + 320 passed |
| English | dark | measured + screenshot | measured | measured + screenshot | 320 booking passed |
| Czech | light | measured | measured | measured | 430 + 320 passed |
| Czech | dark | measured | measured | measured | 320 booking passed |

### Standalone Route And Asset Results

| URL | Status | Content type | Size |
| --- | ---: | --- | ---: |
| `/curriculum-vitae` | 200 | `text/html; charset=utf-8` | 92857 bytes |
| `/cs/curriculum-vitae` | 200 | `text/html; charset=utf-8` | 96352 bytes |
| `/contact/book` | 200 | `text/html; charset=utf-8` | 60954 bytes |
| `/cs/contact/book` | 200 | `text/html; charset=utf-8` | 63647 bytes |
| `/curriculum-vitae/CV_Karel_Kutchan.pdf` | 200 | `application/pdf` | 182692 bytes |
| `/curriculum-vitae/CV_Karel_Kutchan_CS.pdf` | 200 | `application/pdf` | 96693 bytes |

The booking page has no approved Figma screen node. It therefore reuses the established Container, Button, typography, surface and focus contracts and is not represented as measured Figma parity.
