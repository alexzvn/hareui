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
app.use(
  createHareUI({
    ui: {
      toolbar: {
        slots: { base: 'gap-4 rounded-lg bg-surface p-3' },
      },
    },
  }),
)
```

## Styling Reference

The root carries `data-slot="toolbar"` and `data-orientation`.

| `ui` key              | Description                                                   |
| --------------------- | ------------------------------------------------------------- |
| `base`                | Base container                                                |
| `separatorVertical`   | Classes added to each vertical Separator inside the toolbar   |
| `separatorHorizontal` | Classes added to each horizontal Separator inside the toolbar |
| `buttonGroup`         | Classes added to each ButtonGroup inside the toolbar          |

Use the `orientation` prop to lay the toolbar out `horizontal` or `vertical`. Set `attached` for a surface background with full rounding.

Inside a Toolbar, ToggleButtonGroups and ButtonGroups take the toolbar's orientation and Separators take the perpendicular
one, unless they set `orientation` themselves.

### CSS Classes

HareUI follows the [BEM](https://getbem.com/) methodology to keep component variants and states reusable and easy to customize. The Toolbar component uses these CSS classes ([View source styles](https://github.com/alexzvn/hareui/blob/main/packages/vue/src/components/toolbar/toolbar.css)):

#### Base Classes

- `.h-toolbar` - Base container; also sizes the Separators inside it

The default `horizontal` orientation adds no class.

#### Modifier Classes

- `.h-toolbar--vertical` - Vertical orientation
- `.h-toolbar--attached` - Attached variant with surface background and full rounding

The classes sit in `@layer components`, so a utility you pass through `class` or `ui` wins over them.

## API Reference

### Props

<ApiTable component="Toolbar" kind="props" />

### Slots

<ApiTable component="Toolbar" kind="slots" />

## Theme

<ApiTheme component="Toolbar" />

## Related Components

<RelatedComponents :components="['button-group', 'toggle-button-group', 'separator']" />
