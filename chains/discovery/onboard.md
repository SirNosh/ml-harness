---
name: onboard
description: "Complete onboarding - grill, breakdown, and first chain selection"
---

# Onboard Chain

This chain handles one bounded unit of work inside a gate. Completing this chain does not by itself complete the gate. Nosh must read the resulting reports and artifacts, update the relevant project artifacts and live `todo` queue, then decide whether to rerun, adjust, or switch chains.

Complete the full onboarding process in one chain. This runs the grill, breakdown, and selects the first chain to execute.

Agent sequence for this chain:

- `nosh` runs the grilling session, writes the shared project understanding, and decides when the understanding is strong enough to plan against.
- `nosh` appends each raw user answer to `.ml-harness/truths/user-answers.md` as the user responds.
- `nosh` then runs the breakdown pass and proposes the first chainable parts.
- No subagent should be used here unless Nosh explicitly needs a bounded specialist pass after onboarding is already complete.

## Step 1: Run Grill Chain

Execute the `grill` chain. This updates:

- `.ml-harness/truths/grill-session.md`
- `.ml-harness/truths/user-answers.md`
- `.ml-harness/truths/project-context.md`
- `.ml-harness/state.json`
- `.ml-harness/timeline.md`

## Step 2: Run Breakdown Chain

Execute the `breakdown` chain. This writes:

- `.ml-harness/truths/phase-breakdown.md`
- `.ml-harness/truths/paper-definition.md`
- `.ml-harness/truths/claim-ledger.md`
- `docs/paper-draft.md`

Do not unlock chains until the user approves this breakdown.

## Step 3: Select First Chain

Once the breakdown is approved, select the first chain from the first approved part in `.ml-harness/truths/phase-breakdown.md`.

Default starting points:

- Research: start with the first discovery or research part, typically `research/literature-review`.
- Startup: start with the first planning part, typically a Dumbledore-led product or architecture pass before implementation chains.

Before declaring readiness, clear any stale todo items and seed the live `todo` queue from the first executable parts in `.ml-harness/truths/phase-breakdown.md`.

## Step 4: Announce Readiness

Tell the user:

- onboarding is complete,
- project context is set,
- the phase breakdown is approved,
- the live `todo` queue now reflects the first executable parts,
- the first chain is ready to run,
- that chain work now runs one approved part at a time from `.ml-harness/truths/phase-breakdown.md`.

Wait for confirmation before executing the first chain.
