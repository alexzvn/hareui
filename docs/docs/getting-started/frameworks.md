---
title: Frameworks
description: Integrate HeroUse with Vite, Nuxt, and other Vue-based tooling.
---

## Vite + Vue

### 1. Install Tailwind CSS v4 and HeroUse

::: code-group

```bash [npm]
npm i herouse tailwindcss @tailwindcss/vite
```

```bash [pnpm]
pnpm add herouse tailwindcss @tailwindcss/vite
```

```bash [yarn]
yarn add herouse tailwindcss @tailwindcss/vite
```

```bash [bun]
bun add herouse tailwindcss @tailwindcss/vite
```

:::

### 2. Configure Vite

```ts [vite.config.ts]
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
})
```

### 3. Import styles

```css [src/main.css]
@import "tailwindcss";
@import "herouse";
```

### 4. Mount the app

```ts [src/main.ts]
import { createApp } from 'vue'
import { createHeroUse } from 'herouse'
import App from './App.vue'
import './main.css'

createApp(App)
  .use(createHeroUse())
  .mount('#app')
```

### 5. Use your first component

```vue [src/App.vue]
<script setup lang="ts">
import { Button } from 'herouse'
</script>

<template>
  <main class="flex min-h-screen items-center justify-center">
    <Button variant="tertiary">Hello HeroUse</Button>
  </main>
</template>
```

## Nuxt

HeroUse has no Nuxt module. Register it as a plain Vue plugin and load the CSS through Nuxt's config.

### 1. Install dependencies

::: code-group

```bash [npm]
npm i herouse tailwindcss @tailwindcss/vite
```

```bash [pnpm]
pnpm add herouse tailwindcss @tailwindcss/vite
```

```bash [yarn]
yarn add herouse tailwindcss @tailwindcss/vite
```

```bash [bun]
bun add herouse tailwindcss @tailwindcss/vite
```

:::

### 2. Import styles

```css [assets/main.css]
@import "tailwindcss";
@import "herouse";
```

### 3. Register the plugin

```ts [plugins/herouse.ts]
import { createHeroUse } from 'herouse'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(createHeroUse())
})
```

### 4. Wire up Nuxt config

```ts [nuxt.config.ts]
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  css: ['~/assets/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
})
```

::: tip
The plugin step is optional, same as in Vite. Skip it unless you need `createHeroUse({ ui })` for app-wide theme overrides — see [Theming](/docs/getting-started/theming).
:::

## Other Frameworks

Unlike HeroUI, which ships a framework-agnostic `@heroui/styles` package usable from Vue, Svelte, Angular, or plain HTML, HeroUse components are Vue single-file components with [Reka UI](https://reka-ui.com) as a hard dependency. There is no standalone BEM-class stylesheet to drop into a non-Vue project — HeroUse requires Vue 3.5+.

## What's Next?

- [Quick Start](/docs/getting-started/quick-start) - Install HeroUse step by step
- [Design Principles](/docs/getting-started/design-principles) - HeroUse's API conventions
