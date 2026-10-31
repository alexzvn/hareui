---
title: CommandPalette
description: Type to filter grouped actions, run them from the keyboard, pick one or many, and step into sub-lists.
links:
  source: command-palette/CommandPalette.vue
  styles: command-palette/theme.ts
---

## Usage

The CommandPalette renders inline. Put it in a [Modal](./modal) for a `⌘K`-style launcher, or in a [Popover](./popover) for a searchable picker.

```ts
import { CommandPalette } from '@hareui/vue/command-palette'
```

CommandPalette ships from the `@hareui/vue/command-palette` entry, not the package root. It searches with the `fuse.js` peer dependency:

::: code-group

```bash [npm]
npm i fuse.js
```

```bash [pnpm]
pnpm add fuse.js
```

```bash [yarn]
yarn add fuse.js
```

```bash [bun]
bun add fuse.js
```

:::

<ComponentPreview name="command-palette/default" />

## Anatomy

```vue
<CommandPalette :groups="groups">
  <template #header />               <!-- optional: above the input -->
  <template #back="{ onBack }" />    <!-- optional: replaces the back button of nested lists -->
  <template #close />                <!-- optional: end of the input -->
  <template #group-label="{ group }" /> <!-- optional: group headings -->
  <template #item="{ item }" />      <!-- optional: also #item-leading, -label, -description, -trailing -->
  <template #empty="{ searchTerm }" /> <!-- optional: nothing matched -->
  <template #footer />               <!-- optional: under the list -->
</CommandPalette>
```

## Groups

Pass `groups`, each with a unique `id`, an optional `label` and its `items`. An item shows its `label` and can add:

- `prefix` and `suffix` text around the label, and a `description` below it
- a leading `icon`, `avatar` or `chip` (a status dot)
- `kbds`, keyboard shortcuts at the end

Icons are components or icon classes.

<ComponentPreview name="command-palette/inline" />

## Widths

`size` caps the width at 384px (`sm`), 512px (`md`, default) or 576px (`lg`). The input and the rows look the same at every size.

<ComponentPreview name="command-palette/widths" />

## In a Modal

Put the palette in a Modal's `#content` slot and close the Modal on `update:model-value`. Give the dialog the same max width as the palette's `size` (`max-w-xl` for `lg` here), so the palette fills it edge to edge. The `#header`, `#close` and `#footer` slots add breadcrumbs, an `Esc` hint or keyboard hints. Set `:icon="false"` to hide the search icon.

<ComponentPreview name="command-palette/in-modal" />

## Status rows and shortcuts

`chip` adds a leading status dot, `description` a second line, and `kbds` a shortcut on the right. Modifier names such as `command`, `shift` or `enter` render as their symbols.

<ComponentPreview name="command-palette/status" />

## Row slots

The `#item-leading` and `#item-trailing` slots replace the icon and the trailing content of every row.

<ComponentPreview name="command-palette/row-slots" />

## Custom styles

The `ui` prop restyles any slot: here a larger input, square rows with an accent bar, and plain shortcuts.

<ComponentPreview name="command-palette/custom-styles" />

## Preview panel

`@highlight` reports the highlighted item, so a panel next to the list can preview it.

<ComponentPreview name="command-palette/preview-panel" />

## Filters and section actions

Content in `#header` sits above the input. A group with a `slot` gets its own `#<slot>-group-label` heading slot.

<ComponentPreview name="command-palette/filters" />

## Backdrops

The Modal's `variant` sets the backdrop: `opaque`, `blur` or `transparent`.

<ComponentPreview name="command-palette/backdrops" />

## In a Popover

With `multiple` and `v-model`, the palette works as a searchable multi-select. `value-key` stores one field of each item instead of the item.

<ComponentPreview name="command-palette/popover" />

## Nested lists

An item with `children` opens them in place of the groups, with its own `placeholder`. The back button or `Backspace` in an empty input goes back.

<ComponentPreview name="command-palette/nested" />

## Loading results

Bind `v-model:search-term`, fetch the results yourself, set `loading` while they arrive, and mark the group `ignoreFilter` so the palette shows them as they are.

<ComponentPreview name="command-palette/loading" />

## Highlighting matches

Set `fuse.fuseOptions.includeMatches` to mark the matched characters in labels and descriptions.

<ComponentPreview name="command-palette/highlight" />

## Long lists

`virtualize` renders only the visible rows. All groups then show as one list, without headings. Raise `fuse.resultLimit` (12 by default) to search more than 12 items.

<ComponentPreview name="command-palette/virtualize" />

## Custom slots

Items and groups with a `slot` render through `#<slot>`, `#<slot>-leading`, `#<slot>-label`, `#<slot>-description`, `#<slot>-trailing` and `#<slot>-group-label`. Items with `href` or `to` render as links.

<ComponentPreview name="command-palette/custom-slot" />

## API

### CommandPalette Props

<ApiTable component="CommandPalette" kind="props" />

### CommandPalette Slots

<ApiTable component="CommandPalette" kind="slots" />

### CommandPalette Emits

<ApiTable component="CommandPalette" kind="emits" />

## Theme

<ApiTheme component="CommandPalette" />
