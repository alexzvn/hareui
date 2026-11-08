<template>
  <Editor v-model="content" content-type="json" aria-label="Incident update" class="max-w-[640px]">
    <template #default="{ editor }">
      <EditorMentionMenu :editor="editor" :items="people" />
    </template>
    <template #footer>
      <AvatarGroup v-if="notified.length" size="sm">
        <Avatar
          v-for="person in notified"
          :key="person.id"
          :alt="person.label"
          :fallback="person.label.charAt(0)"
          v-bind="person.avatar"
        />
      </AvatarGroup>
      <span>{{ summary }}</span>
    </template>
  </Editor>
</template>

<script setup lang="ts">
import { Avatar, AvatarGroup } from '@hareui/vue'
import { Editor, EditorMentionMenu } from '@hareui/vue/editor'
import type { EditorMentionMenuItem } from '@hareui/vue/editor'
import type { JSONContent } from '@tiptap/vue-3'
import { computed, ref } from 'vue'

const people: EditorMentionMenuItem[] = [
  {
    id: 'maya',
    label: 'Maya Chen',
    description: 'On call, payments',
    avatar: { src: 'https://i.pravatar.cc/96?img=47' },
  },
  {
    id: 'leo',
    label: 'Leo Martins',
    description: 'Backend engineer',
    avatar: { src: 'https://i.pravatar.cc/96?img=12' },
  },
  {
    id: 'priya',
    label: 'Priya Nair',
    description: 'Support lead',
    avatar: { src: 'https://i.pravatar.cc/96?img=32' },
  },
  {
    id: 'tom',
    label: 'Tom Alvarez',
    description: 'Engineering manager',
    avatar: { src: 'https://i.pravatar.cc/96?img=15' },
  },
]

const content = ref<JSONContent>({
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Checkout is back to normal since 10:42. ' },
        { type: 'mention', attrs: { id: 'maya', label: 'Maya Chen' } },
        { type: 'text', text: ' and ' },
        { type: 'mention', attrs: { id: 'leo', label: 'Leo Martins' } },
        { type: 'text', text: ' are writing the review. ' },
      ],
    },
  ],
})

// Every mention node in the document, once each.
const mentionIds = (node: JSONContent): string[] => [
  ...(node.type === 'mention' && node.attrs?.id ? [node.attrs.id as string] : []),
  ...(node.content ?? []).flatMap(mentionIds),
]

const notified = computed(() =>
  [...new Set(mentionIds(content.value))].flatMap((id) =>
    people.filter((person) => person.id === id),
  ),
)

const summary = computed(() =>
  notified.value.length
    ? `Notifying ${notified.value.map((person) => person.label.split(' ')[0]).join(', ')}`
    : 'Mention someone to notify them',
)
</script>
