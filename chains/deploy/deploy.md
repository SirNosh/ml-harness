---
name: deploy
description: "Deploy the project for production or release"
---

# Deploy Chain

This chain handles one bounded unit of work inside a gate. Completing this chain does not by itself complete the gate. Nosh must read the resulting reports and artifacts, update the relevant project artifacts and live `todo` queue, then decide whether to rerun, adjust, or switch chains.

Deploy the project for production use or public release.

Any specialist agent invoked in this chain must receive Nosh's fixed delegation packet and keep `.ml-harness/reports/{part-id}.md` in the frontmatter schema defined by `templates/report.md`.

Agent sequence for this chain:

- `mcgonagall` owns deployment, CI/CD, rollout, and rollback readiness.
- `hermione` handles application release fixes and packaging issues tied to the deployment.
- `hagrid` handles data-path and integration rollout work.
- `snape` checks secrets, auth, authorization, policy exposure, and risky configuration.
- `moody` verifies deployed behavior, quality signals, and release readiness.
- `omen` can do the final verification pass when reproducibility or protocol fidelity matters after rollout.

## Step 1: Read Requirements

Read `.ml-harness/truths/project-context.md` and `.ml-harness/truths/phase-breakdown.md` to understand the active deployment part and its requirements.

## Step 2: Prepare Deployment

Choose the primary deployment owner:

- deployment, CI or infrastructure rollout -> Subagent (`mcgonagall`)
- application release fixes and packaging -> Subagent (`hermione`)
- data or integration-heavy release work -> Subagent (`hagrid`)

- set up CI/CD,
- configure the target environment,
- manage secrets and configuration,
- set up monitoring,
- create the deployment runbook.

## Step 3: Review Security And Readiness

Route the prepared deployment to an independent reviewer:

- secrets, auth, authorization, and policy exposure -> Subagent (`snape`)
- operational readiness and deployment quality -> Subagent (`moody`)

The reviewer appends a verdict and checks:

- no secrets in code,
- authentication working,
- authorization enforced,
- compliant data handling,
- audit trail in place.

## Step 4: Deploy And Verify

- deploy to the target environment,
- run smoke tests,
- verify monitoring,
- confirm rollback capability.

If the deployment is externally exposed, Nosh should prefer one final verification pass from `omen` or `moody` before closing the part.

## Step 5: Write Release Materials

- write release notes,
- announce to stakeholders,
- document changes,
- create a migration guide if needed.

## Step 6: Update Artifacts

Update `.ml-harness/truths/phase-breakdown.md` and `.ml-harness/timeline.md`. Check phase gates and announce deployment completion.
