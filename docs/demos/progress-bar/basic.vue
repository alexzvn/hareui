<script setup lang="ts">
import { ProgressBar } from 'herouse'
</script>

<template>
  <ProgressBar aria-label="Loading" class="w-64" label="Loading" :value="60" />
</template>
