---
title: CloseButton
description: Button component for closing dialogs, modals, or dismissing content
links:
  source: close-button/CloseButton.vue
  styles: close-button/theme.ts
  heroui: close-button
---

## Usage

```ts
import { CloseButton } from '@hareui/vue'
```

<ComponentPreview name="close-button/default" />

## Anatomy

A single `<button>` with a default close icon that the default slot can replace.

```vue
<CloseButton>
  <!-- optional custom icon -->
</CloseButton>
```

`ui` keys: `base`, `icon`.

## Examples

### Interactive

<ComponentPreview name="close-button/interactive" />

### With Custom Icon

<ComponentPreview name="close-button/with-custom-icon" />

## Customization

### Tailwind CSS

<ComponentPreview name="close-button/custom-styles" />

### Global theme override

```ts
app.use(createHareUI({
  ui: {
    closeButton: {
      slots: { base: 'rounded-full' },
    },
  },
}))
```

## Styling Reference

| `ui` key | `data-slot` | Description |
|---|---|---|
| `base` | `close-button` | The root `<button>` |
| `icon` | `close-button-icon` | The default close icon `<svg>` |

### Interactive states

- **Hover**: `:hover`
- **Active/Pressed**: `:active`
- **Focus**: `:focus-visible`
- **Disabled**: `:disabled` / `[aria-disabled=true]`

## API Reference

### Props

<ApiTable component="CloseButton" kind="props" />

### Slots

<ApiTable component="CloseButton" kind="slots" />

### Theme

<ApiTheme component="CloseButton" />

## Related Components

<RelatedComponents :components="['button', 'modal']" />
