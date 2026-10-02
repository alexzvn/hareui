---
title: Fieldset
description: Group related form controls with legends, descriptions, and actions
links:
  source: Fieldset.vue
  styles: fieldset.ts
  heroui: fieldset
---

## Usage

```ts
import { Fieldset } from 'herouse'
```

<ComponentPreview name="fieldset/basic" />

## Anatomy

HeroUI's compound parts (`Fieldset.Legend`, `Fieldset.Group`, `Fieldset.Actions`) become props and
named slots, rendered in a fixed order: legend, description, field group, then actions.

```vue
<Fieldset legend="…" description="…">
  <template #legend /> <!-- or: replaces the legend text -->
  <template #description /> <!-- or: replaces the description text -->
  <!-- default slot = form fields, wrapped in the field group -->
  <template #actions /> <!-- action buttons or helper text -->
</Fieldset>
```

- Each part renders only when its prop or slot is provided.
- `disabled` sets the native `disabled` attribute and `data-disabled="true"`, and disables herouse
  controls inside (such as `Button` and `Link`) the same way HeroUI's fieldset does.

`ui` keys: `base`, `legend`, `description`, `fieldGroup`, `actions`.

## Examples

### In Surface

When used inside a [Surface](/docs/components/surface) component, use `variant="secondary"` on form controls (Input, TextArea, etc.) to apply the lower emphasis variant suitable for surface backgrounds.

<ComponentPreview name="fieldset/on-surface" />

## Customization

### Tailwind CSS

<ComponentPreview name="fieldset/custom-styles" />

### Global theme override

Override the `fieldset` theme app-wide with `createHeroUse`:

```ts
app.use(createHeroUse({
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
}))
```

## Styling Reference

Each rendered element carries the same `data-slot` string as HeroUI, so selectors translate 1:1.

| `ui` key | `data-slot` | Description |
|---|---|---|
| `base` | `fieldset` | Root container |
| `legend` | `fieldset-legend` | Legend element |
| `description` | `description` | Description below the legend |
| `fieldGroup` | `fieldset-field-group` | Wrapper for grouped fields |
| `actions` | `fieldset-actions` | Action bar below the fields |

## API Reference

### Props

<ApiTable component="Fieldset" kind="props" />

### Slots

<ApiTable component="Fieldset" kind="slots" />

## Related Components

<RelatedComponents :components="['form', 'text-field', 'surface']" />
