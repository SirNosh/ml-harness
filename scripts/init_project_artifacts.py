#!/usr/bin/env python3
"""Create Nosh ML harness project artifacts without LLM-generated content."""

from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path


def write_if_missing(path: Path, content: str) -> bool:
    if path.exists():
        return False
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    return True


def main() -> int:
    project_root = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path.cwd().resolve()
    now = datetime.now(timezone.utc).isoformat()

    harness_dir = project_root / ".ml-harness"
    truth_dir = harness_dir / "truths"
    reports_dir = harness_dir / "reports"
    docs_dir = project_root / "docs"

    created: list[str] = []

    files = {
        truth_dir / "project-context.md": """# Project Context

Status: awaiting Nosh onboarding interview.

## What This Project Is

TBD during /onboard.

## Why It Matters

TBD during /onboard.

## Current Shared Understanding

TBD during /onboard.

## Unknowns

- Initial grilling session has not been completed.
""",
        truth_dir / "grill-session.md": """# Grill Session

This file records the structured Nosh onboarding interview.

Raw user answers belong in `user-answers.md` and should be appended there verbatim after each reply.
""",
        truth_dir / "user-answers.md": """# User Answers

Append each user answer here verbatim, in order, immediately after the user responds during `/onboard`.

Do not paraphrase or rewrite prior entries.
""",
        truth_dir / "decisions.md": """# Decisions

Decisions are added only after Nosh and the user reach shared understanding.
""",
        truth_dir / "paper-definition.md": """# Paper Definition

Status: active for publishable research targets.

Nosh must not consider the mission complete until every required gate below is satisfied.

## Required Gates

- [ ] abstract
- [ ] introduction
- [ ] related work
- [ ] method
- [ ] experiments
- [ ] results
- [ ] limitations
- [ ] conclusion
- [ ] references
- [ ] final adversarial review

## Gate Notes

- The living manuscript is `docs/paper-draft.md`.
- Every nontrivial claim in that draft must map to evidence in `.ml-harness/truths/claim-ledger.md`.
- If the project later becomes a non-paper target, Nosh may mark this file as not applicable with reasons, but should not silently ignore it.

## Mission Completion Lock

The mission is complete only when all of the following are true:

- every required gate above is actually satisfied,
- the final phase exit-proof artifact named in `.ml-harness/truths/phase-breakdown.md` exists and has been accepted,
- no required unfinished parts remain in `.ml-harness/truths/phase-breakdown.md`,
- the live `todo` queue has no remaining required active work,
- `.ml-harness/truths/claim-ledger.md` has no paper-critical unsupported claims,
- the final adversarial review passed.

Existing section headings or partial text in `docs/paper-draft.md` are not enough by themselves.
""",
        truth_dir / "claim-ledger.md": """# Claim Ledger

Track every nontrivial claim that appears in `docs/paper-draft.md`.

## Entry Template

- claim-id: c1
  claim: TBD
  draft-location: TBD
  evidence:
    - missing
  status: unsupported
  next-action: weaken claim or generate evidence
""",
        truth_dir / "phase-breakdown.md": """# Phase Breakdown

Status: awaiting post-grill work breakdown.

Use this file as the canonical task plan after onboarding.

## How Nosh Uses This File

- Break work down phase by phase before chains begin.
- For each phase, define the goal, exit criteria, and exact exit proof artifact.
- For each part, define one bounded chain-sized task.
- For research-paper targets, make every phase push material into `docs/paper-draft.md` and update `.ml-harness/truths/claim-ledger.md` when claims change.

## Live Queue Rule

- This file is authoritative for phases, parts, dependencies, and exit proofs.
- The live `todo` queue is derived from the executable unfinished parts here.
- Each todo item should carry `part-id`, `phase`, `chain`, and `owner` metadata when applicable.
- When a part completes or the plan changes, repair the `todo` queue immediately.

## Part Template

### Phase: {phase-name}

Goal: TBD during /onboard.

Exit criteria:
- TBD during /onboard.

Exit proof artifact:
- TBD during /onboard.

Parts:
- part-id: p1
  objective: TBD
  chain: TBD
  owner: TBD
  dependencies: []
  exact-input-files: []
  expected-output-files: []
  success-criteria:
    - TBD
  report-action: create
  status: pending
""",
        harness_dir / "timeline.md": f"""# ML Harness Timeline

- {now} - Created initial ML harness project artifacts.
""",
        docs_dir / "paper-draft.md": """# Working Paper Draft

Status: initialized during onboarding.

## Abstract

TBD.

## Introduction

TBD.

## Related Work

TBD.

## Method

TBD.

## Experiments

TBD.

## Results

TBD.

## Limitations

TBD.

## Conclusion

TBD.

## References

TBD.
""",
        harness_dir / "state.json": json.dumps(
            {
                "schema": "ml-harness.state.v1",
                "createdAt": now,
                "phase": "onboarding",
                "onboardingComplete": False,
                "phaseBreakdownReady": False,
                "chainsUnlocked": False,
                "truthDir": ".ml-harness/truths",
            },
            indent=2,
        )
        + "\n",
        reports_dir / ".gitkeep": "",
    }

    for path, content in files.items():
        if write_if_missing(path, content):
            created.append(str(path.relative_to(project_root)).replace("\\", "/"))

    print(
        json.dumps(
            {
                "projectRoot": str(project_root),
                "created": created,
                "truthDir": ".ml-harness/truths",
                "paperDraft": "docs/paper-draft.md",
                "stateFile": ".ml-harness/state.json",
                "freshlyCreated": bool(created),
            },
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
