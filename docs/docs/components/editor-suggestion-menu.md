---
title: Editor Suggestion Menu
description: A slash-command menu that inserts blocks and runs editor commands.
links:
  source: editor-suggestion-menu/EditorSuggestionMenu.vue
  styles: editor-suggestion-menu/theme.ts
---

## Usage

```ts
import { Editor, EditorSuggestionMenu } from '@hareui/vue/editor'
```

EditorSuggestionMenu ships from the `@hareui/vue/editor` entry, not the package root. It needs the optional tiptap peer dependencies:

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

Put the menu in the default slot of an [Editor](/docs/components/editor) and pass it the slot's `editor`. It lists commands when `/` is typed at the start of a line or after a space. In the menu:

- The text typed after `/` filters the list. Try `/h2` or `/todo`.
- The arrow keys move the highlight.
- Enter or Tab runs the highlighted command in place of the typed text.
- Escape closes the menu.

<ComponentPreview name="editor-suggestion-menu/basic" />

## Anatomy

```vue
<template>
  <Editor v-model="content">
    <template #default="{ editor }">
      <EditorSuggestionMenu :editor="editor" :items="items">
        <template #item="{ item, highlighted, disabled, ui }" />
        <!-- optional: a whole entry -->
        <template #item-leading="{ item }" />
        <!-- optional: the icon well -->
        <template #item-label="{ item }" />
        <!-- optional: the label -->
        <template #item-description="{ item }" />
        <!-- optional: the description -->
        <template #item-trailing="{ item }" />
        <!-- optional: after the label -->
        <template #section-label="{ section }" />
        <!-- optional: a section heading -->
        <template #empty="{ searchTerm }" />
        <!-- optional: nothing matches -->
      </EditorSuggestionMenu>
    </template>
  </Editor>
</template>
```

## Items

Items take the toolbar's command `kind`s, each with a label, a description and an icon. See [EditorToolbar](/docs/components/editor-toolbar#commands) for the list. Keys of the Editor's [`handlers`](/docs/components/editor-toolbar#floating-menu-and-custom-commands) work as `kind` too.

Group items like in [Dropdown](/docs/components/dropdown):

- `{ type: 'section', label, items }`: a group with a heading.
- `{ type: 'separator' }`: a line between items.
- Nested arrays: groups split by a line.

## Custom commands

Give an item `onSelect` to run your own command instead of a `kind`. It gets the tiptap editor after the typed `/text` is removed. This menu inserts today's date, a changelog template and a callout.

<ComponentPreview name="editor-suggestion-menu/custom-commands" />

## Shortcuts

Set `kbd` on an item to show a shortcut at the end of its row. Here each entry shows the Markdown you could type instead.

<ComponentPreview name="editor-suggestion-menu/shortcuts" />

## Insert button

The `suggestion` command kind types `/` at the cursor, which opens the menu. Put it on a toolbar button for people who don't know the trigger. Here a `floating` toolbar shows a "+" on empty lines, and `start-of-line` keeps the menu to the start of a line.

<ComponentPreview name="editor-suggestion-menu/insert-button" />

## Empty state

When nothing matches, the menu stays open with a "No results" row. The `empty` slot replaces it and gets the typed text. Type `/zz` to see it.

<ComponentPreview name="editor-suggestion-menu/empty" />

## Filtering

The typed text is matched against `label`. `filter-fields` lists other fields to match, as names or dotted paths. A field may hold several strings, such as aliases. Exact matches rank first, then prefixes, then the rest.

To load results yourself, bind `v-model:search-term`, set `ignore-filter`, and set `loading` while the request runs. The [EditorMentionMenu](/docs/components/editor-mention-menu#load-items-yourself) page shows it.

## Item slots

The `item` slot renders whole entries your way. The `item-*` slots replace single parts: leading, label, description and trailing. The `section-label` slot renders section headings.

## Trigger and position

- `char` changes the trigger character. It's read when the menu mounts.
- `start-of-line` opens the menu only at the start of a line.
- `allow-spaces` keeps it open when the typed text has spaces.
- `side`, `align` and `side-offset` place the menu next to the trigger. It flips to the other side when there isn't room.

Listen to `select` to react to a pick, and to `update:open` to know when the menu opens or closes.

## Accessibility

The editor keeps focus while the menu is open. It gets `aria-expanded`, `aria-controls` and `aria-activedescendant`, so screen readers announce the highlighted entry as the arrow keys move.

## API Reference

### Props

<ApiTable component="EditorSuggestionMenu" kind="props" />

### Emits

<ApiTable component="EditorSuggestionMenu" kind="emits" />

### Slots

<ApiTable component="EditorSuggestionMenu" kind="slots" />

## Theme

<ApiTheme component="EditorSuggestionMenu" />

## Related Components

<RelatedComponents :components="['editor', 'editor-toolbar', 'editor-mention-menu', 'editor-drag-handle', 'command-palette']" />
