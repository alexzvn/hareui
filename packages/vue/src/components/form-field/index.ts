export { default as FormField } from './FormField.vue'
export type { FormFieldProps, FormFieldSlotProps, FormFieldSlots } from './FormField.types'
export { formFieldContextKey } from './context'
export type { FormFieldContext, FormFieldControl } from './context'
export { useFormField } from '@/composables/useFormField'

export type {
  FormFieldAriaAttrs,
  UseFormFieldOptions,
  UseFormFieldReturn,
} from '@/composables/useFormField'
