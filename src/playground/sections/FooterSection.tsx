import * as React from 'react'
import { Footer } from '../../components/layout/Footer/Footer'
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
      }}
    >
      {children}
    </div>
  )
}

export function FooterSection() {
  return (
    <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
      <ComponentHeader id="footer" title="Footer" />
      <SectionLabel>Preview</SectionLabel>
      <PreviewFrame height={64}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <Footer />
        </div>
      </PreviewFrame>
    </section>
  )
}
