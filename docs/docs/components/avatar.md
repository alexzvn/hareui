---
title: Avatar
description: Display user profile images with customizable fallback content
links:
  reka: avatar
  source: avatar/Avatar.vue
  styles: avatar/theme.ts
  heroui: avatar
---

## Usage

```ts
import { Avatar } from '@hareui/vue'
```

<ComponentPreview name="avatar/basic" />

## Anatomy

Avatar is a single component. Set the image and the fallback through props and slots. The fallback
shows until the image loads, or if it fails.

```vue
<Avatar src="…" alt="…" fallback="JD">
  <template #image /> <!-- optional: custom image component (Avatar.Image asChild) -->
  <template #fallback /> <!-- optional: replaces the fallback text (Avatar.Fallback children) -->
</Avatar>
```

## Examples

### Sizes

<ComponentPreview name="avatar/sizes" />

### Colors

<ComponentPreview name="avatar/colors" />

### Variants

<ComponentPreview name="avatar/variants" />

### Fallback Content

<ComponentPreview name="avatar/fallback" />

## Customization

### Custom Image Component

Use the `#image` slot to compose with a custom image component, such as a framework's
optimized image component. Pass `src` on `Avatar` too. Avatar then tracks the loading state and
shows the fallback until the image is ready. The slotted element receives `src`, the `image`
classes and the loading-state visibility.

<ComponentPreview name="avatar/custom-image-component" />

### Tailwind CSS

Use the `class` prop for the root and `:ui="{ fallback: '…' }"` for the fallback:

<ComponentPreview name="avatar/custom-styles" />

### Global theme override

Override the `avatar` theme app-wide with `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      avatar: {
        slots: {
          base: 'size-16 border-2 border-accent',
          fallback: 'bg-linear-to-br from-purple-500 to-pink-500',
        },
      },
    },
  }),
)
```

## Styling Reference

| `ui` key   | `data-slot`       | Description                                                         |
| ---------- | ----------------- | ------------------------------------------------------------------- |
| `base`     | —                 | Base container with default size (`size-10`)                        |
| `image`    | —                 | Image element with aspect-square sizing, rendered when `src` is set |
| `fallback` | `avatar-fallback` | Fallback container with centered content (text or `#fallback` slot) |

The `size`, `variant` and `color` props control the appearance. `color` only affects the fallback. It has no effect
once an image has loaded.

### CSS Classes

HareUI follows the [BEM](https://getbem.com/) methodology to keep component variants and states reusable and easy to customize. The Avatar component uses these CSS classes ([View source styles](https://github.com/alexzvn/hareui/blob/main/packages/vue/src/components/avatar/avatar.css)):

#### Base Classes

- `.h-avatar` - Base container with default size (`size-10`)
- `.h-avatar__image` - Image element with aspect-square sizing
- `.h-avatar__fallback` - Fallback container with centered content

#### Size Classes

- `.h-avatar--sm` - Small avatar (`size-8`)
- `.h-avatar--lg` - Large avatar (`size-12`)

The default `md` size adds no class.

#### Variant Classes

- `.h-avatar--soft` - Soft variant with lighter background

#### Color Classes

- `.h-avatar__fallback--default` - Default text color
- `.h-avatar__fallback--accent` - Accent text color
- `.h-avatar__fallback--success` - Success text color
- `.h-avatar__fallback--warning` - Warning text color
- `.h-avatar__fallback--danger` - Danger text color

The classes sit in `@layer components`, so a utility you pass through `class` or `ui` wins over them.

## API Reference

### Props

<ApiTable component="Avatar" kind="props" />

### Slots

<ApiTable component="Avatar" kind="slots" />

### Emits

<ApiTable component="Avatar" kind="emits" />

## Theme

<ApiTheme component="Avatar" />

## Related Components

<RelatedComponents :components="['card', 'chip']" />
