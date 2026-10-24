<script setup lang="ts">
import { Button } from '@hareui/vue'
import { defineComponent, h, ref } from 'vue'

const CustomButton = defineComponent((_, { attrs, slots }) => {
  const pressed = ref(false)
  const release = () => (pressed.value = false)
  return () =>
    h(
      'button',
      {
        ...attrs,
        type: 'button',
        'data-custom': pressed.value ? 'pressed' : 'bar',
        onPointerdown: () => (pressed.value = true),
        onPointerup: release,
        onPointerleave: release,
      },
      slots.default?.(),
    )
})
</script>

<template>
  <Button :as="CustomButton"> Press me </Button>
</template>
