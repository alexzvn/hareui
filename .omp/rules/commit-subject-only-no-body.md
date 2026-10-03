---
name: commit-subject-only-no-body
description: "Commit messages must be a single conventional subject line — never a heredoc body"
condition: ["git commit[^\\n]*-F\\s*-", "git commit[^\\n]*<<\\s*'?EOF", "git commit[^\\n]*-m[^\\n]*\\\\n\\\\n"]
scope: "tool:bash"
---

Commit messages are **subject only**:

```
git add <files> && git commit -q -m "type(scope): summary"
```

- No heredoc, no `-F -`, no multi-paragraph body. Omit the body entirely except in extreme cases.
- Conventional: `type(scope): summary`, imperative, lowercase, no trailing period.
- Split the working tree into atomic commits (one concern each, deps first, each builds alone).
- **Draft the subject list and confirm with the user before committing.**
