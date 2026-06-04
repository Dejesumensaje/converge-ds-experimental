import * as React from 'react'
import { useState } from 'react'
import { Checkbox } from '../../components/ui'
import { ComponentHeader, SectionLabel, Row } from '../helpers'

export function CheckboxSection() {
  /* --- md states --- */
  const [mdUnchecked, setMdUnchecked]         = useState<boolean | 'indeterminate'>(false)
  const [mdChecked, setMdChecked]             = useState<boolean | 'indeterminate'>(true)
  const [mdIndet]                             = useState<boolean | 'indeterminate'>('indeterminate')
  const [mdDisUnchecked]                      = useState<boolean | 'indeterminate'>(false)
  const [mdDisChecked]                        = useState<boolean | 'indeterminate'>(true)

  /* --- sm states --- */
  const [smUnchecked, setSmUnchecked]         = useState<boolean | 'indeterminate'>(false)
  const [smChecked, setSmChecked]             = useState<boolean | 'indeterminate'>(true)
  const [smIndet]                             = useState<boolean | 'indeterminate'>('indeterminate')
  const [smDisUnchecked]                      = useState<boolean | 'indeterminate'>(false)
  const [smDisChecked]                        = useState<boolean | 'indeterminate'>(true)

  /* --- error state --- */
  const [errChecked, setErrChecked]           = useState<boolean | 'indeterminate'>(false)
  const [errMsgChecked, setErrMsgChecked]     = useState<boolean | 'indeterminate'>(false)

  return (
    <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
      <ComponentHeader id="checkbox" title="Checkbox" />

      {/* ── Medium ───────────────────────────────────────────────── */}
      <SectionLabel>Medium — all states</SectionLabel>
      <Row>
        <Checkbox
          size="md"
          checked={mdUnchecked}
          onCheckedChange={setMdUnchecked}
          label="Unchecked"
        />
        <Checkbox
          size="md"
          checked={mdChecked}
          onCheckedChange={setMdChecked}
          label="Checked"
        />
        <Checkbox
          size="md"
          checked={mdIndet}
          label="Indeterminate"
        />
        <Checkbox
          size="md"
          checked={mdDisUnchecked}
          disabled
          label="Disabled unchecked"
        />
        <Checkbox
          size="md"
          checked={mdDisChecked}
          disabled
          label="Disabled checked"
        />
      </Row>

      {/* ── Small ────────────────────────────────────────────────── */}
      <div style={{ marginTop: 32 }}>
        <SectionLabel>Small — all states</SectionLabel>
        <Row>
          <Checkbox
            size="sm"
            checked={smUnchecked}
            onCheckedChange={setSmUnchecked}
            label="Unchecked"
          />
          <Checkbox
            size="sm"
            checked={smChecked}
            onCheckedChange={setSmChecked}
            label="Checked"
          />
          <Checkbox
            size="sm"
            checked={smIndet}
            label="Indeterminate"
          />
          <Checkbox
            size="sm"
            checked={smDisUnchecked}
            disabled
            label="Disabled unchecked"
          />
          <Checkbox
            size="sm"
            checked={smDisChecked}
            disabled
            label="Disabled checked"
          />
        </Row>
      </div>

      {/* ── Error states ─────────────────────────────────────────── */}
      <div style={{ marginTop: 32 }}>
        <SectionLabel>Error states</SectionLabel>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-xl)', flexWrap: 'wrap' }}>
          <Checkbox
            size="md"
            checked={errChecked}
            onCheckedChange={setErrChecked}
            invalid
            label="Invalid (no message)"
            helperText="Required field"
          />
          <Checkbox
            size="md"
            checked={errMsgChecked}
            onCheckedChange={setErrMsgChecked}
            errorMessage="You must accept to continue"
            label="Invalid with error message"
          />
        </div>
      </div>

      {/* ── Helper text ──────────────────────────────────────────── */}
      <div style={{ marginTop: 32 }}>
        <SectionLabel>With helper text</SectionLabel>
        <Checkbox
          size="md"
          defaultChecked={false}
          label="Subscribe to newsletter"
          helperText="We'll send you updates once a month."
        />
      </div>
    </section>
  )
}
