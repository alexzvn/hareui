---
title: DashboardPanel
description: A resizable panel that holds the main content of a dashboard, with header, body and footer slots.
links:
  source: dashboard-panel/DashboardPanel.vue
  styles: dashboard-panel/theme.ts
---

## Usage

The DashboardPanel component is used inside a [DashboardGroup](./dashboard-group). Use the `header`, `body` and `footer` slots to fill it. Without a size, it takes up the remaining space.

```ts
import { DashboardPanel } from '@hareui/vue'
```

<ComponentPreview name="dashboard-panel/basic" contain />

## Anatomy

```vue
<DashboardPanel>
  <template #header />        <!-- optional: navbar / toolbar -->
  <template #body />          <!-- scrollable, 24px padding (lines up with DashboardNavbar) -->
  <template #footer />        <!-- optional -->
  <template #resize-handle /> <!-- optional: replaces the drag handle -->
</DashboardPanel>
```

Use the `default` slot instead of `header`, `body` and `footer` when you need full control over the content. It has no padding and no scroll container.

## Examples

### Resizable

Use the `resizable` prop to make the panel resizable by dragging its end edge. The handle supports the same pointer and keyboard interactions as [DashboardSidebar](./dashboard-sidebar#resizable). Give each panel an `id` so their sizes are stored separately.

<ComponentPreview name="dashboard-panel/resizable" contain />

### Default Slot

Use the `default` slot to render content that needs no padding or scrolling, such as an empty state.

<ComponentPreview name="dashboard-panel/default-slot" contain />

## Customization

### Global theme override

```ts
app.use(
  createHareUI({
    ui: {
      dashboardPanel: {
        slots: { body: 'p-0 sm:p-0' },
      },
    },
  }),
)
```

## Styling Reference

| `ui` key | `data-slot`               | Description                                                             |
| -------- | ------------------------- | ----------------------------------------------------------------------- |
| `root`   | `dashboard-panel`         | The panel. `--width` is set once it has a size. Carries `data-dragging` |
| `body`   | `dashboard-panel-body`    | Scrollable, padded body                                                 |
| `handle` | `dashboard-resize-handle` | The resize handle                                                       |

## API Reference

### Props

<ApiTable component="DashboardPanel" kind="props" />

### Slots

<ApiTable component="DashboardPanel" kind="slots" />

### Theme

<ApiTheme component="DashboardPanel" />

## Related Components

<RelatedComponents :components="['drawer', 'modal']" />
