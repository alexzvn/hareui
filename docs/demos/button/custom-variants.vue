<script setup lang="ts">
import { Button, themes, tv } from '@hareui/vue'

const myButtonVariants = tv({
  extend: themes.button,
  slots: {
    base: 'font-semibold shadow-md text-shadow-lg data-[pending=true]:opacity-40',
  },
  variants: {
    radius: {
      full: { base: 'rounded-full' },
      lg: { base: 'rounded-lg' },
      md: { base: 'rounded-md' },
      sm: { base: 'rounded-sm' },
    },
    size: {
      sm: { base: 'h-10 px-4' },
      md: { base: 'h-11 px-6' },
      lg: { base: 'h-12 px-8' },
      xl: { base: 'h-13 px-10' },
    },
    variant: {
      primary: { base: 'text-white dark:bg-white/10 dark:text-white dark:hover:bg-white/15' },
    },
  },
  defaultVariants: {
    radius: 'full',
    variant: 'primary',
  },
})
</script>

<template>
  <Button :class="myButtonVariants({ radius: 'full', variant: 'primary' }).base()">
    Custom Button
  </Button>
</template>
