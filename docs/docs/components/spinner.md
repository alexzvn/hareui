---
title: Spinner
description: A loading indicator component to show pending states
links:
  source: spinner/Spinner.vue
  styles: spinner/theme.ts
  heroui: spinner
---

## Usage

```ts
import { Spinner } from '@hareui/vue'
```

<ComponentPreview name="spinner/basic" />

## Anatomy

Spinner is a single component with one slot.

## Examples

### Colors

<ComponentPreview name="spinner/colors" />

### Sizes

<ComponentPreview name="spinner/sizes" />

### Speed

Apply an animation utility via the `class` prop to change how fast a single spinner
rotates. Pair it with `motion-reduce:animate-none` so it stays still for users who
prefer reduced motion.

<ComponentPreview name="spinner/speed" />

## Customization

### Tailwind CSS

<ComponentPreview name="spinner/custom-styles" />

### Global theme override

```ts
app.use(
  createHareUI({
    ui: {
      spinner: {
        defaultVariants: { color: 'current' },
      },
    },
  }),
)
```

## Styling Reference

| `ui` key | `data-slot` | Description                     |
| -------- | ----------- | ------------------------------- |
| `base`   | `spinner`   | The root `<span role="status">` |

### CSS Classes

HareUI follows the [BEM](https://getbem.com/) methodology to keep component variants and states reusable and easy to customize. The Spinner component uses these CSS classes ([View source styles](https://github.com/alexzvn/hareui/blob/main/packages/vue/src/components/spinner/spinner.css)):

#### Base & Size Classes

- `.h-spinner` - Base spinner styles with default size
- `.h-spinner--sm` - Small size variant
- `.h-spinner--lg` - Large size variant
- `.h-spinner--xl` - Extra large size variant

The default `md` size adds no class.

#### Color Classes

- `.h-spinner--current` - Inherits current text color
- `.h-spinner--accent` - Accent color variant
- `.h-spinner--danger` - Danger color variant
- `.h-spinner--success` - Success color variant
- `.h-spinner--warning` - Warning color variant

The classes sit in `@layer components`, so a utility you pass through `class` or `ui` wins over them.

## API Reference

### Props

<ApiTable component="Spinner" kind="props" />

## Theme

<ApiTheme component="Spinner" />

## Related Components

<RelatedComponents :components="['button']" />
