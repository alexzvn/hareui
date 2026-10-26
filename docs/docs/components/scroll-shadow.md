---
title: ScrollShadow
description: Apply visual shadows to indicate scrollable content overflow with automatic detection of scroll position.
links:
  source: scroll-shadow/ScrollShadow.vue
  styles: scroll-shadow/theme.ts
  heroui: scroll-shadow
---

## Usage

```vue
<script setup lang="ts">
import { ScrollShadow } from '@hareui/vue'
</script>
```

<ComponentPreview name="scroll-shadow/default" />

## Examples

### Orientation

<ComponentPreview name="scroll-shadow/orientation" />

### Shadow Size

<ComponentPreview name="scroll-shadow/size" />

### With Card

<ComponentPreview name="scroll-shadow/with-card" />

### Hide Scroll Bar

<ComponentPreview name="scroll-shadow/hide-scroll-bar" />

### Visibility Change

<ComponentPreview name="scroll-shadow/visibility-change" />

## Customization

### Tailwind CSS

<ComponentPreview name="scroll-shadow/custom-styles" />

### Global Configuration

To customize the ScrollShadow classes for the whole app, extend the `scrollShadow` theme in `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      scrollShadow: {
        slots: { base: 'rounded-xl border border-default-200' },
        variants: {
          orientation: {
            vertical: { base: 'pr-2' }, // Add padding for custom scrollbar styling
            horizontal: { base: 'pb-2' },
          },
        },
      },
    },
  }),
)
```

## Styling Reference

### Slots

- `base` → `[data-slot="scroll-shadow"]` – root container element

#### Variants

- `orientation="vertical"` – vertical scrolling (default)
- `orientation="horizontal"` – horizontal scrolling
- `hide-scroll-bar` – hides the native scrollbar

The fade masks live in HareUI's stylesheet (`styles/scroll-shadow.css`) and key on
`[data-slot="scroll-shadow"]` and `[data-orientation]`, so they apply to any element carrying
those attributes (Tabs' scrolling list uses the same component).

### CSS Variables

The ScrollShadow component uses CSS variables to size the fade mask and reserve space for visible native scrollbars:

| Variable                         | Default                             | Description                                                                                                         |
| -------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `--scroll-shadow-size`           | `40px`                              | Controls the fade gradient size. This is set from the `size` prop.                                                  |
| `--scroll-shadow-offset`         | `0px`                               | How far the container must be scrolled before the fade starts. This is set from the `offset` prop.                  |
| `--scroll-shadow-scrollbar-size` | `10px` (`0px` when `hideScrollBar`) | Reserves a solid mask gutter for the native scrollbar so the fade does not cover it. Override for wider scrollbars. |

### Data Attributes

The component uses data attributes to control shadow visibility:

- **Scroll States**: `[data-top-scroll]`, `[data-bottom-scroll]`, `[data-left-scroll]`, `[data-right-scroll]` - Applied when content can be scrolled in that direction
- **Combined States**: `[data-top-bottom-scroll]`, `[data-left-right-scroll]` - Applied when content can be scrolled in both directions
- **Orientation**: `[data-orientation="vertical"]` or `[data-orientation="horizontal"]` - Indicates scroll direction
- **Size**: `[data-scroll-shadow-size]` - Contains the shadow gradient size value
- **Shadow Mode**: `[data-scroll-shadow-mode]` - `"auto"` when the fade is derived from the scroll position, `"manual"` when `visibility` is controlled or `enabled` is `false`

### Scroll-Driven Fade

In `auto` mode, browsers that support [scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline)
derive the fade from the scroll position in CSS. The mask is therefore correct on the very
first paint, with no measurement and no flash of unfaded content during hydration. Browsers
without support fall back to the `[data-*-scroll]` attributes above, which are written after
mount. Two things to keep in mind when customizing:

- In `auto` mode the root always resolves a `mask-image`, even when there is nothing to scroll.
  That makes it a stacking context and a containing block for `position: fixed` descendants.
  Set `visibility` explicitly if you need to opt out.
- The scroll-driven fade uses the `animation` property on the root. Applying an `animate-*`
  utility to the same element replaces it and leaves no fade. Animate a wrapper instead.

## API Reference

### Props

<ApiTable component="ScrollShadow" kind="props" />

### Slots

<ApiTable component="ScrollShadow" kind="slots" />

### Emits

<ApiTable component="ScrollShadow" kind="emits" />

### Theme

<ApiTheme component="ScrollShadow" />
