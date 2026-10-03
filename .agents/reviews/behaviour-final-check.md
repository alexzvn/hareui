# Final behaviour / state / animation check — complex components

Date: 2026-10-03. Scope: interactive behaviour of HareUI (`packages/vue`) against HeroUI v3 (`@heroui/react@3.2.6`, React Aria): mouse/keyboard paths, focus management, ARIA state, form values, and enter/exit animation timelines. Static styling is out of scope: `parity/compare.ts` already covers it.

## Method

- Harness `parity/.behav-lib.ts` (gitignored scratch). Each scenario loads the same parity case in the playground (`:5173`) and the reference (`:5174`), then drives both with identical real mouse/keyboard input. After every step it diffs the focused element, the Chrome a11y tree, a screenshot (pixelmatch), console warnings/errors, and an optional in-page probe (hidden form values, scroll lock, etc.). On `anim` steps it also diffs per-frame opacity/transform/height/... of every `[data-slot]`, plus mount/unmount times.
- About 810 scenarios across 9 groups: per-group scenario files `parity/.behav-<group>.ts` and extra cases `*_behav_tmp.ts(x)`, all gitignored. Each group triaged every diff as bug / known / noise, checking against `.agents/docs/decisions.md`, `status.md` and the component docs.
- Harness caveat: puppeteer blurs background tabs. Groups without CDP focus emulation (dialogs, floating, colors, toggles, disclosure) can produce fake "focus → body" results. I re-ran these single-page with `Emulation.setFocusEmulationEnabled`: Popover P2, Toast Q1/Q2, Dropdown D1/D2/D4, Tabs H3, ColorSwatchPicker SP2, Checkbox readonly click. Other focus rows from those groups (Dialogs M3/D2, Dropdown D5/D6, ColorPicker P1, Tabs T7, ToggleButtonGroup T3, RadioGroup R5) are as reported and not re-verified. The pilot finding "Select loses focus after mouse pick" came from this artefact and is **not a bug**.
- ✔ = I reproduced it myself after the group report, in a fresh run with a focused page per side.
- Animation timelines: start-time offsets of 30–500 ms between sides come from sampling under load and changed sign across reruns, so they count as noise. Values, durations and removal times were compared.

## Verdict

Not release-ready for interaction parity. 13 high-severity bugs, about 60 medium. Many share a handful of root causes (see [Cross-cutting root causes](#cross-cutting-root-causes)), so fixing ~8 places closes most of them. The multi-select keyboard model (H8 plus the ListBox/TagGroup/Table medium rows) is the biggest functional gap. Enter/exit animations are at parity almost everywhere.

Fully identical groups and components: Accordion, Disclosure, DisclosureGroup, ScrollShadow, Toolbar, ToggleButton, Tooltip (only known/noise), Pagination (one low attribute).

## High severity

| # | Component | Finding | Root cause / fix |
|---|---|---|---|
| H1 ✔ **fixed** | Modal, AlertDialog | After the 3rd open→close cycle, `#app` keeps `aria-hidden="true"` permanently, hiding the whole page from AT. Chrome logs "Blocked aria-hidden…". | `force-mount` on `DialogContent` made Reka's `useHideOthers` call `undo()` both when `present` turned false and in `onUnmounted`, so the counters went negative. Fixed by dropping `force-mount`; the dialog runs the no-op `presence-hold` animation while closed (`styles/keyframes.css`, dialog slot in `modal/theme.ts` and `alert-dialog/theme.ts`), so it still stays mounted through the container's exit. Tests: `modal.spec.ts` and `alert-dialog.spec.ts`, "releases aria-hidden on the page after every open/close cycle…". |
| H2 **fixed** | Modal (nested) | Closing the inner modal un-hides the page behind the still-open outer modal. | Same cause and fix as H1. Test: `modal.spec.ts` "keeps the page hidden while the outer modal is open…". |
| H3 ✔ | Tabs | Arrow-key navigation drops focus to `<body>`: React `Overview → Analytics → Reports → Overview`, Vue `Overview → body → body → body`. After a mouse click focus lands on the tablist, so arrows do nothing. | `tabs/Tabs.vue:127-137` `flatEntries` + template `:249`: the indicator entry is interleaved in the keyed `v-for` after the selected tab, so Vue moves the focused tab node in the DOM and it loses focus. Render the indicator outside the keyed list, or keep its position stable. |
| H4 ✔ | Checkbox (→ Table select-all) | Clicking the glyph of an indeterminate checkbox toggles twice. Standalone select-all: React `mixed → all checked`, Vue `mixed → all unchecked`. In Table, the select-all from a partial selection ends empty. Toggles missed it because they clicked the label text. | `composables/forwardRootClick.ts:15`: `content.contains(target)` is false because the re-render detaches the indeterminate glyph before the root handler (`checkbox/Checkbox.vue:160`) runs, so a second click is forwarded. Use `event.composedPath().includes(content)`. |
| H5 | Table | No roving tabindex: every header, row and checkbox is a tab stop. Tab enters on "Select all", and Space then selects every row. React: one tab stop, first row. | `table/Table.vue` (~386-456) renders `tabindex=0` on every `tr` and header. Implement a grid roving tab stop; checkboxes `tabindex=-1`. |
| H6 ✔ | ComboBox | With a selection, clearing the input and pressing Tab/Enter commits the first option (`animal=aardvark`). React commits empty. | `combo-box/ComboBox.vue:451-455` `onInputTextChange`: `setHighlight(null)` runs before `selection = null`, and the listbox re-highlights its first item. Clear the highlight after the model write. |
| H7 | TagGroup | Removing a tag (button, Delete, Backspace) drops focus to `<body>`. Further Delete/Arrow keys are dead. React focuses the neighbouring tag, or the group. | `tag-group/TagGroup.vue` (~136-220): the focused node unmounts and nothing restores focus. Focus the next/previous key after `nextTick`. |
| H8 | ListBox | No range selection in `multiple` mode: Shift+Arrow/Home/End/Space and Shift+click only move focus or toggle. | `list-box/ListBox.vue`: Reka `ListboxRoot` has no anchor/range logic. Add anchor + contiguous range, as in RAC `useSelectableCollection`. Same gap in TagGroup and Table (M-COL). |
| H9 | Popover | Vue's popover is non-modal and RAC's is modal. An outside click reaches the element underneath, the page stays scrollable, and a controlled toggle re-opens. Not documented as a deviation. | `popover/Popover.vue:128` `modal=false`. Use a modal Reka popover, or underlay + scroll lock. |
| H10 | ColorArea, ColorPicker | With a hex/rgb value and `colorSpace="hsb"`, the thumb position and valuetext use HSL saturation (Vue 89 %, React 74 % for `#F43F5E`). After a swatch click the ColorPicker shows the wrong thumb. | Reka `color/channel.js:58-61`: `getChannelValue('saturation')` falls back to HSL for non-hsl/hsb colours. Pass a model already converted with `toSpace(…, space)` in `color-area/ColorArea.vue:193`. |
| H11 | ColorField | ~~Required + empty never blocks submit; empty submits `#000000`~~: **known**, decision #16 option A (Reka always holds a colour; the form value stays `#000000`). Remaining, medium: the submitted hex is lowercase (`#0485f7` vs HeroUI `#0485F7`). | Reka's hidden input (`ColorFieldRoot.vue:313-320`) carries the value; format it as HeroUI does. |
| H12 ✔ | NumberField | An optional field can't be emptied: the visible input clears, but the committed/form value stays (`qty=5`). React commits `qty=`. ArrowUp then starts from the stale value. | `number-field/NumberField.vue` ~146-205: Reka `applyInputValue` maps empty back to the model, and the wrapper never emits `undefined`. |
| H13 | SearchField | When `readonly`, Escape clears the value (emitting change+clear) and Enter emits `submit`. RAC ignores both. | `search-field/SearchField.vue` keydown handler (~112-175) has no `readonly`/`disabled` guard. |
| H14 | InputGroup | Clicking, or pressing Enter/Space on, a suffix button moves focus to the input. Space then types into it. | `input-group/InputGroup.vue:163-167` `onClick` focuses the input for every click. Skip when the target is inside an interactive child. |

## Cross-cutting root causes

| Root cause | Affected findings | Fix point |
|---|---|---|
| Reka non-modal popover only refocuses the trigger when there was no outside interaction (`PopoverContentNonModal.js:122-128`) | Select S1, Popover P2 ✔, ColorPicker P1, DatePicker P2: outside click leaves focus on `body`, so the next Tab restarts from the page top | `@close-auto-focus` → `preventDefault()` + focus the trigger, in the shared popover wrapper |
| Missing paging/boundary keys | Calendar/RangeCalendar Home/End/PageUp/PageDown/Shift+Page; DateField/TimeField segment Home/End/Page; Dropdown PageUp/Down; Select PageUp/Down (Combo/Autocomplete already implement them, `ComboBox.vue:422`) | Per-component keydown, reusing the Combo/Autocomplete helper |
| Reka RovingFocus handles keys that RAC ignores (`reka-ui/dist/RovingFocus/utils.js:14-17`) | Tabs PageUp/Down (T6), RadioGroup Home/End/PageUp moving focus without selecting (R2), ToggleButtonGroup Home/End (T2); ListBox PageUp/PageDown swapped (L4) | Swallow those keys on the roving container |
| Roving container `tabindex=-1` takes focus when a disabled item is pressed | Select S12, ListBox L7, Dropdown D6, Tabs T7 (next Tab skips the tabs), ToggleButtonGroup T3, RadioGroup R5, TagGroup T4 (→ body) | `pointerdown.prevent` on disabled items |
| A focused node is unmounted or moved with no focus restore | Tabs H3, TagGroup H7, Toast Q2 ✔ (keyboard-dismissed toast → `body`; React moves focus to the next toast) | Restore focus to a neighbour |
| Selection on `click`, not press-start / pointer-up | Select S7 (press-drag-release impossible), ComboBox C6, Autocomplete A1, ListBox L8 | Open on mouse `pointerdown`, select on `pointerup` |
| Reka `preventDefault`s Enter on form controls, so no implicit submit | Checkbox C3, RadioGroup R4, Switch S2, ColorField F3 | Let Enter bubble to `form.requestSubmit()` |
| Multi-select keyboard model missing (anchor, Shift-range, Meta/Ctrl+A keeping focus, Escape clears) | ListBox L1-L3, TagGroup T2/T3, Table B3/B4 | Shared selection-manager composable |

## Medium severity by component

**Overlays**
- Popover: P2 ✔ outside-click focus (above). P3: the trigger doesn't keep `data-pressed`/scale .97 while open (`Popover.vue:129`).
- Dropdown ✔: D1, no wrap at the ends (React New→Delete→New, Vue stops); missing `:loop` (~`Dropdown.vue:322`). D2, ArrowUp on the trigger doesn't open on the last item (`onTriggerKeydownCapture` ~273-300). D3, PageUp/PageDown ignored. D4, Escape in a submenu closes the whole menu (React closes only the submenu).
- Toast: Q1 ✔, F6 doesn't reach the toast region although the docs promise it, so timers keep running. Q2 ✔, keyboard dismiss → `body` (`toast-provider/ToastItem.vue:160`).
- Select: S1 outside-click focus. S2, ArrowUp-open focuses the first item, not the last (`Select.vue:273-276`, `:303-309`). S3, hover doesn't move keyboard focus (pass `highlight-on-hover`). S4, PageUp/PageDown. S5, typeahead broken for 1 s after an arrow key (Reka `useTypeahead` appends `ArrowDown` to the buffer). S6, Space inside a typeahead string selects and closes. S7, press-drag-release.
- ComboBox: C2, on commit the list collapses to 1 option / 48 px in the first exit frame; React keeps 5 options / 208 px until the fade ends (`ComboBox.vue:272-279`: `matches` reads the live input value).

**Collections**
- ListBox: L2, Meta/Ctrl+A moves focus to the last item. L3, Escape doesn't clear the selection. L4, PageUp/PageDown swapped. L5, in `none` mode the keyboard cursor stays on the stale hover item after a click.
- TagGroup: T2, no range/select-all/Escape. T3, Ctrl+Arrow / Ctrl+Space semantics differ.
- Table: B3, no range selection or Meta+A. B4, Escape doesn't clear.

**Dates**
- Calendar: C1, Home/End/Page keys are no-ops. C2, clicking or pressing Enter on the selected date deselects it (pass `prevent-deselect`). C3, clicking an outside-month day navigates and selects (React ignores it).
- RangeCalendar: R1/R2, no live range preview (mouse or keyboard), and the committed keyboard range ends one day apart. R8/R9, press-drag selection and drag-adjust don't work. R10, `allow-non-contiguous-ranges` marks unavailable days inside the range as selected.
- DateField/TimeField: F1, the 12-hour hour crosses AM/PM on Arrow, so the stored value differs (`00:30` vs `12:30`). F2, segment Home/End/Page missing. F5, forced `isInvalid` doesn't reach segment `aria-invalid`.
- DatePicker: P1, Alt+ArrowDown decrements the month instead of opening. P2, outside-click focus. P3, clicking the selected date doesn't close. P4, Escape in the year picker leaves the popover open.
- DateRangePicker: D1, opens on the placeholder day instead of the selected range. D5, typing a 4-digit end year moves focus to the trigger and Enter no longer opens. D6, a reversed range turns invalid on segment edit (React waits for blur).
- Year picker Y1: React lands on Dec 31 of the chosen year, Vue keeps month/day (`calendar/Calendar.vue:211` `onSelectYear`). HeroUI behaviour comes from `visibleYears` = min..max; matching it is optional.

**Colors**
- ColorField: F4, invalid text (`zzz`, 8-digit hex) isn't reverted on commit. F5, hex PageUp steps 10 (React 1). F6, hue channel clamps 360 → 0, and the `°`/`%` units are missing.
- ColorSlider: S1, alpha `aria-valuenow` is 50 (React 0.5). S2, `name` produces no form value.
- ColorSwatchPicker: SP6, `layout="stack"` ignores ArrowLeft/Right, and PageUp/Down differ. SP2/A2: an outside colour change (hex commit matching a swatch) moves DOM focus onto the swatch. The group saw this on the hex-commit path; my area-keyboard repro was identical, so treat it as path-specific.
- ColorPicker: P1, outside-click focus.

**Inputs**
- NumberField: PageUp/PageDown move 10× step (RAC 1×).
- Slider: the thumb has no accessible name. Range thumbs cross each other (RAC clamps at the neighbour). PageUp/Down 10× step. Vertical track click gives a different value (cause inferred).
- InputOTP (`input-otp/InputOtp.vue` ~150-272, one selection-model difference): typing on a full field doesn't replace the last slot, typing after Arrow/Home inserts or deletes at the wrong slot, and paste into a full field overwrites the wrong slots.

**Disclosure / nav**
- Tabs: T2, the panel is always a tab stop (RAC only when it has no tabbable child). T3, with the first tab disabled and no default, Vue selects the disabled tab and nothing is focusable.

## Low severity (abridged)

- Dialogs: a scrollable `modal-body`/`drawer-body` is an extra tab stop (M3/D2).
- Popover: dialog named by trigger ("Open") instead of heading, heading `h3` vs `h2`.
- Dropdown: long-press open focuses the menu, not the first item. Submenu pointer grace differs. The parent keeps `data-highlighted`.
- Toast: region named "Notifications" (React "N notifications.").
- Select: closed typeahead cycles on a repeated char; Shift+letter typeahead ignored; no page scroll lock; mouse open focuses an option instead of the listbox; `aria-invalid` on the trigger.
- ComboBox: caret stays select-all after Escape; focus ring after bare modifier keys; highlight kept after pointer pick; required `*` in the accessible name.
- Autocomplete: drag-release; `aria-activedescendant` on keyboard open (arguably better).
- ListBox: Space fires `onAction` in `none` mode; macOS Ctrl+click.
- TagGroup: grid/rows unlabeled; tag name includes "Remove tag".
- Table: row vs cell focus; disabled row focusable; PageUp/Down; sort indicator removed at 20 ms vs 115 ms.
- Calendar: nav buttons keep day 1 vs day-of-month; labels "Previous page" vs "Previous", year trigger name.
- DateField: valuetext not zero-padded; 12-hour `aria-valuenow` in 24-hour form; `0`,`4` into a filled year gives `14`.
- DatePicker: trigger has no name (React "Calendar").
- RangeCalendar: no `data-invalid` on cells for an unavailable end.
- NumberField: press scale sticks when disabled mid-hold; stepper labels/inputmode/`aria-readonly`; hidden input updates on commit only.
- Slider: no `aria-valuetext`.
- SearchField: clear label "Clear search" vs "Close".
- TextField: `update:modelValue` fires on mount with `defaultValue`.
- InputGroup: root role; prefix click in textarea mode.
- Checkbox/Switch: clicking a readonly control focuses it ✔ (React keeps focus where it was); no keyboard-held pressed visual.
- CheckboxGroup/RadioGroup: group `disabled` not exposed as `aria-disabled`.
- ToggleButtonGroup: Tab enters the selected item, not the first.
- ButtonGroup: `aria-disabled` on the group leaks to enabled children.
- Pagination: links lack `data-disabled`.
- Tabs: no way to label the tablist; vertical tabs ignore Left/Right; PageUp/Down move.

## Animations

Identical values, durations and unmount timing within jitter:
- **Overlays:** Modal and AlertDialog (backdrop ~250 ms, container ~230 ms in, ~100 ms out; content stays mounted through exit as in `ebcc20f`), Drawer slide in/out in all four placements, snap-back, and dismiss threshold/velocity.
- **Floating:** Popover (scale .9→1 + fade 150 ms in, .95 + fade 100 ms out), Tooltip per placement, Dropdown and submenus, Toast enter/exit and timeout/pause timing.
- **Selection:** Select, ComboBox and Autocomplete popovers.
- **Disclosure / nav:** Accordion/Disclosure height and indicator rotation, Tabs indicator geometry.
- **Toggles:** Switch thumb, Checkbox mark, Radio indicator.
- **Inputs:** Slider fill, NumberField press, SearchField clear button.
- **Dates and colors:** ColorPicker popover (fades ~100–115 ms and removal within jitter, measured), Calendar month change and year-picker panel (no element left behind). DatePicker/DateRangePicker popovers were compared on removal timing and start/end values only, not full translate/scale curves. After an outside click, Vue's fade looked like it stopped early in one sample (unconfirmed).

Differences:
- ComboBox C2 (medium): list collapses at the start of the exit.
- Popover P3 (medium): the trigger has no pressed scale while open.
- Table sort indicator (low): old indicator removed at 20 ms vs 115 ms.
- Drawer drag-dismiss (low, Vue better): React jumps off-screen in one frame because HeroUI leaves `transition:none` set; Vue keeps sliding.
- Date popovers on Escape (low, React quirk): React closes with no exit animation, Vue fades out.

## Known / noise (not bugs)

**Known deviations**
- Modal `dismissible=false` also blocks Escape (`modal.md:156`).
- Select and Autocomplete clear on Backspace/Delete (`select.md:132`, `autocomplete.md:243`); Autocomplete `search=false`.
- Tooltip warm-up per instance (decision #6).
- Toast stack geometry (#7).
- Calendar week/day views (#11) and unavailable-range rules (#12).
- Colour names, thumb structure and empty value (#16-#20).
- Extra `role=alert` on field errors.

**Noise**
- Hidden RAC DismissButtons and aria-hidden-outside.
- `data-hovered`/`data-pressed`-only frames.
- Id formats; overscan rows in the virtualized Autocomplete.
- Sampler start offsets; en-dash vs hyphen in valuetext.
- The "Blocked aria-hidden" warning, logged on both sides.

**Reference crash (not ours)**
- The React ComboBox sections+separator case crashes while typing (`childNodes is not supported`).

## Not covered

- Dark theme interactions, RTL/locales, non-Gregorian calendars.
- Touch/pen pointers; IME composition; `prefers-reduced-motion`.
- Async loading (`loading`/`load-more`), form `reset`, controlled date values, multi-month calendars.
- Scrollbar-width compensation under classic scrollbars (one probe only).
- Root causes still inferred: Slider vertical track click, DateRangePicker D5, RangeCalendar keyboard one-day offset.

## Reproducing

Servers: `bun run dev` (`:5173`) and `bun run reference` (`:5174`). Then:

```sh
bun parity/.behav-<group>.ts [--only <scenario>] [--keep]
# group ∈ dialogs, floating, selection, tablelist, dates, colors, inputs, toggles, disclosure
```

Groups that ran with focus emulation import their own `parity/.behav-lib-<group>.ts`. PNG evidence is in `parity/out/behav/<group>/`. All scratch files are gitignored: `parity/.behav*`, `*_behav_tmp.ts(x)` and `parity/out/`. Delete them once the fixes are verified.
