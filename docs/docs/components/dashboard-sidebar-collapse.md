---
title: DashboardSidebarCollapse
description: A button to collapse and expand the sidebar on desktop.
links:
  source: dashboard-sidebar-collapse/DashboardSidebarCollapse.vue
  styles: dashboard-sidebar-collapse/theme.ts
---

## Usage

The `DashboardSidebarCollapse` component is a [`Button`](/docs/components/button) that collapses and expands a `collapsible` [`DashboardSidebar`](/docs/components/dashboard-sidebar) inside a [`DashboardGroup`](/docs/components/dashboard-group). It is hidden below the `md` breakpoint, where the sidebar opens as a sheet instead.

```ts
import { DashboardSidebarCollapse } from '@hareui/vue'
```

Put it in the `#header` slot of the sidebar and hide the brand while `collapsed`: on the collapsed rail the button centres itself above the menu icons.

<ComponentPreview name="dashboard-sidebar-collapse/basic" contain />

```vue
<DashboardSidebarCollapse side="left" variant="ghost">
  <!-- default slot: replaces the icon; receives { collapsed } -->
</DashboardSidebarCollapse>
```

`ui` keys: `base`. Native button attributes (`aria-label`, `@click`, ...) fall through to the button.

## Examples

### Variants

Use the `variant` and `size` props to change the look of the button. It defaults to the `ghost` variant.

<ComponentPreview name="dashboard-sidebar-collapse/variants" contain="8rem" />

### Within the `leading` slot

Use the button in the `#leading` slot of a [`DashboardNavbar`](/docs/components/dashboard-navbar) to display it before the title.

<ComponentPreview name="dashboard-sidebar-collapse/leading" contain />

Use the `side` prop to collapse the right sidebar instead. With `side="right"` the icon is mirrored.

<ComponentPreview name="dashboard-sidebar-collapse/side-right" contain />

- The button updates the collapsed state of the group, which `DashboardSidebar` syncs with its `v-model:collapsed`. Outside a `DashboardGroup` it has no effect.
- The `aria-label` defaults to "Collapse sidebar" or "Expand sidebar", and `aria-expanded` follows the state. Pass your own `aria-label` to translate it.

## Customization

### Global theme override

Override the `dashboardSidebarCollapse` theme app-wide with `createHareUI`:

```ts
app.use(createHareUI({
  ui: {
    dashboardSidebarCollapse: {
      slots: { base: 'hidden xl:flex' },
    },
  },
}))
```

## API

### DashboardSidebarCollapse Props

<ApiTable component="DashboardSidebarCollapse" kind="props" />

### DashboardSidebarCollapse Slots

<ApiTable component="DashboardSidebarCollapse" kind="slots" />
