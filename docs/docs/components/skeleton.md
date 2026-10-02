---
title: Skeleton
description: Skeleton is a placeholder to show a loading state and the expected shape of a component.
links:
  source: Skeleton.vue
  styles: skeleton.ts
  heroui: skeleton
---

## Usage

```ts
import { Skeleton } from 'herouse'
```

<ComponentPreview name="skeleton/basic" />

## Anatomy

Skeleton is a single element. Size and shape come from `class`; the default slot is optional.

`ui` keys: `base`.

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
container classes below on a parent element (the equivalent of HeroUI's `skeleton--shimmer`
class) and set `animation-type="none"` on child skeletons.

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

Override the `skeleton` theme app-wide with `createHeroUse`:

```ts
app.use(createHeroUse({
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
}))
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
.light, [data-theme="light"] {
  --skeleton-animation: shimmer;
}

.dark, [data-theme="dark"] {
  --skeleton-animation: pulse;
}
```

This global setting will be overridden by the `animationType` prop when specified on individual components.
Like HeroUI, the variable is read from `:root` once per page load, after the component mounts.

## Styling Reference

Like HeroUI's, the Skeleton root has no `data-slot`.

| `ui` key | Description |
|---|---|
| `base` | Base skeleton styles with background and rounded corners |

HeroUI's modifier classes correspond to the `animationType` prop (herouse renders utilities, not
BEM classes, so style through `class`, `ui` or `createHeroUse`):

- `.skeleton--shimmer` → `shimmer` (default): shimmer animation with a gradient
- `.skeleton--pulse` → `pulse`: Tailwind's `animate-pulse`
- `.skeleton--none` → `none`: static skeleton

### Animation

#### Shimmer Animation

The shimmer effect creates a gradient that moves across the skeleton element:

```ts
// theme/skeleton.ts, animationType.shimmer
'after:absolute after:inset-0 after:-translate-x-full after:animate-skeleton after:bg-linear-to-r after:from-transparent after:via-surface-tertiary after:to-transparent after:content-[\'\']'
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

`animationType="none"` applies no animation classes.

## API Reference

### Props

<ApiTable component="Skeleton" kind="props" />

### Slots

<ApiTable component="Skeleton" kind="slots" />

## Related Components

<RelatedComponents :components="['card', 'avatar']" />
