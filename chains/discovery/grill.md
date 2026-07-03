---
name: grill
description: "Socratic grilling session - one question at a time to deeply understand the project"
---

# Grill Chain

This chain handles one bounded unit of work inside a gate. Completing this chain does not by itself complete the gate. Nosh must read the resulting reports and artifacts, update the relevant project artifacts and live `todo` queue, then decide whether to rerun, adjust, or switch chains.

Conduct a Socratic grilling session with the user. One question at a time. Follow-up drilling. No assumptions.

Agent sequence for this chain:

- `nosh` conducts the grilling directly with the user.
- `nosh` appends each raw user answer verbatim to `.ml-harness/truths/user-answers.md` immediately after the user responds.
- `nosh` writes the resulting understanding into the truth files.
- No subagent should ask the core onboarding questions, because only Nosh owns the full project context.

## Step 1: Conduct Grill

Ask the user one open-ended question about their project. Wait for their response. Then ask a follow-up that drills deeper into what they said.

1. Ask one question.
2. Wait for response.
3. Append the user's raw answer verbatim to `.ml-harness/truths/user-answers.md` immediately.
4. Ask a follow-up that challenges assumptions or deepens understanding.
5. Repeat until there is shared understanding.

The goal is to uncover:

- what they are actually trying to build,
- why it matters,
- what constraints they have,
- what "done" looks like,
- what they have already tried,
- what they do not know,
- what tradeoffs they will and will not accept.

Write the structured grilling session to `.ml-harness/truths/grill-session.md`. Keep `.ml-harness/truths/user-answers.md` as the raw, un-paraphrased answer log.

## Step 2: Write Project Context

Based on the grilling session and `.ml-harness/truths/user-answers.md`, update `.ml-harness/truths/project-context.md`. This is a living document that captures:

- what the project is,
- why it matters,
- what has been decided,
- what is still unknown,
- current status,
- whether this is AI Lab or AI Startup work.

## Step 3: Update High-Level State

Update `.ml-harness/state.json` with only high-level project state:

- project type (`research` or `startup`),
- current phase (`discovery`),
- phase definitions and gates from `assets/phases/{type}.yaml`,
- onboarding flags,
- timeline started.

Do not invent or store the detailed parts list here. The detailed task plan belongs in `.ml-harness/truths/phase-breakdown.md`.

## Step 4: Present Summary

Show the user:

- what you heard,
- the project type and phase spine,
- the major unresolved questions that still shape the plan,
- that the next step is the phase-by-phase work breakdown.

If the user wants changes, update and re-present. Only move on to the breakdown step once the shared understanding is solid enough to plan against.
