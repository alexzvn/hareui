<script setup lang="ts">
import { Pagination } from '@hareui/vue'

// HeroUI swaps `linkClass` for `activeClass` on the current page; here both live on the `link`
// key, with the active styles behind `data-[active=true]:`.
const linkClass = 'text-muted hover:bg-surface hover:text-foreground'
const activeClass =
  'data-[active=true]:bg-accent data-[active=true]:text-accent-foreground data-[active=true]:hover:bg-accent-hover'
</script>

<template>
  <Pagination
    class="justify-center"
    :default-page="2"
    next-label=""
    prev-label=""
    :total="3"
    :ui="{ content: 'gap-1 rounded-xl bg-default p-1', link: `${linkClass} ${activeClass}` }"
  />
</template>
