<script setup lang="ts">
import { h, ref } from 'vue'
import { Button, Chip } from '@hareui/vue'
import { CodeBlock } from '@hareui/vue/code-block'
import { Icon } from '../icons'

const FileIcon = () => h(Icon, { icon: 'gravity-ui:file-code' })

const ts = `type Order = { items: number[]; coupon?: number }

export const orderTotal = ({ items, coupon = 0 }: Order) => {
  const subtotal = items.reduce((sum, price) => sum + price, 0)
  return Math.max(subtotal - coupon, 0)
}`

const long = `const response = await fetch('/api/weather?city=lisbon&units=metric&days=7&include=hourly,alerts')
const { forecast } = (await response.json()) as { forecast: { day: string; high: number }[] }
console.table(forecast)`

const langs = ['ts', 'vue', 'bash', 'json']
const lang = ref('ts')
const samples: Record<string, string> = {
  ts,
  vue: '<template>\n  <Button @click="save">Save</Button>\n</template>',
  bash: 'bun add @hareui/vue shiki',
  json: '{\n  "name": "demo",\n  "private": true\n}',
}
</script>

<template>
  <div class="flex max-w-[560px] flex-col gap-8">
    <h1 class="text-xl font-semibold">CodeBlock</h1>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Default (typescript)</h2>
      <CodeBlock :code="ts" lang="typescript" />
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Plain text (no highlighter)</h2>
      <CodeBlock :code="'Plain text keeps   its spacing.\n\nAnd empty lines.'" />
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Language switch</h2>
      <div class="mb-2 flex gap-2">
        <Button
          v-for="item in langs"
          :key="item"
          size="sm"
          :variant="item === lang ? 'primary' : 'tertiary'"
          @click="lang = item"
        >
          {{ item }}
        </Button>
      </div>
      <CodeBlock :code="samples[lang]!" :lang="lang" />
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Filename + icon</h2>
      <CodeBlock :code="ts" lang="ts" filename="src/orders/total.ts" :icon="FileIcon" />
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Highlight + line numbers</h2>
      <CodeBlock :code="ts" lang="ts" line-numbers :highlight="[1, [4, 5]]" />
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Long lines scroll</h2>
      <CodeBlock :code="long" lang="ts" line-numbers :highlight="[2]" />
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Hide header</h2>
      <CodeBlock code="git switch -c fix/invoice-rounding" lang="bash" hide-header />
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Copy options / no copy</h2>
      <div class="flex flex-col gap-3">
        <CodeBlock
          code="hk_live_4f9a2c71e8b3d605"
          :copy="{ label: 'Copy token', copiedLabel: 'Token copied', duration: 4000 }"
        />
        <CodeBlock :code="ts" lang="ts" :copy="false" />
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Themes</h2>
      <CodeBlock
        :code="samples.json!"
        lang="json"
        :themes="{ light: 'vitesse-light', dark: 'vitesse-dark' }"
      />
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">Unknown language (falls back to plain)</h2>
      <CodeBlock code="some code" lang="not-a-language" />
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">#header and #copy slots</h2>
      <CodeBlock :code="samples.bash!" lang="bash" filename="install.sh">
        <template #header="{ filename, lang: language }">
          <div class="flex items-center gap-2">
            <span class="text-xs font-medium text-foreground">{{ filename }}</span>
            <Chip color="accent" size="sm" variant="soft">{{ language }}</Chip>
          </div>
        </template>
        <template #copy="{ copied, copy }">
          <Button size="sm" variant="tertiary" class="h-6 gap-1 px-2 text-xs" @click="copy">
            <Icon :icon="copied ? 'gravity-ui:check' : 'gravity-ui:copy'" class="size-3" />
            {{ copied ? 'Copied' : 'Copy' }}
          </Button>
        </template>
      </CodeBlock>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">:ui override</h2>
      <CodeBlock
        :code="ts"
        lang="ts"
        :ui="{ base: 'rounded-lg border border-border bg-surface', code: 'text-sm', label: 'text-accent' }"
      />
    </section>
  </div>
</template>
