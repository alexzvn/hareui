---
title: Editor Drag Handle
description: A grip next to the hovered block of an Editor that moves or selects the block.
links:
  source: editor-drag-handle/EditorDragHandle.vue
  styles: editor-drag-handle/theme.ts
---

## Usage

```ts
import { EditorDragHandle } from '@hareui/vue/editor-drag-handle'
```

EditorDragHandle ships from its own entry because tiptap's drag handle needs the collaboration packages. Install them on top of the [Editor](/docs/components/editor)'s peer dependencies:

::: code-group

```bash [npm]
npm i @tiptap/extension-drag-handle-vue-3 @tiptap/extension-drag-handle @tiptap/extension-node-range @tiptap/extension-collaboration @tiptap/y-tiptap yjs y-protocols
```

```bash [pnpm]
pnpm add @tiptap/extension-drag-handle-vue-3 @tiptap/extension-drag-handle @tiptap/extension-node-range @tiptap/extension-collaboration @tiptap/y-tiptap yjs y-protocols
```

```bash [yarn]
yarn add @tiptap/extension-drag-handle-vue-3 @tiptap/extension-drag-handle @tiptap/extension-node-range @tiptap/extension-collaboration @tiptap/y-tiptap yjs y-protocols
```

```bash [bun]
bun add @tiptap/extension-drag-handle-vue-3 @tiptap/extension-drag-handle @tiptap/extension-node-range @tiptap/extension-collaboration @tiptap/y-tiptap yjs y-protocols
```

:::

Put the handle in the default slot of an Editor and pass it the slot's `editor`. It shows a grip next to the block under the pointer. Drag the grip to move the block, or click it to select the block. From `sm` up, the document leaves room for it at the start.

While you drag between blocks, the other blocks slide apart to show where the block will land, and the drop puts it right there. Over the middle of a list or quote, a drop line shows where the block lands inside it instead. A cancelled drag slides the blocks back.

<ComponentPreview name="editor-drag-handle/basic" />

## Anatomy

```vue
<template>
  <Editor v-model="content">
    <template #default="{ editor }">
      <EditorDragHandle :editor="editor">
        <template #default="{ select, ui }" />
        <!-- optional: replaces the grip -->
      </EditorDragHandle>
    </template>
  </Editor>
</template>
```

The default slot replaces the grip. Its `select` function selects the hovered block, focuses the editor and returns the block with its `pos`.

## Block menu

Put a [Dropdown](/docs/components/dropdown) in the slot to act on the block. Call `select` when the menu opens, then pass the block's `pos` to the block command kinds: `duplicate`, `delete`, `moveUp` and `moveDown`. The Editor slot's `handlers` run them. This spec's grip turns blocks into other types, copies, moves and deletes them.

<ComponentPreview name="editor-drag-handle/block-menu" />

## Insert and drag

A second button next to the grip can add a block. Here "+" adds an empty line below the hovered block and runs the `suggestion` command kind, which opens an [EditorSuggestionMenu](/docs/components/editor-suggestion-menu).

<ComponentPreview name="editor-drag-handle/insert-and-drag" />

## Nested blocks

`nested` also shows the grip on nested blocks, such as list items and the paragraphs of a quote. The `select` event gives the block that was clicked. The footer here shows it. A nested block slides among its siblings while the pointer stays inside its parent. Outside it, a drop line shows where it will land instead.

<ComponentPreview name="editor-drag-handle/nested" />

## Position

`side-offset` sets the gap between the grip and the block, 8px by default. The grip moves to the hovered block and fades in and out.

## Keyboard

The grip needs a pointer. From the keyboard, Alt+Shift+Up and Alt+Shift+Down move the block at the cursor, in any Editor.

## API Reference

### Props

<ApiTable component="EditorDragHandle" kind="props" />

### Emits

<ApiTable component="EditorDragHandle" kind="emits" />

### Slots

<ApiTable component="EditorDragHandle" kind="slots" />

## Theme

<ApiTheme component="EditorDragHandle" />

## Related Components

<RelatedComponents :components="['editor', 'editor-toolbar', 'editor-suggestion-menu', 'editor-mention-menu']" />
