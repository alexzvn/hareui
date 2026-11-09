---
title: Header
description: A responsive header component.
links:
  source: header/Header.vue
  styles: header/theme.ts
---

## Usage

```ts
import { Header } from '@hareui/vue'
```

The `Header` component renders a sticky `<header>` element. Fill the bar with these slots:

- `left`: the title link
- `default`: the navigation, centered from the `lg` breakpoint
- `right`: actions

On mobile, the `body` slot fills the menu. The `content` slot replaces the whole menu. Add `class="border-b border-separator"` to separate the header from the page.

<ComponentPreview name="header/basic" contain="18rem" />

::: tip
Below the `lg` breakpoint, the default slot is hidden and a toggle button opens the menu. Use the `breakpoint` prop to change it.
:::

## Anatomy

```vue
<Header title="HareUI" to="/" mode="modal" toggle-side="right" hide-on-scroll>
  <template #title /> <!-- optional: logo inside the title link -->
  <template #left /> <!-- optional: replaces the title link -->
  <!-- default slot: centered navigation, from the breakpoint up -->
  <template #right /> <!-- optional: actions; the toggle follows it when toggle-side="right" -->
  <template #toggle="{ open, toggle, ui }" /> <!-- optional: replaces the toggle button -->
  <template #top /> <!-- optional: above the bar -->
  <template #bottom /> <!-- optional: below the bar -->
  <template #body /> <!-- the menu body, under the menu's own header -->
  <template #content="{ close }" /> <!-- optional: replaces the whole menu content -->
</Header>
```

The toggle and the menu are rendered only when the `body` or `content` slot is used. Use `v-model:open` to control the menu.

## Examples

### Title

Use the `title` prop to change the title of the header. When you put a logo in the `title` slot, the `title` prop remains the link's accessible name.

<ComponentPreview name="header/title" minHeight="200px" />

### To

Use the `to` prop to change the link of the title. Defaults to `/`. Use the `left` slot to replace the link entirely.

<ComponentPreview name="header/to" minHeight="200px" />

### Mode

Use the `mode` prop to change how the menu opens on mobile. It takes `modal` (default), `slideover` or `drawer`.

Use the `menu` prop to pass props to the underlying component. For example, `:menu="{ placement: 'left' }"` opens the slideover from the left.

<ComponentPreview name="header/mode" contain="18rem" />

### Toggle

Use the `toggle` prop to customize the toggle button. It accepts any [`Button`](/docs/components/button) prop. Set it to `false` to hide it.

<ComponentPreview name="header/toggle" contain="18rem" device="mobile" />

### Toggle Side

Use the `toggle-side` prop to place the toggle button on the `left` or `right` (default) of the header.

<ComponentPreview name="header/toggle-side" contain="18rem" device="mobile" />

### Animated Toggle

Use the `toggle` slot to render your own button. It receives `open`, `toggle` and `ui`.

<ComponentPreview name="header/animated-toggle" contain="18rem" device="mobile" />

### Docs Site

A documentation site header with navigation next to the logo, a search button and a theme switcher.

<ComponentPreview name="header/docs-site" contain="18rem" />

### With Dropdowns

An app header with a team switcher and a user menu built with [`Dropdown`](/docs/components/dropdown).

<ComponentPreview name="header/with-dropdowns" contain="18rem" />

### Hide On Scroll

Use the `hide-on-scroll` prop to hide the header when scrolling down and show it again when scrolling up. It stays visible while its menu is open or it has focus. Use the `scroll-target` prop to watch a container other than the nearest scrollable ancestor, and `v-model:hidden` to read or set the state.

<ComponentPreview name="header/hide-on-scroll" contain="20rem" />

### Compact

Use the `height` prop to change the height of the header. Defaults to `4rem`.

<ComponentPreview name="header/compact" contain="18rem" />

### Within an app layout

```vue
<template>
  <Header hide-on-scroll>
    <template #title><Logo class="h-6 w-auto" /></template>

    <NavigationMenu :items="items" />

    <template #right>
      <Button aria-label="GitHub" icon-only variant="ghost">…</Button>
    </template>

    <template #body>
      <NavigationMenu :items="items" orientation="vertical" />
    </template>
  </Header>

  <main><slot /></main>

  <Footer>…</Footer>
</template>

<script setup lang="ts">
import { Button, Footer, Header, NavigationMenu } from '@hareui/vue'

const items = [
  { label: 'Docs', href: '/docs', active: true },
  { label: 'Components', href: '/components' },
]
</script>
```

## Customization

### Tailwind CSS

```vue
<Header :ui="{ root: 'bg-transparent', container: 'max-w-7xl', title: 'text-accent' }" />
```

### Global theme override

```ts
import { createHareUI } from '@hareui/vue'

app.use(
  createHareUI({
    ui: {
      header: {
        slots: { root: 'bg-surface' },
        defaultVariants: { breakpoint: 'md' },
      },
    },
  }),
)
```

## Styling Reference

| `ui` key     | `data-slot`                          | Element                                                                                                                                  |
| ------------ | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `root`       | `header`                             | The `<header>`; `class` merges here. `data-hidden="true"` while hidden by `hideOnScroll`, `data-menu-open="true"` while the menu is open |
| `container`  | `header-container`                   | Width-limited flex row (same width as `Container`)                                                                                       |
| `left`       | `header-left`                        | Start area (title, and the toggle when `toggle-side="left"`)                                                                             |
| `title`      | `header-title`                       | The title link                                                                                                                           |
| `center`     | `header-center`                      | The default slot, shown from the breakpoint up                                                                                           |
| `right`      | `header-right`                       | End area (actions, and the toggle when `toggle-side="right"`)                                                                            |
| `toggle`     | `header-toggle`                      | The toggle button                                                                                                                        |
| `toggleIcon` | `header-toggle-icon`                 | The animated hamburger icon (`data-open`)                                                                                                |
| `overlay`    | `modal-backdrop` / `drawer-backdrop` | Backdrop of the menu (drops it from the breakpoint up)                                                                                   |
| `content`    | `modal-dialog` / `drawer-dialog`     | Panel of the menu                                                                                                                        |
| `header`     | `header-menu-header`                 | The menu's own header row (title and toggle), `modal` and `slideover` only                                                               |
| `body`       | `header-menu-body`                   | The scrollable menu body                                                                                                                 |

The `--header-height` CSS variable holds the height of the header. While the menu is open, its position is exposed in these variables:

- `--header-menu-top`
- `--header-menu-left`
- `--header-menu-width`
- `--header-menu-height`

### CSS Classes

HareUI follows the [BEM](https://getbem.com/) methodology to keep component variants and states reusable and easy to customize. The Header component uses these CSS classes ([View source styles](https://github.com/alexzvn/hareui/blob/main/packages/vue/src/components/header/header.css)):

#### Base Classes

- `.h-header` - The sticky bar; slides out while `data-hidden="true"`

#### Element Classes

- `.h-header__container` - Width-limited flex row
- `.h-header__left` - Start area
- `.h-header__center` - Center area (the default slot)
- `.h-header__right` - End area
- `.h-header__title` - The title link
- `.h-header__toggle` - The toggle Button
- `.h-header__toggle-icon` - The animated hamburger icon
- `.h-header__menu-header` - The menu's own header row
- `.h-header__menu-body` - The scrollable menu body

#### Breakpoint Classes

- `.h-header__left--sm` - Grows to fill the row from `sm` up
- `.h-header__left--md` - Grows to fill the row from `md` up
- `.h-header__left--lg` - Grows to fill the row from `lg` up
- `.h-header__left--xl` - Grows to fill the row from `xl` up
- `.h-header__right--sm` - Grows to fill the row from `sm` up
- `.h-header__right--md` - Grows to fill the row from `md` up
- `.h-header__right--lg` - Grows to fill the row from `lg` up
- `.h-header__right--xl` - Grows to fill the row from `xl` up
- `.h-header__center--sm` - Hidden below `sm`
- `.h-header__center--md` - Hidden below `md`
- `.h-header__center--lg` - Hidden below `lg`
- `.h-header__center--xl` - Hidden below `xl`
- `.h-header__toggle--sm` - Hidden from `sm` up
- `.h-header__toggle--md` - Hidden from `md` up
- `.h-header__toggle--lg` - Hidden from `lg` up
- `.h-header__toggle--xl` - Hidden from `xl` up
- `.h-header__center--none` - Hidden at every width (`breakpoint="none"`)

#### Modifier Classes

- `.h-header__toggle--left` - Pulls the toggle toward the start edge
- `.h-header__toggle--right` - Pulls the toggle toward the end edge
- `.h-header__menu-body--drawer` - Extra top padding in `drawer` mode

The menu's `overlay` and `content` classes are utilities, not CSS classes: they go to the Modal or Drawer through its `ui`.

The classes sit in `@layer components`, so a utility you pass through `class` or `ui` wins over them.

## API Reference

### Props

<ApiTable component="Header" kind="props" />

### Slots

<ApiTable component="Header" kind="slots" />

### Emits

<ApiTable component="Header" kind="emits" />

## Theme

<ApiTheme component="Header" />

## Accessibility

- The toggle has `aria-expanded`. Its `aria-label` switches between the `open-label` and `close-label` props.
- The menu is a dialog: focus is trapped while it is open, Escape closes it and focus returns to the toggle.
  `menu-title` names the dialog.
- The title link's `aria-label` is the `title` prop.
- The bar reveals itself when it receives keyboard focus, and the slide transition is disabled for `prefers-reduced-motion`.

## Routing

With vue-router installed, a `to` starting with `/` renders a `RouterLink` and the menu closes when the route changes. Without a router, `to` is a plain link and the menu closes when a link inside it is clicked. `mode="slideover"` renders a [`Drawer`](/docs/components/drawer) from the right.
