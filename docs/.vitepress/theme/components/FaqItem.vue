<template>
  <slot />
</template>

<script setup lang="ts">
// One question for <Faq>. Faq reads `question` as the trigger label and renders the default slot
// (markdown, when separated from the tags by blank lines) as the answer.
defineProps<{ question: string }>()
</script>
