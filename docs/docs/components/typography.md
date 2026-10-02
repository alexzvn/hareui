---
title: Typography
description: A semantic typography primitive for headings, body copy, and inline code.
links:
  source: Typography.vue
  styles: typography.ts
  heroui: typography
---

## Usage

```ts
import { Typography } from 'herouse'
```

<ComponentPreview name="typography/default" />

## Anatomy

`Typography` maps visual `type` values to semantic elements by default.

```vue
<Typography type="h1">Heading</Typography>
```

- `type` picks both the visual style and, unless `as` is set, the rendered element: `h1`–`h6` →
  `<h1>`–`<h6>`, `body`/`body-sm`/`body-xs` → `<p>`, `code` → `<code>`.
- `prose` switches to a rich-content container (`<div data-slot="prose">`): children are plain
  HTML and receive HeroUI's default typography rhythm instead of the `type` styles. `type`,
  `align`, `color`, `weight` and `truncate` are ignored in this mode.

`ui` keys: `base`, `prose`.

## Examples

### Scale

<ComponentPreview name="typography/typography-scale" />

### Primitives

<ComponentPreview name="typography/primitives" />

- `Typography.Heading level={1..6}` maps to `type="h1"` through `type="h6"`.
- `Typography.Paragraph size="base" | "sm" | "xs"` maps to `type="body"`, `"body-sm"` and `"body-xs"`.
- `Typography.Code` maps to `type="code"`.
- `Typography.Prose` maps to the `prose` prop, which styles rich content passed as regular HTML children.

### Prose

<ComponentPreview name="typography/prose" />

### Render Props

<ComponentPreview name="typography/render-props" />

Use the `as` prop when you need to customize the rendered element.

## Customization

### Tailwind CSS

<ComponentPreview name="typography/custom-styles" />

### Global theme override

Override the `typography` theme app-wide with `createHeroUse`:

```ts
app.use(createHeroUse({
  ui: {
    typography: {
      variants: {
        type: {
          h1: { base: 'font-extrabold tracking-tight' },
          code: { base: 'rounded-md bg-default-100 font-mono dark:bg-default-50/20' },
        },
      },
    },
  },
}))
```

## Styling Reference

Each rendered element carries the same `data-slot` string as HeroUI (`typography` for the
default mode, `prose` for `prose` mode), so selectors translate 1:1.

| `ui` key | `data-slot` | Description |
|---|---|---|
| `base` | `typography` | Base typography primitive |
| `prose` | `prose` | Rich prose container |

HeroUI follows [BEM](https://getbem.com/) for its modifier classes (herouse renders utilities,
not BEM classes, so style through `class`, `ui` or `createHeroUse`):

- `.typography--h1` through `.typography--h6`, `.typography--body`, `.typography--body-sm`,
  `.typography--body-xs`, `.typography--code` → the `type` prop
- `.typography--align-start`, `--align-center`, `--align-end`, `--align-justify` → the `align`
  prop
- `.typography--color-default`, `--color-muted` → the `color` prop
- `.typography--weight-normal`, `--weight-medium`, `--weight-semibold`, `--weight-bold` → the
  `weight` prop
- `.typography--truncate` → the `truncate` prop

## API Reference

### Props

<ApiTable component="Typography" kind="props" />

### Slots

<ApiTable component="Typography" kind="slots" />

## Related Components

<RelatedComponents :components="['card', 'label', 'description']" />
