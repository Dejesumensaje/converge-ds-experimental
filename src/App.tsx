import './styles/globals.css'
import './styles/playground.css'
import React, { useState } from 'react'

// UI components
import {
  TooltipProvider,
  Tabs,
  type TabItem,
} from './components/ui'

// Layout components
import { Header } from './components/layout/Header/Header'
import { Sidebar, type SidebarItem } from './components/layout/Sidebar/Sidebar'
import { Footer } from './components/layout/Footer/Footer'

// Icons
import {
  LayoutDashboard, ShoppingCart, BarChart2, Settings, Users,
  TrendingUp,
} from 'lucide-react'

// Playground helpers + section modules
import { ComponentHeader, SectionLabel, Row } from './playground/helpers'
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
   PreviewFrame — boxed frame for layout component demos
   =================================================================== */

function PreviewFrame({
  children,
  height = 340,
  contained = false,
}: {
  children: React.ReactNode
  height?: number
  contained?: boolean
}) {
  return (
    <div
      style={{
        position: 'relative',
        height,
        border: '1px solid var(--border)',
        borderRadius: 12,
        overflow: 'hidden',
        background: 'var(--neutral-gray-background)',
        ...(contained ? { transform: 'translateZ(0)' } : {}),
      }}
    >
      {children}
    </div>
  )
}

/* ===================================================================
   Static data — defined outside App to avoid recreation on re-render
   =================================================================== */

const SIDEBAR_NAV_ITEMS: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders',    label: 'Orders',    icon: ShoppingCart },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'users',     label: 'Users',     icon: Users },
  { id: 'settings',  label: 'Settings',  icon: Settings },
]

/* Tabs static data */
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


/* ===================================================================
   App
   =================================================================== */

export default function App() {
  /* --- Tabs state — each demo is independent --- */
  const [tabMd1, setTabMd1] = useState('overview')
  const [tabMd2, setTabMd2] = useState('forecast')
  const [tabMd3, setTabMd3] = useState('analytics')
  const [tabMd4, setTabMd4] = useState('overview')
  const [tabSm1, setTabSm1] = useState('overview')
  const [tabSm2, setTabSm2] = useState('forecast')
  const [tabSm3, setTabSm3] = useState('analytics')
  const [tabSm4, setTabSm4] = useState('overview')

  /* --- Sidebar state — each demo is independent --- */
  const [sbLightCollapsed, setSbLightCollapsed] = useState(false)
  const [sbLightActive,    setSbLightActive]    = useState('dashboard')
  const [sbDarkCollapsed,  setSbDarkCollapsed]  = useState(true)
  const [sbDarkActive,     setSbDarkActive]     = useState('analytics')

  const lightSidebarItems = SIDEBAR_NAV_ITEMS.map(item => ({
    ...item,
    active: item.id === sbLightActive,
    onClick: () => setSbLightActive(item.id),
  }))

  const darkSidebarItems = SIDEBAR_NAV_ITEMS.map(item => ({
    ...item,
    active: item.id === sbDarkActive,
    onClick: () => setSbDarkActive(item.id),
  }))

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

            {/* Tabs */}
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

            {/* Header */}
            <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
              <ComponentHeader id="header" title="Header" />
              <SectionLabel>Full component — logo · product name · divider · Bell · Avatar · Account dropdown</SectionLabel>
              <PreviewFrame height={64} contained>
                <Header productName="Converge Platform" />
              </PreviewFrame>
              <p style={{ marginTop: 8, fontSize: 12, color: 'var(--muted-foreground)' }}>
                Avatar opens the account dropdown with profile, help center, preferences, and log out.
              </p>
            </section>

            {/* Sidebar */}
            <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
              <ComponentHeader id="sidebar" title="Sidebar" />
              <SectionLabel>Toggle affordance built in — collapse/expand from within the component</SectionLabel>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-l)' }}>
                <div>
                  <p style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 8, marginTop: 0 }}>
                    Light — {sbLightCollapsed ? 'collapsed' : 'expanded'}
                  </p>
                  <PreviewFrame height={360}>
                    <div style={{ display: 'flex', height: '100%', padding: 12 }}>
                      <Sidebar
                        theme="light"
                        collapsed={sbLightCollapsed}
                        onCollapsedChange={setSbLightCollapsed}
                        primaryItems={lightSidebarItems}
                      />
                    </div>
                  </PreviewFrame>
                </div>

                <div>
                  <p style={{ fontSize: 12, color: 'var(--muted-foreground)', marginBottom: 8, marginTop: 0 }}>
                    Dark — {sbDarkCollapsed ? 'collapsed' : 'expanded'}
                  </p>
                  <PreviewFrame height={360}>
                    <div style={{ display: 'flex', height: '100%', padding: 12 }}>
                      <Sidebar
                        theme="dark"
                        collapsed={sbDarkCollapsed}
                        onCollapsedChange={setSbDarkCollapsed}
                        primaryItems={darkSidebarItems}
                      />
                    </div>
                  </PreviewFrame>
                </div>
              </div>
            </section>

            {/* Footer */}
            <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
              <ComponentHeader id="footer" title="Footer" />
              <SectionLabel>Preview</SectionLabel>
              <PreviewFrame height={64}>
                <div style={{ position: 'absolute', inset: 0 }}>
                  <Footer />
                </div>
              </PreviewFrame>
            </section>

          </main>
        </div>
      </div>

      {/* Page footer */}
      <Footer />
    </TooltipProvider>
  )
}
