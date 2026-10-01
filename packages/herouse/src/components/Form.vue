<script lang="ts">
import type { ValidationBehavior, ValidationErrors } from './formContext'

export interface FormProps {
  /**
   * Validation behavior for the fields inside. `native` blocks submission and shows errors on change or submit;
   * `aria` shows errors in realtime and never blocks submission. A field's own `validationBehavior` wins.
   * @defaultValue 'native'
   */
  validationBehavior?: ValidationBehavior
  /** Server-side errors keyed by field `name`. Shown immediately; a field's error clears once the user changes it. */
  validationErrors?: ValidationErrors
}

export interface FormSlots {
  /** Fields and buttons. */
  default?: () => any
}
</script>

<script setup lang="ts">
import { provide, toRef } from 'vue'
import { formContextKey } from './formContext'

const props = withDefaults(defineProps<FormProps>(), { validationBehavior: 'native' })
defineSlots<FormSlots>()

provide(formContextKey, {
  validationBehavior: toRef(() => props.validationBehavior),
  validationErrors: toRef(() => props.validationErrors),
})
</script>

<template>
  <form :novalidate="validationBehavior !== 'native' || undefined">
    <slot />
  </form>
</template>
