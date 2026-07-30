# Centralized Consultation Booking Implementation Record

## Outcome

Implement one localized booking destination at `/contact/book` and `/cs/contact/book`. The site loads the existing public Google Appointment Schedule only after a visitor explicitly requests it, while keeping direct calendar and e-mail alternatives visible at all times.

## Confirmed Inputs

- Schedule URL: `https://calendar.google.com/calendar/appointments/schedules/AcZssZ1C4Xr8kHc-vu8Mr9Yivuejsv52uG4U0TwcpvlKKx68ItOEY9ZN5yiWwbNHOUPMPGqaFHSL8Dbb?gv=true`
- Public response on `2026-07-30`: HTTP `200`, `text/html`, title `Book a consultation`.
- Public e-mail: `karel@codeguy.cz`, derived from the central contact source.
- The public schedule response does not prove account ownership, meeting duration, price, timezone, availability or cancellation rules. The implementation must not claim those facts.
- Booking has no approved Figma screen nodes. Reuse the current semantic design system and do not report measured Figma parity for this route.

## Architecture

```text
Contact ──────────────┐
Experience ──────────┤
Curriculum Vitae ────┼──> localized /contact/book
Case-study detail ───┘             │
                                   ├── explicit load ──> Google iframe
                                   ├── external calendar link
                                   └── mailto:karel@codeguy.cz
```

- `src/content/booking.ts` owns the locale-neutral schedule URL, offer ID and central contact identity.
- `messages/{en,cs}.json` owns every visitor-visible and accessibility string.
- A narrow client `BookingScheduler` owns only the explicit iframe-loading state.
- A shared server `BookingCta` owns the four contextual entry points.
- The localized route remains a static public page with localized metadata.
- The English route receives an explicit `beforeFiles` rewrite because the repository does not use middleware rewriting for finite English pages.
- The existing CSP host allowance for `calendar.google.com` remains unchanged.

## Implementation Sequence

1. Add the config, localized copy and unit coverage.
2. Add `BookingScheduler` with no iframe on initial render, a keyboard-operable load action, and always-visible external calendar and e-mail fallbacks.
3. Add the localized route, metadata, responsive semantic styling and English rewrite.
4. Add the shared CTA to Contact, Experience, Curriculum Vitae and case-study detail.
5. Remove the dormant Home import and delete the legacy modal after repository-wide usage is zero.
6. Extend sitemap, SEO and locale-switching contracts.
7. Add Chromium coverage for both locales, themes, responsive widths, deferred loading, keyboard focus, fallback behavior and CTA routing.
8. Prove the route and CSP in the built standalone server.

## Verification Contract

- Initial booking-page render makes no `calendar.google.com` request and contains no iframe.
- The load action creates exactly one localized-title iframe.
- External calendar and e-mail fallbacks are visible before and after loading.
- Google requests are intercepted in E2E; tests do not depend on the external service.
- `/contact/book` and `/cs/contact/book` return `200` with correct `<html lang>`, metadata, canonical and language alternates.
- `/en/contact/book` normalizes to unprefixed English.
- All four entry points preserve locale.
- No visible descendant overflow exists at `1440`, `768`, `390` and `320` CSS pixels in light or dark mode.
- `rg -n "BookingModal|bookingModal|BOOKING_URL" src` returns no runtime consumer before legacy deletion.

## Delivery

The booking implementation ships with the CV redesign on `feat/curriculum-vitae-redesign` through a pull request targeting `dev`. The PR must be created and independently verified, but not merged or deployed.
