<template>
  <ItemCard
    :icon="icon('moon')"
    title="Night shift"
    description="Warmer colours after sunset"
    class="w-full max-w-md"
  >
    <template #action>
      <Switch v-model="isEnabled" aria-label="Night shift" />
    </template>
  </ItemCard>
</template>

<script setup lang="ts">
import { ItemCard, Switch } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const isEnabled = ref(true)
</script>
