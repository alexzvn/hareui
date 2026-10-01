---
title: Tooltip
description: Displays informative text when users hover over or focus on an element
links:
  reka: tooltip
  source: Tooltip.vue
  styles: tooltip.ts
  heroui: tooltip
---

## Usage

```ts
import { Tooltip } from 'herouse'
```

<ComponentPreview name="tooltip/basic" />

## Anatomy

Each `Tooltip` instance owns its own Reka `TooltipProvider`, so no app-level provider is
needed. The first child is the trigger (`as-child`, merged directly onto its own root
element — no extra wrapper is rendered); `text` or the `#content` slot supplies the
floating content.

```vue
<Tooltip text="Helpful information about this element">
  <Button>Hover for tooltip</Button>
</Tooltip>

<!-- or, with the content slot and an arrow -->
<Tooltip arrow>
  <template #default><Button>Hover for tooltip</Button></template>
  <template #content>Helpful information about this element</template>
</Tooltip>
```

`ui` keys: `base`, `arrow`.

## Examples

### Placement

<ComponentPreview name="tooltip/placement" />

### With Arrow

<ComponentPreview name="tooltip/with-arrow" />

### Custom Triggers

The default slot's root element becomes the trigger. To use non-focusable content (an `Avatar`,
a `Chip`, an icon), wrap it in an `inline-block` element with `role="button"` and `tabindex="0"`
(the equivalent of HeroUI's `Tooltip.Trigger`) so the tooltip stays reachable from the keyboard.

<ComponentPreview name="tooltip/custom-trigger" />

## Customization

### Tailwind CSS

<ComponentPreview name="tooltip/custom-styles" />

### Global Configuration

To customize the Tooltip classes for the whole app, extend the `tooltip` theme in `createHeroUse`:

```ts
app.use(createHeroUse({
  ui: {
    tooltip: {
      slots: { base: 'rounded-xl shadow-lg' },
    },
  },
}))
```

## Styling Reference

| `ui` key | `data-slot` | Element |
|---|---|---|
| `base` | — | The floating content (Reka `TooltipContent`) |
| `arrow` | `overlay-arrow` | The arrow SVG, rendered when `arrow` is `true` |

### Interactive States

- `data-[state=delayed-open]` / `data-[state=instant-open]` — applied while the tooltip is
  open (entrance animation), mapped from HeroUI's `[data-entering]`
- `data-[state=closed]` — applied while closing (exit animation), mapped from HeroUI's
  `[data-exiting]`
- `data-[side="top|right|bottom|left"]` — the resolved placement, mapped from HeroUI's
  `[data-placement]`

## API Reference

### Props

<ApiTable component="Tooltip" kind="props" />

### Slots

<ApiTable component="Tooltip" kind="slots" />

### Emits

<ApiTable component="Tooltip" kind="emits" />

## Related Components

- [Button](/docs/components/button)
- [Popover](/docs/components/popover)
