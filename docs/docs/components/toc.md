---
title: Toc
description: A table of contents that follows the heading in view, as a sticky list or as floating marks that open the links on hover.
links:
  source: toc/Toc.vue
  styles: toc/theme.ts
---

## Usage

Pass the headings of the page to the `links` prop, one `{ id, text }` per heading, nested with `children`. The component watches the headings with those ids and marks the links of the ones in view. Clicking a link scrolls its heading to the top of the nearest scrolling container and updates the URL hash.

```ts
import { Toc } from '@hareui/vue'
```

<ComponentPreview name="toc/basic" />

## Anatomy

```vue
<Toc :links="links">
  <template #leading="{ open, ui }" />          <!-- optional: before the title -->
  <template #default="{ open }" />              <!-- optional: replaces the title -->
  <template #trailing="{ open, ui }" />         <!-- optional: replaces the chevron -->
  <template #top="{ links }" />                 <!-- optional: above the links -->
  <template #content="{ links }" />             <!-- optional: replaces the list -->
  <template #link="{ link, active, level }" />  <!-- optional: the text of each link -->
  <template #bottom="{ links }" />              <!-- optional: below the links -->
</Toc>
```

Each link is a `TocLink`:

```ts
type TocLink = {
  id: string // the heading's id
  text: string
  depth?: number // 2 for an h2, informational only
  children?: TocLink[]
  class?: ClassValue
  ui?: { item?; itemWithChildren?; link?; linkText?; panelLink? }
}
```

The ids must exist in the page. Give your headings a `scroll-margin-top` (`scroll-mt-*`) when a sticky header covers them.

### Title

Use the `title` prop to change the heading of the list. Defaults to `On this page`. It is also the accessible name of the `<nav>` and, in the floating variant, of the marks and the panel.

### Slots

- `leading` and `trailing` sit around the title.
- `link` changes the text of each link. It gets `link`, `active` and `level`.
- `top` and `bottom` hold content around the list, such as a "back to top" link. `bottom` is hidden below `lg`.

<ComponentPreview name="toc/slots" />

### Color

Use the `color` prop to change the color of the active links: `default`, `accent` (default), `success`, `warning` or `danger`.

<ComponentPreview name="toc/color" />

### Highlight

Use the `highlight` prop to draw a line along the links, with the active ones highlighted. The segment slides as you scroll.

<ComponentPreview name="toc/highlight" />

Pass an object to change the highlight: `variant: 'circuit'` traces the line along the nesting of the links, and `color` sets the color of the active segment (it follows `color` by default).

<ComponentPreview name="toc/highlight-variant" />

### Mobile

Below the `lg` breakpoint, the list collapses behind its title. The title becomes a button that opens and closes it; bind `v-model:open` to control it, or set `default-open`. The list is sticky in its scroll container in both layouts, below a `--header-height` you can set on a parent.

<ComponentPreview name="toc/collapsible" device="mobile" />

### Floating

Use `variant="floating"` for a compact table of contents: one short mark per link, with the active one longer and colored. Resting the pointer on the marks opens a panel with the links; leaving both closes it. A click pins the panel open, and the keyboard opens it with `Enter` or `Space`, focusing the active link. `Escape` or a press outside closes it.

<ComponentPreview name="toc/floating" />

Nested links get shorter marks and indented panel links. The `top` and `bottom` slots render inside the panel.

<ComponentPreview name="toc/floating-nested" />

### Side

Use the `side` prop to place the floating marks on the `left` or `right` (default) of the content. The marks align to that edge and the panel opens towards the other side.

<ComponentPreview name="toc/floating-side" />

### Trigger

Use `trigger="press"` to open the panel on click only, ignoring hover. Touch input always opens it on tap.

<ComponentPreview name="toc/floating-press" />

### Delays

Use the `delay` and `close-delay` props to change how long, in milliseconds, the pointer must rest on the marks before the panel opens (`200` by default) and how long it stays open after the pointer leaves (`300` by default).

<ComponentPreview name="toc/floating-delays" />

## Examples

### Control the open state

Bind `v-model:open` to open or close the panel from outside.

<ComponentPreview name="toc/floating-controlled" />

### Long lists

The panel stops at `400px` (or 60% of the viewport height) and scrolls, keeping the active link centered when it opens.

<ComponentPreview name="toc/floating-long" />

## Customization

### Global theme override

```ts
app.use(
  createHareUI({
    ui: {
      toc: {
        slots: { link: 'text-xs' },
      },
    },
  }),
)
```

## Styling Reference

| `ui` key                    | `data-slot`                          | Description                                                                                    |
| --------------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `root`                      | `toc`                                | The `<nav>`. Carries `data-variant`                                                            |
| `container`                 | `toc-container`                      | Wrapper of the title, list and slots (`list`)                                                  |
| `top` / `bottom`            | `toc-top` / `toc-bottom`             | Wrappers of the `top` and `bottom` slots                                                       |
| `trigger`                   | `toc-trigger`                        | The title row: a collapsible button below `lg`, a static label from `lg` (`list`)              |
| `title`                     | `toc-title`                          | The title text                                                                                 |
| `trailing` / `trailingIcon` | `toc-trailing` / `toc-trailing-icon` | The end of the trigger and its chevron                                                         |
| `content`                   | `toc-content`                        | The list container (`list`)                                                                    |
| `list` / `listWithChildren` | —                                    | Top-level and nested `<ul>`                                                                    |
| `item` / `itemWithChildren` | —                                    | `<li>` without and with children                                                               |
| `link` / `linkText`         | `toc-link` / `toc-link-text`         | Each link of the list and its text. Active links carry `data-active` and `aria-current`        |
| `indicator`                 | `toc-indicator`                      | The highlight line (`highlight`)                                                               |
| `indicatorLine`             | `toc-indicator-line`                 | The inactive part of the `circuit` line                                                        |
| `indicatorActive`           | `toc-indicator-active`               | The active segment                                                                             |
| `marks` / `mark`            | `toc-marks` / `toc-mark`             | The button holding the marks and each mark (`floating`). The active mark carries `data-active` |
| `panel`                     | `toc-panel`                          | The floating panel (a non-modal dialog). Carries `data-state` and `data-side`                  |
| `panelLink`                 | `toc-link`                           | Each link in the floating panel                                                                |

Marks and panel links read their nesting level from `--toc-level`. The active color is `--toc-color`. Transitions are disabled when the user prefers reduced motion.

## API Reference

### Props

<ApiTable component="Toc" kind="props" />

### Slots

<ApiTable component="Toc" kind="slots" />

### Emits

<ApiTable component="Toc" kind="emits" />

## Theme

<ApiTheme component="Toc" />

## Related Components

<RelatedComponents :components="['navigation-menu', 'popover']" />
