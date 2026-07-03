---
name: code-review
description: "Thorough code quality review"
---

# Code Review Chain

This chain handles one bounded unit of work inside a gate. Completing this chain does not by itself complete the gate. Nosh must read the resulting reports and artifacts, update the relevant project artifacts and live `todo` queue, then decide whether to rerun, adjust, or switch chains.

Thorough code review for quality, correctness, and maintainability.

Any specialist agent invoked in this chain must receive Nosh's fixed delegation packet and keep `.ml-harness/reports/{part-id}.md` in the frontmatter schema defined by `templates/report.md`.

This chain is itself an independent review pass. Use it after an implementation or fix chain, not as a substitute for implementation.

## Step 1: Review Code

Read `.ml-harness/truths/phase-breakdown.md` to confirm the active review part, then review the targeted code for:

- bugs and logical errors,
- error handling gaps,
- code style and convention mismatches,
- readability and maintainability issues,
- performance issues,
- security concerns.

Write findings to `.ml-harness/reports/{part-id}.md`.

Preferred reviewers:

- research code and reproducibility -> Subagent (`omen`)
- startup quality and test posture -> Subagent (`moody`)
- security-sensitive or exposed code paths -> Subagent (`snape`)

## Step 2: Check Consistency

Check for:

- duplicated logic,
- inconsistent patterns,
- unused imports or code,
- dependency issues.

## Step 3: Resolve Findings

For each finding:

- if blocking, route the fix back to the original implementation owner, then rerun this review,
- if non-blocking, document it,
- if disputed, flag it for a decision.

## Step 4: Update Artifacts

Update `.ml-harness/truths/phase-breakdown.md` and `.ml-harness/timeline.md`. Check phase gates and report findings to the user.
