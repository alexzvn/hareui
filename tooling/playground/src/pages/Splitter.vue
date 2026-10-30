<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@hareui/vue'
import { Splitter } from '@/components/splitter'
import type { SplitterItem } from '@/components/splitter'
import { Icon } from '../icons'

const types = ['line', 'drag', 'pill', 'handle'] as const
const variants = [
  { variant: 'primary', surface: 'bg-background', text: 'text-foreground' },
  { variant: 'secondary', surface: 'bg-surface', text: 'text-surface-foreground' },
  { variant: 'tertiary', surface: 'bg-surface-secondary', text: 'text-surface-secondary-foreground' },
] as const

const pane = 'items-center justify-center p-4 text-sm font-medium'

const halves: SplitterItem[] = [
  { slot: 'start', defaultSize: 50, minSize: 20, class: `bg-surface text-surface-foreground ${pane}` },
  { slot: 'end', defaultSize: 50, minSize: 20, class: pane },
]

const plainHalves: SplitterItem[] = [
  { slot: 'start', defaultSize: 50, class: pane },
  { slot: 'end', defaultSize: 50, class: pane },
]

const three: SplitterItem[] = [
  { slot: 'outline', defaultSize: 22, minSize: 15, class: `bg-surface text-surface-foreground ${pane}` },
  { slot: 'draft', defaultSize: 53, minSize: 30, class: pane },
  { slot: 'notes', defaultSize: 25, minSize: 15, class: `bg-surface text-surface-foreground ${pane}` },
]

const shell: SplitterItem[] = [
  { slot: 'tree', defaultSize: 24, minSize: 15, maxSize: 40, class: `bg-surface text-surface-foreground ${pane}` },
  { slot: 'work', defaultSize: 76 },
]

const work: SplitterItem[] = [
  { slot: 'canvas', defaultSize: 68, minSize: 25, class: pane },
  { slot: 'console', defaultSize: 32, minSize: 15, class: `bg-surface-secondary text-surface-secondary-foreground ${pane}` },
]

const collapsible: SplitterItem[] = [
  { slot: 'channels', defaultSize: 28, minSize: 20, maxSize: 45, collapsible: true, collapsedSize: 0, class: `bg-surface text-surface-foreground ${pane}` },
  { slot: 'thread', defaultSize: 72, class: pane },
]

const pixels: SplitterItem[] = [
  { slot: 'rail', sizeUnit: 'px', defaultSize: 240, minSize: 160, maxSize: 360, collapsible: true, collapsedSize: 56, class: 'bg-surface text-surface-foreground' },
  { slot: 'feed', class: pane },
]

const splitter = ref<InstanceType<typeof Splitter>>()
const log = ref<string[]>([])
const record = (entry: string) => {
  log.value = [entry, ...log.value].slice(0, 6)
}
</script>

<template>
  <div class="flex flex-col gap-10 p-8">
    <h1 class="text-2xl font-semibold">Splitter</h1>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">type (horizontal)</h2>
      <div class="grid gap-4 md:grid-cols-2">
        <div v-for="type in types" :key="type" class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide text-muted">{{ type }}</span>
          <div class="h-44 overflow-hidden rounded-xl border border-border bg-background">
            <Splitter :items="halves" :type="type">
              <template #start>Preview</template>
              <template #end>Source</template>
            </Splitter>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">type (vertical)</h2>
      <div class="grid gap-4 md:grid-cols-4">
        <div v-for="type in types" :key="type" class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide text-muted">{{ type }}</span>
          <div class="h-64 overflow-hidden rounded-xl border border-border bg-background">
            <Splitter :items="halves" orientation="vertical" :type="type">
              <template #start>Query</template>
              <template #end>Results</template>
            </Splitter>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">variant</h2>
      <div class="flex flex-col gap-4">
        <div v-for="v in variants" :key="v.variant" class="flex flex-col gap-2">
          <span class="text-xs font-medium uppercase tracking-wide text-muted">{{ v.variant }}</span>
          <div :class="['h-32 overflow-hidden rounded-xl border border-border', v.surface, v.text]">
            <Splitter :items="plainHalves" :variant="v.variant">
              <template #start>Budget</template>
              <template #end>Actuals</template>
            </Splitter>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">indicator (line + pill grip), three panels</h2>
      <div class="h-56 overflow-hidden rounded-xl border border-border bg-background">
        <Splitter :items="three" indicator>
          <template #outline>Outline</template>
          <template #draft>Draft</template>
          <template #notes>Notes</template>
        </Splitter>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">nested</h2>
      <div class="h-80 overflow-hidden rounded-xl border border-border bg-background">
        <Splitter id="pg-shell" :items="shell">
          <template #tree>Project</template>
          <template #work>
            <Splitter id="pg-work" :items="work" orientation="vertical" type="drag">
              <template #canvas>Canvas</template>
              <template #console>Console</template>
            </Splitter>
          </template>
        </Splitter>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">collapsible (slot API, exposed panelsRef, events)</h2>
      <div class="mb-2 flex items-center gap-2">
        <Button size="sm" variant="secondary" @click="splitter?.panelsRef[0]?.collapse()">Collapse channels</Button>
        <Button size="sm" variant="secondary" @click="splitter?.panelsRef[0]?.expand()">Expand channels</Button>
        <span class="text-xs text-muted">{{ log.join(' · ') }}</span>
      </div>
      <div class="h-64 overflow-hidden rounded-xl border border-border bg-background">
        <Splitter
          ref="splitter"
          :items="collapsible"
          @collapse="(i) => record(`collapse ${i}`)"
          @expand="(i) => record(`expand ${i}`)"
          @dragging="(i, d) => record(`dragging ${i} ${d}`)"
        >
          <template #channels>Channels</template>
          <template #thread>Thread</template>
        </Splitter>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">px units + collapsedSize rail</h2>
      <div class="h-64 overflow-hidden rounded-xl border border-border bg-background">
        <Splitter :items="pixels" type="pill">
          <template #rail="{ collapsed, collapse, expand }">
            <div class="flex flex-1 items-start justify-center p-2">
              <Button
                :icon-only="collapsed"
                :aria-label="collapsed ? 'Expand rail' : undefined"
                size="sm"
                variant="tertiary"
                @click="collapsed ? expand() : collapse()"
              >
                <Icon :icon="collapsed ? 'gravity-ui:layout-side-content-left' : 'gravity-ui:layout-side-content'" />
                <template v-if="!collapsed">Collapse</template>
              </Button>
            </div>
          </template>
          <template #feed>Feed</template>
        </Splitter>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">disabled</h2>
      <div class="h-32 overflow-hidden rounded-xl border border-border bg-background">
        <Splitter :items="halves" disabled type="drag">
          <template #start>Locked</template>
          <template #end>Layout</template>
        </Splitter>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">auto-save-id (reload to restore)</h2>
      <div class="h-32 overflow-hidden rounded-xl border border-border bg-background">
        <Splitter id="pg-saved" auto-save-id="playground:splitter" :items="halves">
          <template #start>Drag me</template>
          <template #end>then reload</template>
        </Splitter>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">#resize-handle slot + :ui override</h2>
      <div class="h-40 overflow-hidden rounded-xl border border-border bg-background">
        <Splitter
          :items="plainHalves"
          :ui="{ handle: 'w-1 bg-accent-soft data-[state=hover]:bg-accent data-[state=drag]:bg-accent' }"
        >
          <template #resize-handle="{ index }">
            <span class="absolute top-1/2 left-1/2 -translate-1/2 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-accent-foreground">
              {{ index + 1 }}
            </span>
          </template>
          <template #start>Left</template>
          <template #end>Right</template>
        </Splitter>
      </div>
    </section>
  </div>
</template>
