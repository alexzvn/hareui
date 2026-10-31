<template>
  <div class="flex w-full max-w-md flex-col gap-6">
    <ItemCardGroup title="Playback" variant="secondary">
      <ItemCard :icon="icon('play')" title="Autoplay" description="Start the next episode">
        <template #action>
          <Switch v-model="isAutoplay" aria-label="Autoplay" />
        </template>
      </ItemCard>
      <ItemCard :icon="icon('gear')" title="Quality" description="On mobile data">
        <template #action>
          <InlineSelect v-model="quality" aria-label="Quality" :items="qualities" />
        </template>
      </ItemCard>
    </ItemCardGroup>
    <ItemCardGroup title="Downloads" variant="secondary">
      <ItemCard
        :icon="icon('arrow-down-to-line')"
        title="Wi-Fi only"
        description="Save mobile data"
      >
        <template #action>
          <Switch v-model="isWifiOnly" aria-label="Wi-Fi only" />
        </template>
      </ItemCard>
      <ItemCard :icon="icon('trash-bin')" title="Clear downloads" description="Frees 2.4 GB">
        <template #action>
          <Button size="sm" variant="danger-soft">Clear</Button>
        </template>
      </ItemCard>
    </ItemCardGroup>
  </div>
</template>

<script setup lang="ts">
import type { ListBoxItem, SelectValue } from '@hareui/vue'
import { Button, InlineSelect, ItemCard, ItemCardGroup, Switch } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'

const icon = (name: string) => (attrs: Record<string, unknown>) =>
  h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const qualities: ListBoxItem[] = [
  { value: 'auto', label: 'Automatic' },
  { value: 'high', label: 'High' },
  { value: 'saver', label: 'Data saver' },
]

const isAutoplay = ref(true)
const isWifiOnly = ref(false)
const quality = ref<SelectValue>('auto')
</script>
