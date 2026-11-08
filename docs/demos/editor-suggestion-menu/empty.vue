<template>
  <Editor v-model="content" aria-label="Recipe" class="max-w-[640px]">
    <template #default="{ editor }">
      <EditorSuggestionMenu :editor="editor" :items="items">
        <template #empty="{ searchTerm }">No block named “{{ searchTerm }}”</template>
      </EditorSuggestionMenu>
    </template>
  </Editor>
</template>

<script setup lang="ts">
import { Editor, EditorSuggestionMenu } from '@hareui/vue/editor'
import type { EditorSuggestionMenuItem } from '@hareui/vue/editor'
import { ref } from 'vue'

const content = ref(`<h2>Lemon olive oil cake</h2>
<p>Serves eight. Bake at 180 °C for 40 minutes.</p>
<p></p>`)

const items: EditorSuggestionMenuItem[] = [
  {
    kind: 'heading',
    level: 3,
    label: 'Heading',
    description: 'Ingredients, method, notes',
    icon: 'icon-[gravity-ui--heading-3]',
  },
  {
    kind: 'bulletList',
    label: 'Ingredient list',
    description: 'One ingredient per line',
    icon: 'icon-[gravity-ui--list-ul]',
  },
  {
    kind: 'orderedList',
    label: 'Steps',
    description: 'The method, in order',
    icon: 'icon-[gravity-ui--list-ol]',
  },
]
</script>
