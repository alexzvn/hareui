---
title: Quick Start
description: Install HeroUse and render your first Button in minutes.
---

## Requirements

- [Vue 3.5+](https://vuejs.org/)
- [Tailwind CSS v4](https://tailwindcss.com/docs/installation/framework-guides)

## Quick Install

Install HeroUse:

::: code-group

```bash [npm]
npm i herouse
```

```bash [pnpm]
pnpm add herouse
```

```bash [yarn]
yarn add herouse
```

```bash [bun]
bun add herouse
```

:::

## Import Styles

Add to your main CSS file:

```css{2}
@import "tailwindcss";
@import "herouse";
```

::: warning
Import order matters. Always import `tailwindcss` first.
:::

## Register Plugin (Optional)

HeroUse components work without any setup. Install the plugin only if you want to override themes globally with `createHeroUse`:

```ts [main.ts]
import { createApp } from 'vue'
import { createHeroUse } from 'herouse'
import App from './App.vue'
import './style.css'

createApp(App)
  .use(createHeroUse())
  .mount('#app')
```

## Use Components

```vue
<script setup lang="ts">
import { Button } from 'herouse'
</script>

<template>
  <Button>My Button</Button>
</template>
```

## What's Next?

- [Design Principles](/docs/getting-started/design-principles) - Understand HeroUse's naming and API conventions
- [Browse Components](/docs/components/button) - See available components
- [Learn Styling](/docs/getting-started/styling) - Customize with Tailwind CSS
- [Explore Composition](/docs/getting-started/composition) - Master slots and the `as` prop
