<script setup lang="ts">
import { Avatar } from 'herouse'
import { Icon } from '@iconify/vue'
</script>

<template>
  <div class="flex items-center gap-4">
    <!-- Text fallback -->
    <Avatar fallback="JD" />

    <!-- Icon fallback -->
    <Avatar>
      <template #fallback><Icon icon="gravity-ui:person" /></template>
    </Avatar>

    <!-- Fallback with delay -->
    <Avatar :delay-ms="600" fallback="NA" src="https://invalid-url-to-show-fallback.com/image.jpg" />

    <!-- Custom styled fallback -->
    <Avatar fallback="GB" :ui="{ fallback: 'border-none bg-linear-to-br from-pink-500 to-purple-500 text-white' }" />
  </div>
</template>
