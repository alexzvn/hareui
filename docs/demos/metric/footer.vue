<template>
  <Metric
    class="w-full max-w-80"
    title="Newsletter Readers"
    :icon="Readers"
    status="success"
    :value="23518"
  >
    <template #footer>
      <Link href="#" class="text-sm">Open audience report</Link>
    </template>
  </Metric>
</template>

<script setup lang="ts">
import { Link, Metric } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { h } from 'vue'

const Readers = () => h(Icon, { icon: 'gravity-ui:envelope' })
</script>
