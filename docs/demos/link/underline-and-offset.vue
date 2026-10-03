<script setup lang="ts">
import { Link } from '@hareui/vue'
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-muted">
        Default hover underline
      </p>
      <Link href="#" icon>
        Hover to see the underline
      </Link>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-muted">
        Always visible underline
      </p>
      <Link class="underline" href="#" icon>
        Underline always visible
      </Link>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-muted">
        No underline
      </p>
      <Link class="no-underline" href="#" icon>
        Link without any underline
      </Link>
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-muted">
        Changing the underline offset
      </p>
      <div class="flex flex-col gap-3">
        <Link class="underline-offset-1" href="#" icon>
          Offset 1 (1px space)
        </Link>
        <Link class="underline-offset-2" href="#" icon>
          Offset 2 (2px space)
        </Link>
        <Link class="underline-offset-3" href="#" icon>
          Offset 3 (3px space)
        </Link>
        <Link class="underline-offset-4" href="#" icon>
          Offset 4 (4px space)
        </Link>
      </div>
    </div>
  </div>
</template>
