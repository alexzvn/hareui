---
title: ToggleButton
description: An interactive toggle control for on/off or selected/unselected states
links:
  source: toggle-button/ToggleButton.vue
  styles: toggle-button/theme.ts
  heroui: toggle-button
---

## Usage

```ts
import { ToggleButton } from '@hareui/vue'
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

Bind the selected state with `v-model`. The default slot receives `{ selected, disabled }`.

<ComponentPreview name="toggle-button/controlled" />

## Customization

### Tailwind CSS

<ComponentPreview name="toggle-button/custom-styles" />

### Global theme override

Override the `toggleButton` theme app-wide with `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      toggleButton: {
        slots: { base: 'bg-purple-500 text-white' },
        variants: { iconOnly: { true: { base: 'rounded-lg' } } },
      },
    },
  }),
)
```

## Styling Reference

The root carries `data-slot="toggle-button"`. `ui` key: `base`.

### CSS classes

ToggleButton's own styles are `.h-toggle-button` classes in `@layer components`, so any utility you add wins. The root carries `.h-toggle-button` plus `.h-toggle-button--ghost`, `.h-toggle-button--{sm|lg}` and `.h-toggle-button--icon-only` when those props are set. Colors and height come from `--toggle-button-bg`, `--toggle-button-bg-hover`, `--toggle-button-bg-pressed`, `--toggle-button-fg`, their `-selected` counterparts and `--toggle-button-height`.

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

## Theme

<ApiTheme component="ToggleButton" />

## Related Components

<RelatedComponents :components="['toggle-button-group', 'button']" />
