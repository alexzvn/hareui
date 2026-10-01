import type { ReactElement } from 'react'
import { Button, Modal } from '@heroui/react'
import { gear } from '../icons'

export const cases: Record<string, () => ReactElement> = {}

function Footer() {
  return (
    <>
      <Button variant="ghost">Cancel</Button>
      <Button>Confirm</Button>
    </>
  )
}

function Body() {
  return <p>This is the modal body content.</p>
}

function LongBody() {
  return (
    <>
      {Array.from({ length: 12 }, (_, i) => (
        <p key={i}>{`Paragraph ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`}</p>
      ))}
    </>
  )
}

for (const size of ['xs', 'sm', 'md', 'lg', 'cover', 'full'] as const) {
  cases[`modal-size-${size}`] = () => (
    <Modal defaultOpen>
      <Modal.Backdrop>
        <Modal.Container size={size}>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>Modal Title</Modal.Heading>
            </Modal.Header>
            <Modal.Body><Body /></Modal.Body>
            <Modal.Footer><Footer /></Modal.Footer>
            <Modal.CloseTrigger />
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}

for (const variant of ['opaque', 'blur', 'transparent'] as const) {
  cases[`modal-variant-${variant}`] = () => (
    <Modal defaultOpen>
      <Modal.Backdrop variant={variant}>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>Modal Title</Modal.Heading>
            </Modal.Header>
            <Modal.Body><Body /></Modal.Body>
            <Modal.Footer><Footer /></Modal.Footer>
            <Modal.CloseTrigger />
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}

for (const placement of ['auto', 'top', 'center', 'bottom'] as const) {
  cases[`modal-placement-${placement}`] = () => (
    <Modal defaultOpen>
      <Modal.Backdrop>
        <Modal.Container placement={placement}>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>Modal Title</Modal.Heading>
            </Modal.Header>
            <Modal.Body><Body /></Modal.Body>
            <Modal.Footer><Footer /></Modal.Footer>
            <Modal.CloseTrigger />
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}

for (const scroll of ['inside', 'outside'] as const) {
  cases[`modal-scroll-${scroll}`] = () => (
    <Modal defaultOpen>
      <Modal.Backdrop>
        <Modal.Container scroll={scroll}>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>Modal Title</Modal.Heading>
            </Modal.Header>
            <Modal.Body><LongBody /></Modal.Body>
            <Modal.Footer><Footer /></Modal.Footer>
            <Modal.CloseTrigger />
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}

cases['modal-full'] = () => (
  <Modal defaultOpen>
    <Modal.Backdrop>
      <Modal.Container>
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Icon>{gear()}</Modal.Icon>
            <Modal.Heading>Delete item</Modal.Heading>
          </Modal.Header>
          <Modal.Body><p>This action cannot be undone. This will permanently delete the item.</p></Modal.Body>
          <Modal.Footer><Footer /></Modal.Footer>
          <Modal.CloseTrigger />
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  </Modal>
)
