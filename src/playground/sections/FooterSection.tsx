import * as React from 'react'
import { Footer } from '../../components/layout/Footer/Footer'
import { ComponentHeader, SectionLabel, PreviewFrame } from '../helpers'

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
