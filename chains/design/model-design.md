---
name: model-design
description: "Design the model architecture and mechanisms"
---

# Model Design Chain

This chain handles one bounded unit of work inside a gate. Completing this chain does not by itself complete the gate. Nosh must read the resulting reports and artifacts, update the relevant project artifacts and live `todo` queue, then decide whether to rerun, adjust, or switch chains.

Design the model architecture, mechanisms, and code structure.

Any specialist agent invoked in this chain must receive Nosh's fixed delegation packet and keep `.ml-harness/reports/{part-id}.md` in the frontmatter schema defined by `templates/report.md`.

Agent sequence for this chain:

- `chamber` designs research architectures, mechanisms, and code structure.
- `dumbledore` or `luna` designs startup system architecture and product-facing technical structure.
- `sage` checks mathematical soundness, notation, and mechanism logic.
- `jett` or `hermione` checks whether the design is actually buildable and testable in code.

## Step 1: Read Context

Read `.ml-harness/truths/project-context.md`, `.ml-harness/truths/phase-breakdown.md`, `docs/problem-statement.md`, `docs/experiment-design.md`, and `docs/feasibility-report.md` if it exists.

## Step 2: Create Architecture Design

Choose the primary design owner:

- research architecture and mechanism design -> Subagent (`chamber`)
- startup system architecture -> Subagent (`dumbledore` or `luna`)

Create `docs/model-architecture.md` with:

- architecture overview,
- mechanism design,
- code structure,
- implementation plan.

## Step 3: Review Mathematical Soundness

Route the draft to an independent reviewer:

- mathematical soundness and mechanism logic -> Subagent (`sage`)

The reviewer appends a verdict and checks:

- mathematical soundness,
- tensor correctness,
- gradient flow,
- notation consistency.

## Step 4: Review Implementation Structure

Route the reviewed design to an implementation-minded reviewer:

- research buildability and code structure -> Subagent (`jett`)
- startup application structure and testability -> Subagent (`hermione`)

The reviewer appends a verdict and checks:

- clean interfaces,
- maintainable structure,
- testability,
- extensibility.

## Step 5: Update Artifacts

Update:

- `.ml-harness/truths/phase-breakdown.md`
- `.ml-harness/timeline.md`
- `.ml-harness/truths/decisions.md`

Check phase gates.
