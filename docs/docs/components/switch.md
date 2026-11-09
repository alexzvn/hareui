---
title: Switch
description: A toggle switch component for boolean states
links:
  reka: switch
  source: switch/Switch.vue
  styles: switch/theme.ts
  heroui: switch
---

## Usage

```vue
<script setup lang="ts">
import { Switch, SwitchGroup } from '@hareui/vue'
</script>
```

<ComponentPreview name="switch/basic" />

## Anatomy

Switch is a single component — no compound parts. Label, description, and the thumb icon are
composed through props or named slots.

```vue
<Switch label="…" description="…" error-message="…">
  <template #label="{ checked }" />       <!-- Label content -->
  <template #description />               <!-- Description content -->
  <template #icon="{ checked }" />        <!-- Icon rendered inside the thumb -->
  <template #error="{ validationErrors }" /> <!-- FieldError content, rendered while invalid -->
</Switch>
```

| `ui` key  | `data-slot`      | Element                                                                                                        |
| --------- | ---------------- | -------------------------------------------------------------------------------------------------------------- |
| `base`    | `switch`         | `<div>` root                                                                                                   |
| `content` | `switch-content` | The switch button                                                                                              |
| `control` | `switch-control` | The track                                                                                                      |
| `thumb`   | `switch-thumb`   | The moving thumb                                                                                               |
| `icon`    | `switch-icon`    | Icon container inside the thumb (iff `#icon`)                                                                  |
| —         | `description`    | [Description](/docs/components/description) (iff `description` / `#description`)                               |
| —         | `field-error`    | [FieldError](/docs/components/field-error) (while invalid, iff `error-message` / `#error` / validation errors) |

Group multiple switches with [SwitchGroup](#switchgroup), a layout-only wrapper (`orientation: 'vertical' | 'horizontal'`, default `vertical`):

```vue
<SwitchGroup>
  <Switch name="a" label="Option 1" />
  <Switch name="b" label="Option 2" />
</SwitchGroup>
```

| `ui` key | `data-slot`          | Element                        |
| -------- | -------------------- | ------------------------------ |
| `base`   | `switch-group`       | `<div>` root                   |
| `items`  | `switch-group-items` | Container for the switch items |

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

HareUI has no dedicated `label-position` prop. Reverse the order with a `content` class override:

<ComponentPreview name="switch/label-position" />

### Group

<ComponentPreview name="switch/group" />

### Group Horizontal

<ComponentPreview name="switch/group-horizontal" />

### Form Integration

<ComponentPreview name="switch/form" />

### Render Props

The label, description and icon slots receive the `checked` state:

<ComponentPreview name="switch/render-props" />

## Customization

### Tailwind CSS

Override the control's checked colors with CSS variables through `:ui`, and stack a [Description](/docs/components/description) under the label inside `#label`:

<ComponentPreview name="switch/custom-styles" />

### Global Configuration

```ts
app.use(
  createHareUI({
    ui: { switch: { slots: { control: 'rounded-md' } } },
  }),
)
```

## Styling Reference

### Slots

- `base` → `[data-slot="switch"]` – root container. It carries the state attributes listed below.
- `content` → `[data-slot="switch-content"]` – the interactive `SwitchRoot` element
- `control` → `[data-slot="switch-control"]` – the track
- `thumb` → `[data-slot="switch-thumb"]` – the moving thumb
- `icon` → `[data-slot="switch-icon"]` – optional icon inside the thumb

### CSS Classes

HareUI follows the [BEM](https://getbem.com/) methodology to keep component variants and states reusable and easy to customize. The Switch component uses these CSS classes ([View source styles](https://github.com/alexzvn/hareui/blob/main/packages/vue/src/components/switch/switch.css)):

#### Switch Classes

- `.h-switch` - Base switch container
- `.h-switch__content` - Optional content container
- `.h-switch__control` - Switch control track
- `.h-switch__thumb` - Switch thumb that moves
- `.h-switch--sm` - Small size variant
- `.h-switch--lg` - Large size variant

The default `md` size adds no class.

#### SwitchGroup Classes

The SwitchGroup component uses these CSS classes ([View source styles](https://github.com/alexzvn/hareui/blob/main/packages/vue/src/components/switch-group/switch-group.css)):

- `.h-switch-group` - Switch group container
- `.h-switch-group__items` - Container for switch items
- `.h-switch-group--horizontal` - Horizontal layout
- `.h-switch-group--vertical` - Vertical layout (default)

The classes sit in `@layer components`, so a utility you pass through `class` or `ui` wins over them.

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

## SwitchGroup

`SwitchGroup` is a layout-only wrapper. It has no state of its own and shares nothing with its `Switch` children.
Each switch keeps its own `name`, `value` and `v-model`. Use the group only for the spacing and orientation of a stack of switches.

### Props

<ApiTable component="SwitchGroup" kind="props" />

### Slots

<ApiTable component="SwitchGroup" kind="slots" />

## Theme

### Switch Theme

<ApiTheme component="Switch" />

### SwitchGroup Theme

<ApiTheme component="SwitchGroup" />

## Accessibility

- Clicking anywhere in the content area (including the label) toggles the switch
- Use `aria-label` when no visible `label` / `#label` is provided
- `description` is linked via `aria-describedby`
- `required` and `disabled` set the native attributes on the underlying control

## Related Components

<RelatedComponents :components="['checkbox', 'radio-group', 'label', 'description']" />
