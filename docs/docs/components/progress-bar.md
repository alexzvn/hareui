---
title: ProgressBar
description: A progress bar shows either determinate or indeterminate progress of an operation over time.
links:
  reka: progress
  source: progress-bar/ProgressBar.vue
  styles: progress-bar/theme.ts
  heroui: progress-bar
---

## Usage

```ts
import { ProgressBar } from '@hareui/vue'
```

<ComponentPreview name="progress-bar/basic" />

## Anatomy

The label, output, track and fill parts are rendered by the component.

```vue
<ProgressBar :value="60" label="Loading">
  <template #label /> <!-- optional: replaces the label text -->
  <template #output="{ percentage, valueText, indeterminate }" /> <!-- optional: replaces the value text -->
</ProgressBar>
```

- Set `label` or fill the `#label` slot to show a label. It also names the bar for screen readers.
- The value shows next to the label unless the bar is indeterminate. Set `show-output` to force it on or off.

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
app.use(
  createHareUI({
    ui: {
      progressBar: {
        slots: {
          base: 'w-full gap-2',
          track: 'h-3 rounded-full',
          fill: 'rounded-full',
        },
      },
    },
  }),
)
```

## Styling Reference

Each rendered element carries a `data-slot` attribute you can target in selectors.

| `ui` key | `data-slot`           | Description                                      |
| -------- | --------------------- | ------------------------------------------------ |
| `base`   | `progress-bar`        | Base container (grid layout)                     |
| `label`  | `label`               | Label text (Label theme plus the grid placement) |
| `output` | `progress-bar-output` | Value text display                               |
| `track`  | `progress-bar-track`  | Track background                                 |
| `fill`   | `progress-bar-fill`   | Filled portion of the track                      |

### CSS Classes

HareUI follows the [BEM](https://getbem.com/) methodology to keep component variants and states reusable and easy to customize. The ProgressBar component uses these CSS classes ([View source styles](https://github.com/alexzvn/hareui/blob/main/packages/vue/src/components/progress-bar/progress-bar.css)):

#### Base & Element Classes

- `.h-progress-bar` - Base container (grid layout)
- `.h-progress-bar__output` - Value text display
- `.h-progress-bar__track` - Track background
- `.h-progress-bar__fill` - Filled portion of the track

The label is styled through `.h-progress-bar [data-slot='label']`, on top of the Label classes.

#### Size Classes

- `.h-progress-bar--sm` - Small size variant (thinner track)
- `.h-progress-bar--lg` - Large size variant (thicker track)

The default `md` size adds no class.

#### Color Classes

- `.h-progress-bar--default` - Default color variant
- `.h-progress-bar--accent` - Accent color variant
- `.h-progress-bar--success` - Success color variant
- `.h-progress-bar--warning` - Warning color variant
- `.h-progress-bar--danger` - Danger color variant

An indeterminate bar adds no class. The fill slides because the root has no `aria-valuenow`.

The classes sit in `@layer components`, so a utility you pass through `class` or `ui` wins over them.

## API Reference

### Props

<ApiTable component="ProgressBar" kind="props" />

### Slots

<ApiTable component="ProgressBar" kind="slots" />

`#label` and `#output` receive:

| Prop            | Type                  | Description                            |
| --------------- | --------------------- | -------------------------------------- |
| `percentage`    | `number \| undefined` | The percentage of the progress (0-100) |
| `valueText`     | `string \| undefined` | The formatted value text               |
| `indeterminate` | `boolean`             | Whether progress is indeterminate      |

## Theme

<ApiTheme component="ProgressBar" />
