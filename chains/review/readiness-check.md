---
name: readiness-check
description: "Check if all phase gates are met and the project is ready to advance"
---

# Readiness Check Chain

This chain handles one bounded unit of work inside a gate. Completing this chain does not by itself complete the gate. Nosh must read the resulting reports and artifacts, update the relevant project artifacts and live `todo` queue, then decide whether to rerun, adjust, or switch chains.

Verify all phase gates are met before advancing to the next phase.

This chain does not replace artifact review. Use it only after the relevant worker and reviewer reports exist.

## Step 1: Read Phase Status

Read:

- `.ml-harness/state.json`
- `.ml-harness/truths/phase-breakdown.md`
- the live `todo` queue via `todo({ action: "list" })` if available

Use `state.json` for the high-level phase and gate spine. Use `phase-breakdown.md` for the part-level evidence and the canonical next allowed parts. Treat the live `todo` queue as the operational next-task surface.

## Step 2: Check Gates

For each gate in the current phase:

- is it met,
- what part or artifact proves it,
- if not met, what is still missing.

Also verify whether the parts listed for the current phase in `.ml-harness/truths/phase-breakdown.md` are actually complete.

For AI Lab paper-targeted work, also verify whether `.ml-harness/truths/paper-definition.md` has any required gate that still lacks the promised artifact or review evidence.

## Step 3: Generate Gate Report

Create a clear status report:

```text
Phase: {current_phase}
Status: {complete|incomplete}

Gates:
- [x] Gate 1 - met (evidence: ...)
- [ ] Gate 2 - unmet (missing: ...)

Overall: {X}/{Y} gates met
Ready to advance: {yes|no}
```

## Step 4: Suggest Next Actions

If gates are unmet:

- identify the next part to run from `.ml-harness/truths/phase-breakdown.md`,
- ensure the live `todo` queue points at that part and remove stale conflicting tasks,
- explain what is blocking the remaining gates,
- recommend the next chain.

If all gates are met:

- announce phase completion,
- for AI Lab work, recommend the next phase or next part,
- for AI Startup work, stop and ask the user to approve the next gate before routing into it.

## Step 5: Update Status

Update `.ml-harness/state.json` with the current phase outcome and any phase advancement.
Update `.ml-harness/timeline.md` with the readiness-check result.
