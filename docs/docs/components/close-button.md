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
app.use(
  createHareUI({
    ui: {
      closeButton: {
        slots: { base: 'rounded-full' },
      },
    },
  }),
)
```

## Styling Reference

| `ui` key | `data-slot`         | Description                    |
| -------- | ------------------- | ------------------------------ |
| `base`   | `close-button`      | The root `<button>`            |
| `icon`   | `close-button-icon` | The default close icon `<svg>` |

### CSS Classes

HareUI follows the [BEM](https://getbem.com/) methodology to keep component variants and states reusable and easy to customize. The CloseButton component uses these CSS classes ([View source styles](https://github.com/alexzvn/hareui/blob/main/packages/vue/src/components/close-button/close-button.css)):

#### Base Classes

- `.h-close-button` - Base component styles

#### Variant Classes

- `.h-close-button--default` - Default variant

The classes sit in `@layer components`, so a utility you pass through `class` or `ui` wins over them. Their selectors
have zero specificity, so a component that embeds CloseButton can restyle it with its own class too.

### Interactive States

- **Hover**: `:hover`
- **Active/Pressed**: `:active`
- **Focus**: `:focus-visible`
- **Disabled**: `:disabled` / `[aria-disabled=true]`

## API Reference

### Props

<ApiTable component="CloseButton" kind="props" />

### Slots

<ApiTable component="CloseButton" kind="slots" />

## Theme

<ApiTheme component="CloseButton" />

## Related Components

<RelatedComponents :components="['button', 'modal']" />
