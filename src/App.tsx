import './styles/globals.css'
import './styles/playground.css'

// UI components
import { TooltipProvider } from './components/ui'

// Layout components — chrome only (Footer is the page footer)
import { Footer } from './components/layout/Footer/Footer'

// Registry — single source of truth for sections and nav
import { SECTION_REGISTRY } from './playground/registry'

/* ===================================================================
   Nav — group label lookup
   =================================================================== */

const GROUP_LABELS: Record<string, string> = {
  foundations:    'Foundations',
  actions:        'Actions',
  forms:          'Forms & Inputs',
  'data-display': 'Data Display',
  feedback:       'Feedback & Overlays',
  layout:         'Layout',
}

/* ===================================================================
   PlaygroundNav — derived from SECTION_REGISTRY
   =================================================================== */

function PlaygroundNav() {
  // Group entries preserving first-appearance order (= taxonomy order)
  const groupMap = new Map<string, { id: string; label: string }[]>()
  for (const entry of SECTION_REGISTRY) {
    if (!groupMap.has(entry.group)) groupMap.set(entry.group, [])
    groupMap.get(entry.group)!.push({ id: entry.id, label: entry.label })
  }

  return (
    <nav aria-label="Playground navigation">
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {Array.from(groupMap.entries()).map(([groupKey, items]) => (
          <li key={groupKey}>
            <span
              style={{
                display: 'block',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--muted-foreground)',
                paddingTop: 16,
                paddingBottom: 4,
              }}
            >
              {GROUP_LABELS[groupKey] ?? groupKey}
            </span>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {items.map(item => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    style={{
                      display: 'block',
                      fontSize: 13,
                      color: 'var(--foreground)',
                      textDecoration: 'none',
                      padding: '3px 8px',
                      borderRadius: 6,
                      transition: 'background 120ms',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--muted)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/* ===================================================================
   App
   =================================================================== */

export default function App() {
  return (
    <TooltipProvider>

      {/* ── Playground shell — minimal branding, NOT the Header component ── */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 48,
          zIndex: 50,
          background: 'var(--background)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 'var(--spacing-l)',
          paddingRight: 'var(--spacing-l)',
          gap: 'var(--spacing-s)',
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--foreground)', letterSpacing: '-0.01em' }}>
          Converge™
        </span>
        <span style={{ width: 1, height: 14, background: 'var(--border)' }} />
        <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--muted-foreground)' }}>
          Design System
        </span>
      </div>

      {/* ── Page layout ────────────────────────────────────────────────── */}
      <div style={{ paddingTop: 'calc(var(--header-height) + var(--spacing-xxl))' }}>
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '0 var(--spacing-xxl)',
            display: 'flex',
            gap: 'var(--spacing-xxl)',
            alignItems: 'flex-start',
          }}
        >
          {/* Sticky nav rail */}
          <aside
            style={{
              position: 'sticky',
              top: 60,
              width: 180,
              flexShrink: 0,
              height: 'calc(100vh - 72px)',
              overflowY: 'auto',
            }}
          >
            <PlaygroundNav />
          </aside>

          {/* Main content — rendered in registry order (taxonomy) */}
          <main style={{ flex: 1, minWidth: 0, paddingBottom: 'var(--spacing-jumbo)' }}>
            {SECTION_REGISTRY.map(s => <s.Component key={s.id} />)}
          </main>
        </div>
      </div>

      {/* Page footer chrome */}
      <Footer />

    </TooltipProvider>
  )
}
