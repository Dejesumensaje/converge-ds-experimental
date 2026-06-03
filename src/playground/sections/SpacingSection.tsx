import * as React from 'react'
import { ComponentHeader } from '../helpers'

const SPACING_DATA: { token: string }[] = [
  { token: '--spacing-tiny'    },
  { token: '--spacing-xxs'     },
  { token: '--spacing-s'       },
  { token: '--spacing-m'       },
  { token: '--spacing-l'       },
  { token: '--spacing-xl'      },
  { token: '--spacing-xxl'     },
  { token: '--spacing-xxxl'    },
  { token: '--spacing-jumbo'   },
  { token: '--spacing-jumbox'  },
  { token: '--spacing-jumboxx' },
]

export function SpacingSection() {
  const [cssVals, setCssVals] = React.useState<Record<string, string>>({})
  React.useEffect(() => {
    const style = getComputedStyle(document.documentElement)
    const vals: Record<string, string> = {}
    SPACING_DATA.forEach(({ token }) => {
      vals[token] = style.getPropertyValue(token).trim()
    })
    setCssVals(vals)
  }, [])

  return (
    <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
      <ComponentHeader id="spacing" title="Spacing" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-s)' }}>
        {SPACING_DATA.map(({ token }) => (
          <div key={token} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-l)' }}>
            {/* Visual bar — width driven by the token itself */}
            <div
              style={{
                width: `var(${token})`,
                height: 20,
                background: 'var(--selection)',
                borderRadius: 4,
                flexShrink: 0,
              }}
            />
            {/* Labels */}
            <div style={{ display: 'flex', gap: 'var(--spacing-l)', alignItems: 'center' }}>
              <span className="body-body2-regular" style={{ color: 'var(--foreground)', minWidth: 180 }}>
                {token}
              </span>
              <span className="body-body2-regular" style={{ color: 'var(--muted-foreground)' }}>
                {cssVals[token] || '…'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
