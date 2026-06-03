import './styles/globals.css'
import './styles/playground.css'
import React, { useState } from 'react'

// UI components
import {
  Button,
  Badge,
  Chip,
  Input,
  Switch,
  Table, TableHeader, TableHeaderRow, TableHeaderCell,
  TableBody, TableRow, TableCell,
  Avatar,
  Tabs,
  Tooltip, TooltipProvider,
  Modal,
  AlertModal,
  FullScreenAlert,
  Drawer,
  type TabItem,
} from './components/ui'

// Layout components
import { Header } from './components/layout/Header/Header'
import { Sidebar, type SidebarItem } from './components/layout/Sidebar/Sidebar'
import { Footer } from './components/layout/Footer/Footer'

// Icons
import {
  Mail, Plus, Download,
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

const LONG_ROWS = Array.from({ length: 18 }, (_, i) => {
  const names    = ['Alice Johnson', 'Bob Martinez', 'Carol White', 'David Park', 'Eva Chen', 'Frank Lee']
  const roles    = ['Admin', 'Editor', 'Viewer', 'Editor', 'Admin', 'Viewer']
  const statuses = ['active', 'inactive', 'pending', 'active', 'active', 'inactive']
  return {
    id:     i + 1,
    name:   names[i % names.length],
    role:   roles[i % roles.length],
    status: statuses[i % statuses.length],
    score:  55 + ((i * 13) % 45),
  }
})

const TABLE_ROWS = [
  { id: 1, name: 'Alice Johnson',  role: 'Admin',   status: 'active',   score: 98 },
  { id: 2, name: 'Bob Martinez',   role: 'Editor',  status: 'inactive', score: 74 },
  { id: 3, name: 'Carol White',    role: 'Viewer',  status: 'active',   score: 85 },
  { id: 4, name: 'David Park',     role: 'Editor',  status: 'pending',  score: 61 },
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

  /* --- Drawer state --- */
  const [drawerSmOpen, setDrawerSmOpen] = useState(false)
  const [drawerMdOpen, setDrawerMdOpen] = useState(false)
  const [drawerLgOpen, setDrawerLgOpen] = useState(false)
  const [drawerSwInactive, setDrawerSwInactive] = useState(false)
  const [drawerSwArchived, setDrawerSwArchived] = useState(false)

  /* --- FullScreenAlert state --- */
  const [fsaAlertOpen,   setFsaAlertOpen]   = useState(false)
  const [fsaSuccessOpen, setFsaSuccessOpen] = useState(false)
  const [fsaLoadingOpen, setFsaLoadingOpen] = useState(false)

  /* --- AlertModal state --- */
  const [alertOpen,   setAlertOpen]   = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [loadingOpen, setLoadingOpen] = useState(false)

  /* --- Modal state --- */
  const [modalSmOpen, setModalSmOpen] = useState(false)
  const [modalMdOpen, setModalMdOpen] = useState(false)
  const [modalLgOpen, setModalLgOpen] = useState(false)
  const [modalXlOpen, setModalXlOpen] = useState(false)

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
                FEEDBACK & GUIDANCE
                ═══════════════════════════════════════════════════════ */}

            {/* Tooltip */}
            <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
              <ComponentHeader id="tooltip" title="Tooltip" />

              <SectionLabel>Sides</SectionLabel>
              <Row>
                <Tooltip content="Shows on top"    side="top">
                  <Button variant="secondary" size="sm">Top</Button>
                </Tooltip>
                <Tooltip content="Shows on right"  side="right">
                  <Button variant="secondary" size="sm">Right</Button>
                </Tooltip>
                <Tooltip content="Shows on bottom" side="bottom">
                  <Button variant="secondary" size="sm">Bottom</Button>
                </Tooltip>
                <Tooltip content="Shows on left"   side="left">
                  <Button variant="secondary" size="sm">Left</Button>
                </Tooltip>
              </Row>

              <div style={{ marginTop: 24 }}>
                <SectionLabel>On non-button elements</SectionLabel>
                <Row>
                  <Tooltip content="User: Alice Johnson">
                    <Avatar fallback="AJ" src="https://i.pravatar.cc/150?img=5" />
                  </Tooltip>
                  <Tooltip content="This badge indicates completed status">
                    <Badge tone="success">Completed</Badge>
                  </Tooltip>
                </Row>
              </div>
            </section>

            <AvatarSection />

            {/* AlertModal */}
            <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
              <ComponentHeader id="alert-modal" title="AlertModal" />

              <SectionLabel>Variants</SectionLabel>
              <Row>
                <Button variant="secondary" size="sm" onClick={() => setAlertOpen(true)}>alert</Button>
                <Button variant="secondary" size="sm" onClick={() => setSuccessOpen(true)}>success</Button>
                <Button variant="secondary" size="sm" onClick={() => setLoadingOpen(true)}>loading</Button>
              </Row>

              <AlertModal
                open={alertOpen}
                onOpenChange={setAlertOpen}
                variant="alert"
                headline="You have unsaved changes"
                description="Leaving now will discard all edits. This cannot be undone."
                footer={
                  <>
                    <Button variant="secondary" onClick={() => setAlertOpen(false)}>Keep editing</Button>
                    <Button variant="primary" error onClick={() => setAlertOpen(false)}>Discard changes</Button>
                  </>
                }
              />

              <AlertModal
                open={successOpen}
                onOpenChange={setSuccessOpen}
                variant="success"
                headline="Report published"
                description="Your Q1 report is now live and shared with your team."
                footer={
                  <Button variant="primary" onClick={() => setSuccessOpen(false)}>Done</Button>
                }
              />

              <AlertModal
                open={loadingOpen}
                onOpenChange={setLoadingOpen}
                variant="loading"
                headline="Generating your report…"
                description="This may take a few seconds. Please don't close this window."
                footer={
                  <Button variant="tertiary" size="sm" onClick={() => setLoadingOpen(false)}>
                    Simulate complete
                  </Button>
                }
              />
            </section>

            {/* FullScreenAlert */}
            <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
              <ComponentHeader id="fullscreen-alert" title="FullScreenAlert" />

              <SectionLabel>Variants — full viewport takeover</SectionLabel>
              <Row>
                <Button variant="secondary" size="sm" onClick={() => setFsaAlertOpen(true)}>alert</Button>
                <Button variant="secondary" size="sm" onClick={() => setFsaSuccessOpen(true)}>success</Button>
                <Button variant="secondary" size="sm" onClick={() => setFsaLoadingOpen(true)}>loading</Button>
              </Row>

              <FullScreenAlert
                open={fsaAlertOpen}
                onOpenChange={setFsaAlertOpen}
                variant="alert"
                title="Something went wrong"
                description="An error occurred while processing your request. Please check your connection and try again."
                footer={
                  <>
                    <Button variant="secondary" onClick={() => setFsaAlertOpen(false)}>Cancel</Button>
                    <Button variant="primary" onClick={() => setFsaAlertOpen(false)}>Retry</Button>
                  </>
                }
              />

              <FullScreenAlert
                open={fsaSuccessOpen}
                onOpenChange={setFsaSuccessOpen}
                variant="success"
                title="Report published"
                description="Your Q1 report is now live and has been shared with your team."
                footer={
                  <Button variant="primary" onClick={() => setFsaSuccessOpen(false)}>Done</Button>
                }
              />

              <FullScreenAlert
                open={fsaLoadingOpen}
                onOpenChange={setFsaLoadingOpen}
                variant="loading"
                title="Generating your report…"
                description="This may take a few seconds. Please don't close this window."
                footer={
                  <Button variant="tertiary" size="sm" onClick={() => setFsaLoadingOpen(false)}>
                    Simulate complete
                  </Button>
                }
              />
            </section>

            {/* Modal */}
            <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
              <ComponentHeader id="modal" title="Modal" />

              <SectionLabel>Open by size</SectionLabel>
              <Row>
                <Button variant="secondary" size="sm" onClick={() => setModalSmOpen(true)}>sm — Simple</Button>
                <Button variant="secondary" size="sm" onClick={() => setModalMdOpen(true)}>md — Form</Button>
                <Button variant="secondary" size="sm" onClick={() => setModalLgOpen(true)}>lg — Table</Button>
                <Button variant="secondary" size="sm" onClick={() => setModalXlOpen(true)}>xl — Long content</Button>
              </Row>

              <Modal
                open={modalSmOpen}
                onOpenChange={setModalSmOpen}
                title="Archive item"
                size="sm"
                footer={
                  <>
                    <Button variant="secondary" onClick={() => setModalSmOpen(false)}>Cancel</Button>
                    <Button variant="primary" onClick={() => setModalSmOpen(false)}>Archive</Button>
                  </>
                }
              >
                <p style={{ margin: 0, color: 'var(--muted-foreground)', fontSize: 14, lineHeight: 1.6 }}>
                  This item will be moved to the archive. You can restore it at any time from the Archive section in Settings.
                </p>
              </Modal>

              <Modal
                open={modalMdOpen}
                onOpenChange={setModalMdOpen}
                title="Edit profile"
                size="md"
                footer={
                  <>
                    <Button variant="secondary" onClick={() => setModalMdOpen(false)}>Cancel</Button>
                    <Button variant="primary" onClick={() => setModalMdOpen(false)}>Save changes</Button>
                  </>
                }
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-l)' }}>
                  <Input label="Full name"   value="Alice Johnson"       onChange={() => {}} />
                  <Input label="Email"       value="alice@company.com"   onChange={() => {}} type="email" iconLeft={Mail} />
                  <Input label="Department"  value="Engineering"         onChange={() => {}} />
                  <Input label="Role"        value="Senior Engineer"     onChange={() => {}} disabled />
                </div>
              </Modal>

              <Modal
                open={modalLgOpen}
                onOpenChange={setModalLgOpen}
                title="Team members"
                size="lg"
                footer={
                  <>
                    <Button variant="secondary" onClick={() => setModalLgOpen(false)}>Close</Button>
                    <Button variant="primary" iconLeft={Plus} onClick={() => setModalLgOpen(false)}>Add member</Button>
                  </>
                }
              >
                <Table>
                  <TableHeader>
                    <TableHeaderRow>
                      <TableHeaderCell>Name</TableHeaderCell>
                      <TableHeaderCell>Role</TableHeaderCell>
                      <TableHeaderCell>Status</TableHeaderCell>
                      <TableHeaderCell align="right">Score</TableHeaderCell>
                    </TableHeaderRow>
                  </TableHeader>
                  <TableBody>
                    {TABLE_ROWS.map(row => (
                      <TableRow key={row.id}>
                        <TableCell primary={row.name} secondary={`#${row.id}`} />
                        <TableCell primary={row.role} />
                        <TableCell
                          trailing={
                            <Badge
                              tone={row.status === 'active' ? 'success' : row.status === 'inactive' ? 'negative' : 'warning'}
                              size="sm"
                            >
                              {row.status}
                            </Badge>
                          }
                        />
                        <TableCell primary={String(row.score)} align="right" />
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Modal>

              <Modal
                open={modalXlOpen}
                onOpenChange={setModalXlOpen}
                title="Q1 Regional Performance — Full Report"
                size="xl"
                footer={
                  <>
                    <Button variant="secondary" onClick={() => setModalXlOpen(false)}>Dismiss</Button>
                    <Button variant="primary" iconLeft={Download} onClick={() => setModalXlOpen(false)}>Export PDF</Button>
                  </>
                }
              >
                <Table>
                  <TableHeader>
                    <TableHeaderRow>
                      <TableHeaderCell>#</TableHeaderCell>
                      <TableHeaderCell>Name</TableHeaderCell>
                      <TableHeaderCell>Role</TableHeaderCell>
                      <TableHeaderCell>Status</TableHeaderCell>
                      <TableHeaderCell align="right">Score</TableHeaderCell>
                    </TableHeaderRow>
                  </TableHeader>
                  <TableBody>
                    {LONG_ROWS.map(row => (
                      <TableRow key={row.id}>
                        <TableCell primary={String(row.id)} />
                        <TableCell primary={row.name} />
                        <TableCell primary={row.role} />
                        <TableCell
                          trailing={
                            <Badge
                              tone={row.status === 'active' ? 'success' : row.status === 'inactive' ? 'negative' : 'warning'}
                              size="sm"
                            >
                              {row.status}
                            </Badge>
                          }
                        />
                        <TableCell primary={String(row.score)} align="right" />
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Modal>
            </section>

            {/* ═══════════════════════════════════════════════════════
                NAVIGATION & LAYOUT
                ═══════════════════════════════════════════════════════ */}

            {/* Drawer */}
            <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
              <ComponentHeader id="drawer" title="Drawer" />

              <SectionLabel>Open by size — right-side contextual workspace</SectionLabel>
              <Row>
                <Button variant="secondary" size="sm" onClick={() => setDrawerSmOpen(true)}>sm — Quick edit</Button>
                <Button variant="secondary" size="sm" onClick={() => setDrawerMdOpen(true)}>md — Filter panel</Button>
                <Button variant="secondary" size="sm" onClick={() => setDrawerLgOpen(true)}>lg — Long content</Button>
              </Row>

              <Drawer
                open={drawerSmOpen}
                onOpenChange={setDrawerSmOpen}
                title="Edit member"
                size="sm"
                footer={
                  <>
                    <Button variant="secondary" onClick={() => setDrawerSmOpen(false)}>Cancel</Button>
                    <Button variant="primary" onClick={() => setDrawerSmOpen(false)}>Save</Button>
                  </>
                }
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-l)' }}>
                  <Input label="Full name"  value="Alice Johnson"     onChange={() => {}} />
                  <Input label="Email"      value="alice@company.com" onChange={() => {}} type="email" iconLeft={Mail} />
                  <Input label="Department" value="Engineering"       onChange={() => {}} />
                </div>
              </Drawer>

              <Drawer
                open={drawerMdOpen}
                onOpenChange={setDrawerMdOpen}
                title="Filter results"
                size="md"
                footer={
                  <>
                    <Button variant="tertiary" onClick={() => setDrawerMdOpen(false)}>Reset</Button>
                    <Button variant="secondary" onClick={() => setDrawerMdOpen(false)}>Cancel</Button>
                    <Button variant="primary" onClick={() => setDrawerMdOpen(false)}>Apply filters</Button>
                  </>
                }
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12, marginTop: 0 }}>Status</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {(['Active', 'Pending', 'Inactive'] as const).map(s => (
                        <Chip key={s}>{s}</Chip>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12, marginTop: 0 }}>Role</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {(['Admin', 'Editor', 'Viewer'] as const).map(r => (
                        <Chip key={r}>{r}</Chip>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-m)' }}>
                    <Input label="Search by name" value="" onChange={() => {}} />
                    <Switch label="Show inactive members" checked={drawerSwInactive} onCheckedChange={setDrawerSwInactive} />
                    <Switch label="Include archived"      checked={drawerSwArchived} onCheckedChange={setDrawerSwArchived} />
                  </div>
                </div>
              </Drawer>

              <Drawer
                open={drawerLgOpen}
                onOpenChange={setDrawerLgOpen}
                title="Team performance report"
                size="lg"
                footer={
                  <>
                    <Button variant="secondary" onClick={() => setDrawerLgOpen(false)}>Close</Button>
                    <Button variant="primary" iconLeft={Download} onClick={() => setDrawerLgOpen(false)}>Export</Button>
                  </>
                }
              >
                <Table>
                  <TableHeader>
                    <TableHeaderRow>
                      <TableHeaderCell>#</TableHeaderCell>
                      <TableHeaderCell>Name</TableHeaderCell>
                      <TableHeaderCell>Role</TableHeaderCell>
                      <TableHeaderCell>Status</TableHeaderCell>
                      <TableHeaderCell align="right">Score</TableHeaderCell>
                    </TableHeaderRow>
                  </TableHeader>
                  <TableBody>
                    {LONG_ROWS.map(row => (
                      <TableRow key={row.id}>
                        <TableCell primary={String(row.id)} />
                        <TableCell primary={row.name} />
                        <TableCell primary={row.role} />
                        <TableCell
                          trailing={
                            <Badge
                              tone={row.status === 'active' ? 'success' : row.status === 'inactive' ? 'negative' : 'warning'}
                              size="sm"
                            >
                              {row.status}
                            </Badge>
                          }
                        />
                        <TableCell primary={String(row.score)} align="right" />
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Drawer>
            </section>

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
