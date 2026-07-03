---
name: breakdown
description: "Break the project into phase-scoped parts with dependencies and exit criteria"
---

# Breakdown Chain

This chain handles one bounded unit of work inside a gate. Completing this chain does not by itself complete the gate. Nosh must read the resulting reports and artifacts, update the relevant project artifacts and live `todo` queue, then decide whether to rerun, adjust, or switch chains.

After grilling is complete, break the project into the bounded tasks that chains will actually run.

## Step 1: Read Planning Context

Read:

- `.ml-harness/truths/project-context.md`
- `.ml-harness/truths/grill-session.md`
- `.ml-harness/truths/user-answers.md`
- `.ml-harness/truths/decisions.md`
- `.ml-harness/truths/paper-definition.md`
- `.ml-harness/truths/claim-ledger.md`
- `docs/paper-draft.md`
- `.ml-harness/state.json`
- `assets/phases/{type}.yaml` for the active project type

## Step 2: Break Work Down By Phase

For each phase that remains, define:

- the phase goal,
- the gates or exit criteria,
- the exact artifact or artifacts that prove the phase is complete,
- the parts that must be completed before the phase can end.

Each part must be small enough for one bounded chain run and must include:

- `part-id`
- objective
- chain
- owner
- dependencies
- exact input files
- expected output files
- success criteria
- report action
- status

For any part that produces code, experiments, results, or claim-bearing writing, plan the specialist handoff explicitly. Examples:

- implementation parts usually route `jett` or `hermione` -> `omen` or `moody` -> `snape` when exposed
- experiment parts usually route `jett` or `hagrid` -> `omen` or `killjoy` -> `breach`
- claim-bearing writing usually routes `astra` or `sage` -> `omen` or `fade` -> `kayo`

Do not create parts that let the same owner produce and approve the evidence.

For AI Lab paper-targeted work:

- every phase must push material into `docs/paper-draft.md`,
- any part that changes claims must update `.ml-harness/truths/claim-ledger.md`,
- the final phase cannot end until `.ml-harness/truths/paper-definition.md` is satisfied.
- the live `todo` queue must be derivable from the executable unfinished parts in this file.

## Step 3: Write The Canonical Plan

Write the complete plan to `.ml-harness/truths/phase-breakdown.md`.

Use this shape:

```text
### Phase: discovery
Goal: ...

Exit criteria:
- ...

Exit proof artifact:
- ...

Parts:
- part-id: p1
  objective: ...
  chain: research/literature-review
  owner: sova
  dependencies: []
  exact-input-files:
    - .ml-harness/truths/project-context.md
  expected-output-files:
    - docs/lit-review.md
    - .ml-harness/reports/p1.md
  success-criteria:
    - ...
  report-action: create
  status: pending
```

This file is the source of truth for what each chain run is supposed to do.

It is also the source from which the live `todo` queue is seeded and repaired.

## Step 4: Identify Critical Path

Determine which parts are on the critical path. These get priority.

## Step 5: Present Breakdown

Show the user:

- total parts,
- the phase-by-phase execution order,
- critical dependencies,
- the first few parts you recommend running,
- what must be true before each phase can end.

Ask for approval before unlocking chains. When approved, update `.ml-harness/state.json` so `phaseBreakdownReady` is true.

After approval, the live `todo` queue should be seeded from the first executable parts here.
