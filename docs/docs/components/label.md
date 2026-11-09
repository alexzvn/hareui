---
title: Label
description: Renders an accessible label associated with form controls
links:
  reka: label
  source: label/Label.vue
  styles: label/theme.ts
  heroui: label
---

## Usage

```vue
<script setup lang="ts">
import { Label } from '@hareui/vue'
</script>
```

<ComponentPreview name="label/basic" />

## Anatomy

Label renders a single `<label>` element.

| `ui` key | `data-slot` | Element   |
| -------- | ----------- | --------- |
| `base`   | `label`     | `<label>` |

## Examples

### With Required Indicator

```vue
<Label for="email" required>
  Email Address
</Label>
<Input id="email" type="email" />
```

### With Disabled State

```vue
<Label for="username" disabled>
  Username
</Label>
<Input id="username" disabled />
```

### With Invalid State

```vue
<Label for="password" invalid>
  Password
</Label>
<Input id="password" invalid />
```

## Customization

### Tailwind CSS

Pass utilities through `class` on the root, or through `:ui="{ base: '…' }"`. Label's own styles are `.h-label` classes in `@layer components`, so any utility you add wins.

<ComponentPreview name="label/custom-styles" />

### Global Configuration

Override the theme for every Label with `createHareUI`:

```ts
import { createHareUI } from '@hareui/vue'

app.use(
  createHareUI({
    ui: {
      label: {
        slots: { base: 'font-semibold text-foreground' },
        variants: { required: { true: { base: 'after:text-accent' } } },
      },
    },
  }),
)
```

## Styling Reference

### Slots

- `base` → `[data-slot="label"]` — text styling (`text-sm font-medium text-foreground`)

### State Variants

- `required` prop, or a parent with `[data-required="true"]` — shows the required asterisk (`::after`)
- `disabled` prop, or an ancestor with `[data-disabled="true"]` — disabled styling
- `invalid` prop, or an ancestor with `[data-invalid="true"]` / `[aria-invalid="true"]` — danger text color

**Note**: The parent-driven asterisk skips these parents, to avoid duplicate asterisks in group components:

- groups: `role="group"`, `role="radiogroup"` or `role="checkboxgroup"`
- items: `data-slot="radio"` or `data-slot="checkbox"`

### CSS Classes

HareUI follows the [BEM](https://getbem.com/) methodology to keep component variants and states reusable and easy to customize. The Label component uses these CSS classes ([View source styles](https://github.com/alexzvn/hareui/blob/main/packages/vue/src/components/label/label.css)):

#### Base Classes

- `.h-label` - Base label styles

#### State Modifier Classes

- `.h-label--required` - Shows the required asterisk
- `.h-label--disabled` - Disabled state styling
- `.h-label--invalid` - Invalid state styling (danger text color)

The same states also follow a `[data-required]`, `[data-disabled]` or `[data-invalid]` parent field.

The classes sit in `@layer components`, so a utility you pass through `class` or `ui` wins over them.

## API Reference

### Props

<ApiTable component="Label" kind="props" />

### Slots

<ApiTable component="Label" kind="slots" />

## Theme

<ApiTheme component="Label" />

## Accessibility

The Label component is built on the native HTML `<label>` element ([MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label)) and follows WAI-ARIA best practices:

- Associates with form controls using the `for` attribute
- Provides semantic HTML `<label>` element
- Supports keyboard navigation when associated with form controls
- Communicates required and invalid states to screen readers
- Clicking the label focuses/activates the associated form control

## Related Components

<RelatedComponents :components="['text-field', 'input', 'description']" />
