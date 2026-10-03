<script setup lang="ts">
import { Avatar } from '@hareui/vue'
</script>

<template>
  <Avatar
    alt="John Doe"
    class="rounded-lg"
    fallback="JD"
    src="https://img.heroui.chat/image/avatar?w=400&h=400&u=3"
    :ui="{ fallback: 'rounded-lg' }"
  />
</template>
