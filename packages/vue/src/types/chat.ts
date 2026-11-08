/** Who wrote a chat message. Same values as the AI SDK's `UIMessage['role']`. */
export type ChatRole = 'system' | 'user' | 'assistant'

/** State of a chat request. Same values as the AI SDK's `useChat().status`. */
export type ChatStatus = 'submitted' | 'streaming' | 'ready' | 'error'

/** A text part of a message. */
export type ChatTextPart = {
  type: 'text'
  /** The text, usually markdown. */
  text: string
  /** `streaming` while the text is still arriving. */
  state?: 'streaming' | 'done'
}

/** A reasoning part of a message: the model's thinking before it answers. */
export type ChatReasoningPart = {
  type: 'reasoning'
  /** The reasoning text. */
  text: string
  /** `streaming` while the reasoning is still arriving. */
  state?: 'streaming' | 'done'
}

/** State of a tool call. Same values as the AI SDK's tool part `state`. */
export type ChatToolState =
  | 'input-streaming'
  | 'input-available'
  | 'approval-requested'
  | 'approval-responded'
  | 'output-available'
  | 'output-error'
  | 'output-denied'

/** A tool call part. `type` is `tool-<name>` (static tools) or `dynamic-tool` (with `toolName`). */
export type ChatToolPart = {
  type: `tool-${string}` | 'dynamic-tool'
  /** The tool's name; set on `dynamic-tool` parts. */
  toolName?: string
  /** The id of this call. */
  toolCallId: string
  /** Where the call is in its lifecycle. */
  state: ChatToolState
  /** The arguments the model passed. */
  input?: unknown
  /** The tool's result. */
  output?: unknown
  /** The error message when `state` is `output-error`. */
  errorText?: string
}

/** A cited URL. */
export type ChatSourceUrlPart = {
  type: 'source-url'
  /** The id of the source. */
  sourceId: string
  /** The cited URL. */
  url: string
  /** The source's title. */
  title?: string
}

/** A cited document. */
export type ChatSourceDocumentPart = {
  type: 'source-document'
  /** The id of the source. */
  sourceId: string
  /** The document's media type. */
  mediaType: string
  /** The document's title. */
  title: string
  /** The document's file name. */
  filename?: string
}

/** A file attached to a message. */
export type ChatFilePart = {
  type: 'file'
  /** The file's media type, e.g. `image/png`. */
  mediaType: string
  /** The file's URL (a remote URL or a data URL). */
  url: string
  /** The file's name. */
  filename?: string
}

/** A step boundary in a multi-step assistant response. */
export type ChatStepStartPart = {
  type: 'step-start'
}

/** One part of a message. The shape matches the AI SDK's `UIMessage['parts']`, so its messages can be passed in as they are. */
export type ChatMessagePart =
  | ChatTextPart
  | ChatReasoningPart
  | ChatToolPart
  | ChatSourceUrlPart
  | ChatSourceDocumentPart
  | ChatFilePart
  | ChatStepStartPart

/** A chat message. The shape matches the AI SDK's `UIMessage`. */
export type ChatMessageData = {
  /** The id of the message. */
  id: string
  /** Who wrote the message. */
  role: ChatRole
  /** The message content, in order. */
  parts: ChatMessagePart[]
  /** Extra data your app attaches to the message. */
  metadata?: unknown
}
