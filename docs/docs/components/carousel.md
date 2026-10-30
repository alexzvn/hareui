---
title: Carousel
description: Browse a set of slides with arrows, dots, thumbnails, swipe and keyboard navigation.
links:
  source: carousel/Carousel.vue
  styles: carousel/theme.ts
---

## Usage

Pass your slides to `items` and render each one in the default slot. The slot receives the `item` and its `index`.

```ts
import { Carousel } from '@hareui/vue/carousel'
```

<ComponentPreview name="carousel/basic" />

### Installation

Import the carousel from `@hareui/vue/carousel`. Its embla packages are only needed when you import this entry; install the peer dependency:

::: code-group

```bash [npm]
npm i embla-carousel-vue
```

```bash [pnpm]
pnpm add embla-carousel-vue
```

```bash [yarn]
yarn add embla-carousel-vue
```

```bash [bun]
bun add embla-carousel-vue
```

:::

Each [plugin](#plugins) is a separate package, imported only when its prop is set. Install the ones you use:

| Prop             | Package                         |
| ---------------- | ------------------------------- |
| `autoplay`       | `embla-carousel-autoplay`       |
| `auto-scroll`    | `embla-carousel-auto-scroll`    |
| `auto-height`    | `embla-carousel-auto-height`    |
| `class-names`    | `embla-carousel-class-names`    |
| `fade`           | `embla-carousel-fade`           |
| `wheel-gestures` | `embla-carousel-wheel-gestures` |

## Anatomy

```vue
<Carousel :items="items" arrows dots thumbnails>
  <template #default="{ item, index }" />              <!-- one slide -->
  <template #thumbnail="{ item, index, selected }" />  <!-- optional: a thumbnail button's content -->
  <template #prevIcon />                               <!-- optional: the previous button's icon -->
  <template #nextIcon />                               <!-- optional: the next button's icon -->
</Carousel>
```

The carousel is a `region` with an `aria-roledescription` of "carousel", and each slide is a `group` described as a "slide". Give the carousel a name with `aria-label`. When it has focus, the arrow keys of its orientation move between slides. Inside a slide, a text field keeps its arrow keys, as does any control that handles them itself (calls `preventDefault()`).

## Type

Use the `type` prop to choose where the arrows sit. `in-place` (default) keeps them inside the slide edges.

### Modal

`modal` moves the arrows 60px outside the slides, for a focused gallery inside a dialog. Leave room for them around the carousel.

<ComponentPreview name="carousel/arrows-outside" />

### Miniatures

`miniatures` puts the arrows in one row with the thumbnails (or dots) below the slides.

<ComponentPreview name="carousel/miniatures-type" />

## Items

Each slide fills the viewport. To show several at once, set a `basis-*` class on the `item` slot with the `ui` prop. Slides have no gap by default; pad the slide content, or add `ps-*` to `item` and a matching negative `-ms-*` to `container`.

<ComponentPreview name="carousel/several-per-view" />

An object item can also carry its own `class` (or `ui.item`) to size a single slide.

## Orientation

Use the `orientation` prop to scroll vertically. A vertical carousel needs a fixed height on its `container`. The arrows turn with it, and the up and down keys move between slides.

<ComponentPreview name="carousel/orientation" />

## Arrows

Use the `arrows` prop to show the previous and next buttons. They are disabled at either end of the carousel.

### Prev / Next

Use the `prev` and `next` props to pass [Button](./button) props to the arrows, such as a `variant` or an `aria-label`. Replace their icons with the `prevIcon` and `nextIcon` slots.

<ComponentPreview name="carousel/prev-next" />

## Dots

Use the `dots` prop to show one dot per scroll position. With `slidesToScroll` in `options`, each dot stands for a group of slides. The dots hide while every slide fits in view.

<ComponentPreview name="carousel/dots" />

## Thumbnails

Use the `thumbnails` prop to show a row of thumbnail buttons below the slides, one per slide. A string item is used as the image; an object item uses its `thumbnail` and `alt` keys. The row scrolls to keep the selected thumbnail in view, and its edges fade while more thumbnails are hidden past them.

Use the `thumbnail` slot for any other content. It receives the `item`, its `index` and whether it is `selected`.

<ComponentPreview name="carousel/thumbnail-slot" />

## Options

Use the `options` prop to pass [Embla options](https://www.embla-carousel.com/api/options/) such as `align`, `slidesToScroll`, `dragFree`, `startIndex` or `breakpoints`. The scroll axis and direction follow the `orientation` and `dir` props.

### Wrapping around

Set `loop: true` to wrap from the last slide back to the first. Both arrows then stay enabled.

<ComponentPreview name="carousel/wrap-around" />

## Plugins

Each plugin prop takes `true` for its defaults, or an object of the plugin's options.

### Advancing on a timer

Use the `autoplay` prop to advance the slides on a timer. It stops once the user navigates, unless you set `stopOnInteraction: false`.

<ComponentPreview name="carousel/timed-advance" />

### Auto Scroll

Use the `auto-scroll` prop to scroll the slides continuously. Like autoplay, it stops on interaction by default.

<ComponentPreview name="carousel/auto-scroll" />

### Auto Height

Use the `auto-height` prop to resize the carousel to the tallest slide in view. Add `items-start` and a `transition-[height]` class to the `container` to animate the change.

<ComponentPreview name="carousel/auto-height" />

### Class Names

Use the `class-names` prop to toggle state classes on the slides, such as `is-snapped` on the selected one. Style them through the `item` slot.

<ComponentPreview name="carousel/class-names" />

### Fade

Use the `fade` prop to cross-fade between slides instead of sliding them.

<ComponentPreview name="carousel/fade" />

### Wheel Gestures

Use the `wheel-gestures` prop to move between slides with the mouse wheel or a trackpad.

<ComponentPreview name="carousel/wheel-gestures" />

## Examples

### Control the carousel

Listen to `@select` for the selected index, and call the [Embla API](https://www.embla-carousel.com/api/methods/) through a template ref. The ref exposes `emblaApi` and the viewport element, `emblaRef`.

<ComponentPreview name="carousel/controlled" />

```vue
<script setup lang="ts">
const carousel = useTemplateRef('carousel')

const goToStart = () => carousel.value?.emblaApi?.scrollTo(0)
</script>

<template>
  <Carousel ref="carousel" :items="items" />
</template>
```

## Customization

### Global theme override

```ts
app.use(
  createHareUI({
    ui: {
      carousel: {
        slots: { dot: 'w-4 rounded-sm' },
      },
    },
  }),
)
```

## Styling Reference

| `ui` key     | `data-slot`           | Description                                                                              |
| ------------ | --------------------- | ---------------------------------------------------------------------------------------- |
| `root`       | `carousel`            | The focusable region. Carries `data-orientation` and `data-type`                         |
| `wrapper`    | `carousel-wrapper`    | Positions the arrows around the viewport                                                 |
| `viewport`   | `carousel-viewport`   | Clips the slides                                                                         |
| `container`  | `carousel-container`  | The row (or column) of slides                                                            |
| `item`       | `carousel-item`       | One slide                                                                                |
| `prev`       | `carousel-prev`       | The previous button                                                                      |
| `next`       | `carousel-next`       | The next button                                                                          |
| `controls`   | `carousel-controls`   | Holds the dots and thumbnails below the slides (and the arrows with `type="miniatures"`) |
| `dots`       | `carousel-dots`       | The dots list                                                                            |
| `dot`        | `carousel-dot`        | One dot. Carries `data-selected` when selected                                           |
| `thumbnails` | `carousel-thumbnails` | The scrollable thumbnails list                                                           |
| `thumbnail`  | `carousel-thumbnail`  | One thumbnail button. Carries `data-selected` when selected                              |

## API Reference

### Props

<ApiTable component="Carousel" kind="props" />

### Slots

<ApiTable component="Carousel" kind="slots" />

### Emits

<ApiTable component="Carousel" kind="emits" />

## Theme

<ApiTheme component="Carousel" />

## Related Components

<RelatedComponents :components="['scroll-shadow', 'button']" />
