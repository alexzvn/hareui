<script setup lang="ts">
import { Chip } from '@hareui/vue'
import { Icon } from '@iconify/vue'

defineProps<{ theme: 'Light' | 'Dark' }>()
</script>

<template>
  <div>
    <Chip size="sm">
      <template #leading>
        <Icon class="size-3.5" icon="gravity-ui:gear" />
      </template>
      {{ theme }}
    </Chip>
  </div>
</template>
