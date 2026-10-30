---
title: DashboardNavbar
description: A responsive navbar to display at the top of a dashboard panel, with the sidebar toggle built in.
links:
  source: dashboard-navbar/DashboardNavbar.vue
  styles: dashboard-navbar/theme.ts
---

## Usage

The `DashboardNavbar` component shows a title and actions at the top of a [`DashboardPanel`](/docs/components/dashboard-panel). On mobile it also renders a [`DashboardSidebarToggle`](/docs/components/dashboard-sidebar-toggle) that opens the sidebar of the closest [`DashboardGroup`](/docs/components/dashboard-group).

```ts
import { DashboardNavbar } from '@hareui/vue'
```

Place it in the `#header` slot of a `DashboardPanel`. Use the `left` and `right` slots for content at either end of the bar, and the default slot for content in the center, which is shown from the `lg` breakpoint.

<ComponentPreview name="dashboard-navbar/basic" contain="24rem" />

## Anatomy

```vue
<DashboardNavbar title="Inbox">
  <template #toggle /> <!-- optional: replaces the sidebar toggle button -->
  <template #left /> <!-- optional: replaces leading, title and trailing -->
  <template #leading /> <!-- optional: before the title, e.g. DashboardSidebarCollapse or an icon -->
  <template #title /> <!-- optional: replaces the `title` text -->
  <template #trailing /> <!-- optional: after the title, e.g. a Chip -->
  <!-- default slot: centered content, shown from `lg` -->
  <template #right /> <!-- optional: actions at the end -->
</DashboardNavbar>
```

`ui` keys: `root`, `left`, `title`, `center`, `right`, `toggle`. Every slot receives the dashboard state (`sidebarOpen`, `toggleSidebar`, `sidebarCollapsed`, `collapseSidebar`, `sidebars`). The `leading`, `trailing` and `toggle` slots also receive the `ui` classes.

## Examples

### Title

Use the `title` prop to set the title of the navbar. It renders as an `h1`. Use the `as` prop to change the element of the title or the root, for example `:as="{ root: 'header', title: 'h2' }"`.

<ComponentPreview name="dashboard-navbar/title" contain="20rem" />

### Icon

Use the `#title` slot to display an icon next to the title text. Keep `#leading` for controls such as [`DashboardSidebarCollapse`](/docs/components/dashboard-sidebar-collapse).

<ComponentPreview name="dashboard-navbar/icon" contain="20rem" />

### Toggle

Use the `toggle` prop to customize the [`DashboardSidebarToggle`](/docs/components/dashboard-sidebar-toggle) shown on mobile. It accepts any of its props, such as `variant`, `size` or `class`. Set it to `false` to hide the toggle. The ghost toggle is pulled into the padding (`-ms-2.5 md:-ms-2`, matching its 36px and 32px sizes) so its icon lines up with the content; a filled variant can drop that offset with `class: 'ms-0 md:ms-0'`.

<ComponentPreview name="dashboard-navbar/toggle" contain="20rem" device="mobile" />

### Toggle Side

Use the `toggle-side` prop to place the toggle on the right of the navbar. The toggle then controls the right sidebar, the one rendered with `<DashboardSidebar side="right">`.

<ComponentPreview name="dashboard-navbar/toggle-side" contain="20rem" device="mobile" />

## Notes

- The toggle is hidden from the `md` breakpoint, where the sidebar docks. Pick Mobile in a preview to see it open the sidebar's sheet.
- The navbar height comes from the `--navbar-height` CSS variable, `4rem` by default. Change it with a class such as `class="[--navbar-height:3rem]"`.
- The navbar has no bottom border. Add `class="border-b border-separator"`, or place a [`DashboardToolbar`](/docs/components/dashboard-toolbar) below it.

## Customization

### Tailwind CSS

Use the `class` prop for the root and `ui` for every part:

```vue
<DashboardNavbar
  title="Inbox"
  class="border-b border-separator"
  :ui="{ title: 'text-base font-semibold' }"
/>
```

### Global theme override

Override the `dashboardNavbar` theme app-wide with `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      dashboardNavbar: {
        slots: { root: 'border-b border-separator' },
      },
    },
  }),
)
```

## API

### DashboardNavbar Props

<ApiTable component="DashboardNavbar" kind="props" />

### DashboardNavbar Slots

<ApiTable component="DashboardNavbar" kind="slots" />

## Theme

<ApiTheme component="DashboardNavbar" />
