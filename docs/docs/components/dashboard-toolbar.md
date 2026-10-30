---
title: DashboardToolbar
description: A second row under the navbar for filters, tabs and actions.
links:
  source: dashboard-toolbar/DashboardToolbar.vue
  styles: dashboard-toolbar/theme.ts
---

## Usage

The `DashboardToolbar` component displays a row of tabs, filters or actions below a [`DashboardNavbar`](/docs/components/dashboard-navbar). Place both in the `#header` slot of a [`DashboardPanel`](/docs/components/dashboard-panel).

```ts
import { DashboardToolbar } from '@hareui/vue'
```

Use the default slot to fill the toolbar. When its content overflows, the toolbar scrolls horizontally without a visible scrollbar, and the `left` and `right` groups keep their width instead of wrapping.

<ComponentPreview name="dashboard-toolbar/basic" contain="20rem" />

## Anatomy

```vue
<DashboardToolbar>
  <template #left /> <!-- optional: group aligned to the start -->
  <template #right /> <!-- optional: group aligned to the end -->
  <!-- the default slot replaces both groups -->
</DashboardToolbar>
```

`ui` keys: `root`, `left`, `right`.

## Examples

### Left and right

Use the `left` and `right` slots to align two groups to either end of the toolbar. They are ignored when the default slot is used.

<ComponentPreview name="dashboard-toolbar/left-right" contain="20rem" />

## Customization

### Global theme override

Override the `dashboardToolbar` theme app-wide with `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      dashboardToolbar: {
        slots: { root: 'bg-surface' },
      },
    },
  }),
)
```

## API

### DashboardToolbar Props

<ApiTable component="DashboardToolbar" kind="props" />

### DashboardToolbar Slots

<ApiTable component="DashboardToolbar" kind="slots" />

## Theme

<ApiTheme component="DashboardToolbar" />
