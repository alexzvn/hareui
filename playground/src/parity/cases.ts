import type { VNode } from 'vue'

// Aggregates ./cases/<component>.ts (one file per component, ids must match parity/cases/<component>.json)
const modules = import.meta.glob<{ cases: Record<string, () => VNode> }>('./cases/*.ts', { eager: true })

export const cases: Record<string, () => VNode> = Object.assign({}, ...Object.values(modules).map(m => m.cases))
