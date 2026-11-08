import type { ChatToolPart, ChatToolState } from '@/types/chat'

/** A tool part's name: `toolName` on `dynamic-tool` parts, the `type` after `tool-` otherwise. */
export const toolPartName = (part: ChatToolPart) => {
  return part.type === 'dynamic-tool' ? (part.toolName ?? '') : part.type.slice('tool-'.length)
}

/** Whether a call is still in flight: its input is arriving, or it runs (before or after an approval). */
export const isToolRunning = (state: ChatToolState) => {
  return (
    state === 'input-streaming' || state === 'input-available' || state === 'approval-responded'
  )
}
