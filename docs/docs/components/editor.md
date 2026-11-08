---
title: Editor
description: A rich-text field built on tiptap, with Markdown, HTML or JSON content.
links:
  source: editor/Editor.vue
  styles: editor/theme.ts
---

## Usage

```ts
import { Editor } from '@hareui/vue/editor'
```

Editor, EditorToolbar and the editor menus ship from the `@hareui/vue/editor` entry, not the package root. They need the optional tiptap peer dependencies:

::: code-group

```bash [npm]
npm i @tiptap/vue-3 @tiptap/pm @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-image @tiptap/extension-code @tiptap/extension-horizontal-rule @tiptap/extension-bubble-menu @tiptap/extension-floating-menu @tiptap/extension-mention @tiptap/suggestion @tiptap/markdown @floating-ui/dom
```

```bash [pnpm]
pnpm add @tiptap/vue-3 @tiptap/pm @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-image @tiptap/extension-code @tiptap/extension-horizontal-rule @tiptap/extension-bubble-menu @tiptap/extension-floating-menu @tiptap/extension-mention @tiptap/suggestion @tiptap/markdown @floating-ui/dom
```

```bash [yarn]
yarn add @tiptap/vue-3 @tiptap/pm @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-image @tiptap/extension-code @tiptap/extension-horizontal-rule @tiptap/extension-bubble-menu @tiptap/extension-floating-menu @tiptap/extension-mention @tiptap/suggestion @tiptap/markdown @floating-ui/dom
```

```bash [bun]
bun add @tiptap/vue-3 @tiptap/pm @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-image @tiptap/extension-code @tiptap/extension-horizontal-rule @tiptap/extension-bubble-menu @tiptap/extension-floating-menu @tiptap/extension-mention @tiptap/suggestion @tiptap/markdown @floating-ui/dom
```

:::

Bind the document with `v-model`. The default slot receives the tiptap `editor`. Pass it to the toolbars and menus you place in that slot.

The `footer` slot sits under the document, for status text and counters.

<ComponentPreview name="editor/basic" />

## Anatomy

The default slot holds the parts that act on the document. Each one takes the slot's `editor`.

```vue
<template>
  <Editor v-model="content">
    <template #default="{ editor }">
      <EditorToolbar :editor="editor" :items="items" />
      <EditorSuggestionMenu :editor="editor" :items="commands" />
      <EditorMentionMenu :editor="editor" :items="people" />
      <EditorDragHandle :editor="editor" />
    </template>

    <template #footer="{ editor }">
      <span>{{ editor.state.doc.textContent.length }} characters</span>
    </template>
  </Editor>
</template>
```

- [EditorToolbar](/docs/components/editor-toolbar): formatting buttons, in a row or floating over the text.
- [EditorSuggestionMenu](/docs/components/editor-suggestion-menu): a `/` command menu.
- [EditorMentionMenu](/docs/components/editor-mention-menu): `@` mentions.
- [EditorDragHandle](/docs/components/editor-drag-handle): a grip that moves blocks.

## Content type

`v-model` is HTML when it's a string and a tiptap JSON document when it's an object. To force a format, set `content-type`. It takes `json`, `html` or `markdown`. The editor emits the same format back.

External updates replace the document only when they differ from what's already there. So typing never resets the caret, and external updates aren't emitted back as `update:modelValue`.

<ComponentPreview name="editor/controlled" />

With `content-type="markdown"` the editor reads and writes Markdown. It uses GitHub-flavored Markdown by default. Configure it with the `markdown` prop.

<ComponentPreview name="editor/markdown" />

## Variants

`primary` sits on the field background. `secondary` takes the default fill instead, which suits an editor placed on a card or inside a panel.

<ComponentPreview name="editor/secondary" />

## Placeholder

`placeholder` shows on the empty line the caret is in. Pass an object to configure it. For example, `{ placeholder: 'Write…', mode: 'firstLine' }` shows it only while the whole document is empty.

The text can change at any time, for example with the locale. The other options are read once, when the editor is created.

<ComponentPreview name="editor/placeholder" />

## Disabled and read-only

`disabled` dims the field and stops editing. It also disables every toolbar item and sets `aria-disabled`.

`:editable="false"` keeps the normal look and selectable text but blocks changes. It sets `aria-readonly`.

<ComponentPreview name="editor/disabled" />

## Extensions

The editor loads the starter kit (paragraphs, headings, lists, quotes, code, links, underline, history and more), images and the placeholder. These props change that:

- `starter-kit` configures the starter kit. Set it to `false` for a plain-text editor.
- `image` configures images.
- `mention` adds the node that holds `@` mentions. It is on by default; set it to `false` to leave it out. See [EditorMentionMenu](/docs/components/editor-mention-menu#mention-node).
- `extensions` adds any tiptap extension.
- `editor-props` passes options straight to ProseMirror.

## Keyboard shortcuts

Besides tiptap's formatting shortcuts, Alt+Shift+Up and Alt+Shift+Down move the top-level block at the cursor up or down. It is the keyboard way to do what an [EditorDragHandle](/docs/components/editor-drag-handle) does.

## Examples

### Character count

The `footer` slot reads the document from `editor`. Here it counts characters against a limit and turns red past it.

<ComponentPreview name="editor/character-count" />

## API Reference

### Props

<ApiTable component="Editor" kind="props" />

### Emits

<ApiTable component="Editor" kind="emits" />

### Slots

<ApiTable component="Editor" kind="slots" />

## Theme

<ApiTheme component="Editor" />

## Related Components

<RelatedComponents :components="['editor-toolbar', 'editor-suggestion-menu', 'editor-mention-menu', 'editor-drag-handle', 'text-area']" />
