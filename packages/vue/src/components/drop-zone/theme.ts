// One theme for DropZone, DropZoneFileList and DropZoneFileItem: a DropZone's `ui` also styles the file parts inside it.
export default {
  slots: {
    base: 'flex flex-col gap-3',
    area: [
      'flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border-secondary px-6 py-8 text-center outline-none forced-color-adjust-none',
      'transition-[background-color,border-color] duration-150 motion-reduce:transition-none',
      'data-[drop-target=true]:border-accent data-[drop-target=true]:bg-accent-soft',
      'data-[focus-visible=true]:status-focused',
      'data-[disabled=true]:status-disabled',
    ],
    // Visually hidden button that makes the area focusable: Enter / Space open the picker, paste adds files
    focusTarget: 'sr-only',
    // `:where()` keeps the default icon size at zero specificity, so a size utility on your own icon wins
    icon: 'flex items-center justify-center text-muted [:where(&_svg)]:size-8',
    label: 'text-sm font-medium text-foreground',
    description: 'text-xs text-muted',
    // Rendered with the outline Button underneath
    trigger: 'mt-1',
    input: 'sr-only',
    // `empty:hidden` keeps an empty list out of the root's gap; `relative` anchors leaving items
    fileList: 'relative flex flex-col gap-2 empty:hidden',
    fileItem: [
      'relative flex items-start gap-3 rounded-2xl border border-border p-3',
      'transition-[border-color] duration-150 motion-reduce:transition-none',
      'data-[status=failed]:border-danger/30',
    ],
    fileFormatIcon: 'relative h-10 w-8 shrink-0',
    fileFormatIconBadge: [
      'absolute bottom-1 left-0 flex h-3.5 max-w-8 items-center overflow-hidden rounded-[0.25rem] px-[3px] py-0.5 text-[8px] leading-none font-bold whitespace-nowrap text-white uppercase',
      'data-[color=gray]:bg-gray-500 data-[color=red]:bg-red-500 data-[color=green]:bg-green-500 data-[color=blue]:bg-blue-500 data-[color=orange]:bg-orange-500 data-[color=purple]:bg-purple-500',
    ],
    fileInfo: 'flex min-w-0 flex-1 flex-col gap-0.5',
    fileName: 'truncate text-sm font-medium text-foreground',
    fileMeta: 'flex items-center gap-1 text-xs text-muted',
    // Rendered with the ProgressBar (`size="sm"`) underneath
    fileProgress: 'mt-1 w-full',
    fileRetryTrigger: [
      'mt-0.5 w-fit bg-transparent p-0 text-xs font-medium text-danger outline-none no-highlight cursor-(--cursor-interactive)',
      'hover:underline focus-visible:status-focused disabled:status-disabled',
    ],
    fileRemoveTrigger: [
      'flex shrink-0 items-center justify-center rounded-md p-1 text-muted outline-none no-highlight cursor-(--cursor-interactive)',
      'transition-[color] duration-150 motion-reduce:transition-none',
      'hover:text-foreground active:text-foreground focus-visible:status-focused disabled:status-disabled',
      '[:where(&_svg)]:size-4',
    ],
  },
}
