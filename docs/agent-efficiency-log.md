# Agent efficiency log

## 2026-07-29 — Claude review of Home responsive parity

- **Scope:** independent read-only review of `fix/home-responsive-parity` against `dev`, including the pending parity audit.
- **Incident:** `claude ultrareview dev` attempted to create a Git stash and failed on the protected worktree index. The first restricted headless review then spent 184 seconds before failing with `ConnectionRefused`. The approved network-enabled retry completed successfully in 512.5 seconds.
- **Impact:** the requested external review added about twelve minutes of elapsed time without changing repository state. The failed attempts produced no reusable findings.
- **Corrective action:** keep external review prompts scope-bounded; restrict Claude to read-only file and Git commands; preflight authentication and network access; use a clean committed worktree before choosing `ultrareview`; reuse the completed review instead of resubmitting the branch.
- **Outcome:** Claude reported no P0, P1, or P2 findings. Its three verification notes were independently resolved with GitHub API evidence, Figma node `6:2`, and a wording correction in the audit.
