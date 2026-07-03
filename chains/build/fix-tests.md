---
name: fix-tests
description: "Fix failing tests and ensure all tests pass"
---

# Fix Tests Chain

This chain handles one bounded unit of work inside a gate. Completing this chain does not by itself complete the gate. Nosh must read the resulting reports and artifacts, update the relevant project artifacts and live `todo` queue, then decide whether to rerun, adjust, or switch chains.

Diagnose and fix failing tests.

Any specialist agent invoked in this chain must receive Nosh's fixed delegation packet and keep `.ml-harness/reports/{part-id}.md` in the frontmatter schema defined by `templates/report.md`.

Agent sequence for this chain:

- `jett` diagnoses and fixes failing research or experiment tests.
- `hermione` diagnoses and fixes failing startup application tests.
- `hagrid` diagnoses and fixes failing data or integration tests.
- `omen` reruns and reviews research-facing fixes for regressions or protocol breakage.
- `moody` reruns and reviews startup-facing fixes for user-facing regressions and test signal quality.

## Step 1: Run Test Suite

Read `.ml-harness/truths/phase-breakdown.md` to confirm the active fix-tests part and its success criteria. Then run the full test suite. Capture:

- which tests pass,
- which tests fail,
- error messages and stack traces,
- test output.

## Step 2: Diagnose Failures

Choose the diagnosis owner from the current project type:

- Research or experiment code -> Subagent (jett)
- Startup application work -> Subagent (hermione)
- Startup data or integration work -> Subagent (hagrid)

For each failing test:

1. Read the error message.
2. Read the test code.
3. Read the code being tested.
4. Identify the root cause.
5. Determine the fix.

## Step 3: Apply Fixes

Apply fixes one at a time:

1. Fix one test.
2. Run the test to verify.
3. Run the full suite to check for regressions.
4. Move to the next failure.

## Step 4: Verify Fixes

Choose the verifier from the current project type:

- Research implementation -> Subagent (omen)
- Startup implementation -> Subagent (moody)

The verifier appends a verdict to `.ml-harness/reports/{part-id}.md` after rerunning the suite.

Run the full test suite again. Confirm:

- all tests pass,
- no regressions,
- coverage expectations are still met.

## Step 5: Update Artifacts

Update `.ml-harness/truths/phase-breakdown.md` and `.ml-harness/timeline.md`. Report results to the user.
