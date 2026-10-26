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

HareUI components work without any setup. Install the plugin only if you want to override themes globally or set an app-wide overlay portal target with `createHareUI`:

```ts [main.ts]
import { createHareUI } from '@hareui/vue'
import { createApp } from 'vue'

import App from './App.vue'
import './style.css'

createApp(App).use(createHareUI()).mount('#app')
```

### Portal Target

Overlays (Modal, AlertDialog, Drawer, Popover, Tooltip, Toast, ColorPicker, Dropdown and its submenus, Select, ComboBox, Autocomplete, DatePicker, DateRangePicker) portal to `document.body` by default. `portal` sets the default for all of them; a component's own `portal` prop still wins.

```ts [main.ts]
// Vue app mounted inside a shadow root (e.g. a browser extension panel)
const shadow = host.attachShadow({ mode: 'open' })
const mountPoint = document.createElement('div')
const overlays = document.createElement('div')
shadow.append(mountPoint, overlays)

createApp(App)
  .use(createHareUI({ portal: overlays }))
  .mount(mountPoint)
```

`portal` accepts `true` (`document.body`), a selector string, an element, or `false` (render in place). A selector is looked up with `document.querySelector`, so it can't find an element inside a shadow root; pass the element itself, as above.

For a shadow root, inject the compiled stylesheet into it (e.g. `import css from './main.css?inline'` into a `<style>` appended to `shadow`). The theme tokens default to the light theme on `:host` (add `dark` to the host for the dark theme), and the Tailwind custom properties that a shadow root can't register with `@property` get their initial values there too.

## Vite Plugin (Optional)

On Vite, `@hareui/vue/vite` auto-imports components in templates and can set app-wide theme overrides at build time:

```ts [vite.config.ts]
import hareui from '@hareui/vue/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss(), hareui()],
})
```

See [Frameworks](/docs/getting-started/frameworks#vite-plugin-optional) for the `prefix`, `ui` and `components` options.

## Use Components

```vue
<template>
  <Button>My Button</Button>
</template>

<script setup lang="ts">
import { Button } from '@hareui/vue'
</script>
```

## What's Next?

- [Design Principles](/docs/getting-started/design-principles) - Understand HareUI's naming and API conventions
- [Browse Components](/docs/components/button) - See available components
- [Learn Styling](/docs/getting-started/styling) - Customize with Tailwind CSS
- [Explore Composition](/docs/getting-started/composition) - Master slots and the `as` prop
