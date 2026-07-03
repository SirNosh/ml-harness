---
name: experiment-design
description: "Design the experimental methodology and ablation studies"
---

# Experiment Design Chain

This chain handles one bounded unit of work inside a gate. Completing this chain does not by itself complete the gate. Nosh must read the resulting reports and artifacts, update the relevant project artifacts and live `todo` queue, then decide whether to rerun, adjust, or switch chains.

Design the complete experimental methodology, including ablation studies.

Any specialist agent invoked in this chain must receive Nosh's fixed delegation packet and keep `.ml-harness/reports/{part-id}.md` in the frontmatter schema defined by `templates/report.md`.

Agent sequence for this chain:

- `chamber` designs the main experiment set, controls, and ablation structure for research work.
- `moody` designs evaluation-heavy startup validation plans.
- `killjoy` pressures the compute budget, minimum viable envelope, and fairness constraints.
- `sage` checks mathematical and statistical rigor.
- `kayo` attacks loopholes, missing controls, and reviewer-2 weaknesses.

## Step 1: Read Context

Read `.ml-harness/truths/project-context.md`, `.ml-harness/truths/phase-breakdown.md`, `docs/problem-statement.md`, `docs/lit-review.md`, and `docs/baseline-results.md` if they exist.

## Step 2: Create Experiment Design

Choose the primary design owner:

- research methodology and ablation structure -> Subagent (`chamber`)
- evaluation-heavy startup validation plans -> Subagent (`moody`)

Create `docs/experiment-design.md` with:

- main experiments,
- ablation studies,
- compute budget,
- metrics,
- success criteria.

## Step 3: Review Methodology

Route the draft to an independent reviewer:

- compute realism, controls, and minimum viable envelope -> Subagent (`killjoy`)
- mathematical or statistical rigor -> Subagent (`sage`)

The reviewer appends a verdict and checks:

- proper controls,
- useful ablations,
- appropriate metrics,
- sound statistical methodology.

## Step 4: Verify Feasibility

Route the design to a challenger before closing the part:

- claim and design skepticism -> Subagent (`kayo`)

Verify:

- fit in compute budget,
- realistic timelines,
- minimum viable experiment set.

## Step 5: Update Artifacts

Update:

- `.ml-harness/truths/phase-breakdown.md`
- `.ml-harness/timeline.md`
- `.ml-harness/truths/decisions.md`

Check phase gates.
