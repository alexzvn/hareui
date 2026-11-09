---
title: ProgressCircle
description: A circular progress indicator that shows determinate or indeterminate progress.
links:
  reka: progress
  source: progress-circle/ProgressCircle.vue
  styles: progress-circle/theme.ts
  heroui: progress-circle
---

## Usage

```ts
import { ProgressCircle } from '@hareui/vue'
```

<ComponentPreview name="progress-circle/basic" />

## Anatomy

ProgressCircle draws an SVG with a background circle and a progress arc. You only pass the value and a label.
The root has `role="progressbar"` and `aria-value*` attributes, so screen readers announce the progress.

```vue
<ProgressCircle aria-label="Loading" :value="60" />
```

## Examples

### Sizes

<ComponentPreview name="progress-circle/sizes" />

### Colors

<ComponentPreview name="progress-circle/colors" />

### Indeterminate

Use `indeterminate` when progress cannot be determined.

<ComponentPreview name="progress-circle/indeterminate" />

### With Label

<ComponentPreview name="progress-circle/with-label" />

### Custom SVG Props

Use `stroke-width` to change the thickness of both circles. The radius shrinks to match, so the circle always fits
the SVG.

<ComponentPreview name="progress-circle/custom-svg" />

## Customization

### Tailwind CSS

Use the `class` prop for the root and the `ui` prop for the SVG and its circles:

<ComponentPreview name="progress-circle/custom-styles" />

### Global theme override

Override the `progressCircle` theme app-wide with `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      progressCircle: {
        slots: {
          base: 'inline-flex',
          track: 'size-12',
          fillCircle: 'stroke-[purple]',
        },
      },
    },
  }),
)
```

## Styling Reference

Each rendered element carries a `data-slot` attribute you can target in selectors.

| `ui` key      | `data-slot`                    | Description       |
| ------------- | ------------------------------ | ----------------- |
| `base`        | `progress-circle`              | Base container    |
| `track`       | `progress-circle-track`        | SVG element       |
| `trackCircle` | `progress-circle-track-circle` | Background circle |
| `fillCircle`  | `progress-circle-fill-circle`  | Progress arc      |

### CSS Classes

HareUI follows the [BEM](https://getbem.com/) methodology to keep component variants and states reusable and easy to customize. The ProgressCircle component uses these CSS classes ([View source styles](https://github.com/alexzvn/hareui/blob/main/packages/vue/src/components/progress-circle/progress-circle.css)):

#### Base & Element Classes

- `.h-progress-circle` - Base container
- `.h-progress-circle__track` - SVG element
- `.h-progress-circle__track-circle` - Background circle
- `.h-progress-circle__fill-circle` - Progress arc

#### Size Classes

- `.h-progress-circle--sm` - Small size variant
- `.h-progress-circle--lg` - Large size variant

The default `md` size adds no class.

#### Color Classes

- `.h-progress-circle--default` - Default color variant
- `.h-progress-circle--accent` - Accent color variant
- `.h-progress-circle--success` - Success color variant
- `.h-progress-circle--warning` - Warning color variant
- `.h-progress-circle--danger` - Danger color variant

An indeterminate circle adds no class. The track spins because the root has no `aria-valuenow`.

The classes sit in `@layer components`, so a utility you pass through `class` or `ui` wins over them.

## API Reference

### Props

<ApiTable component="ProgressCircle" kind="props" />

## Theme

<ApiTheme component="ProgressCircle" />
