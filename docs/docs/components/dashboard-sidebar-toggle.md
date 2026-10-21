---
title: DashboardSidebarToggle
description: A button to open and close the sidebar sheet on mobile.
links:
  source: dashboard-sidebar-toggle/DashboardSidebarToggle.vue
  styles: dashboard-sidebar-toggle/theme.ts
---

## Usage

The `DashboardSidebarToggle` component is a [`Button`](/docs/components/button) that opens and closes the sidebar of a [`DashboardGroup`](/docs/components/dashboard-group) on mobile. It is hidden from the `md` breakpoint. [`DashboardNavbar`](/docs/components/dashboard-navbar) and [`DashboardSidebar`](/docs/components/dashboard-sidebar) already render one, so you only need it for custom layouts.

```ts
import { DashboardSidebarToggle } from '@hareui/vue'
```

<ComponentPreview name="dashboard-sidebar-toggle/basic" contain device="mobile" />

## Anatomy

```vue
<DashboardSidebarToggle side="left" variant="ghost">
  <!-- default slot: replaces the icon; receives { open } -->
</DashboardSidebarToggle>
```

`ui` keys: `base`. Native button attributes (`aria-label`, `@click`, ...) fall through to the button.

## Examples

### Variants

Use the `variant` and `size` props to change the look of the button. It defaults to the `ghost` variant.

<ComponentPreview name="dashboard-sidebar-toggle/variants" contain="8rem" device="mobile" />

### Within the `toggle` slot

Use the `#toggle` slot of `DashboardNavbar` or `DashboardSidebar` to replace the default toggle with your own.

<ComponentPreview name="dashboard-sidebar-toggle/toggle-slot" contain device="mobile" />

### Side

Use the `side` prop to toggle the right sidebar instead. `DashboardNavbar` sets it from its `toggle-side` prop.

<ComponentPreview name="dashboard-sidebar-toggle/side" contain device="mobile" />

## Notes

- The button toggles the open state of the group's sidebar. Outside a `DashboardGroup` it has no effect.
- The `aria-label` defaults to "Open sidebar" or "Close sidebar", and `aria-expanded` follows the state. Pass your own `aria-label` to translate it.
- The icon is a menu icon, and a close icon while the sidebar is open.

## Customization

### Global theme override

Override the `dashboardSidebarToggle` theme app-wide with `createHareUI`:

```ts
app.use(createHareUI({
  ui: {
    dashboardSidebarToggle: {
      slots: { base: 'md:hidden' },
    },
  },
}))
```

## API

### DashboardSidebarToggle Props

<ApiTable component="DashboardSidebarToggle" kind="props" />

### DashboardSidebarToggle Slots

<ApiTable component="DashboardSidebarToggle" kind="slots" />
