---
title: Popover
description: Displays rich content in a portal, anchored to a trigger element
links:
  source: popover/Popover.vue
  styles: popover/theme.ts
  heroui: popover
---

## Usage

```ts
import { Popover } from '@hareui/vue'
```

<ComponentPreview name="popover/basic" />

## Anatomy

- The default slot's first child is the trigger. The slot receives the current `open` state.
- Set the `title` prop or fill the `#title` slot to add a heading.
- The `#content` slot renders the body. It receives a `close` function.

```vue
<Popover title="Title" arrow>
  <Button>Trigger</Button>
  <template #content="{ close }">
    Content
  </template>
</Popover>
```

## Examples

### Placement

<ComponentPreview name="popover/placement" />

### With Arrow

<ComponentPreview name="popover/with-arrow" />

### Interactive Content

<ComponentPreview name="popover/interactive" />

### Non-modal

By default, a `click` popover makes the rest of the page inert while it's open, so the first click outside only closes
it. With `:modal="false"`, the page stays usable: a click outside reaches whatever was clicked and also closes the
popover. Use it for a toggletip, an info button whose popover sits next to controls people keep using. Open the
popover below, then press "Save draft".

<ComponentPreview name="popover/non-modal" />

### Hover Mode

With `mode="hover"`, the popover opens when the pointer rests on the trigger or the trigger gets focus. It doesn't
move focus or block the rest of the page. You can move the pointer into the popover and click its content. The
`content` slot gets no `close` function in this mode.

| Prop          | Default | What it does                                            |
| ------------- | ------- | ------------------------------------------------------- |
| `openDelay`   | `700`   | Milliseconds of hover or focus before it opens          |
| `closeDelay`  | `300`   | Milliseconds after the pointer or focus leaves to close |
| `enableTouch` | `false` | A tap opens it at once, and the next tap closes it      |

Touch screens have no hover, so without `enableTouch` a tap only opens the popover where tapping focuses the trigger
(not in Safari on iOS). For triggers people are meant to tap, the default `click` mode is the better fit. The issue
preview below uses shorter delays and `enableTouch`.

<ComponentPreview name="popover/hover-mode" />

## Customization

### Tailwind CSS

<ComponentPreview name="popover/custom-styles" />

### Global theme override

```ts
app.use(
  createHareUI({
    ui: {
      popover: {
        slots: { base: 'rounded-xl' },
      },
    },
  }),
)
```

## Styling Reference

| `ui` key  | `data-slot`             | Description                                                  |
| --------- | ----------------------- | ------------------------------------------------------------ |
| `base`    | `popover`               | The floating surface                                         |
| `dialog`  | `popover-dialog`        | The dialog wrapper around the heading/content                |
| `heading` | `popover-heading`       | The heading (shown when `title` prop or `title` slot is set) |
| `arrow`   | `popover-overlay-arrow` | The arrow `<svg>` (shown when `arrow` is `true`)             |

### CSS Classes

HareUI follows the [BEM](https://getbem.com/) methodology to keep component variants and states reusable and easy to customize. The Popover component uses these CSS classes ([View source styles](https://github.com/alexzvn/hareui/blob/main/packages/vue/src/components/popover/popover.css)):

#### Base Classes

- `.h-popover` - Base popover container styles, with the enter and exit animations
- `.h-popover__dialog` - Dialog content wrapper
- `.h-popover__heading` - Heading text styles
- `.h-popover__arrow` - The arrow `<svg>`

The classes sit in `@layer components`, so a utility you pass through `class` or `ui` wins over them.

### Interactive States

- **Open/closed**: `data-state="open" | "closed"` (drives the enter/exit animation)
- **Side**: `data-side="top" | "right" | "bottom" | "left"`

## API Reference

### Props

<ApiTable component="Popover" kind="props" />

### Slots

<ApiTable component="Popover" kind="slots" />

### Emits

<ApiTable component="Popover" kind="emits" />

## Theme

<ApiTheme component="Popover" />

## Related Components

<RelatedComponents :components="['button', 'modal']" />
