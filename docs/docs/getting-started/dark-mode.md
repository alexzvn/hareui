---
title: Dark Mode
description: Add light, dark, and system theme switching to HareUI.
---

HareUI dark mode is CSS-driven. Components read theme variables from the root element, so there's no provider component to mount. Add the `dark` class or `data-theme="dark"` to `<html>` and every component picks up the dark theme automatically.

```html
<html class="dark" data-theme="dark">
  <body class="bg-background text-foreground">
    <!-- Your app -->
  </body>
</html>
```

Keep the `bg-background` and `text-foreground` classes on your app shell so the page canvas changes with the active theme.

::: info
HareUI's built-in light and dark themes respond to both `.light`/`.dark` classes and `data-theme="light"`/`data-theme="dark"` attributes. If you set both manually, keep the values in sync.
:::

## A Toggle Composable

Since HareUI has no theme provider, write a small composable that toggles the `dark` class and persists the choice:

```ts [composables/useDark.ts]
import { ref, watchEffect } from 'vue'

type Theme = 'light' | 'dark' | 'system'

const theme = ref<Theme>((localStorage.getItem('theme') as Theme) ?? 'system')

function resolve(value: Theme): 'light' | 'dark' {
  if (value === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return value
}

watchEffect(() => {
  const resolved = resolve(theme.value)
  document.documentElement.classList.toggle('dark', resolved === 'dark')
  document.documentElement.dataset.theme = resolved
  localStorage.setItem('theme', theme.value)
})

export function useDark() {
  return {
    theme,
    resolvedTheme: () => resolve(theme.value),
    setTheme: (value: Theme) => (theme.value = value),
  }
}
```

```vue [components/ThemeSwitcher.vue]
<template>
  <div class="flex items-center gap-2">
    <Button :variant="theme === 'light' ? 'primary' : 'secondary'" @click="setTheme('light')">
      Light
    </Button>
    <Button :variant="theme === 'dark' ? 'primary' : 'secondary'" @click="setTheme('dark')">
      Dark
    </Button>
    <Button :variant="theme === 'system' ? 'primary' : 'secondary'" @click="setTheme('system')">
      System
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@hareui/vue'
import { useDark } from '../composables/useDark'

const { theme, setTheme } = useDark()
</script>
```

::: tip
If your app already uses [VueUse](https://vueuse.org/), its [`useDark`](https://vueuse.org/core/useDark/) composable covers the same `prefers-color-scheme` detection, `localStorage` persistence, and class toggling — pass `{ selector: 'html', valueDark: 'dark' }` and skip writing your own.
:::

## Styling for Both Themes

Theme-aware utilities work automatically because they read CSS variables:

```vue
<template>
  <main class="min-h-screen bg-background text-foreground">
    <section class="bg-surface text-surface-foreground shadow-surface">Theme-aware content</section>
  </main>
</template>
```

Use the `dark:` variant for one-off changes that only apply in dark mode:

```vue
<div class="bg-background text-foreground dark:border-default">
  Custom dark-mode adjustment
</div>
```

See [Colors](/docs/getting-started/colors) for every token's light and dark value, and [Theming](/docs/getting-started/theming) to override them.
