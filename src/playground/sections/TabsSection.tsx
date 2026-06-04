import * as React from 'react'
import { useState } from 'react'
import { Tabs, type TabItem } from '../../components/ui'
import { LayoutDashboard, BarChart2, TrendingUp } from 'lucide-react'
import { ComponentHeader, SectionLabel } from '../helpers'

const TAB_LABEL_ONLY: TabItem[] = [
  { id: 'overview',  label: 'Overview' },
  { id: 'forecast',  label: 'Forecast' },
  { id: 'analytics', label: 'Analytics' },
]

const TAB_ICON_LABEL: TabItem[] = [
  { id: 'overview',  label: 'Overview',  icon: LayoutDashboard },
  { id: 'forecast',  label: 'Forecast',  icon: BarChart2 },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
]

const TAB_ICON_COUNT: TabItem[] = [
  { id: 'overview',  label: 'Overview',  icon: LayoutDashboard },
  { id: 'forecast',  label: 'Forecast',  icon: BarChart2,  count: 5 },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp, count: 12, countTone: 'in-progress' },
]

const TAB_WITH_DISABLED: TabItem[] = [
  { id: 'overview',  label: 'Overview' },
  { id: 'forecast',  label: 'Forecast' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'reports',   label: 'Reports',  disabled: true },
]

export function TabsSection() {
  const [tabMd1, setTabMd1] = useState('overview')
  const [tabMd2, setTabMd2] = useState('forecast')
  const [tabMd3, setTabMd3] = useState('analytics')
  const [tabMd4, setTabMd4] = useState('overview')
  const [tabSm1, setTabSm1] = useState('overview')
  const [tabSm2, setTabSm2] = useState('forecast')
  const [tabSm3, setTabSm3] = useState('analytics')
  const [tabSm4, setTabSm4] = useState('overview')

  return (
    <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
      <ComponentHeader id="tabs" title="Tabs" />

      <SectionLabel>Medium — label only</SectionLabel>
      <Tabs items={TAB_LABEL_ONLY} value={tabMd1} onValueChange={setTabMd1} />

      <div style={{ marginTop: 32 }}>
        <SectionLabel>Medium — icon + label</SectionLabel>
        <Tabs items={TAB_ICON_LABEL} value={tabMd2} onValueChange={setTabMd2} />
      </div>

      <div style={{ marginTop: 32 }}>
        <SectionLabel>Medium — icon + label + CountBadge</SectionLabel>
        <Tabs items={TAB_ICON_COUNT} value={tabMd3} onValueChange={setTabMd3} />
      </div>

      <div style={{ marginTop: 32 }}>
        <SectionLabel>Medium — with disabled tab</SectionLabel>
        <Tabs items={TAB_WITH_DISABLED} value={tabMd4} onValueChange={setTabMd4} />
      </div>

      <div style={{ marginTop: 40 }}>
        <SectionLabel>Small — label only</SectionLabel>
        <Tabs items={TAB_LABEL_ONLY} value={tabSm1} onValueChange={setTabSm1} size="sm" />
      </div>

      <div style={{ marginTop: 32 }}>
        <SectionLabel>Small — icon + label</SectionLabel>
        <Tabs items={TAB_ICON_LABEL} value={tabSm2} onValueChange={setTabSm2} size="sm" />
      </div>

      <div style={{ marginTop: 32 }}>
        <SectionLabel>Small — icon + CountBadge</SectionLabel>
        <Tabs items={TAB_ICON_COUNT} value={tabSm3} onValueChange={setTabSm3} size="sm" />
      </div>

      <div style={{ marginTop: 32 }}>
        <SectionLabel>Small — with disabled tab</SectionLabel>
        <Tabs items={TAB_WITH_DISABLED} value={tabSm4} onValueChange={setTabSm4} size="sm" />
      </div>
    </section>
  )
}
