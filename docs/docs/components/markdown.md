---
title: Markdown
description: Renders markdown as Vue elements, and keeps up with text that is still streaming in.
links:
  source: markdown/Markdown.vue
  styles: markdown/theme.ts
---

## Usage

Pass GitHub Flavored Markdown to `value`. It renders as Vue elements: headings, paragraphs, lists and task lists, tables, quotes, links, images and code. Fenced code shows in a [CodeBlock](/docs/components/code-block), highlighted when `shiki` is installed.

```ts
import { Markdown } from '@hareui/vue/markdown'
```

<ComponentPreview name="markdown/basic" />

### Installation

Import Markdown from `@hareui/vue/markdown`. It parses with `marked`. Install the peer dependency:

::: code-group

```bash [npm]
npm i marked
```

```bash [pnpm]
pnpm add marked
```

```bash [yarn]
yarn add marked
```

```bash [bun]
bun add marked
```

:::

## Anatomy

```vue
<Markdown value="**Hello**" :streaming="false" :components="{ a: MyLink }" />
```

## Streaming

Set `streaming` while the text is still arriving. Only the block being written re-renders. Syntax still open on its last line shows as if it were closed, such as `**bol` or a link whose URL hasn't arrived. The root is marked `aria-busy` until `streaming` turns off.

Press Replay to stream the answer again. A `ChatLoader` shows until the first characters arrive.

<ComponentPreview name="markdown/streaming" />

## Chat messages

Render a message's text parts with Markdown through the `#text` slot of [ChatMessage](/docs/components/chat-message). The copy action still copies the markdown source.

<ComponentPreview name="markdown/chat-message" />

## Custom components

`components` replaces any element with your own component, keyed by tag. The component gets the element's attributes as props and its content as the default slot, without the theme classes. A `pre` override replaces fenced code. It receives `code`, `lang` and `meta`.

The demo opens links in a new tab, turns images into captioned figures and shows code with a file name. The file name comes from `title=prices.ts` in the fence, which arrives in `meta`.

<ComponentPreview name="markdown/custom-components" />

## Styling

`ui` restyles any tag by its key, and `base` styles the root. This side panel shrinks the text, the headings and the gaps between blocks.

<ComponentPreview name="markdown/compact" />

## Safety

Raw HTML in the source shows as text, so it can't add scripts or event handlers. Links and images keep only relative URLs and these schemes:

- `http` and `https`
- `mailto` and `tel`

Any other scheme, such as `javascript:` or `data:`, is dropped, even when written with character references.

## API

### Markdown props

<ApiTable component="Markdown" kind="props" />

## Theme

<ApiTheme component="Markdown" />
