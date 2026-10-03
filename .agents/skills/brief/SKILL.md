---
name: brief
description: "Take a short brief — a few blocking questions with recommended answers — then do the work."
argument-hint: "The requirement to brief and do"
disable-model-invocation: true
---

Get the **brief**, confirm it and then do one pass of work.

## 1. Ground

Read the repo before you ask a question. Read the files, the models and the callers that the requirement names. Read the `CONTEXT.md` and the `GLOSSARY.md` for the applicable context. `CONTEXT-MAP.md` shows where these files are.

Use a `scout` subagent for a large search. Do not ask the user for a fact that the repo gives.

## 2. Ask the blockers

Ask only about a decision that can make you do the wrong work, or do the work again. Make all other decisions yourself from the conventions of the repo.

Give your recommended answer with each question. Use this format:

```
**Q1**
**<question title>**
<body: the options, the trade-off, the cost of each option>

<your recommended answer>
```

You should ask question until fully understand user requirement. Ask ONE question at a time. You do NOT decide for user, must wait for user answer.

## 3. Confirm changes

Short brief, listing table change what you will do in concise writing and MUST wait for user confirm.
In most case, user will revise your brief plan. If then, do step #2 (Ask the blockers) again and then step #3 (Confirm changes).

**DO NOT JUMP INTO THE WORK WITHOUT EXPLICIT PERMISSION FROM USER.**

## 4. Do the work

Obey the conventions in `CODING_STANDARDS.md`. Also obey the style document for the area that you change.

If you find a new blocker during the work, ask user again.

## 5. Report

Be extremely concise and sacrifice grammar for the sake of concision.
Write a few lines. Give this data:

- The files and the symbols that you changed.
- The method that you used to test the change.
- Each decision that you made for the user.
- Each item that the brief did not include.
