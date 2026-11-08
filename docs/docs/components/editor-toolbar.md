---
title: Editor Toolbar
description: Buttons that run formatting commands on an Editor, in a row or floating over the text.
links:
  source: editor-toolbar/EditorToolbar.vue
  styles: editor-toolbar/theme.ts
---

## Usage

```ts
import { Editor, EditorToolbar } from '@hareui/vue/editor'
```

EditorToolbar ships from the `@hareui/vue/editor` entry, not the package root. It needs the optional tiptap peer dependencies:

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

Put the toolbar in the default slot of an [Editor](/docs/components/editor) and pass it the slot's `editor`. List the commands in `items`. Nested arrays are groups, split by a separator.

<ComponentPreview name="editor-toolbar/basic" />

## Anatomy

```vue
<template>
  <Editor v-model="content">
    <template #default="{ editor }">
      <EditorToolbar :editor="editor" :items="items">
        <template #item="{ item, isActive, isDisabled, onClick }" />
        <!-- optional: every item -->
        <template #publish="{ item, isActive, isDisabled, onClick }" />
        <!-- optional: items with slot: 'publish' -->
      </EditorToolbar>
    </template>
  </Editor>
</template>
```

## Commands

Each item is a command `kind` with the options it needs:

| `kind`                                  | Options                                                 | Command                                                                                |
| --------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `mark`                                  | `mark`: `bold`, `italic`, `underline`, `strike`, `code` | toggle an inline format                                                                |
| `heading`                               | `level`: 1 to 6                                         | toggle a heading                                                                       |
| `textAlign`                             | `align`: `left`, `center`, `right`, `justify`           | align the block (needs `@tiptap/extension-text-align`)                                 |
| `bulletList`, `orderedList`, `taskList` |                                                         | toggle or switch the list (task lists need `@tiptap/extension-list`'s task extensions) |
| `blockquote`, `codeBlock`               |                                                         | toggle the block                                                                       |
| `paragraph`, `horizontalRule`           |                                                         | turn into a paragraph, insert a divider                                                |
| `link`                                  | `href`                                                  | add, edit or remove a link; without `href`, opens the link popover                     |
| `image`                                 | `src`                                                   | insert an image; without `src`, opens the image popover                                |
| `undo`, `redo`, `clearFormatting`       |                                                         | history and formatting                                                                 |
| `duplicate`, `delete`                   | `pos`                                                   | copy the block below itself, remove the block                                          |
| `moveUp`, `moveDown`                    | `pos`                                                   | swap the block with the one before or after it                                         |
| `suggestion`, `mention`                 | `char`: defaults to `/` and `@`                         | type the trigger character, which opens the matching menu                              |

The block kinds act on the top-level block at the cursor. Pass `pos` to target another block, such as the one an [EditorDragHandle](/docs/components/editor-drag-handle) selected.

Command items get a built-in icon and an English name, used as tooltip and accessible label. Override them with these item fields:

- `icon`
- `label`
- `tooltip`
- `aria-label`

Formats and blocks render as toggle buttons that show the state at the caret. A command that can't run is disabled. Items without `kind` are plain buttons with `onClick`.

## Dropdown

An item with `items` opens a menu of commands. Its icon follows the active entry, and the menu checks it.

<ComponentPreview name="editor-toolbar/dropdown" />

## Links and images

A `link` item without `href` opens a popover with a URL field. When the caret is on a link, the field starts with its URL. Edit it and press Enter or Apply to change it, or press Remove to unlink the text. Escape closes the popover without changing anything. It works the same from a fixed toolbar and from a bubble menu.

An `image` item without `src` opens the same field and inserts the image at the caret. With an image selected, the field starts with its URL and Apply swaps the picture.

The popover runs the `link` or `image` handler with the URL. An empty `href` removes the link. So a handler you pass in `handlers` takes over from the popover too.

An item with a fixed `href` or `src` skips the popover. The popover only works on toolbar buttons. Inside a dropdown, give `image` entries a `src`.

<ComponentPreview name="editor-toolbar/link" />

## Bubble menu

`layout="bubble"` floats the toolbar above selected text. Use `should-show` to change when it appears, and `options` for its position.

<ComponentPreview name="editor-toolbar/bubble" />

## Floating menu and custom commands

`layout="floating"` shows the toolbar beside an empty line. Pass `handlers` to the Editor to add commands. Each handler has:

- `canExecute`: whether the command can run on the selection
- `execute`: returns the command chain to run
- `isActive`: whether the toolbar shows the item pressed
- `isDisabled` (optional): an extra condition that disables the item
- `isToggle` (optional): render the item as a toggle button

Every toolbar inside the editor can then use the handler's key as `kind`.

<ComponentPreview name="editor-toolbar/custom-handlers" />

## Item slots

Give an item a `slot` name to render it yourself. The slot gets the item plus `isActive`, `isDisabled` and `onClick`.

The `#item` slot replaces every item without its own slot.

<ComponentPreview name="editor-toolbar/item-slot" />

## Examples

### Toolbar in the footer

The toolbar can go anywhere the editor's slots reach, such as the footer of a reply box.

<ComponentPreview name="editor-toolbar/footer-toolbar" />

## API Reference

### Props

<ApiTable component="EditorToolbar" kind="props" />

### Slots

<ApiTable component="EditorToolbar" kind="slots" />

## Theme

<ApiTheme component="EditorToolbar" />

## Related Components

<RelatedComponents :components="['editor', 'editor-suggestion-menu', 'editor-mention-menu', 'editor-drag-handle', 'toolbar']" />
