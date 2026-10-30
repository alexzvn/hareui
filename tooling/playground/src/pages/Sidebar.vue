<script setup lang="ts">
import type { NavigationMenuItem } from '@hareui/vue'
import { Avatar, Button, NavigationMenu } from '@hareui/vue'
import { h, ref } from 'vue'
import { Sidebar } from '@/components/sidebar'
import { Icon } from '../icons'

const icon = (name: string) => (attrs: Record<string, unknown>) => h(Icon, { ...attrs, icon: `gravity-ui:${name}` })

const items: NavigationMenuItem[] = [
  { label: 'Overview', icon: icon('house'), href: '#', active: true },
  { label: 'Projects', icon: icon('folder'), href: '#', badge: '4' },
  {
    label: 'Reports',
    icon: icon('chart-column'),
    defaultOpen: true,
    children: [
      { label: 'Revenue', href: '#' },
      { label: 'Retention', href: '#' },
    ],
  },
  { label: 'Settings', icon: icon('gear'), href: '#' },
]

const variants = ['sidebar', 'floating', 'inset'] as const
const collapsibles = ['offcanvas', 'icon', 'none'] as const
const modes = ['slideover', 'drawer', 'modal'] as const

const variantOpen = ref<Record<string, boolean>>({ sidebar: true, floating: true, inset: true })
const collapsibleOpen = ref<Record<string, boolean>>({ offcanvas: true, icon: false, none: true })
const sideOpen = ref(true)
const railOpen = ref(true)
const slotsOpen = ref(true)
const modeOpen = ref<Record<string, boolean>>({ slideover: false, drawer: false, modal: false })
const uiOpen = ref(true)

const frame = 'flex h-[420px] overflow-hidden rounded-xl border border-separator [transform:translateZ(0)]'
const frameUi = { container: 'h-full' }
</script>

<template>
  <div class="flex flex-col gap-10">
    <h1 class="text-xl font-semibold">
      Sidebar
    </h1>

    <section v-for="variant in variants" :key="variant">
      <h2 class="mb-2 text-sm font-medium text-muted">
        Variant: {{ variant }} (collapsible="icon")
      </h2>
      <div :class="frame">
        <Sidebar
          v-model:open="variantOpen[variant]"
          :variant="variant"
          collapsible="icon"
          rail
          title="Northwind"
          description="Studio plan"
          :ui="frameUi"
        >
          <template #default="{ state }">
            <NavigationMenu :items="items" orientation="vertical" :collapsed="state === 'collapsed'" tooltip />
          </template>
        </Sidebar>
        <main
          :class="[
            'flex min-w-0 flex-1 flex-col gap-3 p-4',
            variant === 'inset' ? 'm-2 ms-0 rounded-2xl border border-border bg-surface shadow-surface' : '',
          ]"
        >
          <Button variant="ghost" size="sm" icon-only aria-label="Toggle sidebar" @click="variantOpen[variant] = !variantOpen[variant]">
            <Icon icon="gravity-ui:layout-side-content-left" />
          </Button>
          <p class="text-sm text-muted">
            open: {{ variantOpen[variant] }}
          </p>
        </main>
      </div>
    </section>

    <section v-for="collapsible in collapsibles" :key="collapsible">
      <h2 class="mb-2 text-sm font-medium text-muted">
        Collapsible: {{ collapsible }}
      </h2>
      <div :class="frame">
        <Sidebar v-model:open="collapsibleOpen[collapsible]" :collapsible="collapsible" title="Northwind" :ui="frameUi">
          <template #default="{ state }">
            <NavigationMenu :items="items" orientation="vertical" :collapsed="state === 'collapsed'" tooltip />
          </template>
        </Sidebar>
        <main class="flex min-w-0 flex-1 flex-col gap-3 p-4">
          <Button
            variant="ghost"
            size="sm"
            icon-only
            aria-label="Toggle sidebar"
            :disabled="collapsible === 'none'"
            @click="collapsibleOpen[collapsible] = !collapsibleOpen[collapsible]"
          >
            <Icon icon="gravity-ui:layout-side-content-left" />
          </Button>
        </main>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">
        Side: right, with rail and close button
      </h2>
      <div :class="frame">
        <main class="flex min-w-0 flex-1 flex-col items-end gap-3 p-4">
          <Button variant="ghost" size="sm" icon-only aria-label="Toggle sidebar" @click="sideOpen = !sideOpen">
            <Icon icon="gravity-ui:layout-side-content-right" />
          </Button>
        </main>
        <Sidebar v-model:open="sideOpen" side="right" rail close title="Details" description="Invoice #2041" :ui="frameUi">
          <p class="px-2 text-sm text-muted">
            Due in 14 days.
          </p>
        </Sidebar>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">
        Rail + close (custom icon), transition off
      </h2>
      <div :class="frame">
        <Sidebar
          v-model:open="railOpen"
          collapsible="icon"
          rail
          :transition="false"
          :close="{ icon: icon('chevrons-left'), 'aria-label': 'Collapse' }"
          title="Northwind"
          :ui="frameUi"
        >
          <template #default="{ state }">
            <NavigationMenu :items="items" orientation="vertical" :collapsed="state === 'collapsed'" tooltip />
          </template>
        </Sidebar>
        <main class="flex-1 p-4 text-sm text-muted">
          open: {{ railOpen }}
        </main>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">
        Slots: header, actions, footer, rail
      </h2>
      <div :class="frame">
        <Sidebar v-model:open="slotsOpen" collapsible="icon" rail :ui="frameUi">
          <template #header="{ state }">
            <div class="flex min-w-0 items-center gap-3 px-1.5 py-2">
              <span class="flex size-6 shrink-0 items-center justify-center rounded-md bg-accent text-sm font-bold text-accent-foreground">N</span>
              <span v-if="state === 'expanded'" class="truncate text-sm font-semibold">Northwind</span>
            </div>
          </template>
          <template #default="{ state }">
            <NavigationMenu :items="items" orientation="vertical" :collapsed="state === 'collapsed'" tooltip />
          </template>
          <template #footer="{ state }">
            <button type="button" class="flex h-9 w-full items-center gap-3 rounded-2xl px-1.5 text-sm hover:bg-default">
              <Avatar class="size-6 shrink-0 text-[10px]" fallback="RM" size="sm" />
              <span v-if="state === 'expanded'" class="truncate">Rosa Mendes</span>
            </button>
          </template>
          <template #rail="{ ui }">
            <button type="button" data-slot="sidebar-rail" aria-label="Toggle" :class="ui.rail({ class: 'hover:bg-accent/10' })" @click="slotsOpen = !slotsOpen" />
          </template>
        </Sidebar>
        <main class="flex-1 p-4 text-sm text-muted">
          state: {{ slotsOpen ? 'expanded' : 'collapsed' }}
        </main>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">
        Mobile menu modes (breakpoint="2xl" forces the menu below 1536px)
      </h2>
      <div class="flex flex-wrap gap-3">
        <template v-for="mode in modes" :key="mode">
          <Button variant="secondary" @click="modeOpen[mode] = true">
            {{ mode }}
          </Button>
          <Sidebar v-model:open="modeOpen[mode]" :mode="mode" breakpoint="2xl" title="Northwind" :ui="frameUi">
            <NavigationMenu :items="items" orientation="vertical" />
            <template #footer>
              <p class="px-2 text-xs text-muted">
                v2.4.0
              </p>
            </template>
          </Sidebar>
        </template>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">
        :ui override
      </h2>
      <div :class="frame">
        <Sidebar
          v-model:open="uiOpen"
          collapsible="icon"
          title="Northwind"
          :ui="{ container: 'h-full bg-surface-secondary', title: 'text-accent', body: 'px-2' }"
          class="[--sidebar-width:18rem]"
        >
          <template #default="{ state }">
            <NavigationMenu :items="items" orientation="vertical" :collapsed="state === 'collapsed'" tooltip />
          </template>
        </Sidebar>
        <main class="flex-1 p-4">
          <Button variant="ghost" size="sm" icon-only aria-label="Toggle sidebar" @click="uiOpen = !uiOpen">
            <Icon icon="gravity-ui:layout-side-content-left" />
          </Button>
        </main>
      </div>
    </section>
  </div>
</template>
