---
name: implement
description: "Implement a specific component or feature"
---

# Implement Chain

This chain handles one bounded unit of work inside a gate. Completing this chain does not by itself complete the gate. Nosh must read the resulting reports and artifacts, update the relevant project artifacts and live `todo` queue, then decide whether to rerun, adjust, or switch chains.

Implement a specific component, model, or feature as defined in the design docs.

Any specialist agent invoked in this chain must receive Nosh's fixed delegation packet and keep `.ml-harness/reports/{part-id}.md` in the frontmatter schema defined by `templates/report.md`.

Agent sequence for this chain:

- `jett` writes research code, experiment code, and training-pipeline changes.
- `hermione` writes startup application code and product-facing features.
- `hagrid` handles data, ETL, integration, and benchmark-heavy implementation work.
- `omen` reviews research code for correctness, reproducibility, and protocol fidelity.
- `moody` reviews startup code for quality, evaluation fit, and test signal.
- `snape` reviews exposed, safety-sensitive, auth, or policy-critical changes.

## Step 1: Read Context

Read `.ml-harness/truths/project-context.md`, `.ml-harness/truths/phase-breakdown.md`, and the relevant design docs to understand what needs to be implemented.

## Step 2: Identify Part

Determine which part from `.ml-harness/truths/phase-breakdown.md` this chain is addressing. Read the part definition to understand:

- what to implement,
- expected deliverables,
- dependencies,
- expected artifacts,
- success criteria.

## Step 3: Implement Component

Choose the implementation owner from the current project type and part definition:

- Research or experiment code -> Subagent (jett)
- Startup application or feature work -> Subagent (hermione)
- Startup data or integration-heavy work -> Subagent (hagrid), with Hermione owning application glue when needed

Implement the component following the design docs.

The implementation owner creates the first report entry with the exact files changed, tests run, and any blockers.

Output: working code in `src/` with tests in `tests/`.

## Step 4: Verify Implementation

Choose the verifier from the current project type:

- Research implementation -> Subagent (omen) reviews correctness and reproducibility after the implementation owner runs the relevant tests
- Startup implementation -> Subagent (moody) runs tests and quality checks

If the part affects secrets, permissions, auth, guardrails, or externally exposed behavior, add Subagent (`snape`) for a focused safety review before Nosh accepts the part.

Run all relevant tests to verify:

- new code passes tests,
- existing tests still pass,
- no regressions were introduced.

The reviewer appends a clear verdict to `.ml-harness/reports/{part-id}.md`. Nosh should not mark the part complete until reviewer findings are resolved or consciously accepted.

## Step 5: Review Report

Read the report from `.ml-harness/reports/{part-id}.md`. Update:

- `.ml-harness/truths/phase-breakdown.md` - mark part complete
- `.ml-harness/timeline.md` - log completion
- `.ml-harness/truths/project-context.md` - add context about what was built

Check phase gates. Report progress to user.
