<template>
  <div class="flex min-h-screen items-center justify-center p-6">
    <Button variant="secondary" @click="isOpen = !isOpen">
      {{ isOpen ? 'Hide actions' : 'Show actions' }}
    </Button>
    <ActionBar v-model:open="isOpen">
      <template #prefix>
        <Chip size="sm" variant="secondary" class="shrink-0 tabular-nums">3</Chip>
      </template>
      <template #default="{ labelClass }">
        <Button size="sm" variant="ghost">
          <Icon icon="gravity-ui:tag" />
          <span :class="labelClass">Label</span>
        </Button>
        <Button size="sm" variant="ghost">
          <Icon icon="gravity-ui:folder-arrow-right" />
          <span :class="labelClass">Move</span>
        </Button>
        <Button size="sm" variant="ghost">
          <Icon icon="gravity-ui:star" />
          <span :class="labelClass">Favorite</span>
        </Button>
      </template>
      <template #suffix="{ close }">
        <Button icon-only size="sm" variant="ghost" aria-label="Close" @click="close">
          <Icon icon="gravity-ui:xmark" />
        </Button>
      </template>
    </ActionBar>
  </div>
</template>

<script setup lang="ts">
import { ActionBar, Button, Chip } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const isOpen = ref(true)
</script>
