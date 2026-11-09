---
title: Meter
description: A meter represents a quantity within a known range, or a fractional value.
links:
  source: meter/Meter.vue
  styles: meter/theme.ts
  heroui: meter
---

## Usage

```ts
import { Meter } from '@hareui/vue'
```

<ComponentPreview name="meter/basic" />

## Anatomy

The label, output, track and fill parts are rendered by the component. The root carries the meter semantics
(`role="meter progressbar"`, `aria-valuenow`, `aria-valuetext`) itself.

```vue
<Meter :value="60" label="Storage">
  <template #label /> <!-- optional: replaces the label text -->
  <template #output="{ percentage, valueText }" /> <!-- optional: replaces the value text -->
</Meter>
```

- Set `label` or fill the `#label` slot to show a label. It also names the meter for screen readers.
- The value shows next to the label. Set `show-output` to force it on or off.

## Examples

### Sizes

<ComponentPreview name="meter/sizes" />

### Colors

<ComponentPreview name="meter/colors" />

### Without Label

When no visible label is needed, use `aria-label` for accessibility.

<ComponentPreview name="meter/without-label" />

### Custom Value Scale

Use `min-value`, `max-value`, and `format-options` to customize the value range and display format.

<ComponentPreview name="meter/custom-value" />

## Customization

### Tailwind CSS

Use the `class` prop for the root and the `ui` prop for the label, output, track and fill:

<ComponentPreview name="meter/custom-styles" />

### Global theme override

Override the `meter` theme app-wide with `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      meter: {
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

| `ui` key | `data-slot`    | Description                                      |
| -------- | -------------- | ------------------------------------------------ |
| `base`   | `meter`        | Base container (grid layout)                     |
| `label`  | `label`        | Label text (Label theme plus the grid placement) |
| `output` | `meter-output` | Value text display                               |
| `track`  | `meter-track`  | Track background                                 |
| `fill`   | `meter-fill`   | Filled portion of the track                      |

### CSS Classes

HareUI follows the [BEM](https://getbem.com/) methodology to keep component variants and states reusable and easy to customize. The Meter component uses these CSS classes ([View source styles](https://github.com/alexzvn/hareui/blob/main/packages/vue/src/components/meter/meter.css)):

#### Base & Element Classes

- `.h-meter` - Base container (grid layout)
- `.h-meter__output` - Value text display
- `.h-meter__track` - Track background
- `.h-meter__fill` - Filled portion of the track

The label is styled through `.h-meter [data-slot='label']`, on top of the Label classes.

#### Size Classes

- `.h-meter--sm` - Small size variant (thinner track)
- `.h-meter--lg` - Large size variant (thicker track)

The default `md` size adds no class.

#### Color Classes

- `.h-meter--default` - Default color variant
- `.h-meter--accent` - Accent color variant
- `.h-meter--success` - Success color variant
- `.h-meter--warning` - Warning color variant
- `.h-meter--danger` - Danger color variant

The classes sit in `@layer components`, so a utility you pass through `class` or `ui` wins over them.

## API Reference

### Props

<ApiTable component="Meter" kind="props" />

### Slots

<ApiTable component="Meter" kind="slots" />

`#label` and `#output` receive:

| Prop         | Type     | Description                         |
| ------------ | -------- | ----------------------------------- |
| `percentage` | `number` | The percentage of the meter (0-100) |
| `valueText`  | `string` | The formatted value text            |

## Theme

<ApiTheme component="Meter" />
