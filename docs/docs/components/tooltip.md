---
title: Tooltip
description: Displays informative text when users hover over or focus on an element
links:
  reka: tooltip
  source: tooltip/Tooltip.vue
  styles: tooltip/theme.ts
  heroui: tooltip
---

## Usage

```ts
import { Tooltip } from '@hareui/vue'
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

### Delays and Focus-Only Trigger

`delay` (default `1500`) and `close-delay` (default `500`) match HeroUI's `--tooltip-delay` / `--tooltip-close-delay` defaults. The close delay applies only when the pointer leaves the trigger or tooltip; moving back in cancels it. Blur, press, Escape and another tooltip opening close it immediately. `trigger="focus"` opens the tooltip only when the trigger gets focus, and hovering neither opens nor closes it.

```vue
<Tooltip :delay="0" :close-delay="1000" text="Stays open for a second">
  <Button variant="secondary">Close delay</Button>
</Tooltip>

<Tooltip trigger="focus" text="Shown on focus only">
  <Button variant="secondary">Focus me</Button>
</Tooltip>
```

### Known differences from HeroUI

- **No cross-tooltip warm-up.** React Aria shares one global timer, so once any tooltip has opened, the next one opens instantly. Each HareUI Tooltip has its own Reka provider, so every tooltip waits for its own `delay`.
- **Sub-pixel position drift.** Reka positions the content with floating-ui and React Aria uses its own overlay maths. The two can differ by under a pixel.
- **Delays are props, not CSS variables.** HeroUI reads its defaults from `--tooltip-delay` / `--tooltip-close-delay` at runtime. HareUI uses the same values as prop defaults, so changing those variables has no effect.

## Customization

### Tailwind CSS

<ComponentPreview name="tooltip/custom-styles" />

### Global Configuration

To customize the Tooltip classes for the whole app, extend the `tooltip` theme in `createHareUI`:

```ts
app.use(createHareUI({
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

### Theme

<ApiTheme component="Tooltip" />

## Related Components

<RelatedComponents :components="['button', 'popover']" />
