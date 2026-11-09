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

### CSS Classes

HareUI follows the [BEM](https://getbem.com/) methodology to keep component variants and states reusable and easy to customize. The ToggleButton component uses these CSS classes ([View source styles](https://github.com/alexzvn/hareui/blob/main/packages/vue/src/components/toggle-button/toggle-button.css)):

#### Base & Size Classes

- `.h-toggle-button` - Base toggle button styles
- `.h-toggle-button--sm` - Small size variant
- `.h-toggle-button--lg` - Large size variant

#### Variant Classes

- `.h-toggle-button--ghost` - Ghost variant with transparent background

#### Modifier Classes

- `.h-toggle-button--icon-only` - Icon-only toggle button

The default `md` size and `default` variant add no class.

The classes sit in `@layer components`, so a utility you pass through `class` or `ui` wins over them.

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
