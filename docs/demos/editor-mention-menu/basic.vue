<template>
  <Editor v-model="content" aria-label="Design critique comment" class="max-w-[640px]">
    <template #default="{ editor }">
      <EditorMentionMenu
        :editor="editor"
        :items="people"
        :filter-fields="['label', 'description']"
      />
      <EditorMentionMenu :editor="editor" :items="channels" char="#" />
    </template>
  </Editor>
</template>

<script setup lang="ts">
import { Editor, EditorMentionMenu } from '@hareui/vue/editor'
import type { EditorMenuEntry, EditorMentionMenuItem } from '@hareui/vue/editor'
import { ref } from 'vue'

const content = ref(
  `<p>Thanks <span data-type="mention" data-id="maya" data-label="Maya Chen"></span>, the checkout flow reads much better. The coupon field still sits too far from the total. </p>`,
)

const people: EditorMenuEntry<EditorMentionMenuItem>[] = [
  {
    type: 'section',
    label: 'Teammates',
    items: [
      {
        id: 'maya',
        label: 'Maya Chen',
        description: 'Product designer',
        avatar: { src: 'https://i.pravatar.cc/96?img=47' },
      },
      {
        id: 'leo',
        label: 'Leo Martins',
        description: 'Frontend engineer',
        avatar: { src: 'https://i.pravatar.cc/96?img=12' },
      },
      {
        id: 'priya',
        label: 'Priya Nair',
        description: 'Product manager',
        avatar: { src: 'https://i.pravatar.cc/96?img=32' },
      },
      { id: 'jon', label: 'Jon Berg', description: 'Content designer' },
    ],
  },
  {
    type: 'section',
    label: 'Groups',
    items: [
      {
        id: 'design-team',
        label: 'design-team',
        description: '8 people',
        icon: 'icon-[gravity-ui--persons]',
      },
      {
        id: 'checkout-squad',
        label: 'checkout-squad',
        description: '5 people',
        icon: 'icon-[gravity-ui--persons]',
      },
    ],
  },
]

const channels: EditorMentionMenuItem[] = [
  {
    id: 'design-reviews',
    label: 'design-reviews',
    description: 'Critiques and sign-off',
    icon: 'icon-[gravity-ui--hashtag]',
  },
  {
    id: 'checkout',
    label: 'checkout',
    description: 'Cart, payment and receipts',
    icon: 'icon-[gravity-ui--hashtag]',
  },
  {
    id: 'launch',
    label: 'launch',
    description: 'Release planning',
    icon: 'icon-[gravity-ui--hashtag]',
  },
]
</script>
