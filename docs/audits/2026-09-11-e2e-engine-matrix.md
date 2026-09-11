# Playwright engine matrix (COD-85)

## Reproduction

- Date: 2026-09-11. Branch `test/cod-85-split-parity-suite` on top of `dev` `e6d89e7`.
- Runner: `pnpm test:e2e:pinned` (`compose.e2e.yaml`, image `mcr.microsoft.com/playwright:v1.62.0-noble`, one worker, ephemeral database), i.e. the pinned Chromium-on-Linux environment the parity baselines were measured in.
- Projects: chromium (everything), firefox / webkit / mobile-chrome (`PARITY_SPECS` ignored).
- `--list` before the runs: chromium 261 tests across 21 files; firefox, webkit and mobile-chrome 130 each — no parity, navigation-geometry or visual spec listed. `261 − (82 parity + 11 navigation-geometry + 38 anchoring) = 130`, so the excluded set is exactly the parity list.

## Run 1 — four projects, split only

| Project | Result |
| --- | --- |
| chromium | 261 passed, 0 failed |
| firefox | 130 passed, 0 failed |
| mobile-chrome | 128 passed, 2 failed (CV fine-pointer hover, light and dark) |
| webkit | 49 passed, 81 failed |

Total 564 passed / 87 failed in 30.8 min.

The Firefox result confirms the 2026-09-02 measurement: every one of its earlier ten failures was a parity spec, and with those on Chromium only the functional suite is fully portable — no application change was needed for Firefox.

### mobile-chrome

`curriculum-vitae.spec.ts` "fine-pointer … hover expands left" asserts `matchMedia('(hover: hover) and (pointer: fine)')` before testing the hover contract. The Pixel 5 project emulates a touch device, where that query is false by design. Classification: test precondition, not a defect; the two tests now `skip` on the `isMobile` fixture.

### webkit — one cause, not eighty-one

The failures spanned booking, CV, navigation, the language switcher, the 404s, skip-link focus and control geometry (a 52 px button measured 30 px, a 44 px contact link 21 px, the 64 px navigation 98 px). A temporary probe spec run inside the container showed WebKit with all three stylesheets registered but no rule applied, `--control-height-lg` empty, `display: inline` on flex controls, no hydration (a click created no iframe) and six console lines `Failed to load resource: Error performing TLS handshake`.

Cause: the app sent `Strict-Transport-Security` and a CSP with `upgrade-insecure-requests` on every response. Chromium and Firefox exempt `http://localhost` from both; WebKit does not, so it upgraded every stylesheet and script to `https://localhost:3000`, where nothing speaks TLS. Nothing on the page was WebKit-specific — it was an unstyled, script-less document. Classification: environment mismatch surfaced by a real browser difference; fixed at the source so the multi-engine gate can exist (see "Changes").

## Run 2 — webkit + mobile-chrome after the header fix

| Project | Result |
| --- | --- |
| webkit | 128 passed, 1 failed, 1 flaky |
| mobile-chrome | 128 passed, 2 skipped |

256 passed in 3.8 min.

- Flaky: `curriculum-vitae.spec.ts` "real Tab navigation reaches the fixed dark Download Action with visible focus" — the label reveals through a 200 ms opacity transition and the contract sampled it once, immediately after focus; WebKit started the transition a frame later on the dark variant. Now sampled with `expect.poll`, like the spec's other transition checks.
- Failed: `share-bar-contrast.spec.ts` "keeps focused controls distinct in forced colors" — WebKit accepts `emulateMedia({ forcedColors: 'active' })` but implements no forced-colors mode, so no system colour replaces the author outline or background and the assertion `outlineColor !== backgroundColor` has nothing to observe. Skipped on `browserName === 'webkit'`; Chromium and Firefox keep it.

## Run 3 — confirmation

`curriculum-vitae` and `share-bar-contrast` on webkit + mobile-chrome after the two spec
fixes: 71 passed, 3 skipped (the two touch-emulation hover tests, the WebKit forced-colors
contract), 0 failed, 1.0 min. With runs 1–3 together every project is green on its class:
chromium 261, firefox 130, webkit 130 (1 skip), mobile-chrome 130 (2 skips).

## Changes made on the branch

1. `playwright.config.ts` — `PARITY_SPECS`, ignored on the three non-Chromium projects.
2. `compose.e2e.yaml` / `package.json` — the pinned run covers all four projects; `PLAYWRIGHT_ARGS` narrows it; `test:e2e:pinned:chromium` is the Chromium-only entry point.
3. `src/lib/security/headers.ts` (+ unit test) — `Strict-Transport-Security` and `upgrade-insecure-requests` are omitted only when `NEXT_PUBLIC_SERVER_URL` explicitly declares `http://`. Anything else, including an absent value, keeps both, because `next.config.ts` evaluates headers at build time and the production image build receives no `NEXT_PUBLIC_SERVER_URL` build-arg. An independent review caught that the first draft (gate on "starts with https") would have silently dropped HSTS from production.
4. `curriculum-vitae.spec.ts` — `isMobile` skip on the hover tests; `expect.poll` on the focus contract.
5. `share-bar-contrast.spec.ts` — WebKit skip on the forced-colors contract.
6. `AGENTS.md` — where a new geometric spec belongs.

## What stays open

- CI stays Chromium-only on `ubuntu-latest`; the pinned compose run is the multi-engine gate and is run manually before a release.
- The parity family is Chromium-on-Linux by construction. No per-engine baseline sets were introduced (decision in COD-85).
- `work-card-action-target.spec.ts`, `booking.spec.ts` and `curriculum-vitae.spec.ts` keep their pixel assertions in the functional class; they passed on all four engines once the header fix was in, so they stay there until a genuine cross-engine wrapping difference appears.
