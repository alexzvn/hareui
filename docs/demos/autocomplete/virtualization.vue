<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import { Autocomplete } from '@hareui/vue'
import { useFilter } from 'reka-ui'
import { computed, ref } from 'vue'

interface User extends ListBoxItem {
  label: string
  description: string
}

function generateUsers(n: number): User[] {
  const firstNames = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'James', 'Sophia', 'Oliver', 'Isabella', 'Lucas', 'Mia', 'Ethan', 'Charlotte', 'Mason', 'Amelia', 'Logan', 'Harper', 'Alexander', 'Ella', 'Benjamin']
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Jackson', 'White', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker']
  return Array.from({ length: n }, (_, i) => {
    const firstName = firstNames[i % firstNames.length]!
    const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length]!
    return { value: i + 1, label: `${firstName} ${lastName}`, description: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@acme.com` }
  })
}

const allUsers = generateUsers(1000)
const selectedKey = ref<number | null>(null)
const searchQuery = ref('')
const { contains } = useFilter({ sensitivity: 'base' })
// Filter on name or email ourselves; `:filter="false"` shows the items as given
const filteredUsers = computed(() => searchQuery.value
  ? allUsers.filter(user => contains(user.label, searchQuery.value) || contains(user.description, searchQuery.value))
  : allUsers)
</script>

<template>
  <Autocomplete
    v-model="selectedKey"
    v-model:input-value="searchQuery"
    allows-empty-collection
    clearable
    class="w-[300px]"
    label="User"
    placeholder="Select a user"
    search-label="Search users"
    search-placeholder="Search users..."
    :filter="false"
    :items="filteredUsers"
    :virtualize="{ estimateSize: 50 }"
    :ui="{ searchField: 'sticky top-0 z-10' }"
  >
    <template #empty>
      No results found
    </template>
  </Autocomplete>
</template>
