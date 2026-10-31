<template>
  <div class="grid w-full max-w-[640px] grid-cols-1 gap-3 sm:grid-cols-2">
    <Metric
      title="Storage Used"
      :icon="Storage"
      status="success"
      :value="0.42"
      :format="{ format: 'percent' }"
      :progress="{ value: 42 }"
    />
    <Metric
      title="Monthly Quota"
      :icon="Quota"
      status="danger"
      :value="0.91"
      :format="{ format: 'percent' }"
      :progress="{ value: 91, status: 'danger' }"
    />
  </div>
</template>

<script setup lang="ts">
import { Metric } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const Storage = () => h(Icon, { icon: 'gravity-ui:database' })
const Quota = () => h(Icon, { icon: 'gravity-ui:speedometer' })
</script>
