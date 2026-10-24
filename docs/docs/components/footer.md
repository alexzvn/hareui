---
title: Footer
description: A responsive footer component.
links:
  source: footer/Footer.vue
  styles: footer/theme.ts
---

## Usage

```ts
import { Footer } from '@hareui/vue'
```

The `Footer` component renders a `<footer>` element. Use the `left`, `default` and `right` slots to customize it.

<ComponentPreview name="footer/basic" minHeight="140px" />

## Anatomy

```vue
<Footer>
  <template #top /> <!-- optional: full-width area above the bar (only rendered when used) -->
  <template #left /> <!-- optional: start on large screens, e.g. copyright -->
  <!-- default slot: centered content, e.g. links -->
  <template #right /> <!-- optional: end on large screens, e.g. social buttons -->
  <template #bottom /> <!-- optional: full-width area below the bar (only rendered when used) -->
</Footer>
```

On mobile, the slots stack in the order right, default, left.

## Examples

### Top and Bottom

Use the `top` and `bottom` slots to add full-width content above or below the footer, such as link columns. Wrap it in a [`Container`](/docs/components/container) to align it with the footer.

<ComponentPreview name="footer/top-and-bottom" minHeight="340px" />

## Customization

### Tailwind CSS

```vue
<Footer :ui="{ root: 'border-t-0 bg-surface', container: 'lg:py-8' }" />
```

### Global theme override

```ts
import { createHareUI } from '@hareui/vue'

app.use(
  createHareUI({
    ui: { footer: { slots: { root: 'border-t border-border' } } },
  }),
)
```

## Styling Reference

| `ui` key    | `data-slot`        | Element                                                                     |
| ----------- | ------------------ | --------------------------------------------------------------------------- |
| `root`      | `footer`           | The `<footer>`; `class` merges here                                         |
| `top`       | `footer-top`       | Full-width area above the bar, rendered when `#top` is used                 |
| `container` | `footer-container` | Width-limited bar (`--container-max-width`, same as Header and `Container`) |
| `left`      | `footer-left`      | The `#left` slot                                                            |
| `center`    | `footer-center`    | The default slot                                                            |
| `right`     | `footer-right`     | The `#right` slot                                                           |
| `bottom`    | `footer-bottom`    | Full-width area below the bar, rendered when `#bottom` is used              |

## API Reference

### Props

<ApiTable component="Footer" kind="props" />

### Slots

<ApiTable component="Footer" kind="slots" />

### Theme

<ApiTheme component="Footer" />
