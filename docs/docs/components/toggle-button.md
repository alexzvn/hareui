---
title: ToggleButton
description: An interactive toggle control for on/off or selected/unselected states
links:
  source: ToggleButton.vue
  styles: toggleButton.ts
  heroui: toggle-button
---

## Usage

```ts
import { ToggleButton } from 'herouse'
```

<ComponentPreview name="toggle-button/basic" />

## Examples

### Variants

<ComponentPreview name="toggle-button/variants" />

### Icon Only

<ComponentPreview name="toggle-button/icon-only" />

### Sizes

<ComponentPreview name="toggle-button/sizes" />

### Disabled

<ComponentPreview name="toggle-button/disabled" />

### Controlled

Bind the selected state with `v-model`. The default slot receives `{ selected, disabled }` (HeroUI's render props).

<ComponentPreview name="toggle-button/controlled" />

## Customization

### Tailwind CSS

<ComponentPreview name="toggle-button/custom-styles" />

### Global theme override

Override the `toggleButton` theme app-wide with `createHeroUse`:

```ts
app.use(createHeroUse({
  ui: {
    toggleButton: {
      slots: { base: 'bg-purple-500 text-white' },
      variants: { iconOnly: { true: { base: 'rounded-lg' } } },
    },
  },
}))
```

## Styling Reference

The root carries `data-slot="toggle-button"`, as in HeroUI. `ui` key: `base`.

### Interactive States

- **Selected**: `[data-selected="true"]` (accent background and foreground)
- **Hover**: `:hover`
- **Active/Pressed**: `:active` (includes scale transform)
- **Focus**: `:focus-visible` (shows focus ring)
- **Disabled**: `:disabled` or `[aria-disabled="true"]` (reduced opacity, no pointer events)

## API Reference

### Props

<ApiTable component="ToggleButton" kind="props" />

### Slots

<ApiTable component="ToggleButton" kind="slots" />

### Emits

<ApiTable component="ToggleButton" kind="emits" />

## Related Components

- [ToggleButtonGroup](/docs/components/toggle-button-group)
- [Button](/docs/components/button)
