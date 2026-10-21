---
title: Unreleased
description: Changes on main that are not yet published to npm.
---

Changes on `main` that will ship in the next `@hareui/vue` release.

## New

### Vite plugin

`@hareui/vue/vite` auto-imports HareUI components in templates through [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) and applies app-wide theme overrides at build time.

```ts [vite.config.ts]
import hareui from '@hareui/vue/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss(), hareui({ prefix: 'H' })],
})
```

- `prefix` lets you write `<HButton>` or `<h-button>`.
- `ui` sets theme overrides below `createHareUI({ ui })`.
- `HareUIResolver({ prefix })` plugs into an existing unplugin-vue-components setup.

See [Frameworks](/docs/getting-started/frameworks#vite-plugin-optional).
