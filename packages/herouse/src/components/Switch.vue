<script lang="ts">
import type { ComponentSlots, ComponentVariants } from '../types/tv'
import theme from '../theme/switch'

type Switch = typeof theme

export interface SwitchProps {
  /** The checked state. Bind with `v-model`. */
  modelValue?: boolean
  /**
   * The initial checked state when uncontrolled.
   * @defaultValue false
   */
  defaultValue?: boolean
  /** The label rendered next to the control. */
  label?: string
  /** Help text rendered below the label. */
  description?: string
  /**
   * Size of the switch.
   * @defaultValue 'md'
   */
  size?: ComponentVariants<Switch>['size']
  /**
   * Whether the switch is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the switch is invalid. Sets `aria-invalid` on the control and `data-invalid` on the root.
   * @defaultValue false
   */
  invalid?: boolean
  /**
   * Whether the switch is read only: focusable and announced, but its state can't be changed.
   * @defaultValue false
   */
  readonly?: boolean
  /**
   * Whether user input is required on the switch before form submission.
   * @defaultValue false
   */
  required?: boolean
  /** The name of the switch, used when submitting an HTML form. */
  name?: string
  /**
   * The value of the switch, used when submitting an HTML form.
   * @defaultValue 'on'
   */
  value?: string
  /** The id of the switch control. Generated when omitted; use it to point an external `Label` at the switch. */
  id?: string
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Switch>
}

export interface SwitchSlots {
  /** The label content. Replaces the `label` prop. */
  label?: (props: { checked: boolean }) => any
  /** The description content. Replaces the `description` prop. */
  description?: (props: { checked: boolean }) => any
  /** Icon rendered inside the thumb. */
  icon?: (props: { checked: boolean }) => any
}
</script>

<script setup lang="ts">
import { SwitchRoot } from 'reka-ui'
import { computed, ref, useId, useSlots } from 'vue'
import { useComponentUI } from '../composables/useComponentUI'
import Description from './Description.vue'

defineOptions({ inheritAttrs: false })

// `modelValue: undefined` stops Vue casting an absent boolean prop to `false`, so uncontrolled mode and `defaultValue` apply
const props = withDefaults(defineProps<SwitchProps>(), { modelValue: undefined })
const emit = defineEmits<{
  /** Emitted when the checked state changes. */
  'update:modelValue': [value: boolean]
}>()
defineSlots<SwitchSlots>()
const slots = useSlots()

const ui = useComponentUI('switch', theme, () => ({
  size: props.size,
}))

const autoId = useId()
const id = computed(() => props.id ?? autoId)
const descriptionId = computed(() => `${id.value}-description`)

const local = ref(props.defaultValue ?? false)
const checked = computed(() => props.modelValue ?? local.value)
const hasDescription = computed(() => !!(props.description || slots.description))

function onUpdate(value: boolean) {
  // RAC `isReadOnly`: the control stays focusable but never changes state
  if (props.readonly)
    return
  local.value = value
  emit('update:modelValue', value)
}
</script>

<template>
  <div
    data-slot="switch"
    :data-state="checked ? 'checked' : 'unchecked'"
    :data-selected="checked ? 'true' : undefined"
    :data-disabled="disabled ? 'true' : undefined"
    :data-invalid="invalid ? 'true' : undefined"
    :data-readonly="readonly ? 'true' : undefined"
    :data-required="required ? 'true' : undefined"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <SwitchRoot
      v-bind="$attrs"
      :id="id"
      :model-value="checked"
      :name="name"
      :value="value"
      :required="required"
      :disabled="disabled"
      :aria-describedby="hasDescription ? descriptionId : undefined"
      :aria-invalid="invalid ? 'true' : undefined"
      :aria-readonly="readonly ? 'true' : undefined"
      data-slot="switch-content"
      :class="ui.content({ class: props.ui?.content })"
      @update:model-value="onUpdate"
    >
      <span data-slot="switch-control" :class="ui.control({ class: props.ui?.control })">
        <span data-slot="switch-thumb" :class="ui.thumb({ class: props.ui?.thumb })">
          <span v-if="slots.icon" data-slot="switch-icon" :class="ui.icon({ class: props.ui?.icon })">
            <slot name="icon" :checked="checked" />
          </span>
        </span>
      </span>
      <slot name="label" :checked="checked">{{ label }}</slot>
    </SwitchRoot>
    <Description v-if="hasDescription" :id="descriptionId">
      <slot name="description" :checked="checked">{{ description }}</slot>
    </Description>
  </div>
</template>
