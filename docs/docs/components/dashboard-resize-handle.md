---
title: DashboardResizeHandle
description: A handle to resize a dashboard sidebar or panel, used in their resize-handle slot.
links:
  source: dashboard-resize-handle/DashboardResizeHandle.vue
  styles: dashboard-resize-handle/theme.ts
---

## Usage

DashboardSidebar and DashboardPanel render a resize handle when they are `resizable`. Use the DashboardResizeHandle component in their `resize-handle` slot to customize it. The slot props carry the event handlers and ARIA attributes the handle needs to keep working.

```ts
import { DashboardResizeHandle } from '@hareui/vue'
```

## Examples

### Within `resize-handle` slot

Bind the slot props to the handle and add your own classes or content. This example centres a grab pill on the edge.

<ComponentPreview name="dashboard-resize-handle/custom" contain />

## Slot Props

The `resize-handle` slot of DashboardSidebar and DashboardPanel receives:

| Slot prop | Description |
|---|---|
| `onPointerDown`, `onMouseDown`, `onTouchStart` | Start a drag. Bind one of them (`pointerdown` covers all devices) |
| `onDoubleClick` | Restores the default size and expands a collapsed sidebar |
| `onKeyDown` | Arrow keys, `Home`/`End` and `Enter` (collapse) |
| `attrs` | `tabindex`, `aria-orientation`, `aria-valuenow/min/max`, `aria-controls`, `aria-label`: spread with `v-bind` |
| `dragging` | Whether a drag is in progress |

## Styling Reference

| `ui` key | `data-slot` | Description |
|---|---|---|
| `base` | `dashboard-resize-handle` | The separator: an 8px hit area over a 1px line that darkens on hover and while dragging, and turns into a 2px focus line. Carries `data-dragging`, and `data-side` when rendered by a sidebar |

## API Reference

### Props

<ApiTable component="DashboardResizeHandle" kind="props" />

### Slots

<ApiTable component="DashboardResizeHandle" kind="slots" />

### Theme

<ApiTheme component="DashboardResizeHandle" />

## Related Components

<RelatedComponents :components="['drawer', 'modal']" />
