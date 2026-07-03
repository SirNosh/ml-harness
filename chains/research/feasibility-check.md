---
name: feasibility-check
description: "Check if the project is feasible within resource constraints"
---

# Feasibility Check Chain

This chain handles one bounded unit of work inside a gate. Completing this chain does not by itself complete the gate. Nosh must read the resulting reports and artifacts, update the relevant project artifacts and live `todo` queue, then decide whether to rerun, adjust, or switch chains.

Assess whether the proposed approach is feasible within compute, time, and data constraints.

Any specialist agent invoked in this chain must receive Nosh's fixed delegation packet and keep `.ml-harness/reports/{part-id}.md` in the frontmatter schema defined by `templates/report.md`.

Agent sequence for this chain:

- `killjoy` estimates the real compute, memory, time, and experiment envelope for research work.
- `mcgonagall` or `luna` checks delivery, rollout, and operating feasibility for startup work.
- `chamber` cuts architectural bloat and points out simpler feasible alternatives.
- `snape` checks safety, auth, secrets, or exposure risk when the feasibility decision touches deployed behavior.

## Step 1: Read Context

Read `.ml-harness/truths/project-context.md`, `docs/problem-statement.md`, `.ml-harness/truths/phase-breakdown.md`, and `docs/baseline-results.md` if it exists.

## Step 2: Estimate Feasibility

Choose the primary feasibility owner:

- research compute, memory, and experiment feasibility -> Subagent (`killjoy`)
- startup delivery, deployment, and operations feasibility -> Subagent (`mcgonagall` or `luna`)

Estimate:

- GPU hours,
- memory requirements,
- data storage needs,
- timeline,
- cost.

Write `docs/feasibility-report.md` with:

- resource requirements,
- risk assessment,
- alternatives,
- minimum viable experiment,
- recommendation.

## Step 3: Review Architecture Risk

Route the report to an independent reviewer:

- systems and architecture simplification -> Subagent (`chamber`)
- security, safety, or operational exposure -> Subagent (`snape`)

The reviewer appends a verdict and checks:

- scaling risk,
- known failure modes,
- implementation complexity,
- simpler alternatives.

## Step 4: Update Artifacts

Update:

- `.ml-harness/truths/phase-breakdown.md`
- `.ml-harness/timeline.md`
- `.ml-harness/truths/decisions.md`

Check phase gates. If feasibility is confirmed, announce readiness to proceed to design.
