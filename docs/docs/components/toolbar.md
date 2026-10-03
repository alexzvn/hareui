---
title: Toolbar
description: A container for interactive controls with arrow key navigation.
links:
  source: toolbar/Toolbar.vue
  styles: toolbar/theme.ts
  heroui: toolbar
---

## Usage

```ts
import { Toolbar } from '@hareui/vue'
```

<ComponentPreview name="toolbar/basic" />

## Examples

### Vertical

<ComponentPreview name="toolbar/vertical" />

### Attached

<ComponentPreview name="toolbar/attached" />

### With ButtonGroup

<ComponentPreview name="toolbar/with-button-group" />

## Customization

### Tailwind CSS

<ComponentPreview name="toolbar/custom-styles" />

### Global theme override

Override the `toolbar` theme app-wide with `createHareUI`:

```ts
app.use(createHareUI({
  ui: {
    toolbar: {
      slots: { base: 'gap-4 rounded-lg bg-surface p-3' },
    },
  },
}))
```

## Styling Reference

The root carries `data-slot="toolbar"` and `data-orientation`, as in HeroUI.

| `ui` key | HeroUI selector | Description |
|---|---|---|
| `base` | `.toolbar` | Base container |
| `separatorVertical` | `.toolbar .separator--vertical` | Classes added to each vertical Separator inside the toolbar |
| `separatorHorizontal` | `.toolbar .separator--horizontal` | Classes added to each horizontal Separator inside the toolbar |
| `buttonGroup` | `.toolbar--vertical .button-group` | Classes added to each ButtonGroup inside the toolbar |

Variants: `orientation` (`horizontal`, `vertical`) and `attached` (surface background with full rounding).

Inside a Toolbar, ToggleButtonGroups and ButtonGroups take the toolbar's orientation and Separators take the perpendicular
one, unless they set `orientation` themselves.

## API Reference

### Props

<ApiTable component="Toolbar" kind="props" />

### Slots

<ApiTable component="Toolbar" kind="slots" />

## Related Components

<RelatedComponents :components="['button-group', 'toggle-button-group', 'separator']" />
