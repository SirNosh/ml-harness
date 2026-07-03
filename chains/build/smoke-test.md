---
name: smoke-test
description: "Run a minimal end-to-end test to verify the pipeline works"
---

# Smoke Test Chain

This chain handles one bounded unit of work inside a gate. Completing this chain does not by itself complete the gate. Nosh must read the resulting reports and artifacts, update the relevant project artifacts and live `todo` queue, then decide whether to rerun, adjust, or switch chains.

Run a minimal end-to-end test to verify the full pipeline works before committing to a full run.

Any specialist agent invoked in this chain must receive Nosh's fixed delegation packet and keep `.ml-harness/reports/{part-id}.md` in the frontmatter schema defined by `templates/report.md`.

Agent sequence for this chain:

- `jett` runs the smallest credible research or training smoke test.
- `hermione` runs the smallest credible application smoke test.
- `hagrid` runs data-path and integration smoke tests.
- `omen` checks whether the research smoke test output is trustworthy enough to de-risk the next run.
- `moody` checks whether the startup smoke test gives a meaningful quality signal.
- `snape` checks guardrails, auth, and exposed flows when the smoke test covers them.

## Step 1: Choose Owner

Read `.ml-harness/truths/phase-breakdown.md` to confirm the active smoke-test part and its success criteria.

Choose the smoke-test owner from the current project type:

- Research pipeline or model training work -> Subagent (jett)
- Startup application work -> Subagent (hermione)
- Startup data or integration paths -> Subagent (hagrid)

Create a minimal test configuration:

- small dataset,
- small model,
- few steps,
- basic evaluation.

## Step 2: Execute Minimal Run

Execute the minimal pipeline run and verify:

- data loading works,
- forward pass works,
- loss computation works,
- backward pass works,
- optimizer step works,
- evaluation works.

## Step 3: Verify Smoke-Test Results

Check:

- training starts without errors,
- loss behaves sanely,
- no NaN or Inf values,
- memory usage is reasonable,
- no obvious bugs.

## Step 4: Review Smoke Test

Choose the reviewer from the current project type:

- Research pipeline -> Subagent (omen)
- Startup application quality -> Subagent (moody)
- Startup safety-critical paths -> Subagent (snape) when the smoke test covers guardrails or exposed user flows

The reviewer appends a verdict to `.ml-harness/reports/{part-id}.md`. If the reviewer says the smoke test is inconclusive or unsafe, loop back instead of advancing.

## Step 5: Update Artifacts

Update `.ml-harness/truths/phase-breakdown.md` and `.ml-harness/timeline.md`. Report results to the user.

If the smoke test passes, announce readiness for the fuller run it de-risks.
