---
title: CellSwitch
description: A switch laid out as a settings row, with the label at the start and the switch at the end.
links:
  reka: switch
  source: cell-switch/CellSwitch.vue
  styles: cell-switch/theme.ts
---

## Usage

```vue
<script setup lang="ts">
import { CellSwitch } from '@hareui/vue'
</script>
```

<ComponentPreview name="cell-switch/basic" />

## Anatomy

CellSwitch is a [Switch](/docs/components/switch) styled as a row. The whole row is the switch button, so a click anywhere on it toggles the value.

```vue
<template>
  <CellSwitch label="…" error-message="…">
    <template #label />  <!-- content at the start of the row -->
    <template #icon />   <!-- icon inside the thumb -->
    <template #error />  <!-- error below the row, rendered when invalid -->
  </CellSwitch>
</template>
```

| `ui` key | `data-slot` | Element |
|---|---|---|
| `base` | `cell-switch` | `<div>` root |
| `trigger` | `switch-content` | `<button role="switch">`, the visible row |
| `label` | `cell-switch-label` | `<span>` at the start of the row |
| `control` | `switch-control` | `<span>` track of the switch, at the end of the row |
| `thumb` | `switch-thumb` | `<span>` inside the control |
| — | `switch-icon` | `<span>` inside the thumb, holding the `#icon` slot (when used) |
| — | `field-error` | [FieldError](/docs/components/field-error) below the row (while invalid) |

## Examples

### Controlled

Bind the value with `v-model`. The status in the footer follows the switch.

<ComponentPreview name="cell-switch/controlled" />

### Disabled

<ComponentPreview name="cell-switch/disabled" />

### Feature Announcement

Put any content in the `#label` slot and restyle the row with `ui`. Here the row grows to fit an icon, a description, a title and a badge. Set `aria-label` so the switch keeps a short name.

<ComponentPreview name="cell-switch/feature-announcement" />

### Secondary Group

Use `variant="secondary"` on a surface or card, where the default row would blend into the background.

<ComponentPreview name="cell-switch/secondary-group" />

### Settings Group

List rows under a heading to group related settings, such as the devices in one room. Here the heading counts the devices that are on.

<ComponentPreview name="cell-switch/settings-group" />

### Variants

`default` is a field-colored row with a shadow. `secondary` uses the default background and no shadow.

<ComponentPreview name="cell-switch/variants" />

## Customization

### Tailwind CSS

Pass classes per part with `ui`:

```vue
<template>
  <CellSwitch
    label="Wi-Fi"
    :ui="{ trigger: 'h-11 rounded-2xl', label: 'font-semibold' }"
  />
</template>
```

### Global Configuration

```ts
app.use(createHareUI({
  ui: { cellSwitch: { slots: { trigger: 'h-10' } } },
}))
```

The switch control keeps the [Switch](/docs/components/switch) theme, so `ui.switch` in the app config applies here too.

## Styling Reference

### Slots

- `base` → `[data-slot="cell-switch"]`: root
- `trigger` → `[data-slot="switch-content"]`: the row (`h-9`, `px-3`, `gap-3`, `rounded-field`)
- `label` → `[data-slot="cell-switch-label"]`: label text, truncated with an ellipsis
- `control` → `[data-slot="switch-control"]`: switch track
- `thumb` → `[data-slot="switch-thumb"]`: switch thumb

The row background reads `--cell-bg-current`, so a plain `bg-*` class in `ui.trigger` wins in every state. The variants set `--cell-bg`, `--cell-bg-hover` and `--cell-bg-focus`.

### Interactive States

- **Selected**: `[data-selected="true"]` on the root, `[data-state="checked"]` on the row
- **Disabled**: `[data-disabled="true"]` on the root
- **Invalid**: `[data-invalid="true"]` on the root
- **Read Only**: `[data-readonly="true"]` on the root
- **Hover**: the row tints on `:hover`
- **Focus Visible**: the row shows the focus ring on `:focus-visible`

## API Reference

### Props

<ApiTable component="CellSwitch" kind="props" />

### Slots

<ApiTable component="CellSwitch" kind="slots" />

### Emits

<ApiTable component="CellSwitch" kind="emits" />

### Theme

<ApiTheme component="CellSwitch" />

## Accessibility

- The row is a `<button role="switch">` with `aria-checked`, so it is one tab stop
- The row's text names the switch; set `aria-label` when the `#label` slot holds more than a short title
- Keyboard: <kbd>Space</kbd> toggles. <kbd>Enter</kbd> submits the surrounding form, as with a native checkbox
- `readonly` sets `aria-readonly="true"`; `invalid` sets `aria-invalid="true"` and links the error with `aria-describedby`

## Related Components

<RelatedComponents :components="['switch', 'cell-slider', 'cell-select']" />
