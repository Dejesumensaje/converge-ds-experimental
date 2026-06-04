import * as React from 'react'
import { Header } from '../../components/layout/Header/Header'
import { ComponentHeader, SectionLabel, PreviewFrame } from '../helpers'

export function HeaderSection() {
  return (
    <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
      <ComponentHeader id="header" title="Header" />
      <SectionLabel>Full component — logo · product name · divider · Bell · Avatar · Account dropdown</SectionLabel>
      <PreviewFrame height={64} contained>
        <Header productName="Converge Platform" />
      </PreviewFrame>
      <p style={{ marginTop: 8, fontSize: 12, color: 'var(--muted-foreground)' }}>
        Avatar opens the account dropdown with profile, help center, preferences, and log out.
      </p>
    </section>
  )
}
