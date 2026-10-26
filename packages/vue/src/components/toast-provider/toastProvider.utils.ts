// Module scope rather than `<script setup>`: withDefaults() is hoisted out of setup() and can't see setup locals.
export const DEFAULT_GAP = 12
export const DEFAULT_MAX_VISIBLE_TOAST = 3
export const DEFAULT_SCALE_FACTOR = 0.05
export const DEFAULT_TOAST_WIDTH = 460
export const DEFAULT_HOTKEY = ['altKey', 'KeyT']

// `KeyboardEvent` boolean props a hotkey entry can name instead of an `event.code`
export const MODIFIER_PROPS = ['altKey', 'ctrlKey', 'metaKey', 'shiftKey'] as const
