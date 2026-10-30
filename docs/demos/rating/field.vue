<template>
  <Rating
    label="Room comfort"
    description="Bed, temperature and noise during your stay."
    :default-value="3"
  />
</template>

<script setup lang="ts">
import { Rating } from '@hareui/vue'
</script>
