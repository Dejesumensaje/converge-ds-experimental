import * as React from 'react'
import { AlertModal, Button } from '../../components/ui'
import { ComponentHeader, SectionLabel, Row } from '../helpers'

export function AlertModalSection() {
  const [alertOpen,   setAlertOpen]   = React.useState(false)
  const [successOpen, setSuccessOpen] = React.useState(false)
  const [loadingOpen, setLoadingOpen] = React.useState(false)

  return (
    <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
      <ComponentHeader id="alert-modal" title="AlertModal" />

      <SectionLabel>Variants</SectionLabel>
      <Row>
        <Button variant="secondary" size="sm" onClick={() => setAlertOpen(true)}>alert</Button>
        <Button variant="secondary" size="sm" onClick={() => setSuccessOpen(true)}>success</Button>
        <Button variant="secondary" size="sm" onClick={() => setLoadingOpen(true)}>loading</Button>
      </Row>

      <AlertModal
        open={alertOpen}
        onOpenChange={setAlertOpen}
        variant="alert"
        headline="You have unsaved changes"
        description="Leaving now will discard all edits. This cannot be undone."
        footer={
          <>
            <Button variant="secondary" onClick={() => setAlertOpen(false)}>Keep editing</Button>
            <Button variant="primary" error onClick={() => setAlertOpen(false)}>Discard changes</Button>
          </>
        }
      />

      <AlertModal
        open={successOpen}
        onOpenChange={setSuccessOpen}
        variant="success"
        headline="Report published"
        description="Your Q1 report is now live and shared with your team."
        footer={
          <Button variant="primary" onClick={() => setSuccessOpen(false)}>Done</Button>
        }
      />

      <AlertModal
        open={loadingOpen}
        onOpenChange={setLoadingOpen}
        variant="loading"
        headline="Generating your report…"
        description="This may take a few seconds. Please don't close this window."
        footer={
          <Button variant="tertiary" size="sm" onClick={() => setLoadingOpen(false)}>
            Simulate complete
          </Button>
        }
      />
    </section>
  )
}
