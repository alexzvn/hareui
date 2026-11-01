import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { IconValue } from '@/types/icon'
import type { ComponentSlots, ComponentUI, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Stepper = typeof theme

/** The status of a step: before the current one (`completed`), the current one (`active`), or after it (`inactive`). */
export type StepperItemState = 'completed' | 'active' | 'inactive'

/** One step of a `Stepper`. */
export type StepperItem = {
  /** Name of the dynamic slots for this step: `#<slot>` (content), `#<slot>-wrapper`, `#<slot>-title` and `#<slot>-description`. */
  slot?: string
  /** The value matched against `v-model` / `defaultValue`, read from `valueKey`. Defaults to the step's index. */
  value?: string | number
  /** The step title, shown under (horizontal) or next to (vertical) the indicator. */
  title?: string
  /** Secondary text under the title. */
  description?: string
  /** An icon (a class string or a component) shown in the indicator instead of the step number and the completed check. */
  icon?: IconValue
  /** Fallback content shown below the steps while this step is active, when no `#content` / `#<slot>` slot is set. */
  content?: string
  /**
   * How much of the separator after this step is filled, from `0` to `1`.
   * @defaultValue 1 once the step is completed, 0 otherwise
   */
  progress?: number
  /** Whether this step can't be selected. */
  disabled?: boolean
  /** Additional classes merged into this step's item element. */
  class?: ClassValue
  /** Per-slot class overrides for this step. */
  ui?: Partial<
    Pick<
      ComponentSlots<Stepper>,
      | 'item'
      | 'trigger'
      | 'indicator'
      | 'icon'
      | 'check'
      | 'separator'
      | 'separatorFill'
      | 'wrapper'
      | 'title'
      | 'description'
    >
  >
  /** Any other data, available in the slots as `item`. */
  [key: string]: unknown
}

/** Props of `Stepper`: a row or column of steps showing progress through a sequence, with the active step's content below. */
export type StepperProps<T extends StepperItem = StepperItem> = {
  /**
   * The element or component to render the root as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /** The steps to render. */
  items: T[]
  /**
   * The size of the indicators and labels.
   * @defaultValue 'md'
   */
  size?: ComponentVariants<Stepper>['size']
  /**
   * The color of the active and completed steps. `default` uses the foreground color.
   * @defaultValue 'accent'
   */
  color?: ComponentVariants<Stepper>['color']
  /**
   * The direction the steps are laid out in. Arrow keys move focus along it.
   * @defaultValue 'horizontal'
   */
  orientation?: ComponentVariants<Stepper>['orientation']
  /**
   * The key read from each item as its value.
   * @defaultValue 'value'
   */
  valueKey?: string
  /** The active step: an item value, or a step index when no item has that value. A value past the last step marks every step completed. */
  modelValue?: string | number
  /**
   * The active step when `v-model` isn't bound, in the same forms as `modelValue`. Read once.
   * @defaultValue 0
   */
  defaultValue?: string | number
  /**
   * Whether steps must be taken in order: only the steps up to the one after the active step can be selected.
   * @defaultValue true
   */
  linear?: boolean
  /**
   * Whether no step can be selected. The stepper still shows progress.
   * @defaultValue false
   */
  disabled?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Stepper>
}

/** Events emitted by `Stepper`. */
export type StepperEmits<T extends StepperItem = StepperItem> = {
  /** Emitted when the active step changes, with its value (or index). */
  'update:modelValue': [value: string | number]
  /** Emitted by the exposed `next()`, with the step it moved to. */
  next: [item: T]
  /** Emitted by the exposed `prev()`, with the step it moved to. */
  prev: [item: T]
}

/** Props passed to every slot. */
export type StepperItemSlotProps<T extends StepperItem = StepperItem> = {
  /** The step being rendered. */
  item: T
  /** The step's position in `items`. */
  index: number
  /** The step's status. */
  state: StepperItemState
  /** The resolved slot class functions, to style custom content like the default icon (`ui.icon()`). */
  ui: ComponentUI<Stepper>
}

/** Slots of `Stepper`. Steps with a `slot` field use `#<slot>-wrapper`, `#<slot>-title`, `#<slot>-description` and `#<slot>` first. */
export type StepperSlots<T extends StepperItem = StepperItem> = {
  /** Replaces the content of every indicator (the number, icon or completed check). */
  indicator?: (props: StepperItemSlotProps<T>) => VNode[]
  /** Replaces the title and description of every step. */
  wrapper?: (props: StepperItemSlotProps<T>) => VNode[]
  /** Replaces the title text of every step. */
  title?: (props: StepperItemSlotProps<T>) => VNode[]
  /** Replaces the description text of every step. */
  description?: (props: StepperItemSlotProps<T>) => VNode[]
  /** The content shown below (horizontal) or beside (vertical) the steps for the active step. */
  content?: (props: StepperItemSlotProps<T>) => VNode[]
  /** Per-step slots named by the step's `slot` field. */
  [slot: string]: ((props: StepperItemSlotProps<T>) => VNode[]) | undefined
}

/** What a template ref to `Stepper` exposes. */
export type StepperExposed = {
  /** Moves to the next step, if any, and emits `next`. */
  next: () => void
  /** Moves to the previous step, if any, and emits `prev`. */
  prev: () => void
  /** Whether there is a step after the active one. */
  hasNext: boolean
  /** Whether there is a step before the active one. */
  hasPrev: boolean
}
