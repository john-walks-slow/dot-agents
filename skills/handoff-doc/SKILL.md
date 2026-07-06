---
name: handoff-doc
description: 'Write a handoff document that transfers work context to another agent, teammate, reviewer, or oncall. Use when the user says "写交接文档", "handoff", "交接", "交接给", "write a handoff", "transition this work", "pass this to X", or asks to summarize current state/next steps for someone else. Produces a markdown file at {project_root}/docs/yyyy-mm-dd-handoff-{topic}.md. Optional argument: target audience or direction (e.g., "to reviewer", "给 QA", "for oncall").'
argument-hint: '[optional: target audience / direction, e.g. "to reviewer", "给 oncall"]'
user-invocable: true
---

# Handoff Document

Produce a concise, scannable handoff doc that lets the receiver pick up the work without re-reading the whole conversation. Target length: 100~400 lines. Write in the user's language (Chinese if the conversation is in Chinese, otherwise English).

## Output Location

- Directory: `{project_root}/docs/` (create it if missing — check the workspace root via workspace files or `git rev-parse --show-toplevel`)
- Filename: `yymmdd-handoff-{topic}.md`

## Inputs

- **Topic & current state**: inferred from the conversation / current workspace changes.
- **Target audience** (optional, from the slash argument): who the handoff is for. Default: "next agent / teammate". Tailor tone and the "Next Steps" section to them.
  - "reviewer" / "给 reviewer" → emphasize what to inspect, risk areas, self-checks done.
  - "oncall" / "给 oncall" → emphasize how to run, how to roll back, what's live.
  - "qa" / "给 QA" → emphasize repro steps, expected behavior, edge cases.
  - "next agent" / default → emphasize where code is, what's WIP, what's blocked.

If the argument is unclear or missing, infer the audience from context; do not block on asking.

## Required Sections

Use exactly these H2 sections in this order. Skip a section only if it would be empty (then drop the heading, don't leave an empty stub).

```markdown
# Handoff: {Topic} ({yyyy-mm-dd})

Audience: {target audience} · Author: {you, e.g. "Copilot session"}

## TL;DR

One paragraph (3–6 sentences). What was the goal, what got done, what's left. A reader who reads only this section should know whether to accept the handoff.

## Background

Why this work exists. 1–3 short paragraphs. Link to the originating ticket/issue/ADR if known. Do not re-explain the whole project.

## Current State

What exists right now. Bulleted inventory of concrete artifacts:

- Files added/changed (with workspace-relative paths and 1-line purpose each)
- Tests added/changed and their status (passing / pending / not yet run)
- Config / migration / data changes
- Anything already merged vs. uncommitted

Mark uncommitted work explicitly: `(uncommitted)`, `(on branch feature/x)`, etc.

## Decisions & Rationale

Non-obvious choices the receiver must understand to continue safely. One sub-bullet per decision:

- **{Decision}** — {why, 1 sentence}. Alternatives considered: {brief}.

Skip choices that are obvious from the code (e.g. "used the existing lint config"). Include trade-offs, rejected approaches, and "we tried X and it failed because Y".

## In Progress / TODO

What's actively unfinished, ordered by what to do next. Each item:

- [ ] {task} — {where/which file}, {what's blocking if anything}

Distinguish "started but incomplete" from "not started but planned".

## Blockers & Open Questions

- {blocker} — {who/what is needed to unblock, or `needs: ...`}
- {open question} — {default if never answered: ...}

If none, write: "None." — don't omit the section; certainty is valuable in a handoff.

## How to Verify / Reproduce

Concrete commands and steps the receiver can run to confirm the current state works:

- Build / test / run commands (use the project's actual commands — check `package.json` scripts, `tasks.json`, `Makefile`, AGENTS.md, etc.)
- Manual repro steps if UI/runtime behavior is involved
- Expected output or behavior

## Risks & Watch-outs

- {risk} — {mitigation or what to watch}
- {known flaky behavior, partial implementation, TODO markers left in code}

## Pointers

- Key files (links with line numbers where useful)
- Related PRs / commits / issues / ADRs
- Prior conversation/session references if any

## Runbook (only for oncall / live ops handoffs)

- How to roll back
- How to feature-flag off
- Where the logs are
- Who to ping
```

## Procedure

1. **Identify the workspace root.** Use workspace files, or run `git rev-parse --show-toplevel` if needed. The `docs/` folder lives at that root.
2. **Determine topic & date.** Today's date in `yyyy-mm-dd`. Derive a short slug from the work's main theme — scan recent file changes, the conversation's last user request, or the active editor.
3. **Determine audience.** From the slash argument; if absent, default to "next agent / teammate". Adjust tone and the optional Runbook section accordingly.
4. **Gather state.** In parallel (read-only):
   - Recent git changes: `git status --short`, `git log --oneline -10`, `git diff --stat` (and `git diff` for uncommitted if small)
   - Current branch: `git branch --show-current`
   - TODO/FIXME markers touched recently (only in files this session changed — don't sweep the whole repo)
   - Relevant test status if cheap to check (don't run expensive suites; infer from last run if possible)
   - Check for project-specific run/verify commands in `AGENTS.md`, `package.json`, `tasks.json`, `Makefile`, `README.md`
5. **Draft the doc** following the Required Sections above. Apply these rules:
   - **File links**: convert file references to markdown links with workspace-relative paths and line numbers where useful (e.g. `[src/lib/store.ts](src/lib/store.ts#L42)`). Never bare backticks for filenames.
   - **Be concrete**: real commands, real paths, real branch names. No "run the tests" — write `pnpm test`.
   - **Be honest**: if something wasn't verified, say "not verified" — don't claim it works.
   - **No filler**: drop sections that would be empty. Don't write "This section describes...". Lead with the fact.
   - **Audience tone**: for reviewer → terse, evidence-oriented; for oncall → action-oriented; for next agent → continuity-oriented.
6. **Write the file** to `{project_root}/docs/{yyyy-mm-dd}-handoff-{topic}.md`. Create the `docs/` directory if it doesn't exist.
7. **Report back** to the user in 2–4 sentences: filename, one-line summary of the headline state, and any blocker you flagged that needs human input. Link the file.

## Quality Checks (self-review before finishing)

- [ ] A reader who reads only TL;DR knows whether to take the handoff.
- [ ] Every file mentioned has a workspace-relative path (and a link).
- [ ] Uncommitted vs. merged state is explicit.
- [ ] Verify commands are the project's actual commands, not generic placeholders.
- [ ] No empty sections left in the doc.
- [ ] Risks include anything this session left half-done (partial impls, TODOs, skipped tests).
- [ ] Date in filename is today, topic slug is lowercase-hyphenated.

## Anti-patterns

- Restating the whole project background — handoff is about _this_ work, not a project README.
- Listing every file touched by `git status` when most are trivial — group or omit noise.
- "Should work" / "probably fine" — either verify and state it, or mark it unverified.
- Handoff longer than ~200 lines — split or trim; receivers don't read long handoffs.
- Hardcoding commands like `npm test` when the project uses `pnpm` — read the actual toolchain.
