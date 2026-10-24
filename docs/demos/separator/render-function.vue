<script setup lang="ts">
import { Separator } from '@hareui/vue'
import { defineComponent, h } from 'vue'

const CustomDiv = defineComponent(
  (_, { attrs, slots }) =>
    () =>
      h('div', { ...attrs, 'data-custom': 'foo' }, slots.default?.()),
)
</script>

<template>
  <div class="max-w-md">
    <div class="space-y-1">
      <h4 class="text-medium font-medium">HeroUI v3 Components</h4>
      <p class="text-small text-default-400">Beautiful, fast and modern React UI library.</p>
    </div>
    <Separator class="my-4" :as="CustomDiv" />
    <div class="text-small flex h-5 items-center space-x-4">
      <div>Blog</div>
      <Separator orientation="vertical" :as="CustomDiv" />
      <div>Docs</div>
      <Separator orientation="vertical" :as="CustomDiv" />
      <div>Source</div>
    </div>
  </div>
</template>
