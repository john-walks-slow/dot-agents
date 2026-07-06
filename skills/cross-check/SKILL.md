---
name: cross-check
description: >-
  Spawn a general subagent to critically check, review, and research (with web
  search) the current idea, conclusion, or plan, and report Must Reconsider issues and
  suggestions. Use when the user says /cross-check, "cross-check", or asks for a
  second opinion / adversarial review of a plan or conclusion.
disable-model-invocation: true
---

# Cross-check

Spawn a **generalPurpose** subagent to adversarially check the current idea, conclusion, or plan. Do not self-review in the parent agent — the point is an independent pass.

## Workflow

1. **Package the target** from conversation context (and any user-supplied focus). Include:
   - The idea / conclusion / plan (verbatim where possible)
   - Relevant constraints, decisions already made, and open questions
   - File paths or code snippets only if they are part of what is being checked
2. **Launch** one `Task` with `subagent_type: "generalPurpose"`. Do not use `Review` (code-diff review) or `explore` (read-only codebase map).
3. **Relay** the subagent report to the user. Do not silently fix issues unless the user asks.

## Subagent prompt (required contents)

Give the subagent a self-contained brief. It has **no** parent conversation history.

```
You are an independent critic. Adversarially check the following idea/conclusion/plan.

TARGET:
<paste the packaged target>

Do all of the following:
1. Critically review assumptions (even if seemingly settled down before), designs (is there any alternative design with better clarity?), logic, trade-offs, and failure modes.
2. Explore related files. Research online where claims depend on external facts, APIs, or industry practice. Cite sources for non-obvious findings.
3. Prefer essential issues over nitpicks. Skip praise and restating the plan.

Return ONLY:
## Must Reconsider
- ... (empty section if none; each item: problem, why it matters, concrete fix)

## Suggestions
- ... (improvements that are not blockers)

## Open questions
- ... (only if a wrong assumption would change the recommendation)
```
