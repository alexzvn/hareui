---
title: App
description: Wraps your app to provide global configuration and the toast region.
links:
  source: app/App.vue
---

## Usage

Wrap your whole application with the `App` component. It sets the reading direction, locale and default [portal](#portal) for every component inside it, renders a [`ToastProvider`](/docs/components/toast) so `toast()` works anywhere, and renders the overlays opened with [`useOverlay()`](/docs/getting-started/overlays).

```ts
import { App } from '@hareui/vue'
```

```vue
<template>
  <App>
    <RouterView />
  </App>
</template>
```

<ComponentPreview name="app/basic" />

## Anatomy

```vue
<App dir="ltr" locale="en" portal :toaster="{ placement: 'bottom end' }">
  <!-- your application -->
</App>
```

## Examples

### Toaster

Use the `toaster` prop to pass props to the toast region, such as its `placement`. Set it to `null` when you render your own `ToastProvider`.

<ComponentPreview name="app/toaster" />

### Direction

Set `dir="rtl"` to mirror sliders, arrow-key navigation and popover placement. `App` renders no element of its own, so
also set `dir="rtl"` on `<html>` (or on an element around the app). That mirrors the layout, icons and portalled
overlays too.

<ComponentPreview name="app/direction" />

### Locale

`locale` translates the built-in labels, such as close buttons, pagination and screen-reader names.
`@hareui/vue/locale` ships a catalog per language. Import one and pass it in:

<ComponentPreview name="app/locale" />

A catalog also sets:

- date and number formatting, from its `code`
- the reading direction, from its `dir`, unless you set `dir` yourself

Labels a catalog doesn't cover fall back to English. A label prop on a component, such as `openLabel` on `Header`,
still wins over the locale. A plain code string such as `locale="de"` only sets date and number formatting and keeps
the English labels.

::: details Available catalogs
`en` (English), `ar` (العربية), `az` (Azərbaycanca), `be` (Беларуская), `bg` (Български), `bn` (বাংলা), `ca` (Català), `ckb` (کوردی), `cs` (Čeština), `da` (Dansk), `de` (Deutsch), `de_at` (Deutsch (Österreich)), `de_ch` (Schweizer Hochdeutsch), `el` (Ελληνικά), `en_gb` (English (United Kingdom)), `es` (Español), `et` (Eesti), `eu` (Euskara), `fa_ir` (فارسی), `fi` (Suomi), `fr` (Français), `gl` (Galego), `he` (עברית), `hi` (हिन्दी), `hr` (Hrvatski), `hu` (Magyar), `hy` (Հայերեն), `id` (Bahasa Indonesia), `is` (Íslenska), `it` (Italiano), `ja` (日本語), `ka` (ქართული), `kk` (Қазақша), `km` (ភាសាខ្មែរ), `ko` (한국어), `ky` (Кыргызча), `lb` (Lëtzebuergesch), `lo` (ລາວ), `lt` (Lietuvių), `lv` (Latviešu), `mn` (Монгол), `ms` (Melayu), `nb_no` (Norsk Bokmål), `nl` (Nederlands), `pl` (Polski), `pt` (Português), `pt_br` (Português (Brasil)), `ro` (Română), `ru` (Русский), `sk` (Slovenčina), `sl` (Slovenščina), `sq` (Shqip), `sv` (Svenska), `tg` (Тоҷикӣ), `th` (ไทย), `tr` (Türkçe), `ug_cn` (ئۇيغۇرچە), `uk` (Українська), `ur` (اردو), `uz` (Oʻzbek), `vi` (Tiếng Việt), `zh_cn` (简体中文), `zh_tw` (繁體中文).

Right-to-left catalogs: `ar`, `ckb`, `fa_ir`, `he`, `ug_cn`, `ur`.
:::

#### Your Own Locale

`defineLocale()` builds a locale from a name, a code and the labels you want to translate:

```vue
<template>
  <App :locale="fr">
    <RouterView />
  </App>
</template>

<script setup lang="ts">
import { App, defineLocale } from '@hareui/vue'

const fr = defineLocale({
  name: 'Français',
  code: 'fr',
  messages: {
    modal: { close: 'Fermer' },
    pagination: { prev: 'Page précédente', next: 'Page suivante' },
  },
})
</script>
```

To change a few labels of a shipped catalog, spread it:

```ts
import { defineLocale } from '@hareui/vue'
import { fr } from '@hareui/vue/locale'

const myFr = defineLocale({ ...fr, messages: { ...fr.messages, toc: { title: 'Sommaire' } } })
```

#### Document Language

`App` can't set attributes on `<html>`. Set `lang` there yourself (screen readers pick their voice from it), and `dir`
as well:

```ts
document.documentElement.lang = locale.code
document.documentElement.dir = locale.dir
```

### Portal

Use the `portal` prop to choose where overlays such as `Modal`, `Drawer`, `Popover` and `Tooltip` are rendered. It defaults to `true` (`document.body`); pass a selector or an element to render them there, or `false` to render them in place. An overlay's own `portal` prop takes precedence.

When the target is a container rather than the page, give it `position: relative` and size the overlay to it, e.g. `:ui="{ backdrop: 'absolute h-full', container: 'h-full' }"` on a `Modal`, which fills the viewport by default.

<ComponentPreview name="app/portal" />

## API

### App Props

<ApiTable component="App" kind="props" />

### App Slots

<ApiTable component="App" kind="slots" />

## Theme

`App` renders no element of its own, so it has no theme. Style the components inside it through their own `ui` and `class` props.
