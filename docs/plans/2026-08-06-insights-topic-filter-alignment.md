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

- Reuse the existing design-system `Button` component; do not create a bespoke tab/chip component.
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

These controls filter one article collection; they are not navigation tabs with independent tab panels.

- Prefer native buttons in a labelled group/toolbar.
- Expose the selected state with `aria-pressed`.
- Do not add `role=tablist`, `role=tab` or roving-tabindex keyboard behaviour unless the information architecture changes to real tab panels.
- Preserve normal Tab navigation and visible design-system focus styling.
- Announce the changed result count or updated collection when filtering is client-side and the change would otherwise be silent to assistive technology.
- Keep the active filter in the URL/query state when the current routing model supports shareable filters; Back/Forward must remain coherent.

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
- `aria-pressed` and the visible selected state stay synchronized.
- The filtered article set, empty state and result count are correct for every category.
- Direct URL/query loading, refresh and Back/Forward restore the expected filter when URL state is supported.
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
- Workspace inspection was blocked before process start by `helper_unknown_error: setup refresh had errors`; exact production component and CSS paths must be confirmed before implementation, and no claim is made that code was changed in this task.
