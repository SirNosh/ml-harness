---
name: analyze-results
description: "Analyze all experimental results and draw conclusions"
---

# Analyze Results Chain

This chain handles one bounded unit of work inside a gate. Completing this chain does not by itself complete the gate. Nosh must read the resulting reports and artifacts, update the relevant project artifacts and live `todo` queue, then decide whether to rerun, adjust, or switch chains.

Analyze all experimental results, draw conclusions, and prepare for writing.

Any specialist agent invoked in this chain must receive Nosh's fixed delegation packet and keep `.ml-harness/reports/{part-id}.md` in the frontmatter schema defined by `templates/report.md`.

Agent sequence for this chain:

- `breach` synthesizes experiment outputs into claims, tables, comparisons, and mechanism readouts.
- `sage` audits the logic, statistics, and whether the conclusions actually follow from the evidence.
- `omen` traces conclusions back to concrete artifacts and checks that no result is being misrepresented.
- `kayo` attacks the conclusions like a hostile reviewer and looks for overclaiming.

## Step 1: Read Context

Read `.ml-harness/truths/phase-breakdown.md`, `docs/experiment-design.md`, `docs/baseline-results.md`, `docs/ablation-results.md`, the relevant experiment outputs, and the explicitly named reports needed for the active analysis part.

## Step 2: Draft Results Synthesis

Choose the primary analysis owner:

- experiment interpretation and mechanism analysis -> Subagent (`breach`)
- theory-heavy synthesis and formal argumentation -> Subagent (`sage`)

Create `docs/results.md` with:

- summary of all experiments,
- key findings,
- results versus hypothesis,
- comparison to SOTA,
- statistical analysis,
- figures and tables.

## Step 3: Review Conclusions

Route the synthesis to an independent reviewer:

- evidence fidelity and result traceability -> Subagent (`omen`)
- statistical and logical soundness -> Subagent (`sage`)

The reviewer appends a verdict and checks:

- whether conclusions follow from the data,
- whether they are scoped correctly,
- whether limitations are acknowledged,
- whether significance is clear.

## Step 4: Challenge Conclusions

Route the reviewed conclusions to a challenger:

- skeptical claim and reviewer-2 style critique -> Subagent (`kayo`)

Challenge every conclusion:

- Is this overclaimed?
- What is the weakest point?
- What would a reviewer say?
- What additional evidence is needed?

## Step 5: Update Artifacts

Update `.ml-harness/truths/phase-breakdown.md`, `.ml-harness/timeline.md`, `.ml-harness/truths/project-context.md`, and `.ml-harness/truths/decisions.md`. Check phase gates and announce readiness for writing when justified.
