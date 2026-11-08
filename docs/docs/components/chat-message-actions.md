---
title: Chat Message Actions
description: A row of icon buttons under a chat message, such as copy, like, dislike and regenerate.
links:
  source: chat-message-actions/ChatMessageActions.vue
  styles: chat-message-actions/theme.ts
---

## Usage

Pass the buttons to the `actions` prop. Give a button a `kind` to get a built-in icon and label:

- `copy`
- `like` and `dislike`
- `regenerate`
- `edit`
- `share`
- `more`

Each button shows its label in a tooltip and uses it as its accessible name. The demos put the row in the `#actions` slot of a [ChatMessage](/docs/components/chat-message), under the text it acts on.

```ts
import { ChatMessageActions } from '@hareui/vue'
```

<ComponentPreview name="chat-message-actions/basic" />

## Anatomy

```vue
<ChatMessageActions v-model:feedback="feedback" :actions="actions" :message="message">
  <template #default />  <!-- optional: content after the buttons -->
</ChatMessageActions>
```

The root is a `group` named "Message actions" by default. Change the name with `aria-label`. [ChatMessage](/docs/components/chat-message) renders this component for its `actions` prop.

### Copy

A `copy` button copies the text parts of `message` to the clipboard, joined by blank lines. Pass `text` to copy something else.

After a successful copy, the button shows a check and the label "Copied" for two seconds. Screen readers announce "Copied", and the component emits `copy` with the text. If the clipboard is unavailable or refuses the write, nothing changes.

### Feedback

Bind `v-model:feedback` to keep the rating of a message. Pressing `like` or `dislike` sets it to that kind, and pressing the same button again sets it back to `null`.

The rating drives the pressed state of both buttons, and a pressed one shows a filled icon. Set `pressed` on an action to control it yourself.

<ComponentPreview name="chat-message-actions/feedback" />

### Custom actions

Leave out `kind` and give a `label` and an `icon` for an action of your own. You can also override the label or icon of a built-in action. Set `pressed` to make any button a toggle with `aria-pressed`.

An action also takes Button props such as `variant`, `pending`, `disabled` or `to`. Its `class` styles the button, for example to tint it when pressed.

Give an action `items` to open a [Dropdown](/docs/components/dropdown) menu from it, as the `more` button does here. A menu button has no tooltip.

The default slot adds content after the buttons, such as a status line.

<ComponentPreview name="chat-message-actions/custom" />

### User message actions

Under a user message, `edit` and `copy` are the usual pair. The row follows the message to the end side.

<ComponentPreview name="chat-message-actions/user-message" />

### Events

Every click calls the action's `onClick` with the event and `message`. Then the component emits `action` with the action and the event. A `copy` button also emits `copy` once the text is on the clipboard.

<ComponentPreview name="chat-message-actions/events" />

## API

### ChatMessageActions props

<ApiTable component="ChatMessageActions" kind="props" />

### ChatMessageActions slots

<ApiTable component="ChatMessageActions" kind="slots" />

### ChatMessageActions emits

<ApiTable component="ChatMessageActions" kind="emits" />

### ChatMessageAction

Other [Button](/docs/components/button) props, such as `variant`, `pending` and `to`, pass through to the button.

| Field      | Type                                                                           | Description                                                                                         |
| ---------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `kind`     | `'copy' \| 'like' \| 'dislike' \| 'regenerate' \| 'edit' \| 'share' \| 'more'` | A built-in action. Its icon and label become the defaults. `copy` also copies the message text.     |
| `label`    | `string`                                                                       | The accessible name and tooltip text. Defaults to the label of `kind`.                              |
| `icon`     | `IconValue`                                                                    | The icon, in place of the icon of `kind`.                                                           |
| `pressed`  | `boolean`                                                                      | Marks a toggle button as pressed. `like` and `dislike` follow `v-model:feedback` unless you set it. |
| `items`    | `DropdownEntry[]`                                                              | Opens a menu of these entries from the button. The button then has no tooltip.                      |
| `disabled` | `boolean`                                                                      | Disables the button.                                                                                |
| `onClick`  | `(event: MouseEvent, message?: ChatMessageData) => void`                       | Called on click with the message the actions belong to.                                             |
| `class`    | `ClassValue`                                                                   | Classes of the button.                                                                              |

## Theme

<ApiTheme component="ChatMessageActions" />
