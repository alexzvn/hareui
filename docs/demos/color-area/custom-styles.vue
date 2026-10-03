<script setup lang="ts">
import { ColorArea } from '@hareui/vue'
</script>

<template>
  <ColorArea
    class="size-44 rounded-3xl"
    :ui="{ thumb: 'size-5 rounded-full border-4 border-white' }"
    default-value="rgb(116, 52, 255)"
  />
</template>
