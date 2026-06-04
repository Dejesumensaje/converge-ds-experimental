import './styles/globals.css'
import './styles/playground.css'

// UI components
import { TooltipProvider } from './components/ui'

// Layout components — chrome only (Footer is the page footer)
import { Footer } from './components/layout/Footer/Footer'

// Section modules
import { ColorsSection } from './playground/sections/ColorsSection'
import { TypographySection } from './playground/sections/TypographySection'
import { SpacingSection } from './playground/sections/SpacingSection'
import { ButtonSection } from './playground/sections/ButtonSection'
import { InputSection } from './playground/sections/InputSection'
import { SelectSection } from './playground/sections/SelectSection'
import { SwitchSection } from './playground/sections/SwitchSection'
import { ToggleGroupSection } from './playground/sections/ToggleGroupSection'
import { SearchInputSection } from './playground/sections/SearchInputSection'
import { TableSection } from './playground/sections/TableSection'
import { CardSection } from './playground/sections/CardSection'
import { MetricCardSection } from './playground/sections/MetricCardSection'
import { InformativeCardSection } from './playground/sections/InformativeCardSection'
import { BadgeSection } from './playground/sections/BadgeSection'
import { CountBadgeSection } from './playground/sections/CountBadgeSection'
import { DotSection } from './playground/sections/DotSection'
import { ChipSection } from './playground/sections/ChipSection'
import { AvatarSection } from './playground/sections/AvatarSection'
import { TooltipSection } from './playground/sections/TooltipSection'
import { ModalSection } from './playground/sections/ModalSection'
import { AlertModalSection } from './playground/sections/AlertModalSection'
import { FullScreenAlertSection } from './playground/sections/FullScreenAlertSection'
import { DrawerSection } from './playground/sections/DrawerSection'
import { TabsSection } from './playground/sections/TabsSection'
import { HeaderSection } from './playground/sections/HeaderSection'
import { SidebarSection } from './playground/sections/SidebarSection'
import { FooterSection } from './playground/sections/FooterSection'

/* ===================================================================
   Nav data
   =================================================================== */

const NAV_SECTIONS = [
  {
    id: 'foundations',
    label: 'Foundations',
    items: [
      { id: 'colors',     label: 'Colors' },
      { id: 'typography', label: 'Typography' },
      { id: 'spacing',    label: 'Spacing' },
    ],
  },
  {
    id: 'actions',
    label: 'Actions',
    items: [
      { id: 'button', label: 'Button' },
    ],
  },
  {
    id: 'forms',
    label: 'Forms & Inputs',
    items: [
      { id: 'input',       label: 'Input' },
      { id: 'select',      label: 'Select' },
      { id: 'switch',      label: 'Switch' },
      { id: 'togglegroup', label: 'ToggleGroup' },
      { id: 'searchinput', label: 'SearchInput' },
    ],
  },
  {
    id: 'data-display',
    label: 'Data Display',
    items: [
      { id: 'table',           label: 'Table' },
      { id: 'card',            label: 'Card' },
      { id: 'metriccard',      label: 'MetricCard' },
      { id: 'informativecard', label: 'InformativeCard' },
      { id: 'badge',           label: 'Badge' },
      { id: 'countbadge',      label: 'CountBadge' },
      { id: 'dot',             label: 'Dot' },
      { id: 'chip',            label: 'Chip' },
      { id: 'avatar',          label: 'Avatar' },
    ],
  },
  {
    id: 'feedback',
    label: 'Feedback & Overlays',
    items: [
      { id: 'tooltip',          label: 'Tooltip' },
      { id: 'modal',            label: 'Modal' },
      { id: 'alert-modal',      label: 'AlertModal' },
      { id: 'fullscreen-alert', label: 'FullScreenAlert' },
      { id: 'drawer',           label: 'Drawer' },
    ],
  },
  {
    id: 'layout',
    label: 'Layout',
    items: [
      { id: 'tabs',    label: 'Tabs' },
      { id: 'header',  label: 'Header' },
      { id: 'sidebar', label: 'Sidebar' },
      { id: 'footer',  label: 'Footer' },
    ],
  },
]

/* ===================================================================
   PlaygroundNav — sticky left rail
   =================================================================== */

function PlaygroundNav() {
  return (
    <nav aria-label="Playground navigation">
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV_SECTIONS.map(section => (
          <li key={section.id}>
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
              {section.label}
            </span>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {section.items.map(item => (
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
      <div style={{ paddingTop: 'calc(48px + var(--spacing-xxl))' }}>
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

          {/* Main content */}
          <main style={{ flex: 1, minWidth: 0, paddingBottom: 'var(--spacing-jumbo)' }}>

            {/* ═══════════════════════════════════════════════════════
                FOUNDATIONS
                ═══════════════════════════════════════════════════════ */}

            <ColorsSection />
            <TypographySection />
            <SpacingSection />

            {/* ═══════════════════════════════════════════════════════
                ACTIONS
                ═══════════════════════════════════════════════════════ */}

            <ButtonSection />

            {/* ═══════════════════════════════════════════════════════
                DATA DISPLAY (Badge · Dot · CountBadge · Chip)
                ═══════════════════════════════════════════════════════ */}

            <BadgeSection />
            <DotSection />
            <CountBadgeSection />
            <ChipSection />

            {/* ═══════════════════════════════════════════════════════
                FORMS & INPUTS
                ═══════════════════════════════════════════════════════ */}

            <InputSection />
            <SelectSection />
            <SwitchSection />
            <ToggleGroupSection />
            <SearchInputSection />

            {/* ═══════════════════════════════════════════════════════
                DATA DISPLAY (continued)
                ═══════════════════════════════════════════════════════ */}

            <TableSection />
            <CardSection />
            <MetricCardSection />
            <InformativeCardSection />

            {/* ═══════════════════════════════════════════════════════
                FEEDBACK & OVERLAYS
                ═══════════════════════════════════════════════════════ */}

            <TooltipSection />
            <AvatarSection />
            <AlertModalSection />
            <FullScreenAlertSection />
            <ModalSection />

            {/* ═══════════════════════════════════════════════════════
                NAVIGATION & LAYOUT
                ═══════════════════════════════════════════════════════ */}

            <DrawerSection />
            <TabsSection />
            <HeaderSection />
            <SidebarSection />
            <FooterSection />

          </main>
        </div>
      </div>

      {/* Page footer chrome */}
      <Footer />

    </TooltipProvider>
  )
}
