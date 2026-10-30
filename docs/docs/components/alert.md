---
title: Alert
description: Display important messages and notifications to users with status indicators
links:
  source: alert/Alert.vue
  styles: alert/theme.ts
  heroui: alert
---

## Usage

```ts
import { Alert } from '@hareui/vue'
```

<ComponentPreview name="alert/basic" />

## Anatomy

Alert is composed through props and named slots, rendered in a fixed order: `#leading`, indicator, content, then `#trailing`.

```vue
<Alert status="…" title="…" description="…">
  <template #leading /> <!-- unwrapped children before the indicator (e.g. a background) -->
  <template #indicator /> <!-- replaces the status icon -->
  <template #title /> <!-- or: replaces the title text -->
  <template #description /> <!-- or: replaces the description text -->
  <!-- default slot = extra children of Alert.Content, after the description -->
  <template #trailing /> <!-- children after Alert.Content (actions, CloseButton) -->
</Alert>
```

- The indicator renders by default with the status icon; set `:indicator="false"` to omit it.
- The title and description render only when their prop or slot is provided.

`ui` keys: `base`, `indicator`, `content`, `title`, `description`.

## Customization

### Tailwind CSS

<ComponentPreview name="alert/custom-styles" />

### Global theme override

Override the `alert` theme app-wide with `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      alert: {
        slots: { base: 'rounded-2xl shadow-lg', title: 'font-bold text-lg' },
        variants: {
          status: { danger: { base: 'border-l-4 border-red-600' } },
        },
      },
    },
  }),
)
```

## Styling Reference

Each rendered element carries a `data-slot` attribute, so you can target it with selectors.

| `ui` key      | `data-slot`         | Description                                |
| ------------- | ------------------- | ------------------------------------------ |
| `base`        | `alert-root`        | Base alert container                       |
| `indicator`   | `alert-indicator`   | Icon/indicator container                   |
| `content`     | `alert-content`     | Content wrapper for title and description  |
| `title`       | `alert-title`       | Alert title text (renders as `p`)          |
| `description` | `alert-description` | Alert description text (renders as `span`) |

The `status` prop (`default`, `accent`, `success`, `warning`, `danger`) sets the colors. HareUI
renders utility classes, so style through `class`, `ui` or `createHareUI`.

### Interactive States

The Alert component is primarily informational and doesn't have interactive states on the base component. However, it can contain interactive elements like buttons or close buttons.

## API Reference

### Props

<ApiTable component="Alert" kind="props" />

### Slots

<ApiTable component="Alert" kind="slots" />

## Theme

<ApiTheme component="Alert" />

## Related Components

<RelatedComponents :components="['button', 'close-button', 'spinner']" />
