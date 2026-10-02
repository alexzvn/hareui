<script setup lang="ts">
import { Calendar } from 'herouse'
</script>

<template>
  <Calendar aria-label="Trip dates" class="@container-normal w-full max-w-none overflow-x-auto" :number-of-months="2" />
</template>
