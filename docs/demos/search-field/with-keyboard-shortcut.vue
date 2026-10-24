<template>
  <div class="flex flex-col gap-4">
    <div>
      <SearchField
        ref="field"
        v-model="value"
        name="search"
        label="Search"
        placeholder="Search..."
        description="Use keyboard shortcut to quickly focus this field"
        :ui="{ input: 'w-[280px]' }"
      />
    </div>
    <div class="text-default-500 flex items-center gap-2 text-sm">
      <span>Press</span>
      <Kbd keys="shift"> S </Kbd>
      <span>to focus the search field</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Kbd, SearchField } from '@hareui/vue'
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'

const value = ref('')
const field = useTemplateRef<{ $el: HTMLElement }>('field')
const input = () => field.value?.$el.querySelector('input') ?? null

function handleKeyDown(e: KeyboardEvent) {
  // Check for Shift+S
  if (e.shiftKey && e.key === 'S' && !e.metaKey && !e.ctrlKey && !e.altKey) {
    e.preventDefault()
    input()?.focus()
  }
  // Check for ESC key to blur the input
  if (e.key === 'Escape' && document.activeElement === input()) input()?.blur()
}

onMounted(() => window.addEventListener('keydown', handleKeyDown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeyDown))
</script>
