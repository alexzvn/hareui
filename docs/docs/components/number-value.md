---
title: NumberValue
description: A number formatted for the locale, as currency, a percentage, a unit or in compact notation.
links:
  source: number-value/NumberValue.vue
  styles: number-value/theme.ts
---

## Usage

Pass the number in `value`. It is formatted with `Intl.NumberFormat` and drawn with tabular numerals, so values stacked in a column line up. Size, weight and colour come from the surrounding text or from `class`.

```ts
import { NumberValue } from '@hareui/vue'
```

<ComponentPreview name="number-value/basic" />

## Anatomy

```vue
<NumberValue :value="value">
  <template #prefix />                       <!-- optional: before the number -->
  <template #default="{ formatted, value }" /> <!-- optional: replaces the number -->
  <template #suffix />                       <!-- optional: after the number -->
</NumberValue>
```

The root is a `span` with a `value` part between optional `prefix` and `suffix` parts, so it sits inline in running text.

## Examples

### Currency

Set `format` to `currency` and pass an ISO 4217 code in `currency`. The symbol, its position and the separators follow the locale.

<ComponentPreview name="number-value/currency" />

### Percent

Set `format` to `percent`. The value is a fraction: `0.25` shows as 25%. Use `maximum-fraction-digits` to keep decimals.

<ComponentPreview name="number-value/percent" />

### Compact

Set `notation` to `compact` to shorten large numbers (5.3K, 2.5M). `scientific` and `engineering` are also available.

<ComponentPreview name="number-value/compact" />

### Unit

Set `format` to `unit` and pass a unit identifier such as `kilometer`, `celsius` or `megabyte` in `unit`.

<ComponentPreview name="number-value/unit" />

### Sign display

Use `sign-display` to choose when the sign shows:

- `auto` (default): negative numbers only
- `always`: every number, zero included
- `exceptZero`: positive and negative numbers, not zero
- `never`: no sign

<ComponentPreview name="number-value/sign-display" />

### Format options

Pass any `Intl.NumberFormat` options in `options`. An option wins over the prop that sets the same thing. Use it for
options that have no prop, such as `currencySign` or significant digits.

<ComponentPreview name="number-value/options" />

### Locale

The locale comes from the nearest `App` (or Reka UI `ConfigProvider`) and defaults to `en`. The `locale` prop overrides it for one value.

<ComponentPreview name="number-value/locale" />

### Prefix and suffix

Use the `prefix` and `suffix` slots for text around the number, such as a unit label or a billing period. No space is
added between the parts: put it in the slot text (`"from "`, `" downloads"`).

<ComponentPreview name="number-value/prefix-suffix" />

### Custom rendering

The default slot receives the formatted string and the raw value, for example to colour a change by its sign.

<ComponentPreview name="number-value/render" />

### Tabular numerals

Every digit takes the same width, so amounts in a right-aligned column line up and a value that updates doesn't shift its neighbours.

<ComponentPreview name="number-value/tabular-nums" />

## Accessibility

- The value is plain inline text, so screen readers read the formatted string as written for the locale.
- Put the spaces around the number in the `prefix` and `suffix` text. A margin alone looks right but lets screen
  readers run the words together.
- Formatting follows the `App` locale, but `NumberValue` sets no `lang` attribute. When a value is formatted for a
  different language than the page, wrap it in an element with that `lang`.

## Styling Reference

| `ui` key | `data-slot`           | Description                              |
| -------- | --------------------- | ---------------------------------------- |
| `base`   | `number-value`        | Root `span`, in tabular numerals         |
| `prefix` | `number-value-prefix` | Wrapper around the `prefix` slot         |
| `value`  | `number-value-value`  | The formatted number or the default slot |
| `suffix` | `number-value-suffix` | Wrapper around the `suffix` slot         |

## API Reference

### Props

<ApiTable component="NumberValue" kind="props" />

### Slots

<ApiTable component="NumberValue" kind="slots" />

## Theme

<ApiTheme component="NumberValue" />

## Related Components

<RelatedComponents :components="['metric', 'trend-chip', 'number-field']" />
