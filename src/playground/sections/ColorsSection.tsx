import * as React from 'react'
import { ComponentHeader, SectionLabel } from '../helpers'

const COLOR_GROUPS_DATA: { label: string; tokens: string[] }[] = [
  {
    label: 'Brand',
    tokens: ['--primary', '--primary-foreground', '--accent'],
  },
  {
    label: 'Neutrals',
    tokens: [
      '--neutral-light', '--neutral-gray-background',
      '--neutral-gray1', '--neutral-gray2', '--neutral-gray3',
      '--neutral-gray4', '--neutral-gray5', '--neutral-dark',
    ],
  },
  {
    label: 'Text',
    tokens: ['--text-primary', '--text-secondary', '--text-disabled'],
  },
  {
    label: 'Selection',
    tokens: ['--selection', '--selection-foreground'],
  },
  {
    label: 'Semantic',
    tokens: [
      '--success', '--success-foreground',
      '--destructive', '--destructive-foreground',
      '--warning', '--warning-foreground',
      '--informative', '--informative-foreground',
    ],
  },
  {
    label: 'Semantic backgrounds — Success',
    tokens: ['--success-bg-light', '--success-bg-medium', '--success-bg-dark'],
  },
  {
    label: 'Semantic backgrounds — Error',
    tokens: ['--error-bg-light', '--error-bg-medium', '--error-bg-dark'],
  },
  {
    label: 'Semantic backgrounds — Warning',
    tokens: ['--warning-bg-light', '--warning-bg-medium', '--warning-bg-dark'],
  },
  {
    label: 'Semantic backgrounds — Informative',
    tokens: ['--informative-bg-light', '--informative-bg-medium', '--informative-bg-dark'],
  },
  {
    label: 'Chart',
    tokens: ['--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5', '--chart-6', '--chart-7'],
  },
  {
    label: 'Heatmap',
    tokens: ['--heatmap-50', '--heatmap-100', '--heatmap-200', '--heatmap-300', '--heatmap-400', '--heatmap-500'],
  },
]

export function ColorsSection() {
  const [cssVals, setCssVals] = React.useState<Record<string, string>>({})
  React.useEffect(() => {
    const style = getComputedStyle(document.documentElement)
    const vals: Record<string, string> = {}
    COLOR_GROUPS_DATA.forEach(group =>
      group.tokens.forEach(t => { vals[t] = style.getPropertyValue(t).trim() })
    )
    setCssVals(vals)
  }, [])

  return (
    <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
      <ComponentHeader id="colors" title="Colors" />

      {/* Brand scarcity callout */}
      <div
        style={{
          padding: 'var(--spacing-m) var(--spacing-l)',
          borderRadius: 'var(--radius-m)',
          background: 'var(--neutral-gray-background)',
          borderLeft: '3px solid var(--primary)',
          marginBottom: 'var(--spacing-xl)',
        }}
      >
        <p className="body-body2-regular" style={{ margin: 0, color: 'var(--text-secondary)' }}>
          <strong className="body-body2-semibold" style={{ color: 'var(--foreground)' }}>--primary</strong>{' '}
          (Converge green) is reserved for primary buttons, focus rings, and the single most important CTA per screen.
          For selected/active states on any other component, use{' '}
          <strong className="body-body2-semibold" style={{ color: 'var(--foreground)' }}>--selection</strong>.
          For status, use the semantic tokens.
        </p>
      </div>

      {COLOR_GROUPS_DATA.map(group => (
        <div key={group.label} style={{ marginBottom: 'var(--spacing-xl)' }}>
          <SectionLabel>{group.label}</SectionLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-m)' }}>
            {group.tokens.map(token => (
              <div key={token} style={{ width: 72 }}>
                <div
                  style={{
                    width: 72,
                    height: 48,
                    borderRadius: 'var(--radius-m)',
                    background: `var(${token})`,
                    border: '1px solid rgba(0,0,0,0.1)',
                    boxSizing: 'border-box',
                    marginBottom: 6,
                  }}
                />
                <p className="notification-notification" style={{ margin: '0 0 2px', color: 'var(--foreground)', wordBreak: 'break-word' }}>
                  {token.replace(/^--/, '')}
                </p>
                <p className="notification-notification" style={{ margin: 0, color: 'var(--muted-foreground)' }}>
                  {cssVals[token] || '…'}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
