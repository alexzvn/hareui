---
title: Frameworks
description: Integrate HareUI with Vite, Nuxt, and other Vue-based tooling.
---

## Vite + Vue

### 1. Install Tailwind CSS v4 and HareUI

::: code-group

```bash [npm]
npm i @hareui/vue tailwindcss @tailwindcss/vite
```

```bash [pnpm]
pnpm add @hareui/vue tailwindcss @tailwindcss/vite
```

```bash [yarn]
yarn add @hareui/vue tailwindcss @tailwindcss/vite
```

```bash [bun]
bun add @hareui/vue tailwindcss @tailwindcss/vite
```

:::

### 2. Configure Vite

```ts [vite.config.ts]
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
})
```

### 3. Import styles

```css [src/main.css]
@import 'tailwindcss';
@import '@hareui/vue';
```

### 4. Mount the app

```ts [src/main.ts]
import { createHareUI } from '@hareui/vue'
import { createApp } from 'vue'

import App from './App.vue'
import './main.css'

createApp(App).use(createHareUI()).mount('#app')
```

### 5. Use your first component

```vue [src/App.vue]
<template>
  <main class="flex min-h-screen items-center justify-center">
    <Button variant="tertiary">Hello HareUI</Button>
  </main>
</template>

<script setup lang="ts">
import { Button } from '@hareui/vue'
</script>
```

### Vite plugin (optional)

`@hareui/vue/vite` auto-imports HareUI components in templates through [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) and applies app-wide theme overrides at build time. With it, you can drop the `import { Button } from '@hareui/vue'` lines.

```ts [vite.config.ts]
import hareui from '@hareui/vue/vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    hareui({
      prefix: 'H', // <HButton> / <h-button>; default '' keeps <Button>
      ui: { button: { slots: { base: 'uppercase' }, defaultVariants: { size: 'lg' } } },
    }),
  ],
})
```

`hareui` is both the default and a named export.

| Option       | Type                                       | Default | Description                                                                                                                                                                                                       |
| ------------ | ------------------------------------------ | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `prefix`     | `string`                                   | `''`    | Template prefix for HareUI components. `'H'` resolves `<HButton>` and `<h-button>` to `Button`. Kebab-case (`'h-'`) is accepted.                                                                                  |
| `ui`         | same as `createHareUI({ ui })`             | —       | App-wide theme overrides, inlined at build time, so values must be JSON-serializable. Applied above the theme files and below `createHareUI({ ui })`. See [Precedence](/docs/getting-started/theming#precedence). |
| `components` | unplugin-vue-components options \| `false` | `{}`    | Forwarded to unplugin-vue-components (`dts`, `dirs`, extra `resolvers`, …); the HareUI resolver is appended to `resolvers`. `false` turns auto import off.                                                        |

Already registering unplugin-vue-components yourself? Add `HareUIResolver` to its `resolvers` instead:

```ts [vite.config.ts]
import { HareUIResolver } from '@hareui/vue/vite'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss(), Components({ resolvers: [HareUIResolver({ prefix: 'H' })] })],
})
```

## Nuxt

HareUI has no Nuxt module. Register it as a plain Vue plugin and load the CSS through Nuxt's config.

### 1. Install dependencies

::: code-group

```bash [npm]
npm i @hareui/vue tailwindcss @tailwindcss/vite
```

```bash [pnpm]
pnpm add @hareui/vue tailwindcss @tailwindcss/vite
```

```bash [yarn]
yarn add @hareui/vue tailwindcss @tailwindcss/vite
```

```bash [bun]
bun add @hareui/vue tailwindcss @tailwindcss/vite
```

:::

### 2. Import styles

```css [assets/main.css]
@import 'tailwindcss';
@import '@hareui/vue';
```

### 3. Register the plugin

```ts [plugins/hareui.ts]
import { createHareUI } from '@hareui/vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(createHareUI())
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
The plugin step is optional, same as in Vite. Skip it unless you need `createHareUI({ ui })` for app-wide theme overrides — see [Theming](/docs/getting-started/theming).
:::

## Other Frameworks

Unlike HeroUI, which ships a framework-agnostic `@heroui/styles` package usable from Vue, Svelte, Angular, or plain HTML, HareUI components are Vue single-file components with [Reka UI](https://reka-ui.com) as a hard dependency. There is no standalone BEM-class stylesheet to drop into a non-Vue project — HareUI requires Vue 3.5+.

## Next Steps

- [Quick Start](/docs/getting-started/quick-start) - The fastest setup path
- [Theming](/docs/getting-started/theming) - Customize colors and tokens
- [Composition](/docs/getting-started/composition) - Slots, scoped slot props, and the `as` prop
- [Components](/docs/components/button) - Explore all available components
