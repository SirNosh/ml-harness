---
name: literature-review
description: "Survey existing work and create a literature review"
---

# Literature Review Chain

This chain handles one bounded unit of work inside a gate. Completing this chain does not by itself complete the gate. Nosh must read the resulting reports and artifacts, update the relevant project artifacts and live `todo` queue, then decide whether to rerun, adjust, or switch chains.

Survey the existing literature on the project topic and create a comprehensive review.

Any specialist agent invoked in this chain must receive Nosh's fixed delegation packet and keep `.ml-harness/reports/{part-id}.md` in the frontmatter schema defined by `templates/report.md`.

Agent sequence for this chain:

- `sova` builds the paper set, citation inventory, and source shortlist.
- `fade` checks trend coverage, SOTA positioning, and whether the lit review is missing obvious comparators.
- `astra` turns the gathered material into a coherent related-work artifact when the part needs polished synthesis.
- `kayo` attacks novelty or gap claims before Nosh locks the framing.

## Step 1: Read Context

Read `.ml-harness/truths/project-context.md` and `.ml-harness/truths/phase-breakdown.md` to understand the project scope and the active literature-review part.

## Step 2: Conduct Review

Use `pi-web-access` to search for relevant papers, articles, and implementations.

Choose a primary literature owner that matches the part:

- broad paper scan and bibliography build -> Subagent (`sova`)
- trend, SOTA, and positioning scan -> Subagent (`fade`)
- synthesis into a coherent related-work narrative -> Subagent (`astra`)

Prefer these sources, in order:

- arXiv (`arxiv.org`, `export.arxiv.org/api`)
- Semantic Scholar (`api.semanticscholar.org` Graph API)
- OpenAlex (`api.openalex.org`)
- Hugging Face (`https://huggingface.co/`)
- Crossref (`api.crossref.org`)
- GitHub, official docs, benchmark reports, and engineering blogs for implementation hints

Use `web_search` for discovery, `fetch_content` for important source pages, and `get_search_content` when full stored content is needed from a previous result.

Research scope:

- find 10-20 relevant papers,
- identify key themes and trends,
- find the current SOTA,
- identify gaps and opportunities,
- find relevant codebases.

Output: write `docs/lit-review.md` with:

- paper summaries,
- theme analysis,
- SOTA identification,
- gap analysis,
- codebase inventory.

## Step 3: Validate Review

Route the completed draft to an independent reviewer who did not write the draft:

- completeness and source coverage -> Subagent (`sova` or `fade`)
- narrative coherence and positioning -> Subagent (`astra`)
- novelty or gap skepticism when the review supports a claim of difference -> Subagent (`kayo`)

The reviewer appends a verdict to `.ml-harness/reports/{part-id}.md` and checks:

- completeness,
- accuracy,
- positioning.

## Step 4: Review Report

Read the report from `.ml-harness/reports/{part-id}.md`. Update:

- `.ml-harness/truths/phase-breakdown.md` - mark the part complete and record artifacts
- `.ml-harness/timeline.md` - log completion
- `.ml-harness/truths/project-context.md` - add literature context
- `.ml-harness/truths/decisions.md` - record any decisions made

Check phase gates. If research gates are met, announce progress.
