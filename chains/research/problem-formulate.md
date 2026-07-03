---
name: problem-formulate
description: "Formalize the problem statement and research hypothesis"
---

# Problem Formulation Chain

This chain handles one bounded unit of work inside a gate. Completing this chain does not by itself complete the gate. Nosh must read the resulting reports and artifacts, update the relevant project artifacts and live `todo` queue, then decide whether to rerun, adjust, or switch chains.

Formalize the problem statement, hypothesis, and success criteria.

Any specialist agent invoked in this chain must receive Nosh's fixed delegation packet and keep `.ml-harness/reports/{part-id}.md` in the frontmatter schema defined by `templates/report.md`.

Agent sequence for this chain:

- `sage` drafts research hypotheses, scope boundaries, falsifiability, and metric hooks.
- `dumbledore` or `luna` drafts startup problem framing, user value, and success framing.
- `killjoy` checks whether the problem statement can actually be tested within the compute and evidence envelope.
- `kayo` attacks vagueness, fake novelty, and overclaiming.

## Step 1: Read Context

Read `.ml-harness/truths/project-context.md`, `.ml-harness/truths/phase-breakdown.md`, `docs/lit-review.md`, and `docs/baseline-results.md` if it exists.

## Step 2: Draft Problem Statement

Choose the primary drafter from the active project type:

- research hypothesis and scientific framing -> Subagent (`sage`)
- startup problem framing and product scope -> Subagent (`dumbledore` or `luna`)

Create `docs/problem-statement.md` with:

- problem definition,
- motivation,
- hypothesis,
- success criteria,
- evaluation metrics,
- scope boundaries.

## Step 3: Review Testability

Route the draft to an independent reviewer:

- research experimentability, controls, and metric realism -> Subagent (`killjoy`)
- startup metrics and evaluation realism -> Subagent (`moody`)

The reviewer appends a verdict and checks:

- testability,
- metric quality,
- experiment designability,
- falsifiability.

## Step 4: Challenge Framing

Route the framed statement to a challenger:

- skeptical claim and scope challenge -> Subagent (`kayo`)
- prior-work overlap check when novelty is central -> Subagent (`fade`)

Challenge the problem statement:

- Is this a real problem?
- Has this been solved before?
- Are we solving the right thing?
- Is the hypothesis too vague?

## Step 5: Update Artifacts

Update:

- `.ml-harness/truths/phase-breakdown.md`
- `.ml-harness/timeline.md`
- `.ml-harness/truths/project-context.md`
- `.ml-harness/truths/decisions.md`

Check phase gates.
