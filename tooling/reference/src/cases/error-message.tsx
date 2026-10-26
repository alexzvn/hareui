import type { ReactElement } from 'react'
import { ErrorMessage } from '@heroui/react'

export const cases: Record<string, () => ReactElement> = {
  'error-message-basic': () => <ErrorMessage>Please select at least one category</ErrorMessage>,
  'error-message-custom': () => <ErrorMessage className="font-medium text-danger">Choose at least one topic</ErrorMessage>,
  'error-message-long': () => <div className="w-40"><ErrorMessage>Averyveryverylongwordthatmustbreakacrosslines and more</ErrorMessage></div>,
}
