import * as React from 'react'
import { FullScreenAlert, Button } from '../../components/ui'
import { ComponentHeader, SectionLabel, Row } from '../helpers'

export function FullScreenAlertSection() {
  const [fsaAlertOpen,   setFsaAlertOpen]   = React.useState(false)
  const [fsaSuccessOpen, setFsaSuccessOpen] = React.useState(false)
  const [fsaLoadingOpen, setFsaLoadingOpen] = React.useState(false)

  return (
    <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
      <ComponentHeader id="fullscreen-alert" title="FullScreenAlert" />

      <SectionLabel>Variants — full viewport takeover</SectionLabel>
      <Row>
        <Button variant="secondary" size="sm" onClick={() => setFsaAlertOpen(true)}>alert</Button>
        <Button variant="secondary" size="sm" onClick={() => setFsaSuccessOpen(true)}>success</Button>
        <Button variant="secondary" size="sm" onClick={() => setFsaLoadingOpen(true)}>loading</Button>
      </Row>

      <FullScreenAlert
        open={fsaAlertOpen}
        onOpenChange={setFsaAlertOpen}
        variant="alert"
        title="Something went wrong"
        description="An error occurred while processing your request. Please check your connection and try again."
        footer={
          <>
            <Button variant="secondary" onClick={() => setFsaAlertOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setFsaAlertOpen(false)}>Retry</Button>
          </>
        }
      />

      <FullScreenAlert
        open={fsaSuccessOpen}
        onOpenChange={setFsaSuccessOpen}
        variant="success"
        title="Report published"
        description="Your Q1 report is now live and has been shared with your team."
        footer={
          <Button variant="primary" onClick={() => setFsaSuccessOpen(false)}>Done</Button>
        }
      />

      <FullScreenAlert
        open={fsaLoadingOpen}
        onOpenChange={setFsaLoadingOpen}
        variant="loading"
        title="Generating your report…"
        description="This may take a few seconds. Please don't close this window."
        footer={
          <Button variant="tertiary" size="sm" onClick={() => setFsaLoadingOpen(false)}>
            Simulate complete
          </Button>
        }
      />
    </section>
  )
}
