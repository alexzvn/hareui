---
title: Tabs
description: Tabs organize content into multiple sections and allow users to navigate between them.
links:
  reka: tabs
  source: tabs/Tabs.vue
  styles: tabs/theme.ts
  heroui: tabs
---

## Usage

```vue
<script setup lang="ts">
import { Tabs } from '@hareui/vue'
</script>
```

<ComponentPreview name="tabs/basic" />

## Anatomy

Tabs renders a list container wrapping the tab list, one trigger per `items` entry (plus an
optional separator, and the shared sliding indicator), followed by a panel for the selected
item.

```vue
<template>
  <Tabs :items="items" default-value="…" separator>
    <!-- separator: optional -->
    <template #tab="{ item, index, selected }" />
    <!-- replaces item.label -->
    <template #content="{ item, index }" />
    <!-- fallback panel content -->
    <template #[item.slot]="{ item, index }" />
    <!-- per-item panel content -->
  </Tabs>
</template>
```

The tab list sits in a `scroller` (`[data-slot="scroll-shadow"]`). When the tabs overflow it, the
edges fade and previous/next chevrons (`scrollPrev` / `scrollNext`) appear.

| `ui` key           | `data-slot`           | Element                                                                                     |
| ------------------ | --------------------- | ------------------------------------------------------------------------------------------- |
| `base`             | `tabs`                | root element                                                                                |
| `tabListContainer` | `tabs-list-container` | wrapper around the tab list                                                                 |
| `scroller`         | `scroll-shadow`       | scroll container around the tab list, fades overflowing edges                               |
| `scrollPrev`       | –                     | chevron that scrolls to previous tabs (shown only when there are any)                       |
| `scrollNext`       | –                     | chevron that scrolls to next tabs (shown only when there are any)                           |
| `tabList`          | `tabs-list`           | the `TabsList`                                                                              |
| `tab`              | `tabs-tab`            | per-item `TabsTrigger`                                                                      |
| `tabIndicator`     | `tabs-indicator`      | sliding selection indicator, positioned via `--tabs-indicator-{x,y,width,height}`           |
| `separator`        | `tabs-separator`      | divider inside every tab (iff `separator`); hidden on the selected tab and the one after it |
| `tabPanel`         | `tabs-panel`          | the selected item's `TabsContent`                                                           |

### Typing items

`items` takes the exported `TabsItem` type. Extra fields are kept: extend the type, and the slots receive your type, so no casts are needed.

```ts
import type { TabsItem } from '@hareui/vue'

interface MyItem extends TabsItem {
  icon: string
}

const items: MyItem[] = [/* ... */]
// <template #tab="{ item }"> — item.icon is a string
```

## Examples

### Vertical

<ComponentPreview name="tabs/vertical" />

### Overflow

When the tab list exceeds the available space, the edges fade and scroll chevrons appear so users
can navigate the hidden tabs. This works the same way for both horizontal and vertical orientations.

<ComponentPreview name="tabs/overflow" />

### Disabled Tab

<ComponentPreview name="tabs/disabled" />

### With Separator

Set `separator` to display separator lines between tabs.

<ComponentPreview name="tabs/with-separator" />

### Secondary Variant

<ComponentPreview name="tabs/secondary" />

### Secondary Variant Vertical

<ComponentPreview name="tabs/secondary-vertical" />

### Alignment

Tab content is centered by default. Use `align` to align it to the `start` or `end` instead, which is
especially useful for vertical, sidebar-style navigation. The tabs can still be overridden with
`:ui="{ tab: '…' }"`.

<ComponentPreview name="tabs/vertical-alignment" />

## Customization

### Tailwind CSS

<ComponentPreview name="tabs/custom-styles" />

### Global Configuration

To customize the Tabs classes for the whole app, extend the `tabs` theme in `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      tabs: {
        slots: {
          tabList: 'rounded-xl border border-border bg-surface p-1',
          tab: 'rounded-lg font-medium',
          tabIndicator: 'rounded-lg bg-foreground shadow-sm',
        },
        variants: {
          variant: {
            secondary: {
              tabList: 'border-b border-border bg-transparent p-0',
              tabIndicator: 'rounded-none bg-accent',
            },
          },
        },
      },
    },
  }),
)
```

## Styling Reference

### Slots

- `base` → `[data-slot="tabs"]` – root container (`flex`, column in horizontal orientation)
- `tabListContainer` → `[data-slot="tabs-list-container"]` – rounded background behind the list
- `scroller` → `[data-slot="scroll-shadow"]` – scroll area around the list (scrollbar hidden); fades
  overflowing edges and sets `data-left-scroll` / `data-right-scroll` (`data-top-scroll` /
  `data-bottom-scroll` when vertical, `data-left-right-scroll` / `data-top-bottom-scroll` when both)
- `scrollPrev` / `scrollNext` – chevron buttons, shown only while there's hidden content on that side
- `tabList` → `[data-slot="tabs-list"]` – the row/column of triggers
- `tab` → `[data-slot="tabs-tab"]` – one trigger per item
- `separator` → `[data-slot="tabs-separator"]` – divider rendered in every tab when `separator` is
  set; hidden (`opacity-0`) on the selected tab and the one following it
- `tabPanel` → `[data-slot="tabs-panel"]` – only the selected item's panel is mounted
- `tabIndicator` → `[data-slot="tabs-indicator"]` – sliding selection indicator; its box comes from the
  selected tab's `getBoundingClientRect()` via `--tabs-indicator-x/-y/-width/-height`

#### Orientation Attributes

- `[data-orientation="horizontal"]` – horizontal tab layout (default)
- `[data-orientation="vertical"]` – vertical tab layout

#### Variants

- `variant="secondary"` – underline indicator instead of the filled pill

#### Alignment

- `align="start"` – aligns tab content to the start
- `align="end"` – aligns tab content to the end

### Interactive States

Tabs sets these data attributes (from Reka UI):

- **Selected**: `[data-state="active"]` on `[data-slot="tabs-tab"]`
- **Hover**: `:hover`
- **Focus**: `:focus-visible`
- **Disabled**: `[data-disabled]` on `[data-slot="tabs-tab"]` (from `item.disabled`)

## API Reference

### Props

<ApiTable component="Tabs" kind="props" />

### Slots

<ApiTable component="Tabs" kind="slots" />

### Emits

<ApiTable component="Tabs" kind="emits" />

## Theme

<ApiTheme component="Tabs" />
