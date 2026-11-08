<template>
  <Markdown
    :value="value"
    :components="{ a: ExternalLink, pre: FileCode, img: Figure }"
    class="max-w-xl"
  />
</template>

<script setup lang="ts">
import { Link } from '@hareui/vue'
import { CodeBlock } from '@hareui/vue/code-block'
import { Markdown } from '@hareui/vue/markdown'
import { Icon } from '@iconify/vue'
import { defineComponent, h } from 'vue'

// Links open in a new tab and show the external-link icon.
const ExternalLink = defineComponent({
  props: { href: String, title: String },
  setup(props, { slots }) {
    const attrs = { target: '_blank', rel: 'noopener', icon: true }

    return () => h(Link, { ...attrs, href: props.href, title: props.title }, slots)
  },
})

const FileIcon = () => h(Icon, { icon: 'gravity-ui:file-code' })

// `title=prices.ts` in the fence's info string arrives in `meta` and becomes the file name.
const TITLE = /title="?([^"\s]+)"?/

const FileCode = defineComponent({
  props: { code: { type: String, required: true }, lang: String, meta: String },
  setup: (props) => () =>
    h(CodeBlock, {
      code: props.code,
      lang: props.lang || undefined,
      filename: TITLE.exec(props.meta ?? '')?.[1],
      icon: FileIcon,
      class: 'my-3',
    }),
})

// Images sit inside a paragraph, so the figure is built from spans. The title becomes the caption.
const Figure = defineComponent({
  props: { src: String, alt: String, title: String },
  setup: (props) => () =>
    h('span', { role: 'figure', 'aria-label': props.title, class: 'my-3 flex flex-col gap-2' }, [
      h('img', {
        src: props.src,
        alt: props.alt,
        class: 'aspect-video w-full rounded-2xl object-cover',
      }),
      props.title ? h('span', { class: 'text-xs text-muted' }, props.title) : null,
    ]),
})

const value = `## Market day

The stall opens at **eight**. Check the [forecast](https://www.ipma.pt/en/) before you load the van.

![Halved oranges on ice](https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/docs/oranges.jpeg "This week's oranges, picked on Thursday")

The chalkboard and the till read the same price list, so they always agree:

\`\`\`ts title=prices.ts
export const prices = {
  oranges: 2.4,
  lemons: 3.1,
  figs: 6.5,
}
\`\`\`
`
</script>
