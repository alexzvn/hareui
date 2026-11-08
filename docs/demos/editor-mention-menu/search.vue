<template>
  <Editor v-model="content" aria-label="Assign ticket" class="max-w-[640px]">
    <template #default="{ editor }">
      <EditorMentionMenu
        v-model:search-term="searchTerm"
        :editor="editor"
        :items="results"
        :loading="isLoading"
        ignore-filter
      >
        <template #empty="{ searchTerm: term }">No team called “{{ term }}”</template>
      </EditorMentionMenu>
    </template>
  </Editor>
</template>

<script setup lang="ts">
import { Editor, EditorMentionMenu } from '@hareui/vue/editor'
import type { EditorMentionMenuItem } from '@hareui/vue/editor'
import { ref, watch } from 'vue'

const content = ref(
  `<p>Card payments fail for customers in Brazil since this morning. Assigning to </p>`,
)

const directory: EditorMentionMenuItem[] = [
  {
    id: 'billing',
    label: 'Billing',
    description: 'Invoices and payments',
    icon: 'icon-[gravity-ui--credit-card]',
  },
  {
    id: 'design',
    label: 'Design',
    description: 'Product and brand',
    icon: 'icon-[gravity-ui--palette]',
  },
  {
    id: 'infra',
    label: 'Infrastructure',
    description: 'Servers and deploys',
    icon: 'icon-[gravity-ui--server]',
  },
  {
    id: 'mobile',
    label: 'Mobile',
    description: 'iOS and Android apps',
    icon: 'icon-[gravity-ui--smartphone]',
  },
  {
    id: 'support',
    label: 'Support',
    description: 'Customer replies',
    icon: 'icon-[gravity-ui--headphones]',
  },
]

const searchTerm = ref('')
const results = ref<EditorMentionMenuItem[]>(directory)
const isLoading = ref(false)

// Stands in for a request to your API.
const searchTeams = (query: string) =>
  new Promise<EditorMentionMenuItem[]>((resolve) => {
    setTimeout(() => {
      const needle = query.toLowerCase()
      resolve(directory.filter((team) => team.label.toLowerCase().includes(needle)))
    }, 400)
  })

watch(searchTerm, async (query) => {
  isLoading.value = true
  const found = await searchTeams(query)
  if (query !== searchTerm.value) return
  results.value = found
  isLoading.value = false
})
</script>
