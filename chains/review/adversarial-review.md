---
name: adversarial-review
description: "Adversarial review of claims, experiments, and conclusions"
---

# Adversarial Review Chain

This chain handles one bounded unit of work inside a gate. Completing this chain does not by itself complete the gate. Nosh must read the resulting reports and artifacts, update the relevant project artifacts and live `todo` queue, then decide whether to rerun, adjust, or switch chains.

Challenge every claim, experiment, and conclusion. Find the weakest points.

Any specialist agent invoked in this chain must receive Nosh's fixed delegation packet and keep `.ml-harness/reports/{part-id}.md` in the frontmatter schema defined by `templates/report.md`.

This chain is the skeptic pass for claim-bearing work. Use it after results, writing, or experiment-design chains when Nosh wants reviewer-2 pressure before advancing.

## Step 1: Challenge Claims

Read `.ml-harness/truths/phase-breakdown.md` and the claim-bearing artifacts for the active part.

For every claim:

- Is it supported by evidence?
- Is the experiment designed to test it?
- Are baselines compared fairly?
- Are there alternative explanations?
- What would a skeptic say?

## Step 2: Challenge Experiments

For every experiment:

- Does it test the claimed hypothesis?
- Are the metrics appropriate?
- Is the evaluation fair?
- Are there confounding factors?
- What is missing?

## Step 3: Challenge Conclusions

For every conclusion:

- Does it follow from the data?
- Is it overclaimed or underclaimed?
- What evidence would change it?
- What are the limitations?

## Step 4: Resolve Concerns

For each concern raised:

- if valid, route the issue back to the producing owner, then rerun this chain if the concern mattered to the gate,
- if not valid, provide the counterargument,
- if unclear, design additional evidence.

## Step 5: Update Artifacts

Update `.ml-harness/truths/phase-breakdown.md`, `.ml-harness/timeline.md`, and `.ml-harness/truths/decisions.md`. Check phase gates and report findings to the user.
