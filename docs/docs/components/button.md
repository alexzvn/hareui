---
title: Button
description: A clickable button component with multiple variants and states
links:
  source: Button.vue
  styles: button.ts
  heroui: button
---

## Usage

```ts
import { Button } from 'herouse'
```

<ComponentPreview name="button/basic" />

## Anatomy

Button is a single component — no compound parts. Content is composed through named
slots instead of HeroUI's render-prop children.

```vue
<Button>
  <template #leading />
  Label
  <template #trailing />
</Button>
```

`ui` keys: `base`, `spinner`.

## Examples

### Variants

<ComponentPreview name="button/variants" />

### Sizes

<ComponentPreview name="button/sizes" />

### With Icons

<ComponentPreview name="button/with-icons" />

### Icon Only

<ComponentPreview name="button/icon-only" />

### Loading

<ComponentPreview name="button/loading" />

### Loading State

<ComponentPreview name="button/loading-state" />

### Full Width

<ComponentPreview name="button/full-width" />

### Disabled State

<ComponentPreview name="button/disabled" />

### Social Buttons

<ComponentPreview name="button/social" />

### Render Function

<ComponentPreview name="button/render-function" />

### Adding custom variants

You can extend herouse's `button` theme by wrapping it with the `tv` extension mechanism,
the same pattern used internally by every component theme.

<ComponentPreview name="button/custom-variants" />

### Adding Ripple Effect

The Button component supports ripple effects through composition, allowing you to nest ripple components as children. This example uses a Vue port of [m3-ripple](https://github.com/saltyaom/m3-ripple).

<ComponentPreview name="button/ripple-effect" />

## Customization

### Tailwind CSS

Use the `class` prop to merge classes onto the root element (tailwind-merge resolves conflicts):

<ComponentPreview name="button/custom-styles" />

### Global theme override

Override the `button` theme app-wide with `createHeroUse`:

```ts
app.use(createHeroUse({
  ui: {
    button: {
      slots: { base: 'rounded-md' },
      defaultVariants: { variant: 'secondary' },
    },
  },
}))
```

## Styling Reference

Each rendered element carries the same `data-slot` string as HeroUI, so selectors translate 1:1.

| `ui` key | `data-slot` | Description |
|---|---|---|
| `base` | `button` | The root `<button>` / `as` element |
| `spinner` | `spinner` | The auto-rendered pending spinner |

### Interactive states

- **Hover**: `:hover` / `[data-hovered=true]`
- **Active/Pressed**: `:active`
- **Focus**: `:focus-visible`
- **Disabled**: `:disabled` / `[aria-disabled=true]`
- **Pending**: `[data-pending=true]` — renders a `Spinner` in the leading slot, blocks `@click`, stays focusable

## API Reference

### Props

<ApiTable component="Button" kind="props" />

### Slots

<ApiTable component="Button" kind="slots" />

## Related Components

- [Spinner](/docs/components/spinner) — rendered automatically inside a pending Button
- [CloseButton](/docs/components/close-button)
