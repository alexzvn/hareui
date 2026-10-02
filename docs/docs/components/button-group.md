---
title: ButtonGroup
description: Group related buttons together with consistent styling and spacing
links:
  source: ButtonGroup.vue
  styles: buttonGroup.ts
  heroui: button-group
---

## Usage

```ts
import { Button, ButtonGroup } from 'herouse'
```

<ComponentPreview name="button-group/basic" />

## Anatomy

```vue
<template>
  <ButtonGroup separator>
    <Button>First</Button>
    <Button>Second</Button>
    <Button>Third</Button>
  </ButtonGroup>
</template>
```

> **ButtonGroup** wraps multiple Button components together, applying consistent styling, spacing, and automatic border radius handling. It passes `size`, `variant`, `disabled` and `fullWidth` to its Buttons through provide/inject.

HeroUI's `ButtonGroup.Separator`, placed inside each Button except the first, becomes the `separator` prop:
every Button in the group renders the divider and the first Button hides it.

`ui` keys: `base`, `separator`, plus `button` and `buttonOutline`, which are classes added to each grouped
Button (`buttonOutline` only to `variant="outline"` Buttons).

## Examples

### Variants

<ComponentPreview name="button-group/variants" />

### Sizes

<ComponentPreview name="button-group/sizes" />

### Orientation

Use the `orientation` prop to arrange buttons horizontally or vertically.

<ComponentPreview name="button-group/orientation" />

### With Icons

<ComponentPreview name="button-group/with-icons" />

### Full Width

<ComponentPreview name="button-group/full-width" />

### Disabled State

<ComponentPreview name="button-group/disabled" />

### Without Separator

Simply omit the `separator` prop.

<ComponentPreview name="button-group/without-separator" />

## Customization

### Tailwind CSS

<ComponentPreview name="button-group/custom-styles" />

### Global theme override

Override the `buttonGroup` theme app-wide with `createHeroUse`:

```ts
app.use(createHeroUse({
  ui: {
    buttonGroup: {
      slots: { base: 'gap-2 rounded-lg', separator: 'opacity-25' },
    },
  },
}))
```

## Styling Reference

Each rendered element carries the same `data-slot` string as HeroUI, so selectors translate 1:1.

| `ui` key | `data-slot` | Description |
|---|---|---|
| `base` | `button-group` | Base button group container |
| `separator` | `button-group-separator` | Separator element between buttons |
| `button` | `button` | Classes added to each grouped Button |
| `buttonOutline` | `button` | Classes added to each grouped outline Button |

The ButtonGroup component automatically applies border radius to buttons:

- First button gets rounded left/start edge
- Last button gets rounded right/end edge
- Middle buttons have no border radius
- Single button gets full border radius on all edges

The edge radii are set through CSS variables, so a `rounded-*` class on a Button replaces them.

## API Reference

### Props

<ApiTable component="ButtonGroup" kind="props" />

### Slots

<ApiTable component="ButtonGroup" kind="slots" />

## Note

- ButtonGroup passes `size`, `variant`, `disabled` and `fullWidth` to its Button components
- **Only the group's own buttons receive the ButtonGroup props.** A Button nested inside another Button does not inherit them. Unlike HeroUI, a Button rendered by a component in the group's slot (a Dropdown trigger, for example) does inherit them
- Individual Button components can override the group's `disabled` prop by setting `:disabled="false"`
- The component automatically handles border radius between buttons
- Buttons in a group have their active/pressed scale transform removed for a more cohesive appearance

## Related Components

- [Button](/docs/components/button)
- [ToggleButtonGroup](/docs/components/toggle-button-group)
