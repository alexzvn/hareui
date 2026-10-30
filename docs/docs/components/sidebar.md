---
title: Sidebar
description: A collapsible side panel that pushes the page content and opens as a slideover, drawer or modal on mobile.
links:
  source: sidebar/Sidebar.vue
  styles: sidebar/theme.ts
---

## Usage

Place the Sidebar next to your page content inside a flex container. Use the `header`, `default` and `footer` slots to fill it. `v-model:open` follows the viewport: on desktop it expands and collapses the sidebar, and below the `md` breakpoint it opens and closes the same content as a menu.

```ts
import { Sidebar } from '@hareui/vue'
```

<ComponentPreview name="sidebar/basic" contain="32rem" />

## Anatomy

```vue
<div class="flex min-h-svh">
  <Sidebar v-model:open="isOpen">
    <template #header="{ state, open, close }" />  <!-- optional: replaces title, description, actions, close -->
    <template #title="{ state }" />                <!-- optional: replaces the `title` text -->
    <template #description="{ state }" />          <!-- optional: replaces the `description` text -->
    <template #actions="{ state }" />              <!-- optional: buttons before the close button -->
    <template #close="{ state, ui }" />            <!-- optional: replaces the close button -->
    <template #default="{ state, open, close }" /> <!-- scrollable body: your menu -->
    <template #footer="{ state, open, close }" />  <!-- optional: user menu -->
    <template #rail="{ state, ui }" />             <!-- optional: replaces the rail -->
    <template #content="{ close }" />              <!-- optional: replaces the whole mobile menu -->
  </Sidebar>
  <main class="flex-1" />
</div>
```

The sidebar provides the layout only. Build the navigation with any component, such as [NavigationMenu](./navigation-menu).

### Variant

Use the `variant` prop to change the look of the sidebar. `sidebar` (default) sits on the page background with a 1px edge.

`floating` raises the sidebar as a card with rounded corners and a shadow, 8px from the edges of the viewport.

<ComponentPreview name="sidebar/floating" contain="32rem" />

`inset` removes the edge so you can style the page content as a card next to the sidebar.

<ComponentPreview name="sidebar/inset" contain="32rem" />

### Collapsible

Use the `collapsible` prop to choose how the sidebar collapses on desktop:

- `offcanvas` (default): the sidebar slides out of view and the content takes its space.
- `icon`: the sidebar shrinks to a 48px rail. Use the `state` slot prop to show icons only, for example with the `collapsed` prop of NavigationMenu.
- `none`: the sidebar always stays open and has no mobile menu.

<ComponentPreview name="sidebar/collapsible" contain="32rem" />

### Rail

Use the `rail` prop to add a thin strip on the inner edge of the sidebar. Clicking it toggles the sidebar, and hovering it highlights the edge. The rail is part of the desktop sidebar: below the breakpoint, open the menu from a toggle button in the page.

<ComponentPreview name="sidebar/rail" contain="32rem" />

### Side

Use the `side` prop to set the edge the sidebar collapses towards and the side its mobile menu slides in from. Defaults to `left`. Place the sidebar after the content to show it on the right.

<ComponentPreview name="sidebar/side" contain="32rem" />

### Title and description

Use the `title` and `description` props to fill the header. The `title` also names the mobile menu for screen readers. Use the `actions` slot to add buttons at the end of the header, and the `close` prop to add a button that collapses the sidebar. Pass an object to customize the [Button](./button) and its `icon`.

<ComponentPreview name="sidebar/header" contain="32rem" />

### Mode

Use the `mode` prop to choose how the sidebar opens below the breakpoint: `slideover` (default), `drawer` or `modal`. Use the `menu` prop to pass props to the underlying [Drawer](./drawer) or [Modal](./modal), and the `breakpoint` prop to change the width below which the menu replaces the sidebar (`md` by default).

<ComponentPreview name="sidebar/mode" contain="32rem" device="mobile" />

### Auto close

The mobile menu closes when a link inside it is clicked or the page navigates. Items that only expand or collapse a group keep it open. Set `auto-close` to `false` to keep the menu open after navigating.

## Examples

### Groups

Pass an array of arrays to NavigationMenu to split the menu into groups, and add items with `type: 'label'` as group titles.

<ComponentPreview name="sidebar/groups" contain="32rem" />

### Collapsible groups

Give items `children` to make them collapsible. `defaultOpen` expands a group on first render.

<ComponentPreview name="sidebar/collapsible-groups" contain="32rem" />

### Compact

Every size in the sidebar is derived from `--spacing`. Lower it on the sidebar to tighten the whole layout. This example also opens a [Dropdown](./dropdown) from a user row in the footer.

<ComponentPreview name="sidebar/compact" contain="32rem" />

### Workspace

A denser layout that combines header actions, grouped threads, nested projects with item actions and a footer call to action.

<ComponentPreview name="sidebar/workspace" contain="36rem" />

## Customization

### Width

The sidebar reads its width from `--sidebar-width` (15rem) and its collapsed width from `--sidebar-width-icon` (3rem). Set them on the sidebar to change them:

```vue
<Sidebar class="[--sidebar-width:18rem] [--sidebar-width-icon:3.5rem]" />
```

### Global theme override

```ts
app.use(
  createHareUI({
    ui: {
      sidebar: {
        slots: { container: 'bg-surface' },
      },
    },
  }),
)
```

## Styling Reference

| `ui` key      | `data-slot`           | Description                                                                                                                                     |
| ------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `root`        | `sidebar`             | The `<aside>` that holds the space in the page and animates its width. Carries `data-state`, `data-collapsible`, `data-variant` and `data-side` |
| `container`   | `sidebar-container`   | The visible panel, sticky at the top of the viewport                                                                                            |
| `header`      | `sidebar-header`      | Top section                                                                                                                                     |
| `wrapper`     | `sidebar-wrapper`     | Wraps the title and description                                                                                                                 |
| `title`       | `sidebar-title`       | The title                                                                                                                                       |
| `description` | `sidebar-description` | The description                                                                                                                                 |
| `actions`     | `sidebar-actions`     | Wraps the `actions` slot and the close button                                                                                                   |
| `close`       | `sidebar-close`       | The close button                                                                                                                                |
| `body`        | `sidebar-body`        | Scrollable middle section                                                                                                                       |
| `footer`      | `sidebar-footer`      | Bottom section                                                                                                                                  |
| `rail`        | `sidebar-rail`        | The toggle strip on the inner edge                                                                                                              |
| `handle`      | `sidebar-handle`      | Drag handle of the mobile menu in `drawer` mode                                                                                                 |
| `content`     | —                     | The mobile menu dialog                                                                                                                          |
| `overlay`     | —                     | The mobile menu backdrop                                                                                                                        |

The width transition is disabled with `:transition="false"` and when the user prefers reduced motion.

## API Reference

### Props

<ApiTable component="Sidebar" kind="props" />

### Slots

<ApiTable component="Sidebar" kind="slots" />

### Emits

<ApiTable component="Sidebar" kind="emits" />

## Theme

<ApiTheme component="Sidebar" />

## Related Components

<RelatedComponents :components="['navigation-menu', 'dashboard-sidebar', 'drawer']" />
