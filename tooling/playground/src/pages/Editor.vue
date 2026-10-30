<script setup lang="ts">
import { h, ref } from 'vue'
import { Editor, EditorToolbar } from '@hareui/vue/editor'
import type { EditorCustomHandlers, EditorToolbarItem } from '@hareui/vue/editor'
import { Icon } from '../icons'

const html = ref(`<h2>Playground document</h2>
<p>Some <strong>bold</strong>, <em>italic</em>, <u>underlined</u>, <s>struck</s> and <code>inline code</code> text with <a href="https://example.com">a link</a>.</p>
<blockquote><p>A quote block.</p></blockquote>
<ul><li><p>Bullet one</p></li><li><p>Bullet two</p></li></ul>
<ol><li><p>First</p></li><li><p>Second</p></li></ol>
<pre><code>const answer = 42</code></pre>
<hr>
<h3>Heading 3</h3>
<p>The end.</p>`)

const json = ref({
  type: 'doc',
  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'JSON document' }] }],
})

const markdown = ref('## Markdown\n\nA **bold** word and a list:\n\n- one\n- two')
const empty = ref('')

const StarIcon = () => h(Icon, { icon: 'gravity-ui:star' })

const handlers = {
  star: {
    canExecute: () => true,
    execute: (editor) => editor.chain().focus().insertContent('★'),
    isActive: () => false,
  },
} satisfies EditorCustomHandlers

const full: EditorToolbarItem<typeof handlers>[][] = [
  [{ kind: 'undo' }, { kind: 'redo' }],
  [
    { kind: 'mark', mark: 'bold' },
    { kind: 'mark', mark: 'italic' },
    { kind: 'mark', mark: 'underline' },
    { kind: 'mark', mark: 'strike' },
    { kind: 'mark', mark: 'code' },
  ],
  [
    {
      tooltip: 'Block style',
      items: [
        { kind: 'paragraph' },
        { kind: 'heading', level: 1 },
        { kind: 'heading', level: 2 },
        { kind: 'heading', level: 3 },
      ],
    },
    { kind: 'heading', level: 1 },
    { kind: 'heading', level: 2 },
    { kind: 'blockquote' },
    { kind: 'codeBlock' },
    { kind: 'horizontalRule' },
  ],
  [{ kind: 'bulletList' }, { kind: 'orderedList' }, { kind: 'link' }, { kind: 'image' }],
  [{ kind: 'clearFormatting' }, { kind: 'star', icon: StarIcon, tooltip: 'Insert a star' }],
]

const inline: EditorToolbarItem[] = [
  { kind: 'mark', mark: 'bold' },
  { kind: 'mark', mark: 'italic' },
  { kind: 'link' },
]

const withLabels: EditorToolbarItem[] = [
  { kind: 'mark', mark: 'bold', label: 'Bold' },
  { label: 'Plain action', onClick: () => alert('clicked') },
  { label: 'Pressed', active: true },
  { label: 'Disabled', disabled: true },
]
</script>

<template>
  <div class="flex max-w-[860px] flex-col gap-8">
    <h1 class="text-xl font-semibold">Editor</h1>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Primary, full toolbar, footer (HTML)</h2>
      <Editor v-model="html" :handlers="handlers" aria-label="Full">
        <template #default="{ editor }">
          <EditorToolbar :editor="editor" :items="full" />
          <EditorToolbar :editor="editor" :items="inline" layout="bubble" />
        </template>
        <template #footer="{ editor }">
          <span>HTML</span>
          <span>{{ editor.state.doc.textContent.length }} characters</span>
        </template>
      </Editor>
    </section>

    <section class="rounded-3xl bg-surface p-4">
      <h2 class="mb-2 text-sm font-medium text-muted">Secondary on a surface</h2>
      <Editor v-model="html" variant="secondary" aria-label="Secondary">
        <template #default="{ editor }">
          <EditorToolbar :editor="editor" :items="full" />
        </template>
      </Editor>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Placeholder (every line) + floating toolbar</h2>
      <Editor v-model="empty" placeholder="Write something…" aria-label="Placeholder">
        <template #default="{ editor }">
          <EditorToolbar :editor="editor" :items="inline" layout="floating" />
        </template>
      </Editor>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Placeholder (first line only)</h2>
      <Editor
        model-value=""
        :placeholder="{ placeholder: 'Only while empty', mode: 'firstLine' }"
        aria-label="First line"
      />
    </section>

    <section class="grid gap-4 md:grid-cols-2">
      <div>
        <h2 class="mb-2 text-sm font-medium text-muted">Disabled</h2>
        <Editor :model-value="html" disabled aria-label="Disabled">
          <template #default="{ editor }">
            <EditorToolbar :editor="editor" :items="inline" />
          </template>
        </Editor>
      </div>
      <div>
        <h2 class="mb-2 text-sm font-medium text-muted">Read-only</h2>
        <Editor :model-value="html" :editable="false" aria-label="Read-only">
          <template #default="{ editor }">
            <EditorToolbar :editor="editor" :items="inline" />
          </template>
        </Editor>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">JSON content</h2>
      <Editor v-model="json" aria-label="JSON" />
      <pre class="mt-2 text-xs">{{ JSON.stringify(json) }}</pre>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Markdown content</h2>
      <Editor v-model="markdown" content-type="markdown" aria-label="Markdown">
        <template #default="{ editor }">
          <EditorToolbar :editor="editor" :items="inline" />
        </template>
      </Editor>
      <pre class="mt-2 text-xs whitespace-pre-wrap">{{ markdown }}</pre>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Plain text (starter-kit off)</h2>
      <Editor model-value="<p>No rich text here.</p>" :starter-kit="false" aria-label="Plain" />
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Labels, plain actions, size md, item slot</h2>
      <Editor model-value="<p>Labelled buttons</p>" aria-label="Labels">
        <template #default="{ editor }">
          <EditorToolbar :editor="editor" :items="withLabels" size="md">
            <template #item="{ item }">
              <span class="px-2 text-xs text-muted">{{ item.label }}</span>
            </template>
          </EditorToolbar>
          <EditorToolbar :editor="editor" :items="withLabels" />
        </template>
      </Editor>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">:ui override</h2>
      <Editor
        model-value="<p>Taller document, larger radius, accent footer.</p>"
        aria-label="UI override"
        :ui="{ root: 'rounded-3xl', base: 'min-h-[260px] px-6', footer: 'text-accent' }"
      >
        <template #default="{ editor }">
          <EditorToolbar :editor="editor" :items="inline" :ui="{ base: 'justify-end' }" />
        </template>
        <template #footer>
          <span>Custom footer</span>
        </template>
      </Editor>
    </section>
  </div>
</template>
