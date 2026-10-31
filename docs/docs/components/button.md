---
title: Button
description: A clickable button component with multiple variants and states
links:
  source: button/Button.vue
  styles: button/theme.ts
  heroui: button
---

## Usage

```ts
import { Button } from '@hareui/vue'
```

<ComponentPreview name="button/basic" />

## Anatomy

Button is a single component — no compound parts. Content is composed through named
slots, or through the `label`, `leadingIcon`, `trailingIcon` and `avatar` props (a slot wins over its prop).

```vue
<Button>
  <template #leading />
  Label
  <template #trailing />
</Button>
```

`ui` keys: `base`, `spinner`, `label`, `leadingIcon`, `trailingIcon`, `avatar`.

## Examples

### Variants

<ComponentPreview name="button/variants" />

### Sizes

<ComponentPreview name="button/sizes" />

### With Icons

<ComponentPreview name="button/with-icons" />

### Icon Only

<ComponentPreview name="button/icon-only" />

### Label and Icon Props

Pass `label` for the text, and `leadingIcon`, `trailingIcon` or `avatar` for what sits around it. A slot wins over its
prop. A button with an icon or avatar but no label is square, like `iconOnly`; give it an `aria-label`.

An icon can be a component or a CSS class string. A class string only shows an icon when your app has a CSS icon
plugin, such as `@iconify/tailwind4` (`icon-[lucide--x]`) or UnoCSS `presetIcons` (`i-lucide-x`). Iconify names such
as `lucide:x` don't work as strings; pass an `Icon` component for those.

<ComponentPreview name="button/label-and-icons" />

### Loading

<ComponentPreview name="button/loading" />

### Loading State

<ComponentPreview name="button/loading-state" />

### Automatic Loading

With `loadingAuto`, the button shows a spinner and ignores clicks while the promise returned by its `@click` handler
runs. A `type="submit"` button inside a `Form` also waits for the form's `@submit` handler.

<ComponentPreview name="button/loading-auto" />

### As a Link

Give the button `to` or `href` and it renders a link. With vue-router installed, an internal `to` goes through
`RouterLink`; anything else renders a plain `<a>`. A disabled link has no `href` and can't be focused.

The button takes the same link props as [`Link`](./link#link-props):

| Prop            | What it does                                                    |
| --------------- | --------------------------------------------------------------- |
| `target`, `rel` | As on `<a>`; `target="_blank"` adds `rel="noopener noreferrer"` |
| `download`      | Downloads the file instead of opening it                        |
| `external`      | Skips `RouterLink` for `to`                                     |
| `replace`       | Replaces the history entry instead of pushing one               |
| `exact`         | Marks the link active only on the exact route                   |
| `active`        | Sets the active state yourself; `[data-active=true]` marks it   |

<ComponentPreview name="button/as-link" />

### Full Width

<ComponentPreview name="button/full-width" />

### Disabled State

<ComponentPreview name="button/disabled" />

### Social Buttons

<ComponentPreview name="button/social" />

### Render Function

<ComponentPreview name="button/render-function" />

### Adding custom variants

You can extend HareUI's `button` theme by wrapping it with the `tv` extension mechanism,
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

Override the `button` theme app-wide with `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      button: {
        slots: { base: 'rounded-md' },
        defaultVariants: { variant: 'secondary' },
      },
    },
  }),
)
```

## Styling Reference

Each rendered element carries a `data-slot` attribute, so you can target it with selectors.

| `ui` key       | `data-slot`            | Description                                        |
| -------------- | ---------------------- | -------------------------------------------------- |
| `base`         | `button`               | The root `<button>` / `as` element (`<a>` as link) |
| `spinner`      | `spinner`              | The auto-rendered pending spinner                  |
| `label`        | `button-label`         | The `label` prop's text                            |
| `leadingIcon`  | `button-leading-icon`  | The `leadingIcon` prop's icon                      |
| `trailingIcon` | `button-trailing-icon` | The `trailingIcon` prop's icon                     |
| `avatar`       | `button-avatar`        | The `avatar` prop's `Avatar`                       |

### Interactive states

- **Hover**: `:hover` / `[data-hovered=true]`
- **Active/Pressed**: `:active`
- **Focus**: `:focus-visible`
- **Disabled**: `:disabled` / `[aria-disabled=true]`
- **Pending**: `[data-pending=true]` — renders a `Spinner` in the leading slot, blocks `@click`, stays focusable
- **Current route** (link): `[data-active=true]`

## API Reference

### Props

<ApiTable component="Button" kind="props" />

### Slots

<ApiTable component="Button" kind="slots" />

## Theme

<ApiTheme component="Button" />

## Related Components

<RelatedComponents :components="['spinner', 'close-button']" />
