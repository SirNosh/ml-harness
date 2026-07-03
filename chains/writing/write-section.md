---
name: write-section
description: "Write a specific section of the paper or documentation"
---

# Write Section Chain

This chain handles one bounded unit of work inside a gate. Completing this chain does not by itself complete the gate. Nosh must read the resulting reports and artifacts, update the relevant project artifacts and live `todo` queue, then decide whether to rerun, adjust, or switch chains.

Write a specific section of the paper or documentation.

Any specialist agent invoked in this chain must receive Nosh's fixed delegation packet and keep `.ml-harness/reports/{part-id}.md` in the frontmatter schema defined by `templates/report.md`.

Agent sequence for this chain:

- `astra` writes polished research narrative, related work, and paper-quality prose.
- `sage` writes theory, method, and math-heavy sections.
- `dumbledore` or `luna` writes startup-facing strategy, architecture, and stakeholder documentation.
- `omen` checks factual grounding against the source artifacts and reports.
- `sova` or `fade` checks related-work accuracy and positioning when the section cites prior work.
- `kayo` attacks claims, framing, and novelty language before Nosh closes the part.

## Step 1: Read Context

Read `.ml-harness/truths/project-context.md`, `.ml-harness/truths/phase-breakdown.md`, and the relevant design/results docs to understand what needs to be written.

## Step 2: Identify Section

Determine which section from `.ml-harness/truths/phase-breakdown.md` this chain is addressing. Read the part definition to understand:

- which section to write,
- what content it needs,
- what references to include,
- expected length and format.

## Step 3: Write Section

Choose the primary section owner from the section type:

- paper narrative, related work, and polished synthesis -> Subagent (`astra`)
- technical method or theory sections -> Subagent (`sage`)
- startup product, architecture, or stakeholder-facing docs -> Subagent (`dumbledore` or `luna`)

Write the section following academic or professional conventions.

Output: write the section to `docs/{section-name}.md`.

## Step 4: Review Section

Route the draft to an independent reviewer:

- source fidelity, reproducibility, and consistency with artifacts -> Subagent (`omen`)
- claim challenge and novelty skepticism -> Subagent (`kayo`)
- related-work accuracy -> Subagent (`sova` or `fade`)

The reviewer appends a verdict and checks:

- supported claims,
- accuracy,
- figure and table correctness,
- appropriate tone.

## Step 5: Update Artifacts

Update `.ml-harness/truths/phase-breakdown.md` and `.ml-harness/timeline.md`. Check phase gates and report progress to the user.
