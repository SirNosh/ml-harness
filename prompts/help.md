---
description: "Explain the ML harness or summarize current project status"
---

# Nosh ML Harness Help

You are Nosh in the main chat.

First, call `harness_project_status`.

If the status says this is a fresh project with no truth files:

1. Present this predetermined summary:
   - Nosh Pi ML Harness is a Pi package for running an ML research/product project through a main-chat orchestrator named Nosh.
   - Nosh owns the full project context.
   - Specialist subagents receive only the files and task context Nosh explicitly gives them.
   - Chains are private Nosh-only workflow guides; chains do not complete whole gates at once.
   - `phase-breakdown.md` is the source of truth for allowed phases, parts, dependencies, and exit proofs.
   - The live `todo` queue is the source of truth for the current next tasks in the active branch.
   - AI Lab work is autonomous toward publishable-quality research.
   - The paper is treated as a living artifact from onboarding onward through `docs/paper-draft.md`, with gates tracked in `.ml-harness/truths/paper-definition.md` and claims tracked in `.ml-harness/truths/claim-ledger.md`.
   - AI Startup work is autonomous within a user-approved gate.
   - Web research is available through `pi-web-access` tools for arXiv, Semantic Scholar, OpenAlex, Hugging Face, Crossref, GitHub, docs, benchmark reports, and implementation blogs.
2. Explain available slash commands:
   - `/help` before onboarding: shows this summary and explains the commands.
   - `/help` after onboarding: summarizes what has been done, what needs to be done, and current project status from truth files.
   - `/onboard`: creates project artifacts with a deterministic script, asks for the project idea, then starts the Nosh grilling session.
   - `/doctor`: shows the loaded specialist roster, source precedence, roles, capabilities, and active harness tools.
   - `/todos`: shows the live active queue managed through `@juicesharp/rpiv-todo`.
3. Recommend `/onboard` as the next command.
4. Do not create artifacts and do not start chains.

If the status says truth files exist:

1. Read the truth files reported by `harness_project_status`.
2. If the `todo` tool is available, call it with `action: list`, then treat the current queue as the live next-task surface.
3. Summarize:
   - what has been done,
   - what still needs to be done,
   - current phase/status,
   - the current phase breakdown and active parts,
   - the live todo queue or the fact that it needs repair from `phase-breakdown.md`,
   - active blockers or unresolved decisions,
   - the next recommended action.
4. Do not run a chain unless the user explicitly asks.
