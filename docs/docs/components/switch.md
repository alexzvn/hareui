---
title: Switch
description: A toggle switch component for boolean states
links:
  reka: switch
  source: Switch.vue
  styles: switch.ts
  heroui: switch
---

## Usage

```vue
<script setup lang="ts">
import { Switch } from 'herouse'
</script>
```

<ComponentPreview name="switch/basic" />

## Anatomy

Switch is a single component — no compound parts. Label, description, and the thumb icon are
composed through props or named slots.

```vue
<Switch label="…" description="…">
  <template #label="{ checked }" />       <!-- Label content -->
  <template #description />               <!-- Description content -->
  <template #icon="{ checked }" />        <!-- Icon rendered inside the thumb -->
</Switch>
```

| `ui` key | `data-slot` | Element |
|---|---|---|
| `base` | `switch` | `<div>` root |
| `content` | `switch-content` | The Reka `SwitchRoot` button |
| `control` | `switch-control` | The track |
| `thumb` | `switch-thumb` | The moving thumb |
| `icon` | `switch-icon` | Icon container inside the thumb (iff `#icon`) |
| — | `description` | [Description](/docs/components/description) (iff `description` / `#description`) |

## Examples

### Sizes

<ComponentPreview name="switch/sizes" />

### With Icons

<ComponentPreview name="switch/with-icons" />

### Disabled

<ComponentPreview name="switch/disabled" />

### Without Label

<ComponentPreview name="switch/without-label" />

### With Description

<ComponentPreview name="switch/with-description" />

### Default Selected

<ComponentPreview name="switch/default-selected" />

### Controlled

<ComponentPreview name="switch/controlled" />

### Label Position

herouse has no dedicated `label-position` prop; reverse the order with a `content` class override:

<ComponentPreview name="switch/label-position" />

### Render Props

The `#label`, `#description` and `#icon` slots receive `{ checked }`:

<ComponentPreview name="switch/render-props" />

## Customization

### Tailwind CSS

Override the control's checked colors with CSS variables through `:ui`, and stack a [Description](/docs/components/description) under the label inside `#label`:

<ComponentPreview name="switch/custom-styles" />

### Global Configuration

```ts
app.use(createHeroUse({
  ui: { switch: { slots: { control: 'rounded-md' } } },
}))
```

## Styling Reference

### Slots

- `base` → `[data-slot="switch"]` – root container, carries `data-selected` / `data-disabled` / `data-invalid` / `data-readonly` / `data-required`
- `content` → `[data-slot="switch-content"]` – the interactive `SwitchRoot` element
- `control` → `[data-slot="switch-control"]` – the track
- `thumb` → `[data-slot="switch-thumb"]` – the moving thumb
- `icon` → `[data-slot="switch-icon"]` – optional icon inside the thumb

### Interactive States

- **Selected**: `[data-selected="true"]` on the root (thumb position and background color change)
- **Hover**: `:hover` on the root
- **Focus**: `:focus-visible` on the content element (shows focus ring)
- **Disabled**: `[data-disabled="true"]` on the root (reduced opacity, no pointer events)
- **Pressed**: `:active` on the root
- **Invalid**: `[data-invalid="true"]` on the root, `aria-invalid="true"` on the content element
- **Read only**: `[data-readonly="true"]` on the root, `aria-readonly="true"` on the content element
- **Required**: `[data-required="true"]` on the root

## API Reference

### Props

<ApiTable component="Switch" kind="props" />

### Slots

<ApiTable component="Switch" kind="slots" />

### Emits

<ApiTable component="Switch" kind="emits" />

## Accessibility

- Clicking anywhere in the content area (including the label) toggles the switch
- Use `aria-label` when no visible `label` / `#label` is provided
- `description` is linked via `aria-describedby`
- `required` and `disabled` set the native attributes on the underlying control

## Related Components

- [Checkbox](/docs/components/checkbox)
- [RadioGroup](/docs/components/radio-group)
- [Label](/docs/components/label)
- [Description](/docs/components/description)
