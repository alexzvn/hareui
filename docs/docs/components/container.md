---
title: Container
description: A container that centers and constrains the width of your content.
links:
  source: container/Container.vue
  styles: container/theme.ts
---

## Usage

Use the default slot to center and constrain the width of your content. It uses the same width and padding as [`Header`](/docs/components/header) and [`Footer`](/docs/components/footer), so page content lines up with them.

```ts
import { Container } from '@hareui/vue'
```

<ComponentPreview name="container/basic" />

Set the `--container-max-width` (default `64rem`) and `--container-padding` (default `1.5rem`) CSS variables on `:root` to change the width of `Container`, `Header` and `Footer` together. To widen a single container, use the `class` prop, e.g. `class="max-w-7xl"`.

## Customization

### Global theme override

Override the `container` theme app-wide with `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      container: {
        slots: { base: 'max-w-7xl' },
      },
    },
  }),
)
```

## API

### Container Props

<ApiTable component="Container" kind="props" />

### Container Slots

<ApiTable component="Container" kind="slots" />
