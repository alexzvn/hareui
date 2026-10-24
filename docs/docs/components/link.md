---
title: Link
description: A styled anchor component for navigation with built-in icon support
links:
  source: link/Link.vue
  styles: link/theme.ts
  heroui: link
---

## Usage

```ts
import { Link } from '@hareui/vue'
```

<ComponentPreview name="link/basic" />

## Anatomy

```vue
<template>
  <!-- `icon` shows HeroUI's external-link arrow (Link.Icon); `#icon` replaces it -->
  <Link href="#" icon> Call to action </Link>
</template>
```

## Examples

### Icon Placement

<ComponentPreview name="link/icon-placement" />

### Text Decoration with Tailwind CSS

Link is underlined on hover by default. Use Tailwind CSS text-decoration utilities to make the underline always visible, remove it entirely, or customize its color, style, thickness, and offset.

<ComponentPreview name="link/underline-and-offset" />

**Text Decoration Line:**

- `underline` - Always visible underline
- `no-underline` - Remove underline
- default `Link` styles - Underline appears on hover

**Text Decoration Color:**

- `decoration-accent`, `decoration-muted`, etc. - Set underline color using theme colors
- `decoration-muted/50` - Use opacity modifiers for semi-transparent underlines

**Text Decoration Style:**

- `decoration-solid` - Solid line (default)
- `decoration-double` - Double line
- `decoration-dotted` - Dotted line
- `decoration-dashed` - Dashed line
- `decoration-wavy` - Wavy line

**Text Decoration Thickness:**

- `decoration-1`, `decoration-2`, `decoration-4`, etc. - Control underline thickness

**Underline Offset:**

- `underline-offset-1`, `underline-offset-2`, `underline-offset-4`, etc. - Adjust spacing between text and underline

For more details, see the Tailwind CSS documentation:

- [text-decoration-line](https://tailwindcss.com/docs/text-decoration-line)
- [text-decoration-color](https://tailwindcss.com/docs/text-decoration-color)
- [text-decoration-style](https://tailwindcss.com/docs/text-decoration-style)
- [text-decoration-thickness](https://tailwindcss.com/docs/text-decoration-thickness)
- [text-underline-offset](https://tailwindcss.com/docs/text-underline-offset)

### Custom Icon

<ComponentPreview name="link/custom-icon" />

### Render Function

<ComponentPreview name="link/render-function" />

## Customization

### Tailwind CSS

<ComponentPreview name="link/custom-styles" />

### Global theme override

```ts
app.use(
  createHareUI({
    ui: {
      link: {
        slots: {
          base: 'font-semibold',
          icon: 'opacity-100',
        },
      },
    },
  }),
)
```

## Styling Reference

### Slots

- `base` → `[data-slot="link"]` – Base link styles with hover underline
- `icon` → `[data-slot="link-icon"]` – Link icon wrapper (`data-default-icon="true"` while it shows the built-in arrow)

### Interactive States

- **Focus**: `:focus-visible`
- **Hover**: `:hover`
- **Pressed**: `:active`
- **Disabled**: `[aria-disabled="true"]`

## API Reference

### Props

<ApiTable component="Link" kind="props" />

### Slots

<ApiTable component="Link" kind="slots" />

### Theme

<ApiTheme component="Link" />

### Using with Routing Libraries

Pass a router link component to `as`; the Link styles and icon stay the same:

```vue
<script setup lang="ts">
import { Link } from '@hareui/vue'
import { RouterLink } from 'vue-router'
</script>

<template>
  <Link :as="RouterLink" to="/about"> About Page </Link>
</template>
```

## Related Components

<RelatedComponents :components="['button', 'card']" />
