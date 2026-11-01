---
title: TrendChip
description: A chip that shows a metric change, coloured and arrowed by its direction
links:
  source: trend-chip/TrendChip.vue
  styles: trend-chip/theme.ts
---

## Usage

```ts
import { TrendChip } from '@hareui/vue'
```

<ComponentPreview name="trend-chip/basic" />

## Anatomy

```vue
<TrendChip trend="up">
  <template #prefix />
  <template #indicator />
  +3.2%
  <template #suffix />
</TrendChip>
```

## Examples

### Trends

`up` uses the success colour with an up arrow, `down` danger with a down arrow, and `neutral` the default colour
with no arrow. The root carries `data-trend`.

<ComponentPreview name="trend-chip/trends" />

### Sizes

<ComponentPreview name="trend-chip/sizes" />

### Variants

<ComponentPreview name="trend-chip/variants" />

### Prefix and Suffix

Use the `prefix` and `suffix` slots for text around the value, such as a metric name or a comparison period. The
suffix is muted, and the parts are separated by spaces.

<ComponentPreview name="trend-chip/prefix-suffix" />

### Custom Indicator

The `indicator` slot replaces the arrow. It also adds an indicator to the `neutral` trend, which has no arrow by
default. Mark a decorative icon `aria-hidden="true"`.

<ComponentPreview name="trend-chip/custom-indicator" />

## Accessibility

The chip is static text. The arrow is decorative, so the value should carry its sign (`+3.2%`, `-1.4%`) for screen
reader users.

## Styling Reference

| `ui` key    | `data-slot`            | Description                               |
| ----------- | ---------------------- | ----------------------------------------- |
| `base`      | `chip`                 | Root, with `data-trend`                   |
| `label`     | `chip-label`           | Wrapper around prefix, value and suffix   |
| `indicator` | `trend-chip-indicator` | Default arrow (12 / 14 / 16 px by size)   |
| `prefix`    | `trend-chip-prefix`    | Text before the value                     |
| `value`     | `trend-chip-value`     | The value, in tabular numerals            |
| `suffix`    | `trend-chip-suffix`    | Text after the value, in the muted colour |

## API Reference

### Props

<ApiTable component="TrendChip" kind="props" />

### Slots

<ApiTable component="TrendChip" kind="slots" />

## Theme

<ApiTheme component="TrendChip" />

## Related Components

<RelatedComponents :components="['chip', 'badge']" />
