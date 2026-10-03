<script setup lang="ts">
// Private: HeroUI's `Popover.Trigger` is a `div[role=button]` (`.popover__trigger`) wrapping the trigger content.
// HareUI's Popover turns its default slot's root element into the trigger, so this wrapper is that root.
// React Aria's `Pressable` makes it focusable and activates it with Enter/Space.
function onKeydown(event: KeyboardEvent) {
  if (event.target !== event.currentTarget)
    return
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    ;(event.currentTarget as HTMLElement).click()
  }
}
</script>

<template>
  <div
    data-slot="popover-trigger"
    role="button"
    tabindex="0"
    class="inline-block [transition:color_150ms_var(--ease-smooth),background-color_150ms_var(--ease-smooth),box-shadow_150ms_var(--ease-out)] motion-reduce:transition-none focus-visible:status-focused"
    @keydown="onKeydown"
  >
    <slot />
  </div>
</template>
