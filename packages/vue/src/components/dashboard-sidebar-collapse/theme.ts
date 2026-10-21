// Dashboard sidebar collapse: the desktop trigger is hidden below `md`, where the sidebar is a sheet.
// Its `sm` size is the sidebar trigger (a 32px round ghost icon button on desktop). Inside a collapsed sidebar it
// centres itself on the 48px rail (`mx-auto`), in line with the rail's centred 36px menu rows.
export default {
  slots: {
    base: 'hidden shrink-0 md:flex group-data-[collapsed=true]/sidebar:mx-auto',
  },
  variants: {
    side: {
      left: { base: '' },
      right: { base: '' },
    },
  },
}
