<script setup lang="ts">
import { Calendar, Description } from '@hareui/vue'
import { getLocalTimeZone, today } from '@internationalized/date'
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <Calendar aria-label="Event date" :default-value="today(getLocalTimeZone())" readonly />
    <Description class="text-center"> Calendar is read-only </Description>
  </div>
</template>
