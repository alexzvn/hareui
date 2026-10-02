<script setup lang="ts">
import { SearchField } from 'herouse'
</script>

<template>
  <div class="flex flex-col gap-4">
    <SearchField class="w-[280px]" name="search" label="Search products" placeholder="Search products..." description="Enter keywords to search for products" />
    <SearchField class="w-[280px]" name="search-users" label="Search users" placeholder="Search users..." description="Search by name, email, or username" />
  </div>
</template>
