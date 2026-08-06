---
name: figma-product-delivery
description: Keep Codeguy Figma work focused on the resulting product design. Use alongside figma-use whenever editing Codeguy Portfolio - Final Design, translating delivery decisions into Figma, or deciding whether information belongs in Figma, FigJam, or repository documentation.
disable-model-invocation: false
---

# Figma Product Delivery

Use this project skill together with `figma-use` for every write to the Codeguy portfolio Figma file.

## Core boundary

Figma Design contains the resulting product design:

- production screens and responsive variants;
- reusable components and their states;
- semantic variables and light/dark modes;
- prototype flows and destinations;
- accessibility, interaction and implementation annotations that describe product behavior.

Repository documentation contains the delivery process:

- implementation plans;
- backlog and task status;
- agent or CLI orchestration;
- review packets and test execution plans;
- decision logs and records of dead ends;
- commit, rollout and deployment instructions.

FigJam may contain planning artifacts only when the user explicitly requests a planning board, workshop, flowchart, roadmap or collaborative diagram.

## Non-negotiable rule

Never create an implementation plan, backlog, delivery checklist, agent plan or dead-end log inside a Figma Design file merely because the user says the decision should be "in Figma".

In a product-delivery context, interpret that request as: update the relevant product screens, components, states, prototype interactions and handoff annotations so they directly express the approved solution.

If the user explicitly asks to store a plan in Figma, confirm whether they mean FigJam. Do not add process documentation to a Cover, Status, Foundations, Components or Website page without explicit confirmation.

## Required workflow

1. Classify the requested artifact before writing:
   - product UI or behavior → Figma Design;
   - implementation process or project history → repository docs;
   - explicitly requested collaborative planning → FigJam.
2. Load and follow `figma-use` before every `use_figma` call.
3. Inspect the target file and relevant nodes before mutation.
4. Translate decisions into the smallest complete product delta:
   - update component sources before instances when appropriate;
   - cover desktop, tablet, mobile and required modes;
   - preserve instance linkage, semantic variables and prototype destinations;
   - add implementation annotations only when they describe runtime behavior.
5. Validate the resulting product design with structure and screenshots.
6. Store the implementation plan, validation matrix and dead-end record in the repository.

## Pre-write check

Before creating any top-level frame, section, page or text-heavy documentation block, answer:

- Does this object represent something a user sees or interacts with?
- Does it document a reusable product/design-system contract?
- Does it provide implementation semantics required to reproduce the UI?

If all answers are no, the artifact does not belong in Figma Design.

## Recovery from a mistaken process artifact

If a delivery-plan artifact was created in Figma by mistake:

1. stop further Figma writes;
2. delete only the exact returned node IDs for the mistaken artifact;
3. verify that no product-owned nodes were removed;
4. place the plan in repository documentation;
5. record the mistake as a dead end so it is not repeated;
6. resume by editing the actual product components and screens.

## Codeguy-specific guardrails

- Target design file: `Codeguy Portfolio - Final Design`.
- Keep planning documents under repository `docs/plans/` or the established delivery-plan location.
- Use the Figma Cover and Status page for concise product/design status only, not implementation planning.
- Do not create detached instances or duplicate desktop/mobile component definitions when a shared source exists.
- Update prototype destinations whenever navigation or user journeys change.
- Validate desktop, tablet, mobile, light/dark and accessibility states affected by the change.
- Treat external CLI and subagent coordination as repository delivery metadata, never as product UI.

## Completion report

Report Figma changes and repository-plan changes separately:

- Figma: screens, components, states, prototype links and audit results.
- Repository: plan path, decisions, test matrix and dead-end log.

Never claim that a repository plan was written into Figma or that a Figma product delta replaces the implementation plan.
