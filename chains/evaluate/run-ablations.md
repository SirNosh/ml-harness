---
name: run-ablations
description: "Execute planned ablation studies"
---

# Run Ablations Chain

This chain handles one bounded unit of work inside a gate. Completing this chain does not by itself complete the gate. Nosh must read the resulting reports and artifacts, update the relevant project artifacts and live `todo` queue, then decide whether to rerun, adjust, or switch chains.

Execute planned ablation studies as defined in the experiment design.

Any specialist agent invoked in this chain must receive Nosh's fixed delegation packet and keep `.ml-harness/reports/{part-id}.md` in the frontmatter schema defined by `templates/report.md`.

Agent sequence for this chain:

- `jett` executes ablations, config changes, and controlled run variants.
- `hagrid` handles ablations dominated by data, ingestion, or benchmark wiring.
- `omen` checks that the run matched the approved protocol and logging expectations.
- `killjoy` checks fairness, compute envelope, and whether the comparison was actually controlled.
- `breach` interprets what changed and what the ablation means mechanistically.
- `kayo` attacks overclaims when the ablation will support a strong conclusion.

## Step 1: Read Context

Read `docs/experiment-design.md` and `.ml-harness/truths/phase-breakdown.md` to determine which ablation part is active.

## Step 2: Execute Ablations

Choose the primary run owner:

- research implementation and execution -> Subagent (`jett`)
- data-heavy or benchmark-heavy ablations -> Subagent (`hagrid`)

For each planned ablation:

1. Set up the configuration.
2. Run the experiment.
3. Evaluate the results.
4. Compare against the full model.
5. Document the findings.

Output: write `docs/ablation-results.md` with per-ablation configs, metrics, deltas versus the full model, and any execution anomalies.

## Step 3: Validate Ablations

Route the completed run to an independent reviewer:

- protocol fidelity and reproducibility -> Subagent (`omen`)
- compute-envelope and control fairness -> Subagent (`killjoy`)

The reviewer appends a verdict. For each ablation, check:

- did the run match the design,
- is the result statistically significant,
- are there confounding factors,
- do we need reruns or tighter controls.

## Step 4: Interpret Ablations

Route the validated ablation to an analyst:

- results interpretation and mechanism readout -> Subagent (`breach`)
- if the interpretation will support a strong claim, route a skeptical pass -> Subagent (`kayo`)

For each ablation:

- does it support or refute the hypothesis,
- what does it tell us about the mechanism,
- what assumptions were strengthened or weakened.

## Step 5: Update Artifacts

Read `docs/ablation-results.md` and `.ml-harness/reports/{part-id}.md`. Update `.ml-harness/truths/phase-breakdown.md`, `.ml-harness/timeline.md`, and `.ml-harness/truths/project-context.md`. Check phase gates and report results to the user.
