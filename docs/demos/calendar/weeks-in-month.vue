<script setup lang="ts">
import { Calendar, Description } from '@hareui/vue'
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <Calendar aria-label="Event date" fixed-weeks />
    <Description class="text-center">
      Always shows 6 weeks per month to avoid layout shift when navigating
    </Description>
  </div>
</template>
