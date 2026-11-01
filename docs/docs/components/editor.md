---
title: Editor
description: A rich-text field built on tiptap, with toolbars that run formatting commands.
links:
  source: editor/Editor.vue
  styles: editor/theme.ts
---

## Usage

```ts
import { Editor, EditorToolbar } from '@hareui/vue/editor'
```

Editor and EditorToolbar ship from the `@hareui/vue/editor` entry, not the package root. They need the optional tiptap peer dependencies:

::: code-group

```bash [npm]
npm i @tiptap/vue-3 @tiptap/pm @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-image @tiptap/extension-code @tiptap/extension-horizontal-rule @tiptap/extension-bubble-menu @tiptap/extension-floating-menu @tiptap/markdown
```

```bash [pnpm]
pnpm add @tiptap/vue-3 @tiptap/pm @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-image @tiptap/extension-code @tiptap/extension-horizontal-rule @tiptap/extension-bubble-menu @tiptap/extension-floating-menu @tiptap/markdown
```

```bash [yarn]
yarn add @tiptap/vue-3 @tiptap/pm @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-image @tiptap/extension-code @tiptap/extension-horizontal-rule @tiptap/extension-bubble-menu @tiptap/extension-floating-menu @tiptap/markdown
```

```bash [bun]
bun add @tiptap/vue-3 @tiptap/pm @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-image @tiptap/extension-code @tiptap/extension-horizontal-rule @tiptap/extension-bubble-menu @tiptap/extension-floating-menu @tiptap/markdown
```

:::

Bind the document with `v-model`. The default slot receives the tiptap `editor`; pass it to an `EditorToolbar` and list the commands in `items`. Nested arrays are groups, split by a separator. The `footer` slot sits under the document, for status text and counters.

<ComponentPreview name="editor/basic" />

### Anatomy

```vue
<template>
  <Editor v-model="content">
    <template #default="{ editor }">
      <EditorToolbar :editor="editor" :items="items" />
    </template>

    <template #footer="{ editor }">
      <span>{{ editor.state.doc.textContent.length }} characters</span>
    </template>
  </Editor>
</template>
```

## Content type

`v-model` is HTML when it's a string and a tiptap JSON document when it's an object. Set `content-type` to force one: `json`, `html` or `markdown`. The editor emits the same format back. External updates replace the document only when they differ from what's already there, so typing never resets the caret, and they aren't emitted back as `update:modelValue`.

<ComponentPreview name="editor/controlled" />

With `content-type="markdown"` the editor reads and writes Markdown (GitHub-flavored by default; configure it with the `markdown` prop).

<ComponentPreview name="editor/markdown" />

## Variants

`primary` sits on the field background. `secondary` takes the default fill instead, which suits an editor placed on a card or inside a panel.

<ComponentPreview name="editor/secondary" />

## Placeholder

`placeholder` shows on the empty line the caret is in. Pass an object to configure it, e.g. `{ placeholder: 'Write…', mode: 'firstLine' }` shows it only while the whole document is empty. The text can change at any time, for example with the locale; the other options are read when the editor is created.

<ComponentPreview name="editor/placeholder" />

## Disabled and read-only

`disabled` dims the field, stops editing, disables every toolbar item and sets `aria-disabled`. `:editable="false"` keeps the normal look and selectable text but blocks changes, and sets `aria-readonly`.

<ComponentPreview name="editor/disabled" />

## Toolbar

### Commands

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

Command items get a built-in icon and an English name, used as tooltip and `aria-label`. Override them with `icon`, `label`, `tooltip` and `aria-label`. Formats and blocks render as toggle buttons that show the state at the caret; a command that can't run is disabled. Items without `kind` are plain buttons with `onClick`.

### Dropdown

An item with `items` opens a menu of commands. Its icon follows the active entry, and the menu checks it.

<ComponentPreview name="editor/dropdown" />

### Links and images

A `link` item without `href` opens a popover with a URL field. When the caret is on a link, the field starts with its URL: edit it and press Enter or Apply to change it, or press Remove to unlink the text. Escape closes the popover without changing anything. It works the same from a fixed toolbar and from a bubble menu.

An `image` item without `src` opens the same field and inserts the image at the caret. With an image selected, the field starts with its URL and Apply swaps the picture.

The popover runs the `link` or `image` handler with the URL (an empty `href` removes the link), so a handler passed in `handlers` takes over. An item with a fixed `href` or `src` skips the popover. The popover belongs to toolbar buttons: inside a dropdown, give `image` entries a `src`.

<ComponentPreview name="editor/link" />

### Bubble menu

`layout="bubble"` floats the toolbar above selected text. Use `should-show` to change when it appears, and `options` for its position.

<ComponentPreview name="editor/bubble" />

### Floating menu and custom commands

`layout="floating"` shows the toolbar beside an empty line. Pass `handlers` to the Editor to add commands. Each handler has:

- `canExecute`: whether the command can run on the selection
- `execute`: returns the command chain to run
- `isActive`: whether the toolbar shows the item pressed
- `isDisabled` (optional): an extra condition that disables the item
- `isToggle` (optional): render the item as a toggle button

Every toolbar inside the editor can then use the handler's key as `kind`.

<ComponentPreview name="editor/custom-handlers" />

### Item slots

Give an item a `slot` name to render it yourself. The slot gets the item plus `isActive`, `isDisabled` and `onClick`. `#item` replaces every item without its own slot.

<ComponentPreview name="editor/item-slot" />

## Examples

### Character count

<ComponentPreview name="editor/character-count" />

### Toolbar in the footer

The toolbar can go anywhere the editor's slots reach, such as the footer of a reply box.

<ComponentPreview name="editor/footer-toolbar" />

## Extensions

The editor loads the starter kit (paragraphs, headings, lists, quotes, code, links, underline, history and more), images and the placeholder. These props change that:

- `starter-kit` configures the starter kit; `false` keeps a plain-text editor.
- `image` configures images.
- `extensions` adds any tiptap extension.
- `editor-props` passes options straight to ProseMirror.

## API Reference

### Editor Props

<ApiTable component="Editor" kind="props" />

### Editor Emits

<ApiTable component="Editor" kind="emits" />

### Editor Slots

<ApiTable component="Editor" kind="slots" />

### EditorToolbar Props

<ApiTable component="EditorToolbar" kind="props" />

### EditorToolbar Slots

<ApiTable component="EditorToolbar" kind="slots" />

## Theme

### Editor Theme

<ApiTheme component="Editor" />

### EditorToolbar Theme

<ApiTheme component="EditorToolbar" />

## Related Components

<RelatedComponents :components="['toolbar', 'text-area']" />
