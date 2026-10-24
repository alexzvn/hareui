---
title: DashboardGroup
description: A fixed layout component that holds dashboard sidebars and panels and manages their size and collapsed state.
links:
  source: dashboard-group/DashboardGroup.vue
  styles: dashboard-group/theme.ts
---

## Usage

The DashboardGroup component is the main layout that wraps the [DashboardSidebar](./dashboard-sidebar) and [DashboardPanel](./dashboard-panel) components to create a responsive dashboard interface.

```ts
import { DashboardGroup, DashboardPanel, DashboardSidebar } from '@hareui/vue'
```

<ComponentPreview name="dashboard-group/basic" contain />

::: tip
DashboardGroup is `fixed inset-0` and fills the viewport. Render it once at the root of your app layout.
:::

## Anatomy

```vue
<DashboardGroup>
  <DashboardSidebar>…</DashboardSidebar>
  <DashboardPanel>…</DashboardPanel>
  <DashboardSidebar side="right">…</DashboardSidebar> <!-- optional aside -->
</DashboardGroup>
```

The group provides the context returned by [`useDashboard()`](#usedashboard): the `storage`, `storage-key` and `persistent` settings, the `unit` used for every size, and the open and collapsed state of the left and right sidebars.

## Examples

### Unit

Use the `unit` prop to set the unit of the `min-size`, `max-size`, `default-size` and `collapsed-size` props of every sidebar and panel in the group: `%` (default), `rem` or `px`.

```vue
<DashboardGroup unit="rem">
  <DashboardSidebar :default-size="16" :min-size="12" :max-size="24" resizable />
</DashboardGroup>
```

### Persistence

The group stores the size and collapsed state of each sidebar and panel when a drag ends. Use the `storage-key` prop to prefix the keys and the `storage` prop to choose where they are saved:

| Value                  | Behavior                                                                                                                          |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `'cookie'` (default)   | A cookie that lasts one year. It is read during setup, so the first render, including on the server, already has the stored size. |
| `'local'`              | `localStorage`.                                                                                                                   |
| `{ getItem, setItem }` | A custom adapter, for example one that reads the request cookies during SSR.                                                      |

Stored sizes outside `min-size` and `max-size` are clamped, and invalid entries are ignored. Set `:persistent="false"` to disable persistence.

<ComponentPreview name="dashboard-group/storage" contain />

### useDashboard

Use the `useDashboard()` composable to control the sidebars from any component inside the group. It returns `undefined` outside a group.

```ts
const { sidebarOpen, toggleSidebar, sidebarCollapsed, collapseSidebar, sidebars } = useDashboard()!

toggleSidebar() // open or close the mobile menu
collapseSidebar(true) // collapse the left sidebar
sidebars.right.toggle() // the right sidebar has its own state
```

## App Layout Examples

### Default

A collapsible sidebar with a navbar and a main content area.

<ComponentPreview name="dashboard-group/app-layout-default" contain="840px" />

### Collapsible

Set `collapsible` and a `collapsed-size` on the sidebar to let it collapse into an icon rail. Click the collapse button in the navbar to toggle it.

<ComponentPreview name="dashboard-group/app-layout-collapsible" contain="840px" />

### Offcanvas

With `:collapsed-size="0"` and `overflow-hidden` on the root, the sidebar slides fully off-screen when collapsed and the main content takes the full width.

<ComponentPreview name="dashboard-group/app-layout-offcanvas" contain="840px" />

### Inset Sidebar

The sidebar shares the surface of the main content, with no divider between them. Set `shadow-none` in the sidebar's `ui.root` to remove its edge.

<ComponentPreview name="dashboard-group/app-layout-inset-sidebar" contain="840px" />

### Floating Sidebar

A sidebar detached from the viewport edge with rounded corners and a shadow, a common pattern for product dashboards.

<ComponentPreview name="dashboard-group/app-layout-floating-sidebar" contain="840px" />

### Inset Dashboard

A full dashboard combining an inset layout, KPI cards, breadcrumbs and a user menu.

<ComponentPreview name="dashboard-group/app-layout-inset-dashboard" contain="840px" />

### Docs Site

A documentation layout with a search field, a theme switch and grouped navigation in an off-canvas sidebar.

<ComponentPreview name="dashboard-group/app-layout-docs-site" contain="840px" />

### With Breadcrumbs

A project management navbar with a breadcrumb trail that follows the current navigation depth. Every crumb keeps its natural width: the navbar is a size container (`@container`), so when it gets narrow the middle ancestors fold into a "…" crumb, and on phones only the current page and the main actions remain.

<ComponentPreview name="dashboard-group/app-layout-with-breadcrumbs" contain="840px" />

### With Aside

Add a second DashboardSidebar with `side="right"` to show a details panel, such as conversation details or metadata. A button in the navbar opens and closes it. Below `md` the aside becomes a sheet opened by `<DashboardSidebarToggle side="right">`.

<ComponentPreview name="dashboard-group/app-layout-with-aside" contain="840px" />

### Content Scroll Mode

The sidebar and navbar stay in place while only the panel body scrolls.

<ComponentPreview name="dashboard-group/app-layout-content-scroll" contain="840px" />

### Complex

A full-featured layout with a compact sidebar, several menu groups, chips, a user menu and a navbar with breadcrumbs and actions.

<ComponentPreview name="dashboard-group/app-layout-complex" contain="840px" />

### Resizable Sidebar

Set `resizable` with `min-size` and `max-size` on the sidebar to let users drag its edge. The group stores the size, so it is kept across page loads (the examples on this page disable this with `:persistent="false"`).

<ComponentPreview name="dashboard-group/app-layout-resizable-sidebar" contain="840px" />

### Resizable Aside

Set `resizable` on the right sidebar too, with its own size limits. The button in the navbar opens and closes it, and below `md` a `<DashboardSidebarToggle side="right">` opens it as a sheet.

<ComponentPreview name="dashboard-group/app-layout-resizable-aside" contain="840px" />

## Customization

### Global theme override

```ts
app.use(
  createHareUI({
    ui: {
      dashboardGroup: {
        slots: { base: 'bg-surface-secondary' },
      },
    },
  }),
)
```

## Styling Reference

| `ui` key | `data-slot`       | Description                                |
| -------- | ----------------- | ------------------------------------------ |
| `base`   | `dashboard-group` | Root: `fixed inset-0 flex overflow-hidden` |

## API Reference

### Props

<ApiTable component="DashboardGroup" kind="props" />

### Slots

<ApiTable component="DashboardGroup" kind="slots" />

### Theme

<ApiTheme component="DashboardGroup" />

## Related Components

<RelatedComponents :components="['drawer', 'modal']" />
