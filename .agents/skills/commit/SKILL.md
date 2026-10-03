---
name: commit
description: Draft and create git commits with conventional, subject-only messages split into atomic units. Use when the user asks to commit, draft commits, or split working-tree changes into commits.
disable-model-invocation: true
---

# Commit

## Rules

- **Conventional subject**: `type(scope): summary`. Types: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `build`, `perf`. Scope = component or area (`modal`, `drawer`, `vue`, `docs`, `parity`, `agents`).
- **Subject only. No body.** Omit the body entirely except in extreme cases (a non-obvious rationale that will otherwise be lost). Default is empty.
- **No trailing explanation** — no em-dash addendum, no "because…", no file lists appended to the subject.
- **Imperative, lowercase, no period**: `add`, `remove`, `fix` — not `added`/`Adds`/`.`.

## Atomic splitting

Split working-tree changes into the smallest coherent commits that each build:

- **Deps before the code that imports them** (e.g. `chore(ui): add dayjs` precedes the feature using it).
- **One concern per commit** — separate server vs ui, unrelated features, mechanical vs behavioral.
- **Order so each commit compiles/builds** on its own.
- A single-file rewrite is one commit — don't hunk-split into non-atomic pieces.

## Workflow

1. Inspect: `git status` + `git diff` (and `git diff --cached`).
2. Group changed files into atomic commits; decide order.
3. Draft the subject list (subjects only) and confirm with the user.
4. On approval, stage per group and commit:
   ```
   git add <files> && git commit -q -m "type(scope): summary"
   ```
5. Verify: `git log --oneline` + `git status --short` (clean tree).

## Blocker Policy

A blocker is a correctness defect found in the working tree while preparing commits. E.g data leak,
lost money, corrupt state... It is **not** part of the commit task.

- **Never write to fix a blocker without explicit approval.** Report it, propose the fix, stop.
  The diff is the user's work in progress; they may already know.
- **Never commit while a blocker is unresolved and unanswered.** Waiting is the correct end of a turn here.

## Example

```
chore(vue): add reka-ui date utilities
feat(date-picker): add range selection
docs(date-picker): add range selection demo
```
