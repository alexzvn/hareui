---
title: Main
description: A main element that fills the available viewport height below the header.
links:
  source: main/Main.vue
  styles: main/theme.ts
---

## Usage

The `Main` component renders a `<main>` element whose minimum height is the viewport height minus `--header-height`, so short pages still push the footer to the bottom.

```ts
import { Main } from '@hareui/vue'
```

<ComponentPreview name="main/basic" minHeight="340px" />

## Examples

### Within `App.vue`

Use `Main` around your page content, below the [`Header`](/docs/components/header). Set `--header-height` to the height of your header on an ancestor such as `:root`. The variable set by `Header` itself only applies inside the header.

```vue
<template>
  <App>
    <Header />
    <Main>
      <RouterView />
    </Main>
  </App>
</template>
```

```css
:root {
  --header-height: 4rem;
}
```

`--header-height` defaults to `0px` in `Main`.

## Customization

### Global theme override

Override the `main` theme app-wide with `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      main: {
        slots: { base: 'min-h-dvh bg-surface' },
      },
    },
  }),
)
```

## API

### Main Props

<ApiTable component="Main" kind="props" />

### Main Slots

<ApiTable component="Main" kind="slots" />

## Theme

<ApiTheme component="Main" />
