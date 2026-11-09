---
title: Kbd
description: Display keyboard shortcuts and key combinations
links:
  source: kbd/Kbd.vue
  styles: kbd/theme.ts
  heroui: kbd
---

## Usage

```ts
import { Kbd } from '@hareui/vue'
```

<ComponentPreview name="kbd/basic" />

## Anatomy

```vue
<template>
  <!-- keys render as abbr symbols (title = key name); the default slot is the content -->
  <Kbd :keys="['command']"> K </Kbd>
</template>
```

| `ui` key  | Element  | Description                                              |
| --------- | -------- | -------------------------------------------------------- |
| `base`    | `<kbd>`  | The key container                                        |
| `abbr`    | `<abbr>` | One per entry in `keys`, e.g. `⌘` with `title="Command"` |
| `content` | `<span>` | Wraps the default slot                                   |

## Examples

### Variants

<ComponentPreview name="kbd/variants" />

### Navigation Keys

<ComponentPreview name="kbd/navigation-keys" />

### Inline Usage

<ComponentPreview name="kbd/inline-usage" />

### Instructional Text

<ComponentPreview name="kbd/instructional-text" />

### Special Keys

<ComponentPreview name="kbd/special-keys" />

## Customization

### Tailwind CSS

<ComponentPreview name="kbd/custom-styles" />

### Global theme override

Override the `kbd` theme app-wide with `createHareUI`:

```ts
app.use(
  createHareUI({
    ui: {
      kbd: {
        slots: {
          base: 'bg-gray-100 dark:bg-gray-800',
          abbr: 'font-bold',
          content: 'text-sm',
        },
      },
    },
  }),
)
```

## Styling Reference

Kbd renders no `data-slot` attributes. Style it with `class`, the `ui` prop or the global theme.

- `base` – keyboard key styles with background and spacing (`variant="light"` makes the background transparent)
- `abbr` – abbreviation element for modifier keys
- `content` – content wrapper for key text

### CSS Classes

HareUI follows the [BEM](https://getbem.com/) methodology to keep component variants and states reusable and easy to customize. The Kbd component uses these CSS classes ([View source styles](https://github.com/alexzvn/hareui/blob/main/packages/vue/src/components/kbd/kbd.css)):

#### Base Classes

- `.h-kbd` - Base keyboard key styles with background and spacing
- `.h-kbd__abbr` - Abbreviation element for modifier keys
- `.h-kbd__content` - Content wrapper for key text

#### Variant Classes

- `.h-kbd--light` - Transparent background

The default variant adds no class.

The classes sit in `@layer components`, so a utility you pass through `class` or `ui` wins over them.

## API Reference

### Props

<ApiTable component="Kbd" kind="props" />

### Slots

<ApiTable component="Kbd" kind="slots" />

### KbdKey

Available values for `keys`, with the symbol and `title` each renders. The maps behind them are exported as `kbdKeysMap` and `kbdKeysLabelMap`.

| Key        | Symbol | Title     |
| ---------- | ------ | --------- |
| `command`  | ⌘      | Command   |
| `shift`    | ⇧      | Shift     |
| `ctrl`     | ⌃      | Control   |
| `option`   | ⌥      | Option    |
| `enter`    | ↵      | Enter     |
| `delete`   | ⌫      | Delete    |
| `escape`   | ⎋      | Escape    |
| `tab`      | ⇥      | Tab       |
| `capslock` | ⇪      | Caps Lock |
| `up`       | ↑      | Up        |
| `right`    | →      | Right     |
| `down`     | ↓      | Down      |
| `left`     | ←      | Left      |
| `pageup`   | ⇞      | Page Up   |
| `pagedown` | ⇟      | Page Down |
| `home`     | ↖      | Home      |
| `end`      | ↘      | End       |
| `help`     | ?      | Help      |
| `space`    | ␣      | Space     |
| `fn`       | Fn     | Fn        |
| `win`      | ⌘      | Win       |
| `alt`      | ⌥      | Alt       |

## Theme

<ApiTheme component="Kbd" />

## Related Components

<RelatedComponents :components="['typography']" />
