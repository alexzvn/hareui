<template>
  <div class="flex items-center gap-4">
    <div class="flex flex-col items-center gap-2">
      <CloseButton>
        <Icon icon="gravity-ui:circle-xmark" />
      </CloseButton>
      <span class="text-xs text-muted">Custom Icon</span>
    </div>
    <div class="flex flex-col items-center gap-2">
      <CloseButton>
        <Icon icon="gravity-ui:xmark" />
      </CloseButton>
      <span class="text-xs text-muted">Alternative Icon</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CloseButton } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>
