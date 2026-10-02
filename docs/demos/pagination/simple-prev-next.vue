<script setup lang="ts">
import { Pagination } from 'herouse'
import { computed, ref } from 'vue'

const page = ref(1)
const totalPages = 10
const itemsPerPage = 5
const totalItems = 50
const startItem = computed(() => (page.value - 1) * itemsPerPage + 1)
const endItem = computed(() => Math.min(page.value * itemsPerPage, totalItems))
</script>

<template>
  <Pagination v-model:page="page" class="w-full" hide-pages prev-label="Prev" :total="totalPages">
    <template #summary>
      {{ startItem }} to {{ endItem }} of {{ totalItems }} invoices
    </template>
  </Pagination>
</template>
