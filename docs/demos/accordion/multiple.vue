<script setup lang="ts">
import { Accordion } from '@hareui/vue'

const items = [
  {
    label: 'Getting Started',
    content: 'Learn the basics of HeroUI and how to integrate it into your React project. This section covers installation, setup, and your first component.',
  },
  {
    label: 'Core Concepts',
    content: 'Understand the fundamental concepts behind HeroUI, including the compound component pattern, styling with Tailwind CSS, and accessibility features.',
  },
  {
    label: 'Advanced Usage',
    content: 'Explore advanced features like custom variants, theme customization, and integration with other libraries in your React ecosystem.',
  },
  {
    label: 'Best Practices',
    content: 'Follow our recommended best practices for building performant, accessible, and maintainable applications with HeroUI components.',
  },
]
</script>

<template>
  <Accordion class="w-full max-w-md" :items="items" multiple />
</template>
