<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@hareui/vue'
import { Icon } from '../icons'

const variants = ['primary', 'secondary', 'tertiary', 'ghost', 'outline', 'danger', 'danger-soft'] as const
const sizes = ['sm', 'md', 'lg'] as const

const loading = ref(false)
function startLoading() {
  loading.value = true
  setTimeout(() => (loading.value = false), 2000)
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <h1 class="text-xl font-semibold">Button</h1>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Variants</h2>
      <div class="flex flex-wrap gap-3">
        <Button v-for="variant in variants" :key="variant" :variant="variant">{{ variant }}</Button>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Sizes</h2>
      <div class="flex items-center gap-3">
        <Button v-for="size in sizes" :key="size" :size="size">{{ size }}</Button>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Icon only</h2>
      <div class="flex items-center gap-3">
        <Button icon-only aria-label="Settings" variant="tertiary">
          <Icon icon="gravity-ui:gear" />
        </Button>
        <Button icon-only aria-label="Delete" variant="danger">
          <Icon icon="gravity-ui:trash-bin" />
        </Button>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Full width</h2>
      <div class="w-80 space-y-3">
        <Button full-width>Full width</Button>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Disabled</h2>
      <div class="flex flex-wrap gap-3">
        <Button v-for="variant in variants" :key="variant" disabled :variant="variant">{{ variant }}</Button>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Pending</h2>
      <div class="flex items-center gap-3">
        <Button pending>Uploading…</Button>
        <Button :pending="loading" @click="startLoading">{{ loading ? 'Uploading…' : 'Click to load' }}</Button>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Slots (leading / trailing)</h2>
      <div class="flex flex-wrap gap-3">
        <Button>
          <template #leading><Icon icon="gravity-ui:envelope" /></template>
          Email
        </Button>
        <Button variant="secondary">
          Next
          <template #trailing><Icon icon="gravity-ui:chevron-down" /></template>
        </Button>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">:ui override</h2>
      <Button :ui="{ base: 'rounded-md uppercase tracking-widest' }">Square-ish</Button>
    </section>
  </div>
</template>
