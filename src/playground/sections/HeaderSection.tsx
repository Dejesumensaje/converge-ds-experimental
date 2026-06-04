import * as React from 'react'
import { Header } from '../../components/layout/Header/Header'
import { ComponentHeader, SectionLabel } from '../helpers'

function PreviewFrame({ children, height = 340 }: { children: React.ReactNode; height?: number }) {
  return (
    <div
      style={{
        position: 'relative',
        height,
        border: '1px solid var(--border)',
        borderRadius: 12,
        overflow: 'hidden',
        background: 'var(--neutral-gray-background)',
        transform: 'translateZ(0)',
      }}
    >
      {children}
    </div>
  )
}

export function HeaderSection() {
  return (
    <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
      <ComponentHeader id="header" title="Header" />
      <SectionLabel>Full component — logo · product name · divider · Bell · Avatar · Account dropdown</SectionLabel>
      <PreviewFrame height={64}>
        <Header productName="Converge Platform" />
      </PreviewFrame>
      <p style={{ marginTop: 8, fontSize: 12, color: 'var(--muted-foreground)' }}>
        Avatar opens the account dropdown with profile, help center, preferences, and log out.
      </p>
    </section>
  )
}
