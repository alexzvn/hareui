<template>
  <Link as="button" type="button" @click="isExpanded = !isExpanded">
    {{ isExpanded ? 'Hide replies' : 'Show 12 replies' }}
  </Link>
</template>

<script setup lang="ts">
import { Link } from '@hareui/vue'
import { ref } from 'vue'

const isExpanded = ref(false)
</script>
