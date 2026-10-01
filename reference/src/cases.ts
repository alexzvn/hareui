import type { ReactElement } from 'react'

// Aggregates ./cases/<component>.tsx (one file per component, ids must match parity/cases/<component>.json)
const modules = import.meta.glob<{ cases: Record<string, () => ReactElement> }>('./cases/*.tsx', { eager: true })

export const cases: Record<string, () => ReactElement> = Object.assign({}, ...Object.values(modules).map(m => m.cases))
