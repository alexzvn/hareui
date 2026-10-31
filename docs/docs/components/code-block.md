---
title: CodeBlock
description: Show a snippet of code with syntax highlighting, a file name and a copy button.
links:
  source: code-block/CodeBlock.vue
  styles: code-block/theme.ts
---

## Usage

```ts
import { CodeBlock } from '@hareui/vue/code-block'
```

Import CodeBlock from `@hareui/vue/code-block`. Highlighting runs on the optional `shiki` peer, which you only install when you use this entry:

::: code-group

```bash [npm]
npm i shiki
```

```bash [pnpm]
pnpm add shiki
```

```bash [yarn]
yarn add shiki
```

```bash [bun]
bun add shiki
```

:::

Pass the source as `code` and its shiki language id as `lang`. The code renders as plain, escaped text first, on the server too. After mount, CodeBlock loads `shiki` on demand and swaps in the highlighted tokens. Without `shiki`, or for a language it doesn't know, the code stays plain. The colors follow light and dark mode on their own.

<ComponentPreview name="code-block/basic" />

## Anatomy

```vue
<CodeBlock code="…" lang="ts">
  <template #header="{ lang, filename, copied, copy }" /> <!-- optional: replaces the header label -->
  <template #copy="{ copied, copy }" />                   <!-- optional: replaces the copy button -->
</CodeBlock>
```

### Filename

Use the `filename` prop to show a file name in the header instead of the language. Pass an icon class or a component as `icon` to show it before the label.

<ComponentPreview name="code-block/filename" />

### Highlight

Use the `highlight` prop to mark lines. It takes line numbers and inclusive `[from, to]` ranges, counted from 1.

<ComponentPreview name="code-block/highlight" />

### Line Numbers

Use the `line-numbers` prop to number each line. Screen readers skip the numbers, and they are left out when you select the code.

<ComponentPreview name="code-block/line-numbers" />

### Hide Header

Use the `hide-header` prop to remove the header row. The copy button then sits over the top-right corner of the code.

<ComponentPreview name="code-block/hide-header" />

### Copy

The copy button writes `code` to the clipboard and shows a check for 1650 ms. Set `copy` to `false` to hide it, or pass an object to change it:

- `label`: the button's accessible name
- `copiedLabel`: the name once copied
- `duration`: how long the check shows, in milliseconds (default `1650`)

<ComponentPreview name="code-block/copy" />

### Themes

Use the `themes` prop to choose the shiki theme for each color scheme. Defaults to `github-light` and `github-dark`.

<ComponentPreview name="code-block/themes" />

### Long Lines

Long lines don't wrap. The code scrolls sideways, its edges fade while more code is hidden past them, and highlighted lines stretch to the widest line.

<ComponentPreview name="code-block/scroll" />

## Examples

### Custom header

Use the `header` slot to replace the header label. It receives `lang` and `filename`, plus the `copied` state and the `copy` function.

<ComponentPreview name="code-block/header-slot" />

### Custom copy button

Use the `copy` slot to render your own copy button. Call `copy` to write the code to the clipboard; `copied` stays `true` while the copied state shows.

<ComponentPreview name="code-block/copy-slot" />

## API Reference

### Props

<ApiTable component="CodeBlock" kind="props" />

### Slots

<ApiTable component="CodeBlock" kind="slots" />

## Theme

<ApiTheme component="CodeBlock" />

## Related Components

<RelatedComponents :components="['typography', 'kbd']" />
