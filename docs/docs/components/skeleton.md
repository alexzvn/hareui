---
title: Skeleton
description: Skeleton is a placeholder to show a loading state and the expected shape of a component.
links:
  source: skeleton/Skeleton.vue
  styles: skeleton/theme.ts
  heroui: skeleton
---

## Usage

```ts
import { Skeleton } from '@hareui/vue'
```

<ComponentPreview name="skeleton/basic" />

## Anatomy

Skeleton is a single element. Set its size and shape with `class`. The default slot is optional.

## Examples

### Text Content

<ComponentPreview name="skeleton/text-content" />

### User Profile

<ComponentPreview name="skeleton/user-profile" />

### List Items

<ComponentPreview name="skeleton/list" />

### Grid

<ComponentPreview name="skeleton/grid" />

### Single Shimmer

A synchronized shimmer effect that passes over all skeleton elements at once. Put the
container classes below on a parent element and set `animation-type="none"` on child skeletons.

```
relative overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:z-10
before:-translate-x-full before:animate-skeleton before:mix-blend-overlay before:content-['']
before:bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.5)_50%,transparent_100%)]
```

<ComponentPreview name="skeleton/single-shimmer" style="contain: none" />

### Animation Types

<ComponentPreview name="skeleton/animation-types" />

## Customization

### Tailwind CSS

<ComponentPreview name="skeleton/custom-styles" />

### Global theme override

Override the `skeleton` theme app-wide with `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      skeleton: {
        slots: {
          base: 'bg-surface-secondary/50', // Change base background
        },
        variants: {
          animationType: {
            shimmer: { base: 'after:via-surface' }, // Change shimmer gradient color
            pulse: { base: 'animate-pulse opacity-75' }, // Customize pulse animation
            none: { base: 'opacity-50' }, // Style for static skeleton
          },
        },
      },
    },
  }),
)
```

### Global Animation Configuration

You can set a default animation type for all Skeleton components in your application by defining the `--skeleton-animation` CSS variable:

```css
/* In your global CSS file */
:root {
  /* Possible values: shimmer, pulse, none */
  --skeleton-animation: pulse;
}

/* You can also set different values for light/dark themes */
.light,
[data-theme='light'] {
  --skeleton-animation: shimmer;
}

.dark,
[data-theme='dark'] {
  --skeleton-animation: pulse;
}
```

This global setting will be overridden by the `animationType` prop when specified on individual components.
The variable is read from `:root` once per page load, after the component mounts.

## Styling Reference

The Skeleton root has no `data-slot`.

| `ui` key | Description                                              |
| -------- | -------------------------------------------------------- |
| `base`   | Base skeleton styles with background and rounded corners |

The `animationType` prop selects the animation:

- `shimmer` (default): shimmer animation with a gradient
- `pulse`: Tailwind's `animate-pulse`
- `none`: static skeleton

### CSS Classes

HareUI follows the [BEM](https://getbem.com/) methodology to keep component variants and states reusable and easy to customize. The Skeleton component uses these CSS classes ([View source styles](https://github.com/alexzvn/hareui/blob/main/packages/vue/src/components/skeleton/skeleton.css)):

#### Base Classes

- `.h-skeleton` - Base skeleton styles with background and rounded corners

#### Animation Variant Classes

- `.h-skeleton--shimmer` - Adds shimmer animation with gradient effect (default)
- `.h-skeleton--pulse` - Adds pulse animation using Tailwind's `animate-pulse`

`animationType="none"` adds no class.

The classes sit in `@layer components`, so a utility you pass through `class` or `ui` wins over them.

### Animation

#### Shimmer Animation

The shimmer effect creates a gradient that moves across the skeleton element:

```css
/* skeleton.css */
.h-skeleton--shimmer {
  @apply after:absolute after:inset-0 after:-translate-x-full after:animate-skeleton after:bg-linear-to-r after:from-transparent after:via-surface-tertiary after:to-transparent after:content-[''];
}
```

The shimmer animation is defined in the theme using:

```css
@theme inline {
  --animate-skeleton: skeleton 2s linear infinite;

  @keyframes skeleton {
    100% {
      transform: translateX(200%);
    }
  }
}
```

#### Pulse Animation

The pulse animation uses Tailwind's built-in `animate-pulse` utility.

#### No Animation

`animationType="none"` applies no animation class.

## API Reference

### Props

<ApiTable component="Skeleton" kind="props" />

### Slots

<ApiTable component="Skeleton" kind="slots" />

## Theme

<ApiTheme component="Skeleton" />

## Related Components

<RelatedComponents :components="['card', 'avatar']" />
