import * as React from 'react'
import { Switch } from '../../components/ui'
import { ComponentHeader, SectionLabel } from '../helpers'

export function SwitchSection() {
  const [notifications, setNotifications] = React.useState(false)
  const [autoSave,      setAutoSave]      = React.useState(true)
  const [swSmall,       setSwSmall]       = React.useState(false)
  const [swMedium,      setSwMedium]      = React.useState(false)

  return (
    <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
      <ComponentHeader id="switch" title="Switch" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-l)' }}>
        <Switch label="Notifications"      checked={notifications} onCheckedChange={setNotifications} />
        <Switch label="Auto-save (checked)" checked={autoSave}     onCheckedChange={setAutoSave} />
        <Switch label="Disabled off"        checked={false}         disabled />
        <Switch label="Disabled on"         checked={true}          disabled />
      </div>

      <div style={{ marginTop: 24 }}>
        <SectionLabel>Sizes</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-m)' }}>
          <Switch label="Small"            size="sm" checked={swSmall}  onCheckedChange={setSwSmall} />
          <Switch label="Medium (default)" size="md" checked={swMedium} onCheckedChange={setSwMedium} />
        </div>
      </div>
    </section>
  )
}
