---
title: Tabs
description: Tabbed navigation with a sliding selection indicator
links:
  reka: tabs
  source: Tabs.vue
  styles: tabs.ts
  heroui: tabs
---

## Usage

```vue
<script setup lang="ts">
import { Tabs } from 'herouse'
</script>
```

<ComponentPreview name="tabs/basic" />

## Anatomy

Tabs renders a list container wrapping the tab list, one trigger per `items` entry (each
with a separator and the shared sliding indicator), followed by a panel for the selected
item.

```vue
<template>
  <Tabs :items="items" default-value="…">
    <template #tab="{ item, index, selected }" /> <!-- replaces item.label -->
    <template #content="{ item, index }" />       <!-- fallback panel content -->
    <template #[item.slot]="{ item, index }" />   <!-- per-item panel content -->
  </Tabs>
</template>
```

HeroUI's overflow scroll buttons (`Tabs.ListContainer`'s `ScrollShadow` wrapper and the
previous/next scroll arrows) are not ported — the tab list simply wraps.

| `ui` key | `data-slot` | Element |
|---|---|---|
| `base` | `tabs` | root element |
| `tabListContainer` | `tabs-list-container` | wrapper around the tab list |
| `tabList` | `tabs-list` | the `TabsList` |
| `tab` | `tabs-tab` | per-item `TabsTrigger` |
| `tabIndicator` | `tabs-indicator` | sliding selection pill |
| `separator` | `tabs-separator` | divider rendered inside each tab |
| `tabPanel` | `tabs-panel` | the selected item's `TabsContent` |

## Examples

### Secondary Variant

<ComponentPreview name="tabs/secondary" />

### Disabled Tab

<ComponentPreview name="tabs/disabled" />

### Vertical Orientation

<ComponentPreview name="tabs/vertical" />

### Vertical Alignment

<ComponentPreview name="tabs/vertical-alignment" />

## Customization

### Tailwind CSS

Use `:ui` overrides to restyle the list, tabs, and indicator.

<ComponentPreview name="tabs/custom-styles" />

### Global Configuration

```ts
app.use(createHeroUse({
  ui: { tabs: { slots: { tab: 'rounded-lg' } } },
}))
```

## Styling Reference

### Slots

- `base` → `[data-slot="tabs"]` – root container (`flex`, column in horizontal orientation)
- `tabListContainer` → `[data-slot="tabs-list-container"]` – rounded background behind the list
- `tabList` → `[data-slot="tabs-list"]` – the row/column of triggers
- `tab` → `[data-slot="tabs-tab"]` – one trigger per item
- `tabIndicator` → `[data-slot="tabs-indicator"]` – sliding pill positioned via Reka's
  `--reka-tabs-indicator-*` CSS variables
- `separator` → `[data-slot="tabs-separator"]` – divider inside each tab, hidden on the
  selected tab and the one following it
- `tabPanel` → `[data-slot="tabs-panel"]` – only the selected item's panel is mounted

### Interactive States

Tabs sets these data attributes (from Reka UI):

- **Selected**: `[data-state="active"]` on `[data-slot="tabs-tab"]`
- **Disabled**: `[data-disabled]` on `[data-slot="tabs-tab"]` (from `item.disabled`)
- **Orientation**: `[data-orientation="horizontal"|"vertical"]` on the root, list, and tabs

## API Reference

### Props

<ApiTable component="Tabs" kind="props" />

### Slots

<ApiTable component="Tabs" kind="slots" />

## Accessibility

- Built on Reka UI's [Tabs](https://reka-ui.com/docs/components/tabs) primitive, which
  implements the [WAI-ARIA Tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- Keyboard: arrow keys move selection between tabs, following `orientation`;
  <kbd>Home</kbd>/<kbd>End</kbd> jump to the first/last tab; <kbd>Tab</kbd> moves focus
  into and out of the tab list as a single stop
- Disabled tabs (`item.disabled`) are skipped by keyboard navigation
