---
title: ScrollArea
description: A scroll container for lists of items, with virtualization for long lists and masonry layouts.
links:
  source: scroll-area/ScrollArea.vue
  styles: scroll-area/theme.ts
---

## Usage

```ts
import { ScrollArea } from '@hareui/vue'
```

Pass an array to `items` and render each one through the default slot, which gets the `item` and its `index`. Give the
ScrollArea a height (or a width, when horizontal) so it has something to scroll.

<ComponentPreview name="scroll-area/basic" />

### Content

Without `items`, the default slot is the content and is rendered once.

<ComponentPreview name="scroll-area/content" />

## Anatomy

```vue
<ScrollArea v-slot="{ item, index }" :items="items">
  <!-- one item -->
</ScrollArea>
```

The root scrolls. Inside it the viewport (`data-slot="viewport"`) lays the items out in a column, or a row when
horizontal, each in its own wrapper (`data-slot="item"`).

## Examples

### Virtualize

Set `virtualize` to render only the items in view, so a list of thousands stays fast. Items are measured once
rendered, so they can differ in size. When every item has the same size, pass
`{ estimateSize, skipMeasurement: true }`. The virtualizer then uses `estimateSize` and skips measuring.

<ComponentPreview name="scroll-area/virtualize" />

Whether to virtualize is read once, when the ScrollArea mounts. Without virtualization, space items with classes on
`ui.viewport`, such as `gap-2 p-4`. With it, the virtualizer positions the items, so use its `gap`, `paddingStart`
and `paddingEnd` options instead.

`virtualize` takes any [TanStack Virtual option](https://tanstack.com/virtual/v3/docs/api/virtualizer#options) except
`count`, `horizontal`, `isRtl` and `enabled`, which the ScrollArea sets itself. `estimateSize` defaults to 100 px.
`overscan`, the number of items rendered beyond each edge, defaults to 12.

### Orientation

Set `orientation="horizontal"` to scroll sideways. Items sit in a row and, when virtualized, are measured by their
width. On right-to-left pages the list starts on the right.

The date strip below opens on today: it calls `scrollToIndex` once mounted.

<ComponentPreview name="scroll-area/horizontal" />

### Masonry

Set `lanes` in `virtualize` to lay items out in columns (or rows, when horizontal). Each item goes into the shortest
lane, so items of different heights pack together. `gap` spaces the lanes and the items in them.

Here each note is as tall as its content. The number of lanes follows the container width: one lane per 220 px, up to
four. Pass `lanes` a computed value to do the same.

<ComponentPreview name="scroll-area/masonry" />

### Shadow

Set `shadow` to fade the edges that have more content beyond them, like [ScrollShadow](/docs/components/scroll-shadow).
The fade follows `orientation` and shows only while the content overflows. Pass `{ size }` to change its size in px
(40 by default). The fade masks the whole root, so put borders and backgrounds on a wrapper.

The chat below opens on its latest message, so only the top edge fades at first.

<ComponentPreview name="scroll-area/shadow" />

### Scroll to an Item

Call `scrollToIndex(index)` on a template ref to bring an item into view. Virtualized, it also reaches items that
aren't rendered yet. Pass `align` to choose where the item lands. The default, `auto`, scrolls only as far as needed
and leaves an item that is already in view where it is. Pass `behavior: 'smooth'` to animate the scroll.

<ComponentPreview name="scroll-area/scroll-to" />

When virtualized, the ref also exposes the
[TanStack virtualizer](https://tanstack.com/virtual/v3/docs/api/virtualizer#virtualizer-instance) as `virtualizer`, for
anything else, such as `scrollToOffset` or `getVirtualItems`.

### Outer Scroll Element

To virtualize a list that scrolls together with other content in a container, return that container from
`virtualize.getScrollElement`. The ScrollArea then grows to the list's full size instead of scrolling itself.

Set `scrollMargin` to the distance from the top of the container's content to the top of the list. Here that is the
product header's height, measured with a `ResizeObserver` so it stays right when the header wraps.

<ComponentPreview name="scroll-area/outer-scroll" />

### Load More on Scroll

To load the next page as people near the end of a virtualized list, watch the last rendered item through
`virtualizer.getVirtualItems()`. This feed appends 30 items once that item is within five of the end. A spinner row
shows while the page loads.

<ComponentPreview name="scroll-area/infinite-scroll" />

### Scroll State

A virtualized ScrollArea emits `scroll` with `true` when scrolling starts and `false` when it stops, for example to
pause expensive rendering while the list moves.

## Accessibility

- The ScrollArea adds no roles or labels: it is a plain scroll container around your items. For rows people select
  or navigate with the arrow keys, use [ListView](/docs/components/list-view).
- Browsers let keyboard users focus a scroll container that holds no focusable content, and scroll it with the
  arrow keys. The root shows the focus ring when focused this way.
- A virtualized list renders only the items in view, so the browser's find in page and screen readers' browse mode
  see only those items.

## API Reference

### Props

<ApiTable component="ScrollArea" kind="props" />

### Slots

<ApiTable component="ScrollArea" kind="slots" />

### Emits

<ApiTable component="ScrollArea" kind="emits" />

### Expose

A template ref typed as `ScrollAreaExposed` gives you:

| Name            | Type                                                                | Description                                                                            |
| --------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `scrollToIndex` | `(index: number, options?: ScrollAreaScrollToIndexOptions) => void` | Scrolls the item into view. [Scroll to an Item](#scroll-to-an-item) lists the options. |
| `$el`           | `HTMLElement \| undefined`                                          | The scroll container element.                                                          |
| `virtualizer`   | `Virtualizer \| undefined`                                          | The TanStack virtualizer, when virtualized.                                            |

## Theme

<ApiTheme component="ScrollArea" />

## Related Components

<RelatedComponents :components="['scroll-shadow', 'list-view']" />
