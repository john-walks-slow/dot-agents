---
name: try
description: Run exploratory edits safely by backing up target file before modification. Use when the user asks to "try", "backup first", or make uncertain destructive changes in a specific file and wants easy rollback for that file only.
---

# Single File Safe Try

## Goal

Before editing file(s), create a reversible backup for the target file(s) only.

## Default Strategy

Use `git stash push` for the single file by default.

```bash
git stash push -m "backup:<file-path>" -- <file-path>
```

Why this default:

- Lightweight and fast for exploratory attempts.
- Keeps backup scoped to only current target file.
- Easy to restore or inspect later.

## Decision Rules

1. If the change is exploratory/uncertain, use single-file stash backup.
2. If the user asks for durable checkpoint/history, use temporary commit.
3. Never use repository-wide stash/commit when user asked to back up only one file.
4. Confirm target file path before backup.

## Workflow

1. Verify file exists and is the intended target.
2. Create backup with single-file stash:

```bash
git stash push -m "backup:<file-path>" -- <file-path>
```

3. Edit the file.
4. If result is good, continue normally.
5. If rollback is needed:

```bash
git restore --source=stash@{0} -- <file-path>
```

If stash index is uncertain, inspect first:

```bash
git stash list
```

## Temporary Commit Mode (When Needed)

Use this only when user explicitly wants a durable checkpoint for that file.

```bash
git add <file-path>
git commit -m "chore(backup): checkpoint before exploratory edit of <file-path>"
```

Notes:

- Commit mode creates visible history; better for collaboration/audit.
- Stash mode is usually better for quick trial-and-error.

## Guardrails

- Back up only the requested file.
- Do not include unrelated files in stash or commit.
- Do not run destructive git commands.
- If working tree contains many unrelated changes, keep operations path-scoped.

## Response Style

When applying this skill, state:

1. Which file is being backed up.
2. Which backup method is selected and why.
3. Exact rollback command for that file.
