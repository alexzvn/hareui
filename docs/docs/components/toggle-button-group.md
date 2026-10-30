---
title: ToggleButtonGroup
description: Groups multiple ToggleButtons into a unified control, allowing users to select one or multiple options.
links:
  source: toggle-button-group/ToggleButtonGroup.vue
  styles: toggle-button-group/theme.ts
  heroui: toggle-button-group
---

## Usage

```ts
import { ToggleButton, ToggleButtonGroup } from '@hareui/vue'
```

<ComponentPreview name="toggle-button-group/basic" />

## Anatomy

```vue
<template>
  <ToggleButtonGroup selection-mode="multiple" separator>
    <ToggleButton value="first">First</ToggleButton>
    <ToggleButton value="second">Second</ToggleButton>
    <ToggleButton value="third">Third</ToggleButton>
  </ToggleButtonGroup>
</template>
```

HeroUI's `ToggleButtonGroup.Separator`, placed inside each ToggleButton except the first, becomes the
`separator` prop: every ToggleButton renders the divider and the first one hides it. Each ToggleButton's
`value` (HeroUI's `id`) is what the group's `v-model` holds.

`ui` keys: `base`, `separator`, plus `button`, which is added to each ToggleButton in the group.

## Examples

### Sizes

<ComponentPreview name="toggle-button-group/sizes" />

### Orientation

<ComponentPreview name="toggle-button-group/orientation" />

### Full Width

<ComponentPreview name="toggle-button-group/full-width" />

### Disabled

<ComponentPreview name="toggle-button-group/disabled" />

### Without Separator

Omit the `separator` prop to render buttons without dividers.

<ComponentPreview name="toggle-button-group/without-separator" />

### Detached

Use `detached` to separate buttons with gaps instead of connecting them.

<ComponentPreview name="toggle-button-group/attached" />

### Selection Mode

Use `selection-mode="single"` for mutually exclusive choices or `selection-mode="multiple"` for independent toggles.

<ComponentPreview name="toggle-button-group/selection-mode" />

### Controlled

<ComponentPreview name="toggle-button-group/controlled" />

## Customization

### Tailwind CSS

<ComponentPreview name="toggle-button-group/custom-styles" />

### Global theme override

Override the `toggleButtonGroup` theme app-wide with `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      toggleButtonGroup: {
        slots: { base: 'rounded-lg', separator: 'opacity-25' },
        variants: { fullWidth: { true: { base: 'w-full' } } },
      },
    },
  }),
)
```

## Styling Reference

Each rendered element carries the same `data-slot` string as HeroUI, so selectors translate 1:1.

| `ui` key    | `data-slot`                     | Description                                |
| ----------- | ------------------------------- | ------------------------------------------ |
| `base`      | `toggle-button-group`           | Group container                            |
| `separator` | `toggle-button-group-separator` | Divider inside each ToggleButton           |
| `button`    | `toggle-button`                 | Classes added to each grouped ToggleButton |

## API Reference

### Props

<ApiTable component="ToggleButtonGroup" kind="props" />

### Slots

<ApiTable component="ToggleButtonGroup" kind="slots" />

### Emits

<ApiTable component="ToggleButtonGroup" kind="emits" />

## Theme

<ApiTheme component="ToggleButtonGroup" />

## Note

- ToggleButtonGroup passes `size` to all child ToggleButton components
- Each ToggleButton needs a unique `value` that corresponds to the values in `v-model` / `default-value`
- The `disabled` prop disables all child ToggleButtons. A button can't opt back in with `:disabled="false"`: as in React Aria, the group's `disabled` wins
- The component automatically handles border radius between buttons
- Use `disallow-empty-selection` with `selection-mode="single"` to ensure one option is always selected
- **Difference from HeroUI:** pressing a disabled button moves focus to the group container (Reka's roving-focus root), where HeroUI leaves focus where it was. The next <kbd>Tab</kbd> then starts from the group

## Related Components

<RelatedComponents :components="['toggle-button', 'button-group']" />
