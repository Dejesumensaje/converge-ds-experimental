import * as React from 'react'
import { useState } from 'react'
import { RadioGroup, RadioGroupItem } from '../../components/ui'
import { ComponentHeader, SectionLabel } from '../helpers'

export function RadioSection() {
  /* --- md groups — each independent --- */
  const [mdBasic,    setMdBasic]    = useState('overview')
  const [mdDesc,     setMdDesc]     = useState('monthly')
  const [mdHoriz,    setMdHoriz]    = useState('all')
  const [mdDisabled, setMdDisabled] = useState('active')

  /* --- sm group --- */
  const [smBasic, setSmBasic] = useState('overview')

  /* --- error group --- */
  const [errVal, setErrVal] = useState('')

  return (
    <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
      <ComponentHeader id="radio" title="RadioGroup" />

      {/* ── Medium — basic ───────────────────────────────────────── */}
      <SectionLabel>Medium — basic</SectionLabel>
      <RadioGroup value={mdBasic} onValueChange={setMdBasic} size="md">
        <RadioGroupItem value="overview"  label="Overview" />
        <RadioGroupItem value="forecast"  label="Forecast" />
        <RadioGroupItem value="analytics" label="Analytics" />
      </RadioGroup>

      {/* ── Medium — with description ────────────────────────────── */}
      <div style={{ marginTop: 32 }}>
        <SectionLabel>Medium — with description per item</SectionLabel>
        <RadioGroup value={mdDesc} onValueChange={setMdDesc} size="md">
          <RadioGroupItem
            value="monthly"
            label="Monthly"
            description="Billed every month, cancel anytime."
          />
          <RadioGroupItem
            value="annual"
            label="Annual"
            description="Billed once a year. Save 20%."
          />
          <RadioGroupItem
            value="lifetime"
            label="Lifetime"
            description="One-time payment, access forever."
          />
        </RadioGroup>
      </div>

      {/* ── Medium — horizontal ──────────────────────────────────── */}
      <div style={{ marginTop: 32 }}>
        <SectionLabel>Medium — horizontal orientation</SectionLabel>
        <RadioGroup value={mdHoriz} onValueChange={setMdHoriz} size="md" orientation="horizontal">
          <RadioGroupItem value="all"      label="All" />
          <RadioGroupItem value="active"   label="Active" />
          <RadioGroupItem value="archived" label="Archived" />
        </RadioGroup>
      </div>

      {/* ── Medium — disabled items ──────────────────────────────── */}
      <div style={{ marginTop: 32 }}>
        <SectionLabel>Medium — with disabled item</SectionLabel>
        <RadioGroup value={mdDisabled} onValueChange={setMdDisabled} size="md">
          <RadioGroupItem value="active"   label="Active" />
          <RadioGroupItem value="inactive" label="Inactive" disabled />
          <RadioGroupItem value="archived" label="Archived" />
        </RadioGroup>
      </div>

      {/* ── Small ────────────────────────────────────────────────── */}
      <div style={{ marginTop: 32 }}>
        <SectionLabel>Small</SectionLabel>
        <RadioGroup value={smBasic} onValueChange={setSmBasic} size="sm">
          <RadioGroupItem value="overview"  label="Overview" />
          <RadioGroupItem value="forecast"  label="Forecast" />
          <RadioGroupItem value="analytics" label="Analytics" />
        </RadioGroup>
      </div>

      {/* ── Error state ──────────────────────────────────────────── */}
      <div style={{ marginTop: 32 }}>
        <SectionLabel>Error state</SectionLabel>
        <RadioGroup
          value={errVal}
          onValueChange={setErrVal}
          size="md"
          errorMessage="Please select an option to continue."
        >
          <RadioGroupItem value="option-a" label="Option A" />
          <RadioGroupItem value="option-b" label="Option B" />
          <RadioGroupItem value="option-c" label="Option C" />
        </RadioGroup>
      </div>

      {/* ── Fully disabled group ─────────────────────────────────── */}
      <div style={{ marginTop: 32 }}>
        <SectionLabel>Fully disabled group</SectionLabel>
        <RadioGroup defaultValue="b" size="md" disabled>
          <RadioGroupItem value="a" label="Option A" />
          <RadioGroupItem value="b" label="Option B (selected)" />
          <RadioGroupItem value="c" label="Option C" />
        </RadioGroup>
      </div>
    </section>
  )
}
