---
title: Disclosure
description: A disclosure is a collapsible section with a header containing a heading and a trigger button, and a panel that wraps the content.
links:
  source: disclosure/Disclosure.vue
  styles: disclosure/theme.ts
  heroui: disclosure
---

## Usage

```ts
import { Disclosure } from '@hareui/vue'
```

<ComponentPreview name="disclosure/basic" minHeight="440px" />

## Anatomy

Disclosure is composed through props and named slots:

```vue
<Disclosure title="…" v-model:open="open">
  <!-- replaces the trigger; render the themed chevron with <component :is="indicator" /> -->
  <template #trigger="{ open, indicator }" />
  <!-- replaces the chevron inside the default trigger -->
  <template #indicator="{ open }" />
  <!-- default slot = Disclosure.Body's content -->
</Disclosure>
```

- Without `#trigger`, a `<button data-slot="disclosure-trigger">` renders `title` followed by the indicator.
- With `#trigger`, your element (for example a Button) gets the toggle handler. It also receives `aria-expanded` and `aria-controls`.

## Examples

### Render Function

<ComponentPreview name="disclosure/render-function" />

## Customization

### Tailwind CSS

<ComponentPreview name="disclosure/custom-styles" />

### Global CSS

To customize the Disclosure component classes app-wide, override the `disclosure` theme with `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      disclosure: {
        slots: {
          base: 'relative',
          trigger: 'cursor-pointer',
          indicator: 'transition-transform duration-300',
          content: 'overflow-hidden transition-all',
        },
      },
    },
  }),
)
```

## Styling Reference

Each rendered element carries a `data-slot` attribute, so you can target it with selectors.

| `ui` key    | `data-slot`            | Description                       |
| ----------- | ---------------------- | --------------------------------- |
| `base`      | `disclosure`           | Base container styles             |
| `heading`   | `disclosure-heading`   | Heading wrapper                   |
| `trigger`   | `disclosure-trigger`   | Trigger button styles             |
| `indicator` | `disclosure-indicator` | Chevron indicator styles          |
| `content`   | `disclosure-content`   | Content container with animations |
| `body`      | `disclosure-body`      | Body wrapper inside the content   |
| `bodyInner` | -                      | Inner wrapper around the body     |

### CSS Classes

HareUI follows the [BEM](https://getbem.com/) methodology to keep component variants and states reusable and easy to customize. The Disclosure component uses these CSS classes ([View source styles](https://github.com/alexzvn/hareui/blob/main/packages/vue/src/components/disclosure/disclosure.css)):

#### Base Classes

- `.h-disclosure` - Base container styles
- `.h-disclosure__trigger` - Trigger button styles
- `.h-disclosure__indicator` - Chevron indicator styles
- `.h-disclosure__content` - Content container with animations
- `.h-disclosure__body` - Body wrapper inside the content

The heading and the inner body wrapper carry no class.

The classes sit in `@layer components`, so a utility you pass through `class` or `ui` wins over them.

### Interactive States

The component supports both CSS pseudo-classes and data attributes for flexibility:

- **Expanded**: `[data-expanded="true"]` on indicator for rotation
- **Focus**: `:focus-visible` on trigger
- **Disabled**: `:disabled` or `[aria-disabled="true"]` on trigger
- **Hidden**: `[aria-hidden="false"]` on content for visibility

## API Reference

### Props

<ApiTable component="Disclosure" kind="props" />

### Slots

<ApiTable component="Disclosure" kind="slots" />

### Emits

<ApiTable component="Disclosure" kind="emits" />

## Theme

<ApiTheme component="Disclosure" />

## Related Components

<RelatedComponents :components="['button', 'card']" />
