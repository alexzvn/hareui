<script setup lang="ts">
import { Pagination } from '@hareui/vue'
import { computed, ref } from 'vue'

const page = ref(1)
const totalPages = 12
const itemsPerPage = 10
const totalItems = 120
const startItem = computed(() => (page.value - 1) * itemsPerPage + 1)
const endItem = computed(() => Math.min(page.value * itemsPerPage, totalItems))
</script>

<template>
  <Pagination v-model:page="page" class="w-full" ellipsis :total="totalPages">
    <template #summary>
      Showing {{ startItem }}-{{ endItem }} of {{ totalItems }} results
    </template>
  </Pagination>
</template>
