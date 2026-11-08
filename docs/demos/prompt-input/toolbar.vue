<template>
  <PromptInput v-model="text" v-model:files="files" class="max-w-xl" @submit="send">
    <template #leading="{ open }">
      <Tooltip :delay="0" text="Attach">
        <Button aria-label="Attach" icon-only size="sm" variant="tertiary" @click="open">
          <Icon icon="gravity-ui:paperclip" />
        </Button>
      </Tooltip>
      <Tooltip :delay="0" text="Search the web">
        <ToggleButton v-model="isSearching" size="sm" variant="ghost">
          <Icon icon="gravity-ui:globe" />
          Search
        </ToggleButton>
      </Tooltip>
    </template>
    <template #trailing>
      <Tooltip :delay="0" text="Dictate">
        <Button aria-label="Dictate" icon-only size="sm" variant="ghost">
          <Icon icon="gravity-ui:microphone" />
        </Button>
      </Tooltip>
    </template>
  </PromptInput>
</template>

<script setup lang="ts">
import { Button, PromptInput, ToggleButton, Tooltip } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const text = ref('')
const files = ref<File[]>([])
const isSearching = ref(false)

const send = () => {
  text.value = ''
  files.value = []
}
</script>
