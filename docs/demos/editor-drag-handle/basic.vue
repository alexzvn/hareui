<template>
  <Editor v-model="content" aria-label="Launch checklist" class="max-w-[640px]">
    <template #default="{ editor }">
      <EditorDragHandle :editor="editor" />
    </template>
  </Editor>
</template>

<script setup lang="ts">
import { Editor } from '@hareui/vue/editor'
import { EditorDragHandle } from '@hareui/vue/editor-drag-handle'
import { ref } from 'vue'

const content = ref(`<h2>Launch checklist</h2>
<p>Version 2.4 goes out on Thursday. Everything below should be done by Wednesday evening.</p>
<ul>
<li><p>Freeze the release branch on Monday.</p></li>
<li><p>Send the changelog to support.</p></li>
<li><p>Schedule the status page notice.</p></li>
</ul>
<blockquote><p>Ship small, ship often.</p></blockquote>
<p>Publish the announcement once the rollout reaches every region.</p>`)
</script>
