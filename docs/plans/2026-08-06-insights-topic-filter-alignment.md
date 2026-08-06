# Insights topic-filter alignment

Status: Figma is the approved visual source; production alignment pending  
Date: 2026-08-06

## Decision

Keep the current Insights hero/content section headed **“Notes from frontend engineering”**. Align only the topic-filter control and its surrounding spacing with the sharper Figma design. Do not restyle Figma to match the current rounded production control.

Figma references:

- Desktop Insights: `74:264`
- Desktop hero and filters: `74:286`, `74:291`
- Tablet filters: `76:10`
- Mobile filters: `76:211`

## Approved visual contract

- Reuse the existing design-system `Button` component in its link form
  (`renders="link"`, as already used elsewhere in this file and on the 404);
  do not create a bespoke tab/chip component. The controls stay anchors — only
  their presentation changes.
- Current state to replace: `InsightsPage.module.css:62-79` styles `.filter` /
  `.filterActive` by hand and uses `border-radius: var(--radius-pill)` at
  line 69.
- Size: `SM`, 36 px high, 12 px horizontal padding.
- Corner radius: 4 px. Do not use pill/capsule geometry.
- Gap: 8 px.
- Selected filter: `Kind=Secondary`, `State=Default`, `Size=SM` with the semantic border token.
- Unselected filters: `Kind=Quiet`, `State=Default`, `Size=SM`.
- Use the existing Button hover, active, focus and disabled variants and semantic tokens.
- Order: All, Architecture, Performance, Design systems, Accessibility.
- Desktop: one row inside the 920 px content measure.
- Tablet: one row inside 672 px when labels fit; wrapping remains allowed.
- Mobile: 350 px container, wrapping enabled, two rows, 8 px row/column gap. No horizontal carousel and no clipped labels.
- Hero eyebrow, heading, introduction, measure and spacing remain unchanged unless implementation inspection proves a separate defect.

## Semantic contract

**Corrected 2026-08-06 after verification against `dev` (`049540d`).** The
original version of this section required native buttons with `aria-pressed`.
That recommendation was written without workspace access and is wrong for this
codebase — following it would remove working behaviour.

The shipped implementation (`src/app/[locale]/(frontend)/(pages)/insights/page.tsx:75-97`)
is not a client-side toggle group. It is server-rendered navigation:

```tsx
<nav aria-label={t('filters.label')}>
  <ul className={styles.filters}>
    <Link href={`/insights?topic=${…}`} aria-current={isCurrent ? 'page' : undefined}>
```

Filtering happens by navigating to `?topic=<slug>`, and the server re-queries
via `listPublishedPosts({ topicSlug })`. Each control therefore has a
destination, which makes it a link, not a button.

Binding contract:

- Keep the controls as links inside the labelled `nav`/`ul`. Do not convert
  them to `<button>`.
- Keep `aria-current="page"` for the selected filter. `aria-pressed` is for
  toggle buttons and is incorrect on an element that navigates.
- Do not add `role=tablist`, `role=tab` or roving-tabindex keyboard behaviour
  unless the information architecture changes to real tab panels.
- Preserve normal Tab navigation and visible design-system focus styling.
- The active filter already lives in the URL and Back/Forward already work.
  This requirement is met — protect it, do not re-implement it.
- Because navigation replaces the document, no live-region announcement is
  required. Only add one if the control ever becomes client-side.

This means **the semantic layer of this task is already correct and closed**.
The remaining scope is visual only: see below.

## Responsive and localization requirements

- Verify EN and CS labels at 320, 390, 430, 768, 1024 and 1440 px.
- Allow the control height to grow when localized labels wrap; never force a fixed 36/80 px container that clips content.
- Preserve a minimum 44 px interactive target through layout/touch-target treatment even though the visible SM control is 36 px high.
- No horizontal page overflow.
- Filter wrapping must not alter the approved hero typography or article-grid width.

## Acceptance criteria

- Production geometry matches the Figma Button variants, 4 px radius and 8 px spacing.
- Rounded pills/chips and any bespoke filter styles are removed.
- The selected and unselected states are distinguishable in light, dark, forced-colors and high-contrast conditions.
- Every filter can be activated by keyboard and pointer; focus is always visible.
- `aria-current="page"` and the visible selected state stay synchronized, and no
  control gains `aria-pressed`.
- The filtered article set, empty state and result count are correct for every category.
- Direct URL/query loading, refresh and Back/Forward restore the expected filter. This already
  works today and must be proven still working after the restyle — it is the main regression risk.
- Mobile wraps cleanly into rows without a horizontal scroller, clipping or layout jump into the article cards.
- Hero content “Notes from frontend engineering” remains visually unchanged.
- Unit tests cover selection, semantics and filtering. E2E covers URL state, keyboard use and responsive wrapping. Visual regression covers desktop/tablet/mobile in light/dark plus focus and selected states.

## Explicit non-goals

- Do not redesign the Insights hero.
- Do not change article-card content or Payload taxonomy in this alignment task.
- Do not create a second Button, Tab, Chip or SegmentedControl implementation.
- Do not use ARIA tabs for a filtering toolbar.
- Do not make the filter horizontally scrollable unless a future localization proves wrapping unusable and the design decision is reopened.

## Dead ends and caveats

- Calling the control “tabs” can lead to incorrect `role=tablist` semantics. Its current product behaviour is a category filter.
- Matching production by rounding the Figma buttons would preserve the inconsistency rather than fix it; Figma is the approved visual source here.
- A fixed mobile height of 80 px is safe only for the current English labels. Implementation must size to content for localization and zoom.
- Workspace inspection was blocked before process start by `helper_unknown_error: setup refresh had errors`, so the original draft guessed at the implementation. **Resolved 2026-08-06:** the paths are `src/app/[locale]/(frontend)/(pages)/insights/page.tsx:75-97` and `src/app/[locale]/(frontend)/(pages)/insights/InsightsPage.module.css:46-79`. No code was changed by that task.
- Writing a semantic contract from a Figma frame alone produced a wrong requirement here: the design shows button-looking controls, so the draft demanded `<button aria-pressed>`. The controls are actually navigation links carrying URL state. **Inspect the implementation before prescribing semantics from a visual.**
