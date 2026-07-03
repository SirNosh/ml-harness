---
name: templates
description: Common output templates for reports, paper sections, reviews, and decision records.
---

# Templates Reference

Common templates for agent outputs, reports, and documentation.

## Research Paper Template

```md
# {Title}

## Abstract
{One paragraph summary of the work}

## 1. Introduction
{Problem, motivation, contributions}

## 2. Related Work
{What others have done, where we fit}

## 3. Method
{Our approach, mathematical formulation}

## 4. Experiments
{Experimental setup, baselines, metrics}

## 5. Results
{Main results, tables, figures}

## 6. Analysis
{Why it works, ablation insights}

## 7. Discussion
{Limitations, future work}

## 8. Conclusion
{Summary of contributions}

## References
{Bibliography}
```

## Experiment Report Template

```md
# Experiment: {Name}

## Hypothesis
{What we expect to happen}

## Setup
- Dataset: {what, size, splits}
- Model: {architecture, parameters}
- Training: {optimizer, lr, batch_size, epochs}
- Hardware: {GPU type, count}

## Results
| Metric | Baseline | Ours | Delta |
|--------|----------|------|-------|
| {metric} | {value} | {value} | {delta} |

## Analysis
{What the results mean}

## Conclusions
{What we learned}
```

## Code Review Template

```md
# Code Review: {Component}

## Summary
{Brief overview of what was reviewed}

## Findings
### Blocking Issues
- {issue 1}

### Suggestions
- {suggestion 1}

### Notes
- {note 1}

## Verdict
{Approved / Changes requested}
```

## Decision Record Template

```md
# Decision: {Title}

## Date
{When the decision was made}

## Context
{What was the situation?}

## Decision
{What was decided?}

## Alternatives Considered
1. {Alternative 1} - {pros/cons}
2. {Alternative 2} - {pros/cons}

## Rationale
{Why this decision was made}

## Consequences
{What this means for the project}
```

## Status Report Template

```md
# Status Report

## Date
{When}

## Current Phase
{Phase name}

## Gate Status
- [x] {gate 1}
- [ ] {gate 2}

## Recent Activity
- {activity 1}
- {activity 2}

## Next Actions
- {action 1}
- {action 2}

## Blockers
- {blocker 1}
```
