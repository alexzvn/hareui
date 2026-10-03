---
title: Accordion
description: A collapsible content panel for organizing information in a compact space
links:
  source: Accordion.vue
  styles: accordion.ts
  heroui: accordion
---

## Usage

```vue
<script setup lang="ts">
import { Accordion } from '@hareui/vue'
</script>
```

<ComponentPreview name="accordion/basic" minHeight="400px" />

## Anatomy

Accordion renders one item per `items` entry: a heading with a trigger button (leading content,
label, indicator) and a collapsible panel holding the body. HeroUI's compound parts
(`Accordion.Item`, `Accordion.Heading`, `Accordion.Trigger`, `Accordion.Indicator`,
`Accordion.Panel`, `Accordion.Body`) become `items`, slots and `ui` keys:

```vue
<template>
  <Accordion :items="items" v-model="expanded">
    <template #leading="{ item, index, open }" />   <!-- before the label (e.g. an icon) -->
    <template #label="{ item, index, open }" />     <!-- replaces item.label -->
    <template #indicator="{ item, index, open }" /> <!-- Accordion.Indicator's children -->
    <template #content="{ item, index, open }" />   <!-- fallback body content -->
    <template #[item.slot]="{ item, index, open }" /> <!-- per-item body content -->
  </Accordion>
</template>
```

- A single root element in `#indicator` receives the indicator classes and `data-expanded`, like
  HeroUI's `Accordion.Indicator` children, so any icon rotates when its item expands.
- Extra fields on an item (icons, subtitles, …) are passed through to the slots as `item`.
- `Accordion.Body`'s `className` maps to the `bodyInner` `ui` key.

| `ui` key | `data-slot` | Element |
|---|---|---|
| `base` | `accordion` | root element |
| `item` | `accordion-item` | one per item |
| `heading` | `accordion-heading` | `<h3>` around the trigger |
| `trigger` | `accordion-trigger` | the expand/collapse button |
| `indicator` | `accordion-indicator` | chevron (or `#indicator` content) |
| `panel` | `accordion-panel` | collapsible panel |
| `body` | `accordion-body` | content body container |
| `bodyInner` | – | padded wrapper inside the body (HeroUI's `Accordion.Body` `className` target) |

### Typing items

`items` takes the exported `AccordionItem` type. Extra fields are kept: extend the type, and the slots receive your type, so no casts are needed.

```ts
import type { AccordionItem } from '@hareui/vue'

interface MyItem extends AccordionItem {
  icon: string
}

const items: MyItem[] = [/* ... */]
// <template #leading="{ item }"> — item.icon is a string
```

## Examples

### Surface

<ComponentPreview name="accordion/surface" minHeight="400px" />

### Without Separator

<ComponentPreview name="accordion/without-separator" minHeight="400px" />

### Multiple Expanded

<ComponentPreview name="accordion/multiple" minHeight="524px" />

### Disabled State

<ComponentPreview name="accordion/disabled" minHeight="524px" />

### Controlled

<ComponentPreview name="accordion/controlled" minHeight="400px" />

### Custom Indicator

<ComponentPreview name="accordion/custom-indicator" minHeight="320px" />

### FAQ Layout

<ComponentPreview name="accordion/faq" minHeight="720px" />

## Customization

### Tailwind CSS

<ComponentPreview name="accordion/custom-styles" />

### Global Configuration

To customize the Accordion classes for the whole app, extend the `accordion` theme in `createHareUI`:

```ts
app.use(createHareUI({
  ui: {
    accordion: {
      slots: {
        base: 'rounded-xl bg-gray-50',
        trigger: 'font-semibold text-lg',
      },
      variants: {
        variant: {
          surface: { base: 'shadow-lg border-2' },
        },
      },
    },
  },
}))
```

## Styling Reference

### Slots

- `base` → `[data-slot="accordion"]` – base accordion container
- `body` → `[data-slot="accordion-body"]` – content body container
- `bodyInner` – padded wrapper inside the body
- `heading` → `[data-slot="accordion-heading"]` – heading wrapper
- `indicator` → `[data-slot="accordion-indicator"]` – expand/collapse indicator icon
- `item` → `[data-slot="accordion-item"]` – individual accordion item
- `panel` → `[data-slot="accordion-panel"]` – collapsible panel container
- `trigger` → `[data-slot="accordion-trigger"]` – clickable trigger button

#### Variants

- `variant="surface"` – surface background with rounded corners

#### State Attributes

- `[data-slot="accordion-trigger"][aria-expanded="true"]` – expanded state
- `[data-slot="accordion-panel"][aria-hidden="false"]` – panel visible state

### Interactive States

The component supports both CSS pseudo-classes and data attributes for flexibility:

- **Hover**: `:hover` on trigger
- **Focus**: `:focus-visible` on trigger
- **Disabled**: `:disabled` on trigger, `[data-disabled="true"]` on item
- **Expanded**: `[aria-expanded="true"]` on trigger, `[data-expanded="true"]` on item, panel and indicator

## API Reference

### Props

<ApiTable component="Accordion" kind="props" />

### Slots

<ApiTable component="Accordion" kind="slots" />

### Emits

<ApiTable component="Accordion" kind="emits" />

### useDisclosureGroupNavigation

Previous/next navigation for a controlled Accordion or DisclosureGroup (used by the Controlled example).

| Option | Type | Default | Description |
|------|------|---------|-------------|
| `expandedKeys` | `MaybeRefOrGetter<ExpandedValue[]>` | - | The current `v-model` value |
| `itemIds` | `MaybeRefOrGetter<ExpandedValue[]>` | - | Every item's `value`, in display order |
| `onExpandedChange` | `(keys: ExpandedValue[]) => void` | - | Called with the new expanded values |
| `multiple` | `MaybeRefOrGetter<boolean>` | `false` | Keep previously expanded items open while navigating |

Returns `currentIndex`, `isPrevDisabled`, `isNextDisabled` (computed refs) and `onPrevious`, `onNext`.

## Related Components

<RelatedComponents :components="['disclosure-group', 'disclosure']" />
