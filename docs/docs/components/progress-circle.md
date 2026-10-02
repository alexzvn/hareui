---
title: ProgressCircle
description: A circular progress indicator that shows determinate or indeterminate progress.
links:
  reka: progress
  source: ProgressCircle.vue
  styles: progressCircle.ts
  heroui: progress-circle
---

## Usage

```ts
import { ProgressCircle } from 'herouse'
```

<ComponentPreview name="progress-circle/basic" />

## Anatomy

HeroUI's `ProgressCircle.Track`, `ProgressCircle.TrackCircle` and `ProgressCircle.FillCircle` parts are
rendered by the component: an SVG with a background circle and a progress arc. It is built on Reka UI's
`ProgressRoot`, with React Aria's `aria-value*` semantics.

```vue
<ProgressCircle aria-label="Loading" :value="60" />
```

`ui` keys: `base`, `track`, `trackCircle`, `fillCircle`.

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

Use `stroke-width` to change the thickness of both circles; the radius follows (`18 - strokeWidth / 2` in the
36×36 viewBox), so the circle always fits the SVG.

<ComponentPreview name="progress-circle/custom-svg" />

## Customization

### Tailwind CSS

Use the `class` prop for the root and the `ui` prop for the SVG and its circles:

<ComponentPreview name="progress-circle/custom-styles" />

### Global theme override

Override the `progressCircle` theme app-wide with `createHeroUse`:

```ts
app.use(createHeroUse({
  ui: {
    progressCircle: {
      slots: {
        base: 'inline-flex',
        track: 'size-12',
        fillCircle: 'stroke-[purple]',
      },
    },
  },
}))
```

## Styling Reference

Each rendered element carries the same `data-slot` string as HeroUI, so selectors translate 1:1.

| `ui` key | `data-slot` | Description |
|---|---|---|
| `base` | `progress-circle` | Base container |
| `track` | `progress-circle-track` | SVG element |
| `trackCircle` | `progress-circle-track-circle` | Background circle |
| `fillCircle` | `progress-circle-fill-circle` | Progress arc |

HeroUI's modifier classes correspond to props (herouse renders utilities, not BEM classes, so
style through `class`, `ui` or `createHeroUse`):

- `size`: `sm`, `md` (default), `lg` (`.progress-circle--{size}`)
- `color`: `default`, `accent` (default), `success`, `warning`, `danger` (`.progress-circle--{color}`)

## API Reference

### Props

<ApiTable component="ProgressCircle" kind="props" />
