---
title: DashboardSidebar
description: A resizable and collapsible sidebar that opens as a slideover, drawer or modal on mobile.
links:
  source: dashboard-sidebar/DashboardSidebar.vue
  styles: dashboard-sidebar/theme.ts
---

## Usage

The DashboardSidebar component is used inside a [DashboardGroup](./dashboard-group) next to one or more [DashboardPanel](./dashboard-panel). Use the `header`, `default` and `footer` slots to fill it. Below the `md` breakpoint, the same content opens in a menu you control with `v-model:open`.

```ts
import { DashboardSidebar } from '@hareui/vue'
```

<ComponentPreview name="dashboard-sidebar/basic" contain />

## Anatomy

```vue
<DashboardSidebar>
  <template #header="{ collapsed, collapse }" />  <!-- optional: logo, team switcher -->
  <template #default="{ collapsed, collapse }" /> <!-- scrollable body: your menu -->
  <template #footer="{ collapsed, collapse }" />  <!-- optional: user menu -->
  <template #toggle="{ open, toggle }" />         <!-- optional: replaces the mobile close button -->
  <template #content="{ close }" />               <!-- optional: replaces the whole mobile menu -->
  <template #resize-handle="{ onPointerDown, … }" /> <!-- optional: replaces the drag handle -->
</DashboardSidebar>
```

The sidebar provides the layout only. Build the navigation with any component, such as [NavigationMenu](./navigation-menu).

### Resizable

Use the `resizable` prop to make the sidebar resizable by dragging its inner edge. When the handle has focus, the arrow keys resize it (hold `Shift` for larger steps), `Home` and `End` jump to `minSize` and `maxSize`, and a double-click restores `defaultSize`.

<ComponentPreview name="dashboard-sidebar/resizable" contain />

### Collapsible

Use the `collapsible` prop to let the sidebar collapse to `collapsedSize` when it is dragged near its minimum width. It also collapses when you press `Enter` on the focused handle or call `collapse()` from a slot. Use the `collapsed` slot prop to show an icon-only version of your content.

<ComponentPreview name="dashboard-sidebar/collapsible" contain />

### Size

Use the `min-size`, `max-size`, `default-size` and `collapsed-size` props to set the width of the sidebar. Values use the `unit` of the parent [DashboardGroup](./dashboard-group#unit).

<ComponentPreview name="dashboard-sidebar/size" contain />

### Side

Use the `side` prop to place the sidebar on the `left` or `right` of the group. Defaults to `left`. Each side keeps its own state, available as `sidebars.right` from [`useDashboard()`](./dashboard-group#usedashboard).

<ComponentPreview name="dashboard-sidebar/side" contain />

### Mode

Use the `mode` prop to choose how the sidebar opens on mobile: `slideover` (default), `drawer` or `modal`. Use the `menu` prop to pass props to the underlying [Drawer](./drawer) or [Modal](./modal).

<ComponentPreview name="dashboard-sidebar/mode" contain device="mobile" />

### Toggle

Use the `toggle` prop to customize the close button in the mobile menu header. Set it to `false` to hide it, or pass an object of [Button](./button) props.

<ComponentPreview name="dashboard-sidebar/toggle" contain device="mobile" />

### Toggle Side

Use the `toggle-side` prop to move the close button before the header content. Defaults to `right`.

<ComponentPreview name="dashboard-sidebar/toggle-side" contain device="mobile" />

## Examples

### Control the open state

Use `v-model:open` to control the mobile menu, or call `toggleSidebar()` from [`useDashboard()`](./dashboard-group#usedashboard). With `auto-close` (default `true`), the menu closes when a link inside it is clicked.

<ComponentPreview name="dashboard-sidebar/control-open" contain device="mobile" />

### Control the collapsed state

Use `v-model:collapsed` to control the collapsed state, or call `collapseSidebar()` from `useDashboard()`.

<ComponentPreview name="dashboard-sidebar/control-collapsed" contain />

### Inset

The sidebar has a 1px edge by default, drawn with the `shadow-sidebar-edge` utility. Set another shadow in `ui.root` to replace it: `shadow-none` removes the edge, as in this inset layout.

<ComponentPreview name="dashboard-sidebar/inset" contain />

### Floating

Add a margin, rounded corners and `shadow-surface` to `ui.root` to detach the sidebar from the edge of the screen.

<ComponentPreview name="dashboard-sidebar/floating" contain />

### Aside

Add a second sidebar with `side="right"` to show details next to the main content. Below `md` it becomes a sheet; open it with `<DashboardSidebarToggle side="right">`.

<ComponentPreview name="dashboard-sidebar/aside" contain />

### Off-canvas

A collapsed sidebar keeps an icon rail, even with `collapsed-size="0"`. To hide it completely, let its width reach `0` and clip the content:

```vue
<DashboardSidebar collapsible :collapsed-size="0" :ui="{ root: 'w-(--width) overflow-hidden' }" />
```

At `0` width there is nothing to drag from, so the resize handle hides until the sidebar opens again. Give users a [DashboardSidebarCollapse](./dashboard-sidebar-collapse) to reopen it.

## Customization

### Global theme override

```ts
app.use(createHareUI({
  ui: {
    dashboardSidebar: {
      slots: { root: 'bg-surface' },
    },
  },
}))
```

## Styling Reference

| `ui` key | `data-slot` | Description |
|---|---|---|
| `root` | `dashboard-sidebar` | The desktop `<aside>` (`hidden md:flex`), width from `--width`. Carries `data-side`, `data-collapsed` and `data-dragging` |
| `header` | `dashboard-sidebar-header` | Top section |
| `body` | `dashboard-sidebar-body` | Scrollable middle section |
| `footer` | `dashboard-sidebar-footer` | Bottom section |
| `toggle` | `dashboard-sidebar-toggle` | Close button of the mobile menu header. Carries `data-idle` from opening until the pointer moves over it, so it doesn't show a hover fill when the sheet opens under the cursor |
| `handle` | `dashboard-resize-handle` | The resize handle |
| `content` | — | The mobile menu dialog |
| `overlay` | — | The mobile menu backdrop |

The width transition is disabled while `data-dragging="true"` and when the user prefers reduced motion.

## API Reference

### Props

<ApiTable component="DashboardSidebar" kind="props" />

### Slots

<ApiTable component="DashboardSidebar" kind="slots" />

### Theme

<ApiTheme component="DashboardSidebar" />

## Related Components

<RelatedComponents :components="['drawer', 'modal']" />
