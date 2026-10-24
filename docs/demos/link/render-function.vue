<script setup lang="ts">
import { Link } from '@hareui/vue'
import { defineComponent, h } from 'vue'

const CustomSpan = defineComponent(
  (_, { attrs, slots }) =>
    () =>
      h('span', { ...attrs, 'data-custom': 'foo' }, slots.default?.()),
)
</script>

<template>
  <Link :as="CustomSpan" href="#" icon> Call to action </Link>
</template>
