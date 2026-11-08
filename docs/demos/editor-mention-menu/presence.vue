<template>
  <Editor v-model="content" aria-label="Pairing request" class="max-w-[640px]">
    <template #default="{ editor }">
      <EditorMentionMenu :editor="editor" :items="people">
        <template #item-trailing="{ item }">
          <span
            class="ms-auto size-2 shrink-0 rounded-full"
            :class="item.status === 'Online' ? 'bg-success' : 'bg-warning'"
            aria-hidden="true"
          />
        </template>
      </EditorMentionMenu>
    </template>
  </Editor>
</template>

<script setup lang="ts">
import { Editor, EditorMentionMenu } from '@hareui/vue/editor'
import type { EditorMentionMenuItem } from '@hareui/vue/editor'
import { ref } from 'vue'

const content = ref(`<p>Looking for someone to pair on the flaky sync tests this afternoon. </p>`)

type Teammate = EditorMentionMenuItem & { status: 'Online' | 'Away' }

const teammates: Teammate[] = [
  {
    id: 'leo',
    label: 'Leo Martins',
    status: 'Online',
    avatar: { src: 'https://i.pravatar.cc/96?img=12' },
  },
  {
    id: 'priya',
    label: 'Priya Nair',
    status: 'Away',
    avatar: { src: 'https://i.pravatar.cc/96?img=32' },
  },
  {
    id: 'sam',
    label: 'Sam Okafor',
    status: 'Online',
    avatar: { src: 'https://i.pravatar.cc/96?img=53' },
  },
  { id: 'jon', label: 'Jon Berg', status: 'Away' },
]

// The status reads in the description, the dot repeats it at a glance.
const people: Teammate[] = teammates.map((person) => ({ ...person, description: person.status }))
</script>
