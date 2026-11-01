---
title: MetricGroup
description: Lays Metric cards out on one shared surface, divided by thin lines
links:
  source: metric-group/MetricGroup.vue
  styles: metric-group/theme.ts
---

## Usage

```ts
import { Metric, MetricGroup } from '@hareui/vue'
```

<ComponentPreview name="metric-group/horizontal" />

## Anatomy

```vue
<MetricGroup>
  <Metric />
  <Metric />
</MetricGroup>
```

Inside a group, each `Metric` drops its own radius and shadow and shares the group surface. The dividers come from the
group theme, so there are no separator elements to place.

## Examples

### Row

The default. Metrics share the width equally in one row. Thin dividers sit between them, inset from the top and bottom.

<ComponentPreview name="metric-group/horizontal" />

### Stacked

`stacked` turns the row into a column with full-width dividers.

<ComponentPreview name="metric-group/stacked-always" />

### Stacked below a breakpoint

Pass a breakpoint (`sm`, `md`, `lg` or `xl`) to stack only below it, so long values don't get cut off on phones. This
group is a column under 768px; resize the preview to see it switch.

<ComponentPreview name="metric-group/stacked-below-md" />

### Inside a Widget

Inside a `Widget`, pass `class="bg-transparent shadow-none"` so the metrics sit on the widget's content surface.

<ComponentPreview name="metric-group/in-widget" />

## Accessibility

The group is a plain container; each `Metric` keeps its own `dl` semantics. `stacked` is exposed as `data-stacked`.

## Styling Reference

| `ui` key | `data-slot`    | Description                                 |
| -------- | -------------- | ------------------------------------------- |
| `base`   | `metric-group` | Root, with `data-stacked`, and the dividers |

## API Reference

### Props

<ApiTable component="MetricGroup" kind="props" />

### Slots

<ApiTable component="MetricGroup" kind="slots" />

## Theme

<ApiTheme component="MetricGroup" />

## Related Components

<RelatedComponents :components="['metric', 'widget']" />
