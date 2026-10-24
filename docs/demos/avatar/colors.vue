<template>
  <div class="flex items-center gap-4">
    <Avatar color="default" fallback="DF" />
    <Avatar color="accent" fallback="AC" />
    <Avatar color="success" fallback="SC" />
    <Avatar color="warning" fallback="WR" />
    <Avatar color="danger" fallback="DG" />
  </div>
</template>

<script setup lang="ts">
import { Avatar } from '@hareui/vue'
</script>
