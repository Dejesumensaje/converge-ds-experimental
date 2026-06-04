import * as React from 'react'
import { useState } from 'react'
import { Checkbox } from '../../components/ui'
import { ComponentHeader, SectionLabel, Row } from '../helpers'

export function CheckboxSection() {
  /* --- md states --- */
  const [mdUnchecked, setMdUnchecked]         = useState<boolean | 'indeterminate'>(false)
  const [mdChecked, setMdChecked]             = useState<boolean | 'indeterminate'>(true)
  const [mdIndet, setMdIndet]                 = useState<boolean | 'indeterminate'>('indeterminate')

  /* --- sm states --- */
  const [smUnchecked, setSmUnchecked]         = useState<boolean | 'indeterminate'>(false)
  const [smChecked, setSmChecked]             = useState<boolean | 'indeterminate'>(true)
  const [smIndet, setSmIndet]                 = useState<boolean | 'indeterminate'>('indeterminate')

  /* --- error states --- */
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
          onCheckedChange={() => setMdIndet('indeterminate')}
          label="Indeterminate"
        />
        <Checkbox
          size="md"
          defaultChecked={false}
          disabled
          label="Disabled unchecked"
        />
        <Checkbox
          size="md"
          defaultChecked={true}
          disabled
          label="Disabled checked"
        />
      </Row>

      {/* ── Small ────────────────────────────────────────────────── */}
      <div style={{ marginTop: 'var(--spacing-xxl)' }}>
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
            onCheckedChange={() => setSmIndet('indeterminate')}
            label="Indeterminate"
          />
          <Checkbox
            size="sm"
            defaultChecked={false}
            disabled
            label="Disabled unchecked"
          />
          <Checkbox
            size="sm"
            defaultChecked={true}
            disabled
            label="Disabled checked"
          />
        </Row>
      </div>

      {/* ── Error states ─────────────────────────────────────────── */}
      <div style={{ marginTop: 'var(--spacing-xxl)' }}>
        <SectionLabel>Error states</SectionLabel>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-xl)', flexWrap: 'wrap' }}>
          <Checkbox
            size="md"
            checked={errChecked}
            onCheckedChange={setErrChecked}
            error
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
      <div style={{ marginTop: 'var(--spacing-xxl)' }}>
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
