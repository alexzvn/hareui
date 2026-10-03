<p align="center">
  <a href="https://hareui.alexzvn.me">
    <img src="https://img.shields.io/badge/docs-hareui.alexzvn.me-black?style=flat" alt="Documentation">
  </a>
  <a href="https://github.com/alexzvn/hareui/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue?style=flat" alt="License">
  </a>
  <a href="https://www.npmjs.com/package/@hareui/vue">
    <img src="https://img.shields.io/npm/v/@hareui/vue.svg?style=flat-round" alt="npm version">
  </a>
</p>

# HareUI

**Documentation: [hareui.alexzvn.me](https://hareui.alexzvn.me)**

HareUI is a Vue 3 port of [HeroUI v3](https://heroui.com). It pairs the accessible primitives of [Reka UI](https://reka-ui.com) with the utility-first styling of [Tailwind CSS v4](https://tailwindcss.com), and keeps HeroUI's design, tokens and component API.

- **Accessible by default**: keyboard, focus and screen-reader behavior come from Reka UI
- **Tailwind CSS v4**: no CSS-in-JS runtime, themeable through CSS variables
- **Same look as HeroUI**: styles and tokens are translated from HeroUI v3
- **Slot-based composition**: Vue slots and the `as` prop instead of deeply nested props
- **Zero boilerplate**: components work without a plugin or provider

## Getting Started

Requirements: [Vue 3.5+](https://vuejs.org) and [Tailwind CSS v4](https://tailwindcss.com/docs/installation/framework-guides).

```bash
npm i @hareui/vue
```

Add the styles to your main CSS file, after Tailwind:

```css
@import "tailwindcss";
@import "@hareui/vue";
```

Use components:

```vue
<script setup lang="ts">
import { Button } from '@hareui/vue'
</script>

<template>
  <Button>My Button</Button>
</template>
```

## Documentation

Visit [hareui.alexzvn.me](https://hareui.alexzvn.me) for theming, dark mode, styling, composition and every component. AI tools can read the docs as [llms.txt](https://hareui.alexzvn.me/llms.txt) or [llms-full.txt](https://hareui.alexzvn.me/llms-full.txt).

## Contributing

Issues and pull requests are welcome at [github.com/alexzvn/hareui](https://github.com/alexzvn/hareui).

## License

[MIT](./LICENSE). Styles, tokens and icons are derived from HeroUI; see [THIRD_PARTY_LICENSES.md](./packages/vue/THIRD_PARTY_LICENSES.md).
