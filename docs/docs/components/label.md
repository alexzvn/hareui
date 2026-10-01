---
title: Label
description: Renders an accessible label associated with form controls
links:
  reka: label
  source: Label.vue
  styles: label.ts
  heroui: label
---

## Usage

```vue
<script setup lang="ts">
import { Label } from 'herouse'
</script>
```

<ComponentPreview name="label/basic" />

## Anatomy

Label renders a single `<label>` element (Reka UI `Label`).

| `ui` key | `data-slot` | Element |
|---|---|---|
| `base` | `label` | `<label>` |

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

Pass utilities through `class` (root) or `:ui="{ base: '…' }"`; they are merged with tailwind-merge, so conflicting utilities replace the defaults.

<ComponentPreview name="label/custom-styles" />

### Global Configuration

Override the theme for every Label with `createHeroUse`:

```ts
import { createHeroUse } from 'herouse'

app.use(createHeroUse({
  ui: {
    label: {
      slots: { base: 'font-semibold text-foreground' },
      variants: { required: { true: { base: 'after:text-accent' } } },
    },
  },
}))
```

## Styling Reference

### Slots

- `base` → `[data-slot="label"]` — text styling (`text-sm font-medium text-foreground`)

### State Variants

- `required` prop, or a parent with `[data-required="true"]` — shows the required asterisk (`::after`)
- `disabled` prop, or an ancestor with `[data-disabled="true"]` — disabled styling
- `invalid` prop, or an ancestor with `[data-invalid="true"]` / `[aria-invalid="true"]` — danger text color

**Note**: The parent-driven asterisk excludes parents with `role="group"`, `role="radiogroup"` or `role="checkboxgroup"`, and items with `data-slot="radio"` or `data-slot="checkbox"`, preventing duplicate asterisks in group components.

## API Reference

### Props

<ApiTable component="Label" kind="props" />

### Slots

<ApiTable component="Label" kind="slots" />

## Accessibility

The Label component is built on the native HTML `<label>` element ([MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label)) and follows WAI-ARIA best practices:

- Associates with form controls using the `for` attribute
- Provides semantic HTML `<label>` element
- Supports keyboard navigation when associated with form controls
- Communicates required and invalid states to screen readers
- Clicking the label focuses/activates the associated form control

## Related Components

- [TextField](/docs/components/text-field)
- [Input](/docs/components/input)
- [Description](/docs/components/description)
