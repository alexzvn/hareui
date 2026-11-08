---
title: Editor Mention Menu
description: An @ menu that inserts mentions of people, channels or anything you list.
links:
  source: editor-mention-menu/EditorMentionMenu.vue
  styles: editor-mention-menu/theme.ts
---

## Usage

```ts
import { Editor, EditorMentionMenu } from '@hareui/vue/editor'
```

EditorMentionMenu ships from the `@hareui/vue/editor` entry, not the package root. It needs the optional tiptap peer dependencies:

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

Put the menu in the default slot of an [Editor](/docs/components/editor) and pass it the slot's `editor`. Type `@`, pick someone, and the name becomes a single token in the text. This comment box has people and groups under `@`, and channels under `#`.

<ComponentPreview name="editor-mention-menu/basic" />

## Anatomy

```vue
<template>
  <Editor v-model="content">
    <template #default="{ editor }">
      <EditorMentionMenu :editor="editor" :items="people" />
      <EditorMentionMenu :editor="editor" :items="channels" char="#" />
      <!-- optional: a second trigger -->
    </template>
  </Editor>
</template>
```

Items take:

- `label`: the name shown.
- `id`: stored with the mention. It defaults to the label.
- `description`
- `avatar` or `icon`. Without either, the row shows an avatar with the label's initials.

Group them with `{ type: 'section', label, items }` and `{ type: 'separator' }`, like in [EditorSuggestionMenu](/docs/components/editor-suggestion-menu#items).

## Several triggers

Each menu handles its own `char`, so a second menu with `char="#"` can link channels. The demo above has both.

## Mention node

The editor stores mentions as `<span data-type="mention" data-id="…" data-label="…">`. It shows them as the trigger character plus the label, which is also their plain text.

The menu needs the Editor's mention node, which is on by default. `:mention="false"` on the Editor leaves it out.

## Load items yourself

Bind `v-model:search-term` to get the text typed after the trigger, and set `ignore-filter` to show your results as they are. Set `loading` while the request runs, and the menu shows a spinner row. Use it for lists too big to send to the page, such as a user directory.

<ComponentPreview name="editor-mention-menu/search" />

## Who gets notified

Read the mentions back from `v-model`. With `content-type="json"`, each mention is a `mention` node with its `id`. This incident update lists everyone mentioned in the footer.

<ComponentPreview name="editor-mention-menu/notify" />

## Custom row

The item slots work as in [EditorSuggestionMenu](/docs/components/editor-suggestion-menu#item-slots). Here `#item-trailing` adds a presence dot, and the description says the status in words.

<ComponentPreview name="editor-mention-menu/presence" />

## Filtering and position

The menu filters items like [EditorSuggestionMenu](/docs/components/editor-suggestion-menu#filtering). It takes the same `filter-fields`, `start-of-line`, `allow-spaces`, `side`, `align` and `side-offset` props, and the same `empty` slot.

## API Reference

### Props

<ApiTable component="EditorMentionMenu" kind="props" />

### Emits

<ApiTable component="EditorMentionMenu" kind="emits" />

### Slots

<ApiTable component="EditorMentionMenu" kind="slots" />

## Theme

<ApiTheme component="EditorMentionMenu" />

## Related Components

<RelatedComponents :components="['editor', 'editor-toolbar', 'editor-suggestion-menu', 'editor-drag-handle', 'prompt-input']" />
