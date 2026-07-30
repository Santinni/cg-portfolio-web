# AI Agent Efficiency Log

This log records measured sources of agent-limit usage, corrective actions and their outcomes. Percentages are approximate local Claude Code statistics and describe independent characteristics, so they do not add up to 100%.

## Operating guardrails

| Area | Guardrail | Evidence to record |
| --- | --- | --- |
| Context | Target `<100k`; create a handoff and start clean at `100k`; exceed `150k` only for unreproducible state | Session ID, approximate context band, reason for continuation |
| Phases | Separate discovery, mutation and verification when MCP output is heavy | Phase and bounded acceptance criteria |
| Compaction | `/compact` after discovery or large MCP output; `/clear` or a clean session when changing tasks | Where compaction or reset occurred |
| Skills | Run a heavy generative skill once per design phase; use narrow tools for corrections | Skill names and why each was needed |
| MCP | Enable only phase-relevant servers; remove Playwright from Figma-only continuation | Enabled and excluded servers/tools |
| Figma | Use stable node IDs, one page per call, compact returns, incremental writes and representative screenshots | Created/mutated node IDs and screenshots checked |
| Models | Use the model requested by the user; cheaper models may handle deterministic work only when the user permits it | Model and effort level |
| Safety | Give external agents explicit forbidden operations and verify the worktree independently | `git status`, artifact audit, unresolved gaps |

## 2026-07-29 — CV page design with Claude Opus 5

### Measured usage

- 85% of usage occurred above 150k context.
- 93% came from `/figma:figma-generate-design`.
- 95% came from the Figma plugin.
- 76% came from the `plugin:figma:figma` MCP server.
- 14% came from Playwright.
- The original Claude Code session reached the Pro limit before completing dark-mode frames, prototype reactions and the final report.

### Root causes

1. Discovery, website inspection, PDF extraction, Figma construction and verification were kept in one long session.
2. Large Figma MCP results remained in context throughout the session.
3. The heavy design-generation skill dominated the run even after stable target node IDs existed.
4. Playwright remained part of the same context after its evidence had already been collected.
5. Resuming the same session would carry the expensive context forward.

### Corrective action for the continuation

- Do not resume session `2d311cfd-8a85-4344-b04b-432059c1353e`.
- Start a clean Claude Opus 5, high-effort session with a compact factual handoff.
- Do not rerun Playwright, reread the PDFs or repeat website/Figma-wide discovery.
- Do not invoke `/figma:figma-generate-design`; use only the narrow Figma editing workflow on known nodes.
- Limit scope to:
  1. dark desktop and mobile CV frames on page `4:8` using the existing dark variable mode;
  2. prototype reactions for component set `122:181`;
  3. small metadata/property checks and representative screenshots;
  4. confirmation that the repository was not changed by Claude.
- Use existing source frames `124:369`, `132:399`, `131:593` and component set `122:181`; preserve their IDs and return every newly created or mutated ID.

### Baseline before continuation

| Deliverable | Node | Status |
| --- | --- | --- |
| Desktop CV | `124:369` | Created and visually checked |
| Tablet CV | `132:399` | Created and visually checked |
| Mobile CV | `131:593` | Created and visually checked after clipping repair |
| Download action component set | `122:181` | 10 variants, token-bound, no prototype reactions yet |
| Dark-mode CV frames | page `4:8` | Missing |
| Final external-agent report | — | Missing because the session hit its limit |

### Outcome

Completed with a clean session on 2026-07-29.

Raw local evidence:

- Previous session: `C:\Users\karel\.claude\projects\C--web-CG-codeguy-cg-portfolio-web\2d311cfd-8a85-4344-b04b-432059c1353e.jsonl`
- Efficient continuation: `C:\Users\karel\.claude\projects\C--web-CG-codeguy-cg-portfolio-web\2a6234d7-3a19-41ef-b54e-fd9f1bff84e9.jsonl`
- Machine scope: local
- Evidence class: raw evidence
- Confidence: confirmed

| Metric | Original session | Clean continuation | Change |
| --- | ---: | ---: | ---: |
| Elapsed time | 22.48 min | 4.36 min | -80.6% |
| Maximum effective Opus input in one message | 279,379 tokens | 74,511 tokens | -73.3% |
| Opus output across raw session messages | 250,387 tokens | 58,199 tokens | -76.8% |
| `use_figma` calls | 26 | 6 | -76.9% |
| Figma screenshots | 10 | 4 | -60.0% |
| Playwright calls | 14 | 0 | -100% |
| Heavy `figma-generate-design` attribution | 147 messages | 0 messages | eliminated |

The continuation used canonical `claude-opus-5`, high effort, completed in 18 CLI turns and cost approximately USD 1.42 according to local Claude telemetry. Cumulative cache-read totals are intentionally not used as the context-size measure because they sum repeated reads across turns; the per-message maximum above is the relevant guardrail signal.

Delivered and independently verified:

- Dark desktop CV frame `136:190` on page `4:8`.
- Dark mobile CV frame `136:283` on page `4:8`.
- Six `CHANGE_TO` reactions across the existing Download Action variants in component set `122:181`.
- Both dark frames have the same dimensions, node-type counts, component-instance histograms and paint-binding counts as their loaded light source frames; the intended additional binding is Semantic Color mode `4:2` (Dark).
- All ten Download Action variants remain 52 px high with 4 px radius. Focus and Disabled remain static specifications because Figma has no faithful focus-visible trigger and Disabled must be non-interactive.
- Independent screenshots found no visible clipping, overlap, broken icons or incorrect dark-mode surfaces.
- Claude created no repository files. The only repository changes made during the continuation are this requested efficiency documentation and the `AGENTS.md` guardrails; the two untracked CV PDFs remain user-owned inputs.

Conclusion: the clean-handoff strategy kept the run under the new 100k context target and materially reduced time, tool calls and output while completing the missing work. Use this phased pattern for future Figma agent work.

## 2026-07-29 — Brand identity manual and Figma reference

### Measured usage

Two clean Claude Opus 5 high-effort sessions were used, with repository writing kept under controller control:

| Phase | Session | Elapsed | Maximum effective Opus input | Figma calls | Result |
| --- | --- | ---: | ---: | ---: | --- |
| Brand strategy and written manual | `625f38dd-02d7-4872-8c01-b6eb6b4b4fad` | 4.26 min | 27,712 tokens | 0 | Completed efficiently |
| Figma guideline construction | `14a871e9-e822-4445-9e8b-599df44a99d5` | 21.39 min | 190,384 tokens | 11 writes, 7 screenshots | Completed, but exceeded the context and call targets |

The content session used one Opus response and no tools. The Figma session started clean and excluded Playwright, PDFs, browser discovery and `figma-generate-design`, but still exceeded both the `<100k` context target and the intended maximum of 10 `use_figma` calls. Two atomic writes failed because of a property-name error and a bracket mismatch; a final cleanup call was then needed to bind default paints. The agent continued because the page-under-construction was stateful, but that state was reproducible from created node IDs and did not justify passing 150k.

### Outcome and independent verification

- Created Figma page `146:2`, `11 - Brand Identity`, in the approved portfolio file rather than creating a second design-system source of truth.
- Created six 1440 px chapter frames: `146:3`, `147:2`, `149:2`, `150:2`, `151:2` and `153:15`.
- Controller audit found six top-level frames, 12 intact instances from Button component set `21:110`, no broken instances, no local replacement components, no placeholder text, no non-Inter text, no zero-size text and no unbound fills or strokes.
- All six chapters were independently screenshotted and visually checked for hierarchy, clipping, overlap, light/dark specimens and status labelling.
- Existing variables, styles and canonical Button components remained intact; no replacement logo or token collection was created.

### Corrective actions for future large Figma documents

1. Split content definition, canvas construction and validation into separate clean sessions. The controller should normally perform final read-only verification rather than keeping the construction agent alive for screenshots and audits.
2. Limit a construction session to at most three large chapter frames or 80k effective input, whichever comes first. At that point return created node IDs, bindings used and remaining acceptance criteria, then start a clean continuation.
3. Treat 100k as a hard handoff point for reproducible Figma state. Stable node IDs and a compact property summary are sufficient state; do not continue beyond 150k for convenience.
4. Preflight the exact Plugin API property names and syntax in a small read-only or single-node operation before repeating a large construction pattern.
5. Reserve one write-call allowance for repair or cleanup. If the planned call budget has no recovery margin, reduce the batch size before construction begins.
6. Keep independent screenshots outside the external construction session where possible. This avoids retaining large rendered evidence alongside the full write history.

Conclusion: the two-phase strategy successfully prevented website/PDF discovery and Figma generation from contaminating the same context, but a single six-chapter Figma build remained too large. Future guideline work must use smaller construction batches and controller-owned verification.

## 2026-07-29 — Claude review of Home responsive parity

- **Scope:** independent read-only review of `fix/home-responsive-parity` against `dev`, including the pending parity audit.
- **Incident:** `claude ultrareview dev` attempted to create a Git stash and failed on the protected worktree index. The first restricted headless review then spent 184 seconds before failing with `ConnectionRefused`. The approved network-enabled retry completed successfully in 512.5 seconds.
- **Impact:** the requested external review added about twelve minutes of elapsed time without changing repository state. The failed attempts produced no reusable findings.
- **Corrective action:** keep external review prompts scope-bounded; restrict Claude to read-only file and Git commands; preflight authentication and network access; use a clean committed worktree before choosing `ultrareview`; reuse the completed review instead of resubmitting the branch.
- **Outcome:** Claude reported no P0, P1, or P2 findings. Its three verification notes were independently resolved with GitHub API evidence, Figma node `6:2`, and a wording correction in the audit.
