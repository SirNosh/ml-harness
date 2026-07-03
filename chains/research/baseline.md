---
name: baseline
description: "Reproduce baseline results from referenced papers"
---

# Baseline Chain

This chain handles one bounded unit of work inside a gate. Completing this chain does not by itself complete the gate. Nosh must read the resulting reports and artifacts, update the relevant project artifacts and live `todo` queue, then decide whether to rerun, adjust, or switch chains.

Reproduce key results from referenced papers to establish a baseline.

Any specialist agent invoked in this chain must receive Nosh's fixed delegation packet and keep `.ml-harness/reports/{part-id}.md` in the frontmatter schema defined by `templates/report.md`.

Agent sequence for this chain:

- `jett` reproduces the baseline code path, training loop, and evaluation harness.
- `hagrid` or `cypher` handles tricky data ingestion, benchmark setup, and split integrity.
- `omen` checks whether the reproduction actually matches the paper's protocol and comparison rules.
- `breach` interprets discrepancy patterns when they change later claims or experiment design.

## Step 1: Read Context

Read `.ml-harness/truths/project-context.md`, `.ml-harness/truths/phase-breakdown.md`, and `docs/lit-review.md` to understand which baseline part is active and what must be reproduced.

## Step 2: Reproduce Baselines

Choose the reproduction owner from the active baseline part:

- research code and training reproduction -> Subagent (`jett`)
- data or benchmark setup with tricky ingestion or split handling -> Subagent (`hagrid` or `cypher`)

For each baseline:

1. Find the paper and any available code.
2. Set up the exact configuration from the paper.
3. Run the reproduction with the same hyperparameters.
4. Compare results to reported values.
5. Document any discrepancies.

Output: write `docs/baseline-results.md` with:

- baseline configurations,
- paper-reported results,
- reproduction results,
- match analysis,
- discrepancy notes.

## Step 3: Review Reproduction

Route the completed reproduction to an independent reviewer:

- evaluation protocol and implementation fidelity -> Subagent (`omen`)
- data split and benchmark integrity -> Subagent (`cypher`)

The reviewer appends a verdict and checks:

- same evaluation protocol,
- same data splits,
- subtle differences that could invalidate the comparison.

## Step 4: Update Artifacts

Read `docs/baseline-results.md` and `.ml-harness/reports/{part-id}.md`. Update:

- `.ml-harness/truths/phase-breakdown.md`
- `.ml-harness/timeline.md`
- `.ml-harness/truths/project-context.md`

Check phase gates.
