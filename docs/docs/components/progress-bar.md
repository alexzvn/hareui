---
title: ProgressBar
description: A progress bar shows either determinate or indeterminate progress of an operation over time.
links:
  reka: progress
  source: ProgressBar.vue
  styles: progressBar.ts
  heroui: progress-bar
---

## Usage

```ts
import { ProgressBar } from '@hareui/vue'
```

<ComponentPreview name="progress-bar/basic" />

## Anatomy

HeroUI's `Label`, `ProgressBar.Output`, `ProgressBar.Track` and `ProgressBar.Fill` parts are
rendered by the component, built on Reka UI's `ProgressRoot` / `ProgressIndicator`.

```vue
<ProgressBar :value="60" label="Loading">
  <template #label /> <!-- optional: replaces the label text -->
  <template #output="{ percentage, valueText, indeterminate }" /> <!-- optional: replaces the value text -->
</ProgressBar>
```

- The label renders when the `label` prop or `#label` slot is provided, and labels the bar via `aria-labelledby`.
- The output renders next to a label unless the bar is indeterminate; set `show-output` to force it on or off.

`ui` keys: `base`, `label`, `output`, `track`, `fill`.

## Examples

### Sizes

<ComponentPreview name="progress-bar/sizes" />

### Colors

<ComponentPreview name="progress-bar/colors" />

### Without Label

When no visible label is needed, use `aria-label` for accessibility.

<ComponentPreview name="progress-bar/without-label" />

### Indeterminate

Use `indeterminate` when progress cannot be determined.

<ComponentPreview name="progress-bar/indeterminate" />

### Custom Value Scale

Use `min-value`, `max-value`, and `format-options` to customize the value range and display format.

<ComponentPreview name="progress-bar/custom-value" />

## Customization

### Tailwind CSS

Use the `class` prop for the root and the `ui` prop for the label, output, track and fill:

<ComponentPreview name="progress-bar/custom-styles" />

### Global theme override

Override the `progressBar` theme app-wide with `createHareUI`:

```ts
app.use(createHareUI({
  ui: {
    progressBar: {
      slots: {
        base: 'w-full gap-2',
        track: 'h-3 rounded-full',
        fill: 'rounded-full',
      },
    },
  },
}))
```

## Styling Reference

Each rendered element carries the same `data-slot` string as HeroUI, so selectors translate 1:1.

| `ui` key | `data-slot` | Description |
|---|---|---|
| `base` | `progress-bar` | Base container (grid layout) |
| `label` | `label` | Label text (Label theme plus the grid placement) |
| `output` | `progress-bar-output` | Value text display |
| `track` | `progress-bar-track` | Track background |
| `fill` | `progress-bar-fill` | Filled portion of the track |

HeroUI's modifier classes correspond to props (HareUI renders utilities, not BEM classes, so
style through `class`, `ui` or `createHareUI`):

- `size`: `sm` (thinner track), `md` (default), `lg` (thicker track) (`.progress-bar--{size}`)
- `color`: `default`, `accent` (default), `success`, `warning`, `danger` (`.progress-bar--{color}`)

## API Reference

### Props

<ApiTable component="ProgressBar" kind="props" />

### Slots

<ApiTable component="ProgressBar" kind="slots" />

`#label` and `#output` receive:

| Prop | Type | Description |
|------|------|-------------|
| `percentage` | `number \| undefined` | The percentage of the progress (0-100) |
| `valueText` | `string \| undefined` | The formatted value text |
| `indeterminate` | `boolean` | Whether progress is indeterminate |
