<template>
  <div class="grid w-full max-w-[900px] grid-cols-1 gap-3 sm:grid-cols-3">
    <Metric
      title="Uptime"
      :icon="Healthy"
      status="success"
      :value="0.9991"
      :format="{ format: 'percent', maximumFractionDigits: 2 }"
    />
    <Metric title="Queue Depth" :icon="Queue" status="warning" :value="312" />
    <Metric title="Failed Jobs" :icon="Failed" status="danger" :value="17" />
  </div>
</template>

<script setup lang="ts">
import { Metric } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const Healthy = () => h(Icon, { icon: 'gravity-ui:circle-check' })
const Queue = () => h(Icon, { icon: 'gravity-ui:layers' })
const Failed = () => h(Icon, { icon: 'gravity-ui:circle-xmark' })
</script>
