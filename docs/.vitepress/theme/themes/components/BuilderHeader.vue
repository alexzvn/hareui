<template>
  <div
    class="sticky top-0 z-50 mb-3 flex h-14 w-full items-center justify-center bg-background px-2 min-[1200px]:mb-4 min-[1200px]:px-0"
  >
    <div class="flex h-14 w-full max-w-[1400px] items-center justify-between min-[1200px]:h-14">
      <div class="flex items-center gap-4">
        <a href="/" class="inline-flex items-center gap-2.5 font-semibold">
          <HareLogo class="size-6" />
          <span class="text-lg font-semibold">HareUI</span>
        </a>
        <div class="flex items-center gap-3">
          <Tooltip :delay="100" arrow>
            <div
              class="hidden min-[1200px]:inline-flex"
              data-slot="tooltip-trigger"
              role="button"
              tabindex="0"
            >
              <Button icon-only :disabled="!canUndo" size="md" variant="tertiary" @click="undo()">
                <Icon icon="gravity-ui:arrow-uturn-ccw-left" />
              </Button>
            </div>
            <template #content>
              <p>Undo last change <Kbd keys="left" /></p>
            </template>
          </Tooltip>
          <Tooltip :delay="100" arrow>
            <div
              class="hidden min-[1200px]:inline-flex"
              data-slot="tooltip-trigger"
              role="button"
              tabindex="0"
            >
              <Button icon-only :disabled="!canRedo" size="md" variant="tertiary" @click="redo()">
                <Icon icon="gravity-ui:arrow-uturn-cw-right" />
              </Button>
            </div>
            <template #content>
              <p>Redo last change <Kbd keys="right" /></p>
            </template>
          </Tooltip>
          <Separator class="hidden h-6 self-center min-[1200px]:block" orientation="vertical" />
          <ResetButton />
          <div class="hidden sm:block">
            <ShuffleButton />
          </div>
        </div>
      </div>
      <div class="flex w-auto justify-end gap-3 min-[1200px]:w-[244px]">
        <div class="flex h-auto items-center">
          <SwitchMode />
        </div>
        <Tooltip :delay="100" arrow>
          <div class="inline-block" data-slot="tooltip-trigger" role="button" tabindex="0">
            <Button icon-only size="md" variant="tertiary" @click="onShare">
              <Icon icon="gravity-ui:nodes-right" />
            </Button>
          </div>
          <template #content>
            <p>Share theme link</p>
          </template>
        </Tooltip>
        <Tooltip :delay="100" arrow>
          <div
            class="hidden min-[1200px]:inline-flex"
            data-slot="tooltip-trigger"
            role="button"
            tabindex="0"
          >
            <Button
              icon-only
              size="md"
              :variant="isCodeVisible ? 'primary' : 'tertiary'"
              @click="toggleCode"
            >
              <Icon icon="gravity-ui:code" />
            </Button>
          </div>
          <template #content>
            <p>View code</p>
          </template>
        </Tooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, Kbd, Separator, Tooltip, toast } from '@hareui/vue'
// Port of HeroUI docs `themes/components/builder-header.tsx`.
// Left out: the preview tabs (their templates are HeroUI Pro), `HeroUIDocsAgentTrigger` (HeroUI-only AI trigger),
// the language-aware logo link (the docs have no i18n); the logo is the docs wordmark, as in the landing nav.
import { Icon } from '@iconify/vue'
import { h } from 'vue'

import HareLogo from '../../components/HareLogo.vue'
import { useCodePanel } from '../composables/codePanel'
import { useKeyPress } from '../composables/keyPress'
import { useUndoRedo } from '../composables/undoRedo'
import ResetButton from './ResetButton.vue'
import ShuffleButton from './ShuffleButton.vue'
import SwitchMode from './SwitchMode.vue'

const { canRedo, canUndo, redo, undo } = useUndoRedo()
const { isCodeVisible, toggleCode } = useCodePanel()

const onShare = () => {
  navigator.clipboard.writeText(window.location.href)

  toast('Link copied', {
    description: 'Your theme link is copied to the clipboard.',
    indicator: h(Icon, { icon: 'gravity-ui:link' }),
    variant: 'success',
  })
}

useKeyPress('ArrowLeft', { onPress: () => undo(), enabled: canUndo })
useKeyPress('ArrowRight', { onPress: () => redo(), enabled: canRedo })
</script>
