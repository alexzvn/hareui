---
title: Fieldset
description: Group related form controls with legends, descriptions, and actions
links:
  source: fieldset/Fieldset.vue
  styles: fieldset/theme.ts
  heroui: fieldset
---

## Usage

```ts
import { Fieldset } from '@hareui/vue'
```

<ComponentPreview name="fieldset/basic" />

## Anatomy

Fieldset is composed through props and named slots, rendered in a fixed order: legend, description, field group, then actions.

```vue
<Fieldset legend="…" description="…">
  <template #legend /> <!-- or: replaces the legend text -->
  <template #description /> <!-- or: replaces the description text -->
  <!-- default slot = form fields, wrapped in the field group -->
  <template #actions /> <!-- action buttons or helper text -->
</Fieldset>
```

- Each part renders only when its prop or slot is provided.
- `disabled` disables the fieldset natively and sets `data-disabled="true"`. HareUI controls inside, such as `Button` and `Link`, are disabled too.

## Examples

### In Surface

When used inside a [Surface](/docs/components/surface) component, use `variant="secondary"` on form controls (Input, TextArea, etc.) to apply the lower emphasis variant suitable for surface backgrounds.

<ComponentPreview name="fieldset/on-surface" />

## Customization

### Tailwind CSS

<ComponentPreview name="fieldset/custom-styles" />

### Global theme override

Override the `fieldset` theme app-wide with `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      fieldset: {
        slots: {
          base: 'gap-5 rounded-xl border border-border/60 bg-surface p-6 shadow-field',
          legend: 'text-lg font-semibold',
          fieldGroup: 'gap-3 md:grid md:grid-cols-2',
          actions: 'flex justify-end gap-2 pt-2',
        },
      },
    },
  }),
)
```

## Styling Reference

Each rendered element carries a `data-slot` attribute, so you can target it with selectors.

| `ui` key      | `data-slot`            | Description                  |
| ------------- | ---------------------- | ---------------------------- |
| `base`        | `fieldset`             | Root container               |
| `legend`      | `fieldset-legend`      | Legend element               |
| `description` | `description`          | Description below the legend |
| `fieldGroup`  | `fieldset-field-group` | Wrapper for grouped fields   |
| `actions`     | `fieldset-actions`     | Action bar below the fields  |

### CSS Classes

HareUI follows the [BEM](https://getbem.com/) methodology to keep component variants and states reusable and easy to customize. The Fieldset component uses these CSS classes ([View source styles](https://github.com/alexzvn/hareui/blob/main/packages/vue/src/components/fieldset/fieldset.css)):

#### Base Classes

- `.h-fieldset` - Root container
- `.h-fieldset__legend` - Legend element
- `.h-fieldset__field-group` - Wrapper for grouped fields
- `.h-fieldset__actions` - Action bar below the fields

The classes sit in `@layer components`, so a utility you pass through `class` or `ui` wins over them.

## API Reference

### Props

<ApiTable component="Fieldset" kind="props" />

### Slots

<ApiTable component="Fieldset" kind="slots" />

## Theme

<ApiTheme component="Fieldset" />

## Related Components

<RelatedComponents :components="['form', 'text-field', 'surface']" />
