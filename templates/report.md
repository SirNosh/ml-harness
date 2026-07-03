# Agent Report Template

Write delegated reports to `.ml-harness/reports/{part-id}.md`.

Keep this frontmatter at the top of the file and update it to reflect the latest state of the part:

```yaml
---
agent: "{agent-name}"
part-id: "{part-id}"
inputs:
  - "{input-file}"
outputs:
  - "{output-file}"
evidence-produced:
  - "{artifact-or-none}"
confidence: high
blockers:
  - none
recommended-next-part: "{part-id-or-none}"
recommended-next-chain: "{chain-or-none}"
recommended-next-agent: "{agent-name-or-none}"
---
```

If Nosh tells you to append, preserve the existing report body, update the frontmatter to the current best state, and add a new run entry below. The first agent creates the file. Later reviewers or challengers append; they do not replace earlier runs.

Use one run entry per agent pass:

```md
## Run: {agent-name} - {owner|reviewer|challenger}
```

Inside each run entry, use this structure:

### Objective

{What Nosh asked you to do}

### Verdict

{pass | pass with fixes | fail | n/a}

### Summary

{Short result summary}

### Work Done

- {Exact action}
- {Exact action}

### Findings

- {Key finding or issue}
- {Key finding or issue}

### Verification

- {Tests, review, or validation run}
- {If none, say none}

### Open Questions

- {Question or none}

### Next Step

{What Nosh should do next}
