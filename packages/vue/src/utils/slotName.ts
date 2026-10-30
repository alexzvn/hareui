type SlotNameOptions = {
  /** The item's own `slot` field. */
  slot?: string
  /** The part of the item the slot renders, appended as `-<suffix>`; empty for the whole item. */
  suffix?: string
  /** The base name an item without its own `slot` renders through. */
  fallback?: string
}

/** The slot an item renders through: `#<base>` or `#<base>-<suffix>`, where `base` is `slot`, else `fallback`. */
export const resolveSlotName = ({
  slot,
  suffix = '',
  fallback = 'item',
}: SlotNameOptions): string => {
  const base = slot || fallback

  return suffix ? `${base}-${suffix}` : base
}
