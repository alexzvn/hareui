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

Each `Tooltip` brings its own provider, so no app-level provider is needed.
The first child is the trigger. The tooltip attaches to that element directly, with no extra wrapper.
Set `text` or use the `#content` slot for the floating content.

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

## Examples

### Placement

<ComponentPreview name="tooltip/placement" />

### With Arrow

<ComponentPreview name="tooltip/with-arrow" />

### Custom Triggers

The default slot's root element becomes the trigger. Some content can't take focus, such as an `Avatar`, a `Chip` or an icon.
Wrap it in an `inline-block` element with `role="button"` and `tabindex="0"`, so the tooltip stays reachable from the keyboard.

<ComponentPreview name="tooltip/custom-trigger" />

### Keyboard Shortcuts

`kbds` shows a keyboard shortcut after the text, one key per entry. A string that names a known key renders its
symbol, so `'command'` shows ⌘. Any other string renders as written. Pass `Kbd` props for full control.
The shortcut is hidden on screens narrower than the `lg` breakpoint, and when you use the `content` slot.

<ComponentPreview name="tooltip/kbds" />

### Delays and Focus-Only Trigger

The tooltip opens after `delay`, which defaults to 1500 ms. It closes after `close-delay`, which defaults to 500 ms.
The close delay applies only when the pointer leaves the trigger or tooltip. Moving back in cancels it.
Blur, press, Escape and another tooltip opening close it immediately.

`trigger="focus"` opens the tooltip only when the trigger gets focus. Hovering neither opens nor closes it.

```vue
<Tooltip :delay="0" :close-delay="1000" text="Stays open for a second">
  <Button variant="secondary">Close delay</Button>
</Tooltip>

<Tooltip trigger="focus" text="Shown on focus only">
  <Button variant="secondary">Focus me</Button>
</Tooltip>
```

### Delay Behaviour

- Each tooltip waits for its own `delay`, even right after another tooltip has closed.
- Delays are props, not CSS variables: setting `--tooltip-delay` / `--tooltip-close-delay` has no effect.

## Customization

### Tailwind CSS

<ComponentPreview name="tooltip/custom-styles" />

### Global Configuration

To customize the Tooltip classes for the whole app, extend the `tooltip` theme in `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      tooltip: {
        slots: { base: 'rounded-xl shadow-lg' },
      },
    },
  }),
)
```

## Styling Reference

| `ui` key | `data-slot`     | Element                                        |
| -------- | --------------- | ---------------------------------------------- |
| `base`   | —               | The floating content                           |
| `arrow`  | `overlay-arrow` | The arrow SVG, rendered when `arrow` is `true` |

### CSS Classes

HareUI follows the [BEM](https://getbem.com/) methodology to keep component variants and states reusable and easy to customize. The Tooltip component uses these CSS classes ([View source styles](https://github.com/alexzvn/hareui/blob/main/packages/vue/src/components/tooltip/tooltip.css)):

#### Base Classes

- `.h-tooltip` - Base tooltip styles with animations, including its arrow
- `.h-tooltip__kbds` - The keyboard shortcuts after the text, hidden on small screens

The classes sit in `@layer components`, so a utility you pass through `class` or `ui` wins over them.

### Interactive States

- `data-[state=delayed-open]` / `data-[state=instant-open]` — applied while the tooltip is
  open (entrance animation)
- `data-[state=closed]` — applied while closing (exit animation)
- `data-[side="top|right|bottom|left"]` — the resolved placement

## API Reference

### Props

<ApiTable component="Tooltip" kind="props" />

### Slots

<ApiTable component="Tooltip" kind="slots" />

### Emits

<ApiTable component="Tooltip" kind="emits" />

## Theme

<ApiTheme component="Tooltip" />

## Related Components

<RelatedComponents :components="['button', 'popover']" />
