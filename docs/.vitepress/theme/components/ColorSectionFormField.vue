<script setup lang="ts">
import FormFieldThemeBlock, { type FormFieldColors } from './color/FormFieldThemeBlock.vue'

defineProps<{ colors: FormFieldColors }>()
</script>

<template>
  <div class="not-prose flex flex-col gap-2">
    <FormFieldThemeBlock :colors="colors" theme="light" />
    <FormFieldThemeBlock :colors="colors" theme="dark" />
  </div>
</template>
