---
title: Quick Start
description: Install HareUI and render your first Button in minutes.
---

## Requirements

- [Vue 3.5+](https://vuejs.org/)
- [Tailwind CSS v4](https://tailwindcss.com/docs/installation/framework-guides)

## Quick Install

Install HareUI:

::: code-group

```bash [npm]
npm i @hareui/vue
```

```bash [pnpm]
pnpm add @hareui/vue
```

```bash [yarn]
yarn add @hareui/vue
```

```bash [bun]
bun add @hareui/vue
```

:::

## Import Styles

Add to your main CSS file:

```css{2}
@import "tailwindcss";
@import "@hareui/vue";
```

::: warning
Import order matters. Always import `tailwindcss` first.
:::

## Register Plugin (Optional)

HareUI components work without any setup. Install the plugin only if you want to override themes globally with `createHareUI`:

```ts [main.ts]
import { createApp } from 'vue'
import { createHareUI } from '@hareui/vue'
import App from './App.vue'
import './style.css'

createApp(App)
  .use(createHareUI())
  .mount('#app')
```

## Use Components

```vue
<script setup lang="ts">
import { Button } from '@hareui/vue'
</script>

<template>
  <Button>My Button</Button>
</template>
```

## What's Next?

- [Design Principles](/docs/getting-started/design-principles) - Understand HareUI's naming and API conventions
- [Browse Components](/docs/components/button) - See available components
- [Learn Styling](/docs/getting-started/styling) - Customize with Tailwind CSS
- [Explore Composition](/docs/getting-started/composition) - Master slots and the `as` prop
