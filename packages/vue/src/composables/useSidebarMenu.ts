import type { MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

import type { DrawerProps } from '@/components/drawer/Drawer.types'
import Drawer from '@/components/drawer/Drawer.vue'
import type { ModalProps } from '@/components/modal/Modal.types'
import Modal from '@/components/modal/Modal.vue'
import type { SidebarMode } from '@/components/sidebar/Sidebar.types'
import type { ClassValue } from '@/utils/tv'

/** Reactive options of `useSidebarMenu`. */
export type UseSidebarMenuOptions = {
  /** How the menu opens: a side sheet (`slideover`), a bottom sheet (`drawer`) or a full-screen dialog (`modal`). */
  mode: SidebarMode
  /** The side the sidebar sits on, which a `slideover` menu slides in from. */
  side: 'left' | 'right'
  /** The user's `menu` prop: `Modal` props for `mode="modal"`, `Drawer` props otherwise. */
  menu?: Partial<DrawerProps> | Partial<ModalProps>
  /** The sidebar's own classes for the menu's `backdrop` and `dialog` slots, merged before the user's `menu.ui`. */
  classes: { backdrop: ClassValue; dialog: ClassValue }
}

/**
 * The overlay a sidebar renders as below its breakpoint: the `Modal` or `Drawer` component, its props with the
 * defaults of the mode, and its `ui`. The props leave out `menu.title`, since each sidebar names its menu its own way.
 */
export const useSidebarMenu = (options: MaybeRefOrGetter<UseSidebarMenuOptions>) => {
  const Menu = computed(() => (toValue(options).mode === 'modal' ? Modal : Drawer))

  const menuProps = computed<Record<string, unknown>>(() => {
    const { mode, side, menu = {} } = toValue(options)
    const { title: _title, ui: _ui, ...rest } = menu as Record<string, unknown>

    const defaultsByMode = {
      slideover: { placement: side, variant: 'blur' },
      drawer: { placement: 'bottom', variant: 'blur' },
      modal: { size: 'full' },
    } satisfies Record<SidebarMode, Record<string, unknown>>

    return { ...defaultsByMode[mode], ...rest }
  })

  // The user's `menu.ui` is forwarded as is; only `backdrop` / `dialog` are merged with the sidebar's classes.
  const menuClasses = computed(() => {
    const { menu: { ui = {} } = {}, classes } = toValue(options)
    const user: Partial<Record<string, ClassValue>> = ui

    return {
      ...user,
      backdrop: [classes.backdrop, user.backdrop],
      dialog: [classes.dialog, user.dialog],
    }
  })

  return { Menu, menuProps, menuClasses }
}
