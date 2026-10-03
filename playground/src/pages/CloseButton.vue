<script setup lang="ts">
import { ref } from 'vue'
import { CloseButton } from '@hareui/vue'
import { Icon } from '../icons'

const count = ref(0)
</script>

<template>
  <div class="flex flex-col gap-8">
    <h1 class="text-xl font-semibold">CloseButton</h1>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Default</h2>
      <CloseButton />
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Disabled</h2>
      <CloseButton disabled />
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Interactive</h2>
      <div class="flex flex-col items-center gap-2">
        <CloseButton :aria-label="`Close (clicked ${count} times)`" @click="count++" />
        <span class="text-sm text-muted">Clicked: {{ count }} times</span>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Custom icon slot</h2>
      <div class="flex items-center gap-4">
        <CloseButton>
          <Icon icon="gravity-ui:circle-xmark" />
        </CloseButton>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">:ui override</h2>
      <CloseButton :ui="{ base: 'size-8 rounded-full bg-default text-muted hover:bg-default-hover' }" />
    </section>
  </div>
</template>
