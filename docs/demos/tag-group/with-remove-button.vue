<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { TagGroup } from 'herouse'
import { ref } from 'vue'

const tags = ref([
  { id: 'news', label: 'News' },
  { id: 'travel', label: 'Travel' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'shopping', label: 'Shopping' },
])
const frameworks = ref([
  { id: 'react', label: 'React' },
  { id: 'vue', label: 'Vue' },
  { id: 'angular', label: 'Angular' },
  { id: 'svelte', label: 'Svelte' },
])

function onRemoveTags(ids: string[]) {
  tags.value = tags.value.filter(tag => !ids.includes(tag.id))
}
function onRemoveFrameworks(ids: string[]) {
  frameworks.value = frameworks.value.filter(framework => !ids.includes(framework.id))
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="w-sm">
      <TagGroup selection-mode="single" removable label="Default Remove Button" description="Click the X to remove tags" :items="tags" @remove="onRemoveTags" />
    </div>
    <div class="w-md">
      <TagGroup selection-mode="single" removable label="Custom Remove Button" description="Custom remove button with icon" :items="frameworks" @remove="onRemoveFrameworks">
        <template #removeButton>
          <Icon icon="gravity-ui:circle-xmark-fill" />
        </template>
      </TagGroup>
    </div>
  </div>
</template>
