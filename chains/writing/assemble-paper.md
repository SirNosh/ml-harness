---
name: assemble-paper
description: "Assemble all sections into a complete paper draft"
---

# Assemble Paper Chain

This chain handles one bounded unit of work inside a gate. Completing this chain does not by itself complete the gate. Nosh must read the resulting reports and artifacts, update the relevant project artifacts and live `todo` queue, then decide whether to rerun, adjust, or switch chains.

Assemble all written sections into the living paper draft.

Any specialist agent invoked in this chain must receive Nosh's fixed delegation packet and keep `.ml-harness/reports/{part-id}.md` in the frontmatter schema defined by `templates/report.md`.

Agent sequence for this chain:

- `astra` assembles the full research narrative into a paper-shaped draft.
- `sage` tightens theory-heavy sections and method-heavy transitions.
- `dumbledore` assembles startup release packets, design packets, or stakeholder-facing bundles when the output is not a paper.
- `omen` checks cross-section consistency, evidence fidelity, and whether figures and references line up with the artifacts.
- `kayo` acts like reviewer 2 before Nosh calls the draft phase-complete.

## Step 1: Read Sections

Read `.ml-harness/truths/phase-breakdown.md`, `.ml-harness/truths/paper-definition.md`, `.ml-harness/truths/claim-ledger.md`, and all section files in `docs/` to understand what has been written and what the active assembly part must produce.

## Step 2: Assemble Draft

Choose the primary assembly owner:

- research paper assembly and narrative flow -> Subagent (`astra`)
- theory-heavy paper assembly -> Subagent (`sage`)
- startup release or design packet assembly -> Subagent (`dumbledore`)

Update the existing `docs/paper-draft.md` into a coherent paper with:

- title and abstract,
- introduction,
- related work,
- method,
- experiments,
- results,
- discussion,
- conclusion,
- references.

Ensure consistent formatting, cross-references, figures, and bibliography completeness.

Output: update `docs/paper-draft.md`, and tighten `.ml-harness/truths/claim-ledger.md` where draft claims changed.

## Step 3: Review Full Paper

Route the draft to an independent reviewer:

- overall coherence, evidence fidelity, and cross-reference correctness -> Subagent (`omen`)

The reviewer appends a verdict and checks:

- overall coherence,
- claim consistency,
- figure quality,
- reference completeness,
- writing quality.

## Step 4: Review Methodology

Route the reviewed draft through deeper scrutiny:

- mathematical accuracy and methodological rigor -> Subagent (`sage`)
- skeptical conference-review style challenge -> Subagent (`kayo`)

Review the methodology section for:

- mathematical accuracy,
- experimental rigor,
- statistical validity.

## Step 5: Update Artifacts

Update `.ml-harness/truths/phase-breakdown.md` and `.ml-harness/timeline.md`. Check phase gates and announce paper draft completion.
