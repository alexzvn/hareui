---
title: Disclosure
description: A disclosure is a collapsible section with a header containing a heading and a trigger button, and a panel that wraps the content.
links:
  source: Disclosure.vue
  styles: disclosure.ts
  heroui: disclosure
---

## Usage

```ts
import { Disclosure } from 'herouse'
```

<ComponentPreview name="disclosure/basic" minHeight="440px" />

## Anatomy

HeroUI's compound parts (`Disclosure.Heading`, `Disclosure.Trigger`, `Disclosure.Indicator`,
`Disclosure.Content`, `Disclosure.Body`) become props and named slots:

```vue
<Disclosure title="…" v-model:open="open">
  <!-- replaces the trigger; render the themed chevron with <component :is="indicator" /> -->
  <template #trigger="{ open, indicator }" />
  <!-- replaces the chevron inside the default trigger -->
  <template #indicator="{ open }" />
  <!-- default slot = Disclosure.Body's content -->
</Disclosure>
```

- Without `#trigger`, a `<button data-slot="disclosure-trigger">` renders `title` followed by the indicator.
- With `#trigger`, the slotted element (e.g. `Button`) receives `aria-expanded`, `aria-controls` and the toggle handler, like HeroUI's `<Button slot="trigger">`.
- `Disclosure.Body`'s `className` maps to the `bodyInner` `ui` key.

`ui` keys: `base`, `heading`, `trigger`, `indicator`, `content`, `body`, `bodyInner`.

## Examples

### Render Function

<ComponentPreview name="disclosure/render-function" />

## Customization

### Tailwind CSS

<ComponentPreview name="disclosure/custom-styles" />

### Global CSS

To customize the Disclosure component classes app-wide, override the `disclosure` theme with `createHeroUse`:

```ts
app.use(createHeroUse({
  ui: {
    disclosure: {
      slots: {
        base: 'relative',
        trigger: 'cursor-pointer',
        indicator: 'transition-transform duration-300',
        content: 'overflow-hidden transition-all',
      },
    },
  },
}))
```

## Styling Reference

Each rendered element carries the same `data-slot` string as HeroUI, so selectors translate 1:1.

| `ui` key | `data-slot` | Description |
|---|---|---|
| `base` | `disclosure` | Base container styles |
| `heading` | `disclosure-heading` | Heading wrapper |
| `trigger` | `disclosure-trigger` | Trigger button styles |
| `indicator` | `disclosure-indicator` | Chevron indicator styles |
| `content` | `disclosure-content` | Content container with animations |

### Interactive States

The component supports both CSS pseudo-classes and data attributes for flexibility:

- **Expanded**: `[data-expanded="true"]` on indicator for rotation
- **Focus**: `:focus-visible` on trigger
- **Disabled**: `:disabled` or `[aria-disabled="true"]` on trigger
- **Hidden**: `[aria-hidden="false"]` on content for visibility

## API Reference

### Props

<ApiTable component="Disclosure" kind="props" />

### Slots

<ApiTable component="Disclosure" kind="slots" />

### Emits

<ApiTable component="Disclosure" kind="emits" />

## Related Components

- [Button](/docs/components/button)
- [Card](/docs/components/card)
