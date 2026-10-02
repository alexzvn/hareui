---
title: SearchField
description: A text field for search queries, with a search icon and a clear button
links:
  source: SearchField.vue
  styles: searchField.ts
  heroui: search-field
---

## Usage

```vue
<script setup lang="ts">
import { SearchField } from 'herouse'
</script>
```

<ComponentPreview name="search-field/basic" />

## Anatomy

SearchField renders a [Label](/docs/components/label), a group holding a search icon, a native `type="search"` input and a clear button, then a [Description](/docs/components/description) and a [FieldError](/docs/components/field-error). The text parts come from props; each can be replaced with a slot, and the icons can be replaced too.

```vue
<template>
  <SearchField label="…" description="…" error-message="…" :invalid="…">
    <template #label />      <!-- Label content -->
    <template #icon />       <!-- search icon content (default: magnifier icon) -->
    <template #clearIcon />  <!-- clear button icon content (default: × icon) -->
    <template #description />  <!-- Description content -->
    <template #error="{ isInvalid, validationErrors, validationDetails }" /> <!-- FieldError content, rendered while invalid -->
  </SearchField>
</template>
```

| `ui` key | `data-slot` | Element |
|---|---|---|
| `base` | `search-field` | `<div>` root |
| — | `label` | [Label](/docs/components/label) (iff `label` / `#label`) |
| `group` | `search-field-group` | `<div>` wrapping the icon, input and clear button |
| `searchIcon` | `search-field-search-icon` | `<span>` (default icon or `#icon`) |
| `input` | `search-field-input` | `<input type="search">` |
| `clearButton` | `search-field-clear-button` | [CloseButton](/docs/components/close-button) (default icon or `#clearIcon`), hidden via CSS while empty |
| — | `description` | [Description](/docs/components/description) (iff `description` / `#description`) |
| — | `field-error` | [FieldError](/docs/components/field-error) (while invalid, iff `error-message` / `#error` / validation errors) |

## Examples

### In Surface

When used inside a surface (HeroUI's [Surface](/docs/components/surface), here a `bg-surface` container), use `variant="secondary"` to apply the lower emphasis variant suitable for surface backgrounds.

<ComponentPreview name="search-field/on-surface" />

### With Description

<ComponentPreview name="search-field/with-description" />

### Required Field

<ComponentPreview name="search-field/required" />

### Disabled State

<ComponentPreview name="search-field/disabled" />

### Full Width

<ComponentPreview name="search-field/full-width" />

### Validation

Use `invalid` together with `error-message` to control the state yourself, or let the field validate: native attributes (`required`, …) and a `validate` function, inside a [Form](/docs/components/form) or on their own. Without `error-message`, the field shows the validation errors.

<ComponentPreview name="search-field/validation" />

### Controlled

Bind the value with `v-model` to synchronize counters, previews, or formatting. The clear button and <kbd>Escape</kbd> both empty it; pressing <kbd>Enter</kbd> emits `submit` with the current value.

<ComponentPreview name="search-field/controlled" />

### Form Example

<ComponentPreview name="search-field/form-example" />

### With Validation

<ComponentPreview name="search-field/with-validation" />

### Variants

<ComponentPreview name="search-field/variants" />

### Render Function

HeroUI's `render` prop replaces the root element. In Vue, attributes you pass to `SearchField` (other than `aria-label` / `aria-labelledby`, which go to the input) fall through to the root `div`.

<ComponentPreview name="search-field/render-function" />

## Customization

### Tailwind CSS

Use the `icon` and `clearIcon` slots to render custom icons, and `:ui` or `class` for styling.

<ComponentPreview name="search-field/custom-icons" />
<ComponentPreview name="search-field/custom-styles" />

### Global Configuration

```ts
app.use(createHeroUse({
  ui: { searchField: { slots: { base: 'gap-2' } } },
}))
```

## Styling Reference

### Slots

- `base` → `[data-slot="search-field"]` – root container (`flex flex-col gap-1`)
- `group` → `[data-slot="search-field-group"]` – bordered field shell (`inline-flex h-9 items-center rounded-field border`)
- `searchIcon` → `[data-slot="search-field-search-icon"]` – icon wrapper (`size-4 text-field-placeholder`)
- `input` → `[data-slot="search-field-input"]` – the native input
- `clearButton` → `[data-slot="search-field-clear-button"]` – [CloseButton](/docs/components/close-button) (`size-5`)

> **Note:** The child components ([Label](/docs/components/label), [Description](/docs/components/description), [FieldError](/docs/components/field-error)) have their own themes. See their respective pages for customization options.

### Interactive States

SearchField sets these data attributes:

- **Invalid**: `[data-invalid="true"]` on the root and the group - automatically hides the description when invalid
- **Disabled**: `[data-disabled="true"]` on the root and the group
- **Required**: `[data-required="true"]` on the root - shows the label's required asterisk
- **Read Only**: `[data-readonly="true"]` on the root
- **Empty**: `[data-empty="true"]` on the root - hides the clear button (`pointer-events-none opacity-0`) while there's no value
- **Focus Within**: `[data-focus-within="true"]` on the group - applied when the input is focused
- **Focus Visible**: `[data-focus-visible="true"]` on the group - applied when focus is visible (keyboard navigation)

## API Reference

### Props

<ApiTable component="SearchField" kind="props" />

### Slots

<ApiTable component="SearchField" kind="slots" />

### Emits

<ApiTable component="SearchField" kind="emits" />

## Accessibility

- The label's `for` points to the input id (auto-generated with `useId()` unless `id` is set)
- The input's `aria-describedby` lists the ids of the rendered description (`<id>-description`) and error (`<id>-error`)
- `invalid` sets `aria-invalid="true"` on the input; the error is announced via `role="alert"`
- `required` and `disabled` set the native attributes on the input
- The clear button is excluded from the tab order (`tabindex="-1"`) and labeled `"Clear search"`; clicking it refocuses the input instead of moving focus away
- <kbd>Escape</kbd> clears the field (and does nothing when it's already empty); <kbd>Enter</kbd> emits `submit` with the current value

## Related Components

- [Input](/docs/components/input)
- [TextField](/docs/components/text-field)
- [Label](/docs/components/label)
- [Description](/docs/components/description)
- [FieldError](/docs/components/field-error)
- [CloseButton](/docs/components/close-button)
