<script setup lang="ts">
// Logo editor built with HareUI. Defaults are the shipped mark; "Copy params" gives the JSON that regenerates it.
import type { LogoFill, LogoParams } from '../logo/geometry'
import { Button, Card, Chip, Separator, Slider, Switch, toast, ToastProvider, ToggleButton, ToggleButtonGroup } from '@hareui/vue'
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fmt, isValidLogo, LOGO_DEFAULTS, logoBox, logoPath, logoSvg } from '../logo/geometry'
import LogoMark from '../logo/LogoMark.vue'

type NumKey = Exclude<keyof LogoParams, 'fill'>

const SLIDERS: { key: NumKey, label: string, min: number, max: number, step: number, hint: string }[] = [
  { key: 's', label: 'Square size', min: 10, max: 22, step: 0.25, hint: 'Side of each square (canvas is 32)' },
  { key: 'ox', label: 'Horizontal overlap', min: 0.25, max: 12, step: 0.25, hint: 'How far the squares overlap left/right' },
  { key: 'oy', label: 'Vertical overlap', min: 0.25, max: 12, step: 0.25, hint: 'How far the squares overlap up/down' },
  { key: 'e', label: 'Corner extent', min: 0, max: 12, step: 0.25, hint: 'Edge length used by each outer corner curve' },
  { key: 'b', label: 'Join extent', min: 0, max: 12, step: 0.25, hint: 'Edge length used by each centre join curve' },
  { key: 't', label: 'Smoothness', min: 0.5, max: 1, step: 0.01, hint: '0.55 ≈ circular arc, higher = squircle-like' },
  { key: 'eye', label: 'Eye', min: 0, max: 4, step: 0.25, hint: 'Round cut-out in the top square. 0 = off' },
  { key: 'eyex', label: 'Eye position', min: -1, max: 1, step: 0.05, hint: 'Slide the eye across the top square' },
  { key: 'tilt', label: 'Tilt', min: -20, max: 20, step: 0.5, hint: 'Rotation in degrees' },
  { key: 'pad', label: 'Favicon padding', min: 0, max: 8, step: 0.25, hint: 'Extra space around the favicon mark' },
]
const FILLS: { value: LogoFill, label: string }[] = [
  { value: 'mono', label: 'Mono' },
  { value: 'accent', label: 'Accent' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'duo', label: 'Two-tone' },
]

const route = useRoute()
const router = useRouter()
const params = reactive<LogoParams>({ ...LOGO_DEFAULTS, ...fromQuery() })
const guides = ref(true)
const hopOy = ref<number | null>(null)
const pins = ref<LogoParams[]>([])

function fromQuery(): Partial<LogoParams> {
  const out: Partial<LogoParams> = {}
  for (const [k, v] of Object.entries(route.query)) {
    if (!(k in LOGO_DEFAULTS) || typeof v !== 'string')
      continue
    if (k === 'fill')
      out.fill = v as LogoFill
    else if (Number.isFinite(+v))
      (out as Record<string, number>)[k] = +v
  }
  return out
}

watch(params, (p) => {
  const query = Object.fromEntries(Object.entries(p).map(([k, v]) => [k, typeof v === 'number' ? fmt(v) : v]))
  router.replace({ query })
}, { deep: true })

// The hop animation only overrides the vertical overlap, so the URL and sliders stay on the chosen value.
const shown = computed<LogoParams>(() => hopOy.value == null ? params : { ...params, oy: hopOy.value })
const valid = computed(() => isValidLogo(params))
const box = computed(() => logoBox(params))
const path = computed(() => logoPath(params))

const fill = computed({
  get: () => [params.fill],
  set: (v: string[]) => { if (v[0]) params.fill = v[0] as LogoFill },
})

const rnd = (a: number, b: number, step: number) => +(Math.round((a + Math.random() * (b - a)) / step) * step).toFixed(2)
function surprise() {
  const s = rnd(14, 19, 0.25)
  Object.assign(params, {
    s,
    // Overlap must keep the bounding box (2s - overlap) inside the 32-unit canvas.
    ox: rnd(Math.max(1, 2 * s - 32), s * 0.5, 0.25),
    oy: rnd(Math.max(1, 2 * s - 32), s * 0.5, 0.25),
    e: rnd(4, s / 2, 0.25),
    b: rnd(2, 7, 0.25),
    t: rnd(0.6, 0.9, 0.01),
    eye: Math.random() < 0.35 ? rnd(1, 2.5, 0.25) : 0,
    eyex: rnd(-0.6, 0.6, 0.05),
    tilt: Math.random() < 0.3 ? rnd(-12, 12, 0.5) : 0,
    fill: FILLS[Math.floor(Math.random() * FILLS.length)]!.value,
  })
}

let raf = 0
function hop() {
  // The top square lifts to a thin neck, then lands with a small squash.
  cancelAnimationFrame(raf)
  const start = performance.now()
  const target = params.oy
  const frame = (now: number) => {
    const k = Math.min(1, (now - start) / 900)
    const up = Math.sin(Math.PI * Math.min(1, k / 0.75))
    const squash = k > 0.75 ? Math.sin(Math.PI * (k - 0.75) / 0.25) * 1.2 : 0
    hopOy.value = Math.max(0.25, target - up * (target - 0.25) * 0.95 + squash)
    if (k < 1)
      raf = requestAnimationFrame(frame)
    else
      hopOy.value = null
  }
  raf = requestAnimationFrame(frame)
}

// Loading idea: the mark is symmetric under 180°, so quarter turns read as a spinner.
const spin = ref(0)
const spinTimer = setInterval(() => { spin.value += 90 }, 700)
onBeforeUnmount(() => {
  clearInterval(spinTimer)
  cancelAnimationFrame(raf)
})

async function copy(text: string, what: string) {
  await navigator.clipboard.writeText(text)
  toast.success(`${what} copied`)
}
</script>

<template>
  <div class="flex flex-col gap-6 lg:flex-row lg:items-start">
    <Card class="w-full shrink-0 lg:sticky lg:top-8 lg:w-96">
      <template #title>
        HareUI logo
      </template>
      <template #description>
        Defaults are the shipped mark. State lives in the URL.
      </template>
      <div class="flex flex-col gap-5">
        <div v-for="sl in SLIDERS" :key="sl.key" class="flex flex-col gap-1">
          <Slider v-model="params[sl.key]" :label="sl.label" :max="sl.max" :min="sl.min" :step="sl.step" />
          <span class="text-xs text-muted">{{ sl.hint }}</span>
        </div>
        <Separator />
        <div class="flex flex-col gap-2">
          <span class="text-sm font-medium">Fill</span>
          <ToggleButtonGroup v-model="fill" aria-label="Fill" disallow-empty-selection size="sm">
            <ToggleButton v-for="f in FILLS" :key="f.value" :value="f.value">
              {{ f.label }}
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <Switch v-model="guides" label="Grid guides" />
      </div>
      <template #footer>
        <div class="flex flex-wrap gap-2">
          <Button size="sm" @click="surprise">
            Surprise me
          </Button>
          <Button size="sm" variant="secondary" @click="hop">
            Hop
          </Button>
          <Button size="sm" variant="secondary" @click="pins.push({ ...params })">
            Pin
          </Button>
          <Button size="sm" variant="tertiary" @click="copy(JSON.stringify(params), 'Params')">
            Copy params
          </Button>
          <Button size="sm" variant="tertiary" @click="copy(logoSvg(params), 'SVG')">
            Copy SVG
          </Button>
          <Button size="sm" variant="ghost" @click="Object.assign(params, LOGO_DEFAULTS)">
            Reset
          </Button>
        </div>
      </template>
    </Card>

    <div class="flex min-w-0 flex-1 flex-col gap-6">
      <div class="flex flex-wrap items-start gap-6">
        <Card class="items-center">
          <div class="relative bg-[repeating-conic-gradient(var(--default)_0_25%,transparent_0_50%)] bg-size-[16px_16px]" :class="{ 'opacity-40': !valid }">
            <LogoMark :params="shown" :pad="1" :size="400">
              <template v-if="guides">
                <rect fill="none" height="32" stroke="var(--muted)" stroke-dasharray="0.4 0.4" stroke-width="0.08" width="32" />
                <rect :height="params.s" :width="params.s" :x="box.cx" :y="box.ly" fill="none" stroke="var(--danger)" stroke-width="0.1" />
                <rect :height="params.s" :width="params.s" :x="box.lx" :y="box.cy" fill="none" stroke="var(--accent)" stroke-width="0.1" />
              </template>
            </LogoMark>
          </div>
          <template #footer>
            <div class="flex w-full items-center justify-between gap-2 text-sm text-muted">
              <span>Bounding box {{ fmt(2 * params.s - params.ox) }} × {{ fmt(2 * params.s - params.oy) }}</span>
              <Chip v-if="!valid" color="danger" size="sm">
                Out of canvas
              </Chip>
            </div>
          </template>
        </Card>

        <div class="flex flex-col gap-4">
          <div class="flex flex-wrap items-end gap-4">
            <Card v-for="size in [64, 32]" :key="size" class="items-center gap-2 p-3 text-xs text-muted">
              <LogoMark :params="shown" :size="size" class="text-foreground" />
              {{ size }}px
            </Card>
            <Card class="items-center gap-2 p-3 text-xs text-muted">
              <LogoMark :pad="params.pad" :params="shown" :size="16" class="text-foreground" />
              favicon
            </Card>
            <Card class="items-center gap-2 p-3 text-xs text-muted">
              <LogoMark class="text-foreground transition-transform duration-450 ease-[cubic-bezier(.6,-0.3,.3,1.4)]" :params="shown" :size="24" :style="{ transform: `rotate(${spin}deg)` }" />
              loading
            </Card>
          </div>
          <div class="flex flex-wrap items-end gap-4">
            <Card class="items-center gap-2 p-3 text-xs text-muted">
              <div class="grid size-16 place-items-center rounded-[15px] bg-white text-[#18181b] shadow-sm">
                <LogoMark :params="shown" :size="38" />
              </div>
              app icon
            </Card>
            <Card class="items-center gap-2 p-3 text-xs text-muted">
              <div class="grid size-16 place-items-center rounded-[15px] bg-accent shadow-sm">
                <LogoMark :params="shown" :size="38" solid="#fff" />
              </div>
              on accent
            </Card>
            <Card class="items-center gap-2 p-3 text-xs text-muted">
              <div class="grid size-16 place-items-center rounded-[15px] bg-[#18181b] text-[#fafafa] shadow-sm">
                <LogoMark :params="shown" :size="38" />
              </div>
              app icon dark
            </Card>
          </div>
          <Card class="p-4">
            <div class="flex items-center gap-2.5 text-lg font-semibold">
              <LogoMark :params="shown" :size="24" />
              HareUI
            </div>
          </Card>
          <Card class="dark bg-[#09090b] p-4 text-[#fafafa]">
            <div class="flex items-center gap-2.5 text-lg font-semibold">
              <LogoMark :params="shown" :size="24" />
              HareUI
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <template #title>
          Pinned
        </template>
        <template #description>
          Click to restore.
        </template>
        <div v-if="pins.length" class="flex flex-wrap gap-3">
          <div v-for="(pin, i) in pins" :key="i" class="group relative">
            <Button class="h-auto flex-col gap-1 p-3" variant="secondary" @click="Object.assign(params, pin)">
              <LogoMark :params="pin" :size="64" class="size-16 text-foreground" />
              <span class="text-xs text-muted">#{{ i + 1 }} · s{{ pin.s }} x{{ pin.ox }} y{{ pin.oy }}</span>
            </Button>
            <Button aria-label="Remove pin" class="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100" icon-only size="sm" variant="tertiary" @click="pins.splice(i, 1)">
              ×
            </Button>
          </div>
        </div>
        <p v-else class="text-sm text-muted">
          Nothing pinned yet.
        </p>
      </Card>

      <Card>
        <template #title>
          Path
        </template>
        <pre class="text-xs break-all whitespace-pre-wrap text-muted">{{ path }}</pre>
      </Card>
    </div>
    <ToastProvider />
  </div>
</template>
