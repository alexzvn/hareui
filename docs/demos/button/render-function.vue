<template>
  <Button :as="CustomButton"> Press me </Button>
</template>

<script setup lang="ts">
import { Button } from '@hareui/vue'
import { defineComponent, h, ref } from 'vue'

const CustomButton = defineComponent((_, { attrs, slots }) => {
  const isPressed = ref(false)
  const release = () => (isPressed.value = false)

  return () =>
    h(
      'button',
      {
        ...attrs,
        type: 'button',
        'data-custom': isPressed.value ? 'pressed' : 'bar',
        onPointerdown: () => (isPressed.value = true),
        onPointerup: release,
        onPointerleave: release,
      },
      slots.default?.(),
    )
})
</script>
