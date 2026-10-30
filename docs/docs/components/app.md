---
title: App
description: Wraps your app to provide global configuration and the toast region.
links:
  source: app/App.vue
---

## Usage

Wrap your whole application with the `App` component. It sets the reading direction, locale and default [portal](#portal) for every component inside it, and renders a [`ToastProvider`](/docs/components/toast) so `toast()` works anywhere.

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

Use the `dir` prop to set the reading direction. With `rtl`, sliders, arrow-key navigation and popover placement are mirrored. Use the `locale` prop, a locale code such as `'en'` or `'ar'`, to set the locale used by date, number and calendar components.

<ComponentPreview name="app/direction" />

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
