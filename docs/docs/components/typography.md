---
title: Typography
description: A semantic typography primitive for headings, body copy, and inline code.
links:
  source: typography/Typography.vue
  styles: typography/theme.ts
  heroui: typography
---

## Usage

```ts
import { Typography } from '@hareui/vue'
```

<ComponentPreview name="typography/default" />

## Anatomy

`Typography` maps visual `type` values to semantic elements by default.

```vue
<Typography type="h1">Heading</Typography>
```

- `type` picks the visual style. Unless `as` is set, it also picks the rendered element:
  - `h1`–`h6` render `<h1>`–`<h6>`.
  - `body`, `body-sm` and `body-xs` render `<p>`.
  - `code` renders `<code>`.
- `prose` turns the component into a rich-content container, `<div data-slot="prose">`. Its children are plain
  HTML and get a default typography rhythm instead of the `type` styles.
  In this mode, `type`, `align` and `color` are ignored. So are `weight` and `truncate`.

## Examples

### Scale

<ComponentPreview name="typography/typography-scale" />

### Primitives

<ComponentPreview name="typography/primitives" />

- `Typography.Heading` maps `level={1..6}` to `type="h1"` through `type="h6"`.
- `Typography.Paragraph` maps `size="base" | "sm" | "xs"` to body text styles.
  These are `type="body"`, `"body-sm"` and `"body-xs"`.
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

Override the `typography` theme app-wide with `createHareUI`:

```ts
app.use(
  createHareUI({
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
  }),
)
```

## Styling Reference

Each rendered element carries a `data-slot` attribute (`typography` for the
default mode, `prose` for `prose` mode) you can target in selectors.

| `ui` key | `data-slot`  | Description               |
| -------- | ------------ | ------------------------- |
| `base`   | `typography` | Base typography primitive |
| `prose`  | `prose`      | Rich prose container      |

## API Reference

### Props

<ApiTable component="Typography" kind="props" />

### Slots

<ApiTable component="Typography" kind="slots" />

## Theme

<ApiTheme component="Typography" />

## Related Components

<RelatedComponents :components="['card', 'label', 'description']" />
