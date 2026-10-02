<script setup lang="ts">
import { TagGroup } from 'herouse'
import { computed, ref } from 'vue'

const items = [
  { id: 'news', label: 'News' },
  { id: 'travel', label: 'Travel' },
  { id: 'gaming', label: 'Gaming', disabled: true },
  { id: 'shopping', label: 'Shopping' },
]

const single = ref<string[]>(['news'])
const multiple = ref<string[]>(['news', 'travel'])
const removableItems = ref([...items.map(i => ({ ...i }))])
function onRemove(ids: string[]) {
  removableItems.value = removableItems.value.filter(i => !ids.includes(i.id))
}

const errorSelected = ref<string[]>([])
const isInvalid = computed(() => errorSelected.value.length === 0)
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <h1 class="text-2xl font-semibold">
      TagGroup
    </h1>

    <section class="flex flex-wrap items-start gap-10">
      <TagGroup aria-label="Tags" selection-mode="single" :items="items" />
      <TagGroup aria-label="Tags" selection-mode="none" :items="items" />
    </section>

    <section class="flex flex-col gap-6">
      <TagGroup selection-mode="single" size="sm" label="Small" :items="items" />
      <TagGroup selection-mode="single" size="md" label="Medium" :items="items" />
      <TagGroup selection-mode="single" size="lg" label="Large" :items="items" />
    </section>

    <section class="flex flex-col gap-6">
      <TagGroup selection-mode="single" variant="default" label="Default variant" :items="items" />
      <TagGroup selection-mode="single" variant="surface" label="Surface variant" :items="items" />
    </section>

    <section class="flex flex-col gap-6">
      <TagGroup v-model:selected="single" selection-mode="single" label="Single selection" description="Choose one" :items="items" />
      <TagGroup v-model:selected="multiple" selection-mode="multiple" label="Multiple selection" description="Choose many" :items="items" />
    </section>

    <section class="flex flex-col gap-6">
      <TagGroup disabled label="Whole group disabled" :items="items" />
      <TagGroup selection-mode="single" label="Disabled keys" :disabled-keys="['travel']" :items="items" />
    </section>

    <section class="flex flex-col gap-6">
      <TagGroup selection-mode="single" removable label="Removable" description="Click X or press Delete/Backspace" :items="removableItems" @remove="onRemove" />
      <TagGroup label="Empty state" :items="[]">
        <template #empty>
          <p class="text-sm text-muted">
            No tags
          </p>
        </template>
      </TagGroup>
    </section>

    <section class="flex flex-col gap-6">
      <TagGroup
        v-model:selected="errorSelected"
        selection-mode="multiple"
        label="With error message"
        :description="isInvalid ? 'Select at least one' : `Selected: ${errorSelected.join(', ')}`"
        :error-message="isInvalid ? 'Please select at least one' : ''"
        :items="items"
      />
    </section>
  </div>
</template>
