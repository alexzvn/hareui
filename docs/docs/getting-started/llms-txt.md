---
title: LLMs.txt
description: Enable AI coding assistants to understand HeroUse's API with llms.txt and llms-full.txt.
---

HeroUse publishes [llms.txt](https://llmstxt.org/) files so AI coding assistants can reference accurate, up-to-date documentation instead of guessing at the API from training data.

## Available Files

- [/llms.txt](https://herouse.dev/llms.txt) — Index of every documentation page with a one-line description, grouped by Getting Started and Components.
- [/llms-full.txt](https://herouse.dev/llms-full.txt) — The complete documentation: every page's content, with live demo placeholders expanded into their actual `.vue` source and API reference tables rendered as Markdown tables.

Both files are generated from the same Markdown source as this site, so they stay in sync automatically on every deploy — nothing is hand-maintained separately.

## Integration

**Claude Code / Claude:** Tell Claude to reference the documentation:
```
Use HeroUse documentation from https://herouse.dev/llms.txt
```

**Cursor:** Use the `@Docs` feature:
```
@Docs https://herouse.dev/llms-full.txt
```

**Windsurf:** Add to your `.windsurfrules` file:
```
#docs https://herouse.dev/llms-full.txt
```

**Other AI tools:** Most assistants can fetch documentation by URL. Provide:
```
https://herouse.dev/llms.txt
```

Prefer `llms.txt` for tools with limited context — it's an index with short descriptions and links. Use `llms-full.txt` when the tool can fetch and hold the entire corpus, since it includes every component's demo source and prop/slot/emit tables inline.

## What's Inside

Each page in `llms-full.txt` is wrapped with a header in a consistent format before its content:

```
# <Page Title>
**Category**: vue
**URL**: https://herouse.dev/docs/...

> <Page description>
```

`<ComponentPreview>` demo references are replaced with the actual Vue single-file component source in a fenced code block, and `<ApiTable>` references are replaced with a Markdown table of props, slots, or emits — so an AI assistant reading `llms-full.txt` sees real, copy-pasteable component code rather than a placeholder.
