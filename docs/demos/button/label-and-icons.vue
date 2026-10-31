<template>
  <div class="flex flex-wrap items-center gap-3">
    <Button label="Compose" leading-icon="icon-[gravity-ui--pencil]" />
    <Button variant="secondary" label="Next step" trailing-icon="icon-[gravity-ui--arrow-right]" />
    <Button
      variant="tertiary"
      label="Mira Okafor"
      :avatar="{
        src: 'https://img.heroui.chat/image/avatar?w=80&h=80&u=4',
        alt: '',
        fallback: 'MO',
      }"
    />
    <Button variant="ghost" aria-label="Notifications" leading-icon="icon-[gravity-ui--bell]" />
  </div>
</template>

<script setup lang="ts">
import { Button } from '@hareui/vue'
</script>
