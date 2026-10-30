<template>
  <Pagination v-model:page="page" class="justify-center" :total="3" />
</template>

<script setup lang="ts">
import { Pagination } from '@hareui/vue'
import { ref } from 'vue'

const page = ref(1)
</script>
