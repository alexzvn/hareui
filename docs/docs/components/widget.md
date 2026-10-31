---
title: Widget
description: A dashboard panel with a header of title, description and legend above an elevated content area.
links:
  source: widget/Widget.vue
  styles: widget/theme.ts
---

## Usage

Pass a `title` and a `description` for the header and put the content, such as a chart, in the default slot.

```ts
import { Widget } from '@hareui/vue'
```

<ComponentPreview name="widget/basic" />

## Anatomy

```vue
<Widget title="…" description="…" :legend="legend">
  <template #header />      <!-- optional: replaces the whole header -->
  <template #title />       <!-- optional -->
  <template #description /> <!-- optional -->
  <template #legend="{ items }" /> <!-- optional -->
  <!-- content -->
  <template #footer />      <!-- optional: the footer renders only when given -->
</Widget>
```

The widget is a `surface-secondary` shell around an elevated `surface` content area. The header renders when there is a title, a description, a legend or one of their slots. Use the `as` prop to render another element, such as `section`.

## Examples

### Legend

Use the `legend` prop to show a coloured dot and a label per series at the end of the header. `color` takes any CSS colour, such as `var(--chart-3)`; match it to the chart's series colours.

<ComponentPreview name="widget/legend" />

### Footer

Use the `footer` slot to add notes or actions below the content area.

<ComponentPreview name="widget/footer" />

### With a Table

Pass `:ui="{ content: 'p-0' }"` to remove the content padding, so a table runs edge to edge. This table also passes
`:ui="{ header: 'sr-only' }"`, which keeps its column headers for screen readers but hides them on screen.

<ComponentPreview name="widget/table" />

### With a Progress Circle

The content area takes any content, such as a `ProgressCircle` next to its figures.

<ComponentPreview name="widget/progress-circle" />

### Custom Header Content

Use the `title`, `description` and `legend` slots to put your own content in the header.

<ComponentPreview name="widget/slots" />

## Accessibility

- The widget is a plain container; render it `as="section"` and give it an `aria-label` (or `aria-labelledby`
  pointing at your own heading in the `title` slot) when it should be a landmark.
- The title is a `span`, not a heading. Put a heading element in the `title` slot if the page outline needs one.
- The legend is a list (`ul` / `li`); the coloured dots are `aria-hidden`, so each entry is read by its label.
- Label the content yourself, for example a chart's `aria-label` or a table's `aria-label`.

## Styling Reference

| `ui` key          | `data-slot`                | Description                                    |
| ----------------- | -------------------------- | ---------------------------------------------- |
| `base`            | `widget`                   | Root, the `surface-secondary` shell            |
| `header`          | `widget-header`            | Row with the title, description and legend     |
| `title`           | `widget-title`             | Title text                                     |
| `description`     | `widget-description`       | Description text, in the muted colour          |
| `legend`          | `widget-legend`            | Legend list                                    |
| `legendItem`      | `widget-legend-item`       | One legend entry                               |
| `legendItemDot`   | `widget-legend-item-dot`   | 10 px colour dot of an entry                   |
| `legendItemLabel` | `widget-legend-item-label` | Label of an entry                              |
| `content`         | `widget-content`           | Elevated `surface` content area, 16 px padding |
| `footer`          | `widget-footer`            | Footer row under the content area              |

## API Reference

### Props

<ApiTable component="Widget" kind="props" />

### Slots

<ApiTable component="Widget" kind="slots" />

## Theme

<ApiTheme component="Widget" />

## Related Components

<RelatedComponents :components="['metric-group', 'card', 'area-chart']" />
