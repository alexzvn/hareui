---
title: Empty State
description: A placeholder for empty lists, tables and pages, with an icon or avatar, a title, a description and actions.
links:
  source: empty-state/EmptyState.vue
  styles: empty-state/theme.ts
---

## Usage

```ts
import { EmptyState } from '@hareui/vue'
```

Explain why a view is empty and what to do next:

- `icon`: a component or an icon class, shown in a tinted box
- `title` and `description`: the message
- `actions`: an array of [Button](/docs/components/button) props, such as `label` and `onClick`

<ComponentPreview name="empty-state/basic" />

## Anatomy

```vue
<EmptyState>
  <template #leading />     <!-- optional: replaces the icon or avatar -->
  <template #title />       <!-- optional: replaces `title` -->
  <template #description /> <!-- optional: replaces `description` -->
  <template #actions />     <!-- optional: replaces `actions` -->
</EmptyState>
```

With none of these props or slots, the empty state shows its default slot as one muted line, or "No results found"
when the slot is empty. Lists and tables use this form in their `#empty` slots.

## Examples

### Minimal

Leave out the media and the actions for a quiet message.

<ComponentPreview name="empty-state/minimal" />

### Variant

`variant="outline"` draws a dashed border, for drop zones and empty panels.

<ComponentPreview name="empty-state/outline" />

`variant="secondary"` fills it with the secondary surface instead.

<ComponentPreview name="empty-state/with-background" />

### Size

`size` scales the padding, the media, the text and the action buttons. Defaults to `md`. An action button keeps its
own `size` if it sets one.

<ComponentPreview name="empty-state/sizes" />

### Full Height

Center the empty state in a fixed-height container to fill a page or a panel.

<ComponentPreview name="empty-state/full-height" />

### Avatar

Pass [Avatar](/docs/components/avatar) props to `avatar` to show a person instead of an icon.

<ComponentPreview name="empty-state/with-avatar" />

### Leading Slot

Use the `#leading` slot for any other media, such as an [AvatarGroup](/docs/components/avatar-group).

<ComponentPreview name="empty-state/with-avatar-group" />

### Slots

The `#title`, `#description` and `#actions` slots replace their props.

<ComponentPreview name="empty-state/slots" />

## Accessibility

- The title is an `h3` and the description a `p`. The icon is decorative.
- Add `role="status"` when the empty state appears after a search or a filter, so screen readers announce it.

## Styling Reference

Each rendered element carries a `data-slot` attribute, so you can target it with selectors.

| `ui` key      | `data-slot`               | Description                                  |
| ------------- | ------------------------- | -------------------------------------------- |
| `base`        | `empty-state`             | Root container                               |
| `header`      | `empty-state-header`      | Wrapper for the media, title and description |
| `media`       | `empty-state-media`       | The `icon`, `avatar` or `#leading` content   |
| `title`       | `empty-state-title`       | Title heading                                |
| `description` | `empty-state-description` | Description text                             |
| `actions`     | `empty-state-actions`     | The `#actions` content                       |

### CSS Classes

HareUI follows the [BEM](https://getbem.com/) methodology to keep component variants and states reusable and easy to customize. The EmptyState component uses these CSS classes ([View source styles](https://github.com/alexzvn/hareui/blob/main/packages/vue/src/components/empty-state/empty-state.css)):

#### Base & Element Classes

- `.h-empty-state` - Base container, a plain muted line on its own
- `.h-empty-state__header` - Wrapper for the media, title and description
- `.h-empty-state__media` - Media container
- `.h-empty-state__title` - Title heading
- `.h-empty-state__description` - Description text
- `.h-empty-state__actions` - Actions row

#### Size Classes

- `.h-empty-state--sm` - Small size variant
- `.h-empty-state--lg` - Large size variant

The default `md` size adds no class.

#### Variant Classes

- `.h-empty-state--outline` - Dashed border
- `.h-empty-state--secondary` - Secondary surface background

The default variant adds no class.

#### Modifier Classes

- `.h-empty-state--structured` - Centred column, added with any media, title, description or actions
- `.h-empty-state__media--icon` - Muted circle around an `icon`

The classes sit in `@layer components`, so a utility you pass through `class` or `ui` wins over them.

## API Reference

### Props

<ApiTable component="EmptyState" kind="props" />

### Slots

<ApiTable component="EmptyState" kind="slots" />

## Theme

<ApiTheme component="EmptyState" />
