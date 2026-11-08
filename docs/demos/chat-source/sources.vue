<template>
  <ChatMessage role="assistant" class="max-w-lg">
    <template #content>
      <div class="flex flex-col gap-2 text-sm leading-6">
        <p>
          To bring LCP under 2.5 s, preload the hero image, serve it in AVIF and drop
          render-blocking fonts from the critical path.
        </p>
        <ChatSources :sources="sources" />
      </div>
    </template>
  </ChatMessage>
</template>

<script setup lang="ts">
import type { ChatSourceItem } from '@hareui/vue'
import { ChatMessage, ChatSources } from '@hareui/vue'

const favicon = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`

const sources: ChatSourceItem[] = [
  {
    href: 'https://web.dev/articles/lcp',
    title: 'Largest Contentful Paint',
    favicon: favicon('web.dev'),
  },
  {
    href: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload',
    title: 'rel=preload',
    favicon: favicon('developer.mozilla.org'),
  },
  {
    href: 'https://github.com/GoogleChrome/web-vitals',
    title: 'web-vitals library',
    favicon: favicon('github.com'),
  },
  {
    href: 'https://vercel.com/blog/how-core-web-vitals-affect-seo',
    title: 'Core Web Vitals and SEO',
    favicon: favicon('vercel.com'),
  },
]
</script>
