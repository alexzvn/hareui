<script setup lang="ts">
import { Button, Modal, Popover } from 'herouse'
import { ref } from 'vue'
import { Icon } from '../icons'

const sizes = ['xs', 'sm', 'md', 'lg', 'cover', 'full'] as const
const variants = ['opaque', 'blur', 'transparent'] as const
const placements = ['auto', 'top', 'center', 'bottom'] as const

const controlledOpen = ref(false)
</script>

<template>
  <div class="flex flex-col gap-10">
    <h1 class="text-xl font-semibold">
      Modal
    </h1>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">
        Sizes
      </h2>
      <div class="flex flex-wrap gap-4">
        <Modal v-for="size in sizes" :key="size" :size="size">
          <Button variant="secondary">
            {{ size }}
          </Button>
          <template #icon>
            <Icon icon="gravity-ui:rocket" width="20" />
          </template>
          <template #title>
            Size: {{ size }}
          </template>
          <template #body>
            <p>This modal uses the <code>{{ size }}</code> size variant.</p>
          </template>
          <template #footer="{ close }">
            <Button class="w-full" @click="close">
              Continue
            </Button>
          </template>
        </Modal>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">
        Variants (backdrop)
      </h2>
      <div class="flex flex-wrap gap-4">
        <Modal v-for="variant in variants" :key="variant" :variant="variant">
          <Button variant="secondary">
            {{ variant }}
          </Button>
          <template #title>
            Variant: {{ variant }}
          </template>
          <template #body>
            <p>Backdrop variant <code>{{ variant }}</code>.</p>
          </template>
        </Modal>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">
        Placements
      </h2>
      <div class="flex flex-wrap gap-4">
        <Modal v-for="placement in placements" :key="placement" :placement="placement">
          <Button variant="secondary">
            {{ placement }}
          </Button>
          <template #title>
            Placement: {{ placement }}
          </template>
          <template #body>
            <p>Placement <code>{{ placement }}</code>.</p>
          </template>
        </Modal>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">
        Scroll inside / outside
      </h2>
      <div class="flex flex-wrap gap-4">
        <Modal scroll="inside">
          <Button variant="secondary">
            Scroll inside
          </Button>
          <template #title>
            Scroll: inside
          </template>
          <template #body>
            <p v-for="i in 30" :key="i" class="mb-3">
              Paragraph {{ i }}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </template>
        </Modal>
        <Modal scroll="outside">
          <Button variant="secondary">
            Scroll outside
          </Button>
          <template #title>
            Scroll: outside
          </template>
          <template #body>
            <p v-for="i in 30" :key="i" class="mb-3">
              Paragraph {{ i }}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </template>
        </Modal>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">
        dismissible=false / closeButton=false
      </h2>
      <div class="flex flex-wrap gap-4">
        <Modal :dismissible="false">
          <Button variant="secondary">
            Not dismissible
          </Button>
          <template #title>
            dismissible = false
          </template>
          <template #body>
            <p>Clicking the backdrop or pressing Escape does not close this modal.</p>
          </template>
          <template #footer="{ close }">
            <Button @click="close">
              Close
            </Button>
          </template>
        </Modal>
        <Modal :close-button="false">
          <Button variant="secondary">
            No close button
          </Button>
          <template #title>
            closeButton = false
          </template>
          <template #body>
            <p>No default close trigger is rendered.</p>
          </template>
          <template #footer="{ close }">
            <Button @click="close">
              Close
            </Button>
          </template>
        </Modal>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">
        Slot usage: #icon, #header, #body, #footer, #close
      </h2>
      <div class="flex flex-wrap gap-4">
        <Modal>
          <Button variant="secondary">
            Default slots
          </Button>
          <template #icon>
            <Icon icon="gravity-ui:rocket" width="20" />
          </template>
          <template #title>
            Welcome
          </template>
          <template #body>
            <p>Body via <code>#body</code> slot.</p>
          </template>
          <template #footer="{ close }">
            <Button variant="secondary" @click="close">
              Cancel
            </Button>
            <Button @click="close">
              Confirm
            </Button>
          </template>
        </Modal>

        <Modal title="Fully custom header">
          <Button variant="secondary">
            Custom #header
          </Button>
          <template #header>
            <div class="flex items-center gap-2 text-accent">
              <Icon icon="gravity-ui:sparkles" width="18" />
              <span class="font-semibold">Fully custom header</span>
            </div>
          </template>
          <template #body>
            <p>The entire header was replaced via <code>#header</code>.</p>
          </template>
        </Modal>

        <Modal>
          <Button variant="secondary">
            Custom #close
          </Button>
          <template #title>
            Custom close trigger
          </template>
          <template #body>
            <p>The close button is replaced via <code>#close</code>.</p>
          </template>
          <template #close="{ close }">
            <button type="button" class="absolute end-4 top-4 text-xs text-accent underline" @click="close">
              dismiss
            </button>
          </template>
        </Modal>

        <Modal>
          <Button variant="secondary">
            #content (full override)
          </Button>
          <template #content="{ close }">
            <div class="flex flex-col gap-3 p-2">
              <p class="font-semibold">
                Entirely custom content
              </p>
              <p class="text-sm text-muted">
                Replaces header, body, footer, and close trigger via <code>#content</code>.
              </p>
              <Button class="self-end" @click="close">
                Done
              </Button>
            </div>
          </template>
        </Modal>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">
        :ui override
      </h2>
      <div class="flex flex-wrap gap-4">
        <Modal :ui="{ dialog: 'border-2 border-accent', heading: 'text-accent' }">
          <Button variant="secondary">
            :ui override
          </Button>
          <template #title>
            Styled dialog
          </template>
          <template #body>
            <p>The dialog border and heading color come from the <code>:ui</code> prop.</p>
          </template>
        </Modal>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">
        v-model:open controlled
      </h2>
      <div class="flex flex-wrap items-center gap-4">
        <p class="text-xs text-muted">
          Status: <span class="font-mono font-medium text-foreground">{{ controlledOpen ? 'open' : 'closed' }}</span>
        </p>
        <Button size="sm" variant="secondary" @click="controlledOpen = true">
          Open
        </Button>
        <Button size="sm" variant="tertiary" @click="controlledOpen = !controlledOpen">
          Toggle
        </Button>
        <Modal v-model:open="controlledOpen">
          <template #title>
            Controlled modal
          </template>
          <template #body>
            <p>Controlled purely via <code>v-model:open</code>, no default trigger slot.</p>
          </template>
          <template #footer="{ close }">
            <Button @click="close">
              Close
            </Button>
          </template>
        </Modal>
      </div>
    </section>

    <section>
      <h2 class="mb-2 text-sm font-medium text-muted">
        Nesting: Popover inside Modal body
      </h2>
      <div class="flex flex-wrap gap-4">
        <Modal>
          <Button variant="secondary">
            Open with nested Popover
          </Button>
          <template #title>
            Nested overlay
          </template>
          <template #body>
            <p class="mb-3">
              A Popover trigger lives inside this Modal's body.
            </p>
            <Popover title="Nested Popover">
              <Button variant="tertiary">
                Open Popover
              </Button>
              <template #content>
                <p class="text-sm text-muted">
                  This popover is rendered inside the Modal's body content.
                </p>
              </template>
            </Popover>
          </template>
        </Modal>
      </div>
    </section>
  </div>
</template>
