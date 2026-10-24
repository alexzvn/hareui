<template>
  <ConfigProvider :teleport-to="`#${THEME_BUILDER_CONTENT_ID}`">
    <div
      :id="THEME_BUILDER_CONTENT_ID"
      class="flex min-h-full w-full flex-1 bg-background px-4 py-8 font-sans"
    >
      <!-- HeroUI renders DemoComponents twice (a mobile panel and a desktop panel, one hidden by CSS); one instance
           with responsive classes keeps radio names and ids unique. Below lg the inner wrapper is `contents`, so the
           demo grid is a direct flex item as in HeroUI's mobile panel. -->
      <div class="flex w-full justify-center lg:flex-1 lg:flex-col lg:justify-start">
        <div class="contents lg:my-auto lg:flex lg:justify-center">
          <DemoComponents v-if="isMounted" />
        </div>
      </div>
    </div>
  </ConfigProvider>
</template>

<script setup lang="ts">
// Port of HeroUI docs `themes/components/preview-container.tsx`.
// Left out: the iframe tabs (HeroUI Pro templates) and their theme postMessage plumbing; the preview always shows the components tab.
// `UNSAFE_PortalProvider` (overlays opened from the demos portal into `#theme-builder-content`, which carries the
// scoped theme variables) -> Reka's ConfigProvider `teleportTo`, which Reka portals without an explicit target pick up.
import { ConfigProvider } from 'reka-ui'
import { onBeforeUnmount, onMounted, ref } from 'vue'

import DemoComponents from '../../components/home/DemoComponents.vue'
import { useCssSync } from '../composables/cssSync'
import { THEME_BUILDER_CONTENT_ID } from '../constants'

const isMounted = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

useCssSync()

onMounted(() => {
  timer = setTimeout(() => {
    isMounted.value = true
  })
})

onBeforeUnmount(() => clearTimeout(timer))
</script>
