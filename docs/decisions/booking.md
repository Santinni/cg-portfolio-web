# Booking route decisions

| Field | Value |
| --- | --- |
| Scope | `/contact/book` and `/cs/contact/book` |
| Status vocabulary | See [`README.md`](README.md) |
| Last updated | 2026-09-01 |

The booking route embeds a third-party Google Calendar appointment scheduler. These
decisions exist because that surface is outside our control and cannot be verified the
way our own routes can.

## BK-01 — Do not claim facts the schedule response does not prove · `locked`

**Decision.** The implementation must not state meeting duration, price, timezone,
availability, cancellation rules, or account ownership.

**Why.** The only thing we can observe is a public HTTP response. On `2026-07-30` the
configured schedule URL returned HTTP `200`, `text/html`, title `Book a consultation`.
That proves the page exists and is reachable. It proves nothing about who owns the
calendar or what the meeting costs, how long it runs, or how it can be cancelled.
Publishing any of those as fact would be asserting something we cannot support.

**What would reopen it.** A source of truth we control — a configured value in the
repository, or a verified API response that actually carries those fields.

## BK-02 — No approved Figma nodes for this route · `locked`

**Decision.** Build booking from the existing semantic design system. Do not report
measured Figma parity for this route, and do not open a parity finding against it.

**Why.** The route was delivered without approved screen frames. A parity claim needs an
approved source to compare against; here there is none, so any reported percentage or
"matches design" statement would be fabricated.

**What would reopen it.** Approved booking frames added to the design file of record —
see [`design-sources.md`](design-sources.md).

## BK-03 — The third-party iframe is deferred behind an explicit action · `locked`

**Decision.** Render no iframe on initial load. Gate it behind a keyboard-operable load
action. Keep the external calendar link and the e-mail fallback visible both before and
after loading.

**Why.** The embed is third-party and heavy. Loading it unconditionally hands a visitor's
request to Google before they have asked to book anything, and leaves the route useless
if the embed fails. The fallbacks make the route work regardless of the embed's state.

**What would reopen it.** Replacing the third-party scheduler with a first-party booking
flow.

## BK-04 — Booking is one centralized route reached from contextual entry points · `locked`

**Decision.** There is a single booking route. Pages link to it through `BookingCta`,
which carries a `source` identifying where the visitor came from — currently `contact`,
`experience`, `curriculumVitae` and `caseStudy`. Entry-point copy is localized per source.

**Why.** The alternative is an embed repeated on several pages, which multiplies the
third-party surface and makes the constraints in BK-01 to BK-03 impossible to enforce in
one place.

**What would reopen it.** Adding a genuinely different booking flow, rather than another
entry point into this one. Adding a new source is not a reopening — extend
`BookingCtaSource` and add its copy to both catalogs.

**Implementation status: partly met.** The Contact and Experience pages use `BookingCta`.
The CV page hand-builds its own `Button` to `/contact/book` instead, marked only by a
`data-booking-source` attribute. Route it through `BookingCta` when the CV page is next
touched, so entry-point copy stays in one place.

## Related

- Contact values come from the central contact model, not from this route.
- The public e-mail identity is `karel@codeguy.cz`.
