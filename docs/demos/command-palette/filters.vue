<template>
  <Modal v-model:open="isOpen" title="Search" placement="top" :ui="shell">
    <Button variant="secondary">Search everything</Button>
    <template #content>
      <CommandPalette
        :groups="groups"
        size="lg"
        placeholder="Search or ask..."
        @update:model-value="isOpen = false"
      >
        <template #header>
          <div class="flex flex-wrap gap-1.5" role="group" aria-label="Search scopes">
            <Chip v-for="scope in scopes" :key="scope" size="sm" variant="soft">
              {{ scope }}
              <template #trailing>
                <button
                  type="button"
                  class="text-muted hover:text-foreground"
                  :aria-label="`Remove ${scope}`"
                  @click="scopes = scopes.filter((entry) => entry !== scope)"
                >
                  <Icon icon="gravity-ui:xmark" class="size-3" />
                </button>
              </template>
            </Chip>
          </div>
        </template>
        <template #close>
          <Kbd keys="command">J</Kbd>
        </template>
        <template #results-group-label="{ group }">
          <span class="flex w-full items-center justify-between">
            Matches ({{ group.items?.length ?? 0 }})
            <a href="#" class="text-accent" @click.prevent>Show all</a>
          </span>
        </template>
        <template #footer>
          <Kbd keys="up" />
          <Kbd keys="down" />
          <span>Move</span>
          <Kbd keys="enter" class="ms-2" />
          <span>Open</span>
          <span class="ms-auto whitespace-nowrap">
            <span class="max-sm:hidden">Stuck?</span>
            Visit the <a href="#" class="text-accent" @click.prevent>help desk</a>
          </span>
        </template>
      </CommandPalette>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { Button, Chip, Kbd, Modal } from '@hareui/vue'
import { CommandPalette } from '@hareui/vue/command-palette'
import type { CommandPaletteGroup } from '@hareui/vue/command-palette'
import { Icon } from '@iconify/vue'
import { h, ref } from 'vue'

const isOpen = ref(false)

// The dialog drops from the top, 15% down the viewport, and grows in as it fades.
const shell = {
  container:
    'pt-[15vh] [&:where([data-state=open])]:[--tw-duration:200ms]! [&:where([data-state=open])]:zoom-in-95! [&:where([data-state=open])]:slide-in-from-top-2!',
  dialog: 'max-h-110 w-full max-w-xl overflow-hidden p-0 [border-radius:var(--radius-2xl)]',
}

const scopes = ref(['Recipes', 'Shopping lists', 'Pantry', 'Guests'])

const icon = (name: string) => () => h(Icon, { icon: `gravity-ui:${name}` })

const groups: CommandPaletteGroup[] = [
  {
    id: 'ask',
    label: 'Try asking',
    items: [
      { label: 'What can I cook with leftovers?', icon: icon('sparkles') },
      { label: 'Plan dinners for next week', icon: icon('sparkles') },
      { label: 'Make a list for Saturday brunch', icon: icon('sparkles') },
    ],
  },
  {
    id: 'results',
    slot: 'results',
    items: [
      { label: 'Recently cooked', icon: icon('clock') },
      { label: 'Lemon pasta for four', icon: icon('file-text') },
      { label: 'Guest allergies', icon: icon('persons') },
      { label: 'Pantry staples', icon: icon('box') },
    ],
  },
]
</script>
