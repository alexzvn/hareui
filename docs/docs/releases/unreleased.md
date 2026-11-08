---
title: Unreleased
description: Changes merged since the last release.
---

## New

### New components

#### Chat

- [ChatMessage](/docs/components/chat-message) renders one chat message in the shape of the AI SDK's `UIMessage`. User messages sit in a bubble at the end, and assistant messages show as plain text at the start. Files, tool calls, sources and reasoning render with the chat components by default, and each part type has a slot to replace them. Each message can have an avatar, a row of actions and a compact layout.
- [ChatMessageActions](/docs/components/chat-message-actions) is that row of actions: copy, like, dislike, regenerate, edit, share and a menu. Likes and dislikes bind to `v-model:feedback`.
- [ChatConversation](/docs/components/chat-conversation) is the message log. It follows a streaming reply until you scroll up, then shows a scroll-to-bottom button. A sticky `#footer` holds the prompt input.
- [ChatListView](/docs/components/chat-list-view) renders the thread rows of a chat sidebar. The open thread binds to `v-model`.
- [PromptSuggestion](/docs/components/prompt-suggestion) shows starter prompts as pills or cards, and emits `select` when one is picked.
- [ChatLoader](/docs/components/chat-loader) shows that a reply is on its way, as typing dots, a pulse, a spinner or a message skeleton.
- [TextShimmer](/docs/components/text-shimmer) sweeps a highlight across text while work is in progress.
- [ChatTool](/docs/components/chat-tool) shows a tool call that collapses, with approve and deny buttons. Its input and output show as coloured JSON, and the input can stream in as partial text.
- [ChainOfThought](/docs/components/chain-of-thought) shows the model's reasoning as a timeline that follows the stream. Steps can carry an icon and a pending, active or done status, for agent traces.
- [ChatSource](/docs/components/chat-source) shows the sources an answer cites, as chips and as a list.
- [ChatAttachment](/docs/components/chat-attachment) previews attached files: images and videos as thumbnails, other files as a card with an icon for their format, the name and the size. While a file uploads, the card shows a spinner and shimmers its name. A group takes `items` that each carry their own status. Its composer helper picks, drops and pastes files.

#### Composer

- [PromptInput](/docs/components/prompt-input) is the message box of a chat. Its textarea grows with the text, and you can pick, drop or paste attachments.
  - The send button follows the request `status` and turns into a stop button while a reply runs.
  - Bind `v-model:queue` to queue the prompts sent in the meantime.
  - It comes in `stacked`, `compact` and `inline` layouts.
  - `PromptInputEditor`, from `@hareui/vue/editor`, replaces the textarea with an editor that supports `@` mentions and `/` commands. Its `submit` event also passes the picked tokens with their ids, and text set through `v-model` keeps its tokens.
- [Markdown](/docs/components/markdown), from `@hareui/vue/markdown`, renders GitHub Flavored Markdown as Vue elements. It needs `marked`, an optional peer dependency.
  - Fenced code shows in a [CodeBlock](/docs/components/code-block).
  - Set `streaming` while `value` grows. Only the block being written re-renders, and syntax still open on the last line shows as if closed.
  - Links and images keep only safe URLs.
  - Use `components` to swap any element for your own component.

#### Layout and feedback

- [Sheet](/docs/components/sheet) is a modal panel that slides in from an edge and moves with native scrolling.
  - It rests at snap points, given in pixels or CSS lengths. Bind `v-model:snap-point` to read or set where it rests.
  - Swipe it, or drag its handle, to close it.
  - The page dims as the sheet rises.
  - Nested sheets stack and push the ones below back.
- [ScrollArea](/docs/components/scroll-area) is a scroll container that renders a list of items. With `virtualize`, it renders only the items in view.
  - It scrolls vertically or horizontally.
  - It can lay items out in masonry lanes.
  - Set `shadow` to fade its edges.
  - Call `scrollToIndex` on its ref to bring an item into view.
- [PressableFeedback](/docs/components/pressable-feedback) adds press feedback to any element. Space and Enter press it like the pointer does, and it respects reduced motion.
  - `ripple`: a ripple from the press point.
  - `highlight`: a highlight on hover and press.
  - `hold`: an overlay that fills while held, then emits `confirm`.
  - `progress`: a sweep after a click.

#### Map

- [Map](/docs/components/map), from `@hareui/vue/map`, draws an interactive map. It needs `maplibre-gl`, an optional peer dependency that loads on mount.
  - Parts go inside the map: markers, popups, routes, arcs, polygons, heatmaps, clustered points and controls.
  - Data in arrays can go straight to `Map` as props instead, such as `markers` for a list of markers.
  - Positions are `{ long, lat }` or `[long, lat]`.
  - Colors take theme names or any CSS color, including `var()`. They follow the color scheme.
  - Markers can be dragged. A marker follows its position as it changes, without being redrawn.
  - Bind `v-model:center` and `v-model:zoom` to follow the camera. The `fitPoints` method frames a list of positions.
  - The `hareui()` Vite plugin serves maplibre-gl's worker. Other bundlers pass `map.workerUrl` to `createHareUI`.

### New features on existing components

#### Tree

- Set `draggable` to move rows by dragging them. The whole row is the drag source, and a copy of it follows the pointer while you drag.
  - With the pointer, drag the row. On touch screens, long-press it first. Resting on a collapsed folder opens it.
  - With the keyboard, Enter picks up the focused row. The arrow keys choose the spot, Right opens a collapsed folder, Enter drops and Escape cancels.
  - Dragging a selected row moves every selected row, and the dragged copy shows how many.
  - A drop emits `move` with the `items`, the `target` item and the `position`. The position is `before`, `after` or `inside` a folder. A drop inside a collapsed folder opens it.
  - `moveTreeItems(items, event)` applies a `move` to your items and returns the new tree.
  - Use `can-drop` to rule spots out.
  - It works with `virtualize`.
  - Escape cancels a pointer drag too.

#### RichTable

- `reorderable` adds a drag handle before each row. Drag it, or focus it and press Enter or Space, to move the row. A copy of the row follows the pointer while you drag.
  - A drop updates `v-model:data`, and emits `reorder` with the moved row ids, the target row and the reordered `data`.
- `reorderable-columns` lets you drag the headers, or pick one up with Enter or Space, to move columns. A copy of the header follows the pointer, and a drop updates `v-model:column-order`.
- The new `column-resize-end` event gives the column widths once a resize ends.
- In a scrolling `primary` table, the rows now keep the card's rounded corners under the sticky header, above the sticky footer and at the bottom of the scroll area.

#### Editor

- [EditorSuggestionMenu](/docs/components/editor-suggestion-menu) opens a `/` command menu. It inserts blocks and runs the toolbar's commands.
  - The text typed after `/` filters it.
  - The arrow keys move through it, and Enter or Tab picks.
  - Items take sections, a `kbd` shortcut, and their own `onSelect` command.
  - It shows a "No results" row or a spinner instead of closing.
- [EditorMentionMenu](/docs/components/editor-mention-menu) inserts mentions, `@` by default, with avatars, initials or icons.
  - It filters a list you give it, or you load the items yourself.
  - Several menus can share an editor, one per trigger character.
  - The new `mention` prop sets up the mention node, which shows as its trigger and label.
- [EditorDragHandle](/docs/components/editor-drag-handle), from `@hareui/vue/editor-drag-handle`, shows a grip next to the hovered block. Drag it to move the block, or click it to select the block.
  - While you drag, the other blocks slide apart to show where the block will land, and the drop puts it right there.
