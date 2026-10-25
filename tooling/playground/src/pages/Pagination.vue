<script setup lang="ts">
import { Pagination } from '@hareui/vue'
import { ref } from 'vue'

const page = ref(1)
</script>

<template>
  <div class="flex flex-col gap-10 p-8">
    <h1 class="text-2xl font-semibold">Pagination</h1>
    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">v-model:page + ellipsis (page {{ page }})</h2>
      <Pagination v-model:page="page" :total="12" ellipsis>
        <template #summary="{ page: p, total }">Page {{ p }} of {{ total }}</template>
      </Pagination>
    </section>
    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">sizes</h2>
      <div class="flex flex-col gap-4">
        <Pagination v-for="size in (['sm', 'md', 'lg'] as const)" :key="size" :size="size" :total="3" />
      </div>
    </section>
    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">hide-pages / icon-only / disabled</h2>
      <div class="flex flex-col gap-4">
        <Pagination :total="10" hide-pages :prev="{ label: 'Prev' }" />
        <Pagination :total="3" :prev="{ label: '' }" :next="{ label: '' }" :default-page="2" />
        <Pagination :total="3" disabled />
      </div>
    </section>
  </div>
</template>
