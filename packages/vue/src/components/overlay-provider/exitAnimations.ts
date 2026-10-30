const hasEnd = (animation: Animation): boolean => {
  return animation.effect?.getComputedTiming().endTime !== Infinity
}

// Overlay parts carry `data-state="closed"` while they animate out (Reka's Presence keeps them mounted until then).
const isClosing = (animation: Animation): boolean => {
  const effect = animation.effect
  const target = effect && 'target' in effect ? effect.target : null

  return target instanceof Element && target.closest('[data-state="closed"]') !== null
}

/**
 * Resolves once every finite animation or transition running on a closing overlay part has ended (or been cancelled),
 * so an overlay unmounts only after its exit animation. Resolves at once where the Web Animations API is missing.
 */
export const afterExitAnimations = async (): Promise<void> => {
  if (typeof document === 'undefined' || typeof document.getAnimations !== 'function') return

  const animations = document.getAnimations().filter((animation) => {
    return hasEnd(animation) && isClosing(animation)
  })

  await Promise.allSettled(animations.map((animation) => animation.finished))
}
