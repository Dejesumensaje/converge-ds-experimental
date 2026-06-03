import './styles/globals.css'
import './styles/playground.css'
import React, { useState } from 'react'

// UI components
import {
  Button,
  Badge,
  Dot,
  CountBadge,
  Chip,
  Input,
  Switch,
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  MetricCard,
  InformativeCard,
  Table, TableHeader, TableHeaderRow, TableHeaderCell, TableHeaderGroup,
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
  Star,
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

const FORECAST_ROWS = [
  { id: 1, name: 'North Region', revenue: '$125K', margin: '24%', growth: '+18%', variance: '+$4.2K',  trend: 'success'  as const },
  { id: 2, name: 'South Region', revenue: '$98K',  margin: '19%', growth: '+7%',  variance: '-$1.1K',  trend: 'negative' as const },
  { id: 3, name: 'East Region',  revenue: '$143K', margin: '31%', growth: '+26%', variance: '+$8.7K',  trend: 'success'  as const },
  { id: 4, name: 'West Region',  revenue: '$77K',  margin: '15%', growth: '-2%',  variance: '-$3.0K',  trend: 'warning'  as const },
]

const COMPLEX_ROWS = [
  { id: 1, name: 'Alice Johnson', email: 'alice@company.com',  dept: 'Engineering', team: 'Platform',  status: 'active',   score: 98, tier: 'Elite',    avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, name: 'Bob Martinez',  email: 'bob@company.com',    dept: 'Design',      team: 'Product',   status: 'pending',  score: 74, tier: 'Standard', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: 3, name: 'Carol White',   email: 'carol@company.com',  dept: 'Analytics',   team: 'Data',      status: 'active',   score: 91, tier: 'Elite',    avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: 4, name: 'David Park',    email: 'david@company.com',  dept: 'Engineering', team: 'Mobile',    status: 'inactive', score: 62, tier: 'Standard', avatar: 'https://i.pravatar.cc/150?img=4' },
]

/* ===================================================================
   App
   =================================================================== */

export default function App() {
  /* --- Chip state --- */
  const [chipSelected, setChipSelected] = useState<string[]>(['react'])

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

  /* --- Table sort state --- */
  const [sortDir, setSortDir] = useState<'asc' | 'desc' | null>(null)

  const toggleSort = () =>
    setSortDir(d => d === null ? 'asc' : d === 'asc' ? 'desc' : null)

  const sortedRows = [...TABLE_ROWS].sort((a, b) => {
    if (!sortDir) return 0
    return sortDir === 'asc' ? a.score - b.score : b.score - a.score
  })

  const chipToggle = (val: string) =>
    setChipSelected(prev =>
      prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
    )

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
                DATA DISPLAY (inline — not yet extracted)
                ═══════════════════════════════════════════════════════ */}

            {/* Badge */}
            <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
              <ComponentHeader id="badge" title="Badge" />

              <SectionLabel>Tones</SectionLabel>
              <Row>
                <Badge tone="neutral">Neutral</Badge>
                <Badge tone="success">Success</Badge>
                <Badge tone="negative">Negative</Badge>
                <Badge tone="warning">Warning</Badge>
                <Badge tone="in-progress">In Progress</Badge>
              </Row>

              <div style={{ marginTop: 24 }}>
                <SectionLabel>Sizes</SectionLabel>
                <Row>
                  <Badge size="sm">Small</Badge>
                  <Badge size="md">Medium</Badge>
                  <Badge size="lg">Large</Badge>
                </Row>
              </div>
            </section>

            {/* Dot */}
            <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
              <ComponentHeader id="dot" title="Dot" />

              <SectionLabel>Tones × Sizes</SectionLabel>
              <Row>
                {(['neutral','success','negative','warning','in-progress'] as const).map(tone => (
                  <div key={tone} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    {(['sm','md','lg'] as const).map(size => (
                      <Dot key={size} tone={tone} size={size} />
                    ))}
                    <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{tone}</span>
                  </div>
                ))}
              </Row>
            </section>

            {/* CountBadge */}
            <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
              <ComponentHeader id="countbadge" title="CountBadge" />

              <SectionLabel>Tones</SectionLabel>
              <Row>
                <CountBadge count={4}  tone="neutral" />
                <CountBadge count={12} tone="success" />
                <CountBadge count={3}  tone="negative" />
                <CountBadge count={7}  tone="warning" />
                <CountBadge count={99} tone="in-progress" />
              </Row>

              <div style={{ marginTop: 24 }}>
                <SectionLabel>Trend</SectionLabel>
                <Row>
                  <CountBadge count={24} trend="up" />
                  <CountBadge count={8}  trend="down" />
                </Row>
              </div>
            </section>

            {/* Chip */}
            <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
              <ComponentHeader id="chip" title="Chip" />

              <SectionLabel>Interactive (multi-select)</SectionLabel>
              <Row>
                {(['react','vue','angular','svelte'] as const).map(tag => (
                  <Chip key={tag} selected={chipSelected.includes(tag)} onClick={() => chipToggle(tag)}>
                    {tag}
                  </Chip>
                ))}
              </Row>

              <div style={{ marginTop: 24 }}>
                <SectionLabel>Dismissible</SectionLabel>
                <Row>
                  <Chip onClose={() => {}}>React</Chip>
                  <Chip onClose={() => {}}>TypeScript</Chip>
                  <Chip onClose={() => {}} icon={Star}>Favorites</Chip>
                </Row>
              </div>

              <div style={{ marginTop: 24 }}>
                <SectionLabel>Sizes</SectionLabel>
                <Row>
                  <Chip size="sm">Small</Chip>
                  <Chip size="md">Medium</Chip>
                  <Chip size="lg">Large</Chip>
                </Row>
              </div>
            </section>

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

            {/* Card */}
            <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
              <ComponentHeader id="card" title="Card" />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-l)' }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics overview</CardTitle>
                    <CardDescription>Performance for the last 30 days.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p style={{ margin: 0, color: 'var(--muted-foreground)', fontSize: 14 }}>
                      Total sessions increased by 12% compared to the previous period.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="secondary" size="sm">View report</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Team members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Avatar fallback="AL" src="https://i.pravatar.cc/150?img=1" />
                      <Avatar fallback="BM" src="https://i.pravatar.cc/150?img=2" />
                      <Avatar fallback="CW" src="https://i.pravatar.cc/150?img=3" />
                      <Avatar fallback="+3" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="tertiary" size="sm" iconLeft={Plus}>Invite</Button>
                  </CardFooter>
                </Card>
              </div>
            </section>

            {/* MetricCard */}
            <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
              <ComponentHeader id="metriccard" title="MetricCard" />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--spacing-l)' }}>
                <MetricCard
                  title="Total Revenue"
                  primaryValue="$128,400"
                  secondaryValue="vs $112K prev"
                  trendValue={<TrendingUp size={14} aria-hidden />}
                  trendLabel="+14.6%"
                  statusNode={<Badge tone="success" size="sm">On track</Badge>}
                />
                <MetricCard
                  title="Active Users"
                  primaryValue="4,823"
                  secondaryValue="Daily active"
                  trendLabel="+2.3%"
                />
                <MetricCard
                  title="Avg. Order Value"
                  primaryValue="$42.80"
                  trendLabel="-1.2%"
                  statusNode={<Badge tone="warning" size="sm">Watch</Badge>}
                />
              </div>
            </section>

            {/* InformativeCard */}
            <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
              <ComponentHeader id="informativecard" title="InformativeCard" />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-l)' }}>
                <InformativeCard
                  category="Guide"
                  title="Getting started with Converge"
                  subtitle="Learn the basics in 5 minutes"
                  tags={[<Badge key="new" tone="in-progress" size="sm">New</Badge>]}
                  actions={<Button variant="primary" size="sm">Start guide</Button>}
                />
                <InformativeCard
                  imageSrc="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop"
                  category="Tutorial"
                  title="Advanced reporting features"
                  subtitle="Build custom dashboards and share insights"
                  actions={<Button variant="secondary" size="sm">Read more</Button>}
                />
              </div>
            </section>

            {/* Table */}
            <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
              <ComponentHeader id="table" title="Table" />

              {/* A. Basic table with sort */}
              <SectionLabel>A — Basic + sortable column</SectionLabel>
              <Table>
                <TableHeader>
                  <TableHeaderRow>
                    <TableHeaderCell>Name</TableHeaderCell>
                    <TableHeaderCell>Role</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell align="right" sortable sortDirection={sortDir} onSort={toggleSort}>
                      Score
                    </TableHeaderCell>
                  </TableHeaderRow>
                </TableHeader>
                <TableBody>
                  {sortedRows.map(row => (
                    <TableRow key={row.id}>
                      <TableCell primary={row.name} secondary={`#${row.id}`} />
                      <TableCell primary={row.role} />
                      <TableCell
                        trailing={
                          <Badge
                            tone={
                              row.status === 'active'   ? 'success'
                              : row.status === 'inactive' ? 'negative'
                              : 'warning'
                            }
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

              {/* B. Grouped headers — parent columns */}
              <div style={{ marginTop: 32 }}>
                <SectionLabel>B — Grouped headers / parent columns</SectionLabel>
                <Table>
                  <TableHeader>
                    <TableHeaderRow>
                      <TableHeaderCell rowSpan={2}>Region</TableHeaderCell>
                      <TableHeaderGroup colSpan={2} align="center">Forecast</TableHeaderGroup>
                      <TableHeaderGroup colSpan={2} align="center">Performance</TableHeaderGroup>
                    </TableHeaderRow>
                    <TableHeaderRow>
                      <TableHeaderCell>Revenue</TableHeaderCell>
                      <TableHeaderCell>Margin</TableHeaderCell>
                      <TableHeaderCell sortable>Growth</TableHeaderCell>
                      <TableHeaderCell>Variance</TableHeaderCell>
                    </TableHeaderRow>
                  </TableHeader>
                  <TableBody>
                    {FORECAST_ROWS.map(row => (
                      <TableRow key={row.id}>
                        <TableCell primary={row.name} />
                        <TableCell primary={row.revenue} />
                        <TableCell primary={row.margin} />
                        <TableCell
                          primary={row.growth}
                          trailing={<Dot tone={row.trend} size="sm" />}
                        />
                        <TableCell
                          primary={row.variance}
                          trailing={
                            <Badge tone={row.trend} size="sm">
                              {row.trend}
                            </Badge>
                          }
                        />
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* C. Complex cells — enterprise composition */}
              <div style={{ marginTop: 32 }}>
                <SectionLabel>C — Complex cells (avatar · badge · multi-line)</SectionLabel>
                <Table>
                  <TableHeader>
                    <TableHeaderRow>
                      <TableHeaderCell>User</TableHeaderCell>
                      <TableHeaderCell>Department</TableHeaderCell>
                      <TableHeaderCell>Status</TableHeaderCell>
                      <TableHeaderCell align="right">Score</TableHeaderCell>
                    </TableHeaderRow>
                  </TableHeader>
                  <TableBody>
                    {COMPLEX_ROWS.map(row => (
                      <TableRow key={row.id} selected={row.id === 3}>
                        <TableCell
                          leading={
                            <Tooltip content={row.name}>
                              <Avatar src={row.avatar} alt={row.name} fallback={row.name.split(' ').map(n => n[0]).join('')} />
                            </Tooltip>
                          }
                          primary={row.name}
                          secondary={row.email}
                        />
                        <TableCell primary={row.dept} secondary={row.team} />
                        <TableCell
                          trailing={
                            <Badge
                              tone={
                                row.status === 'active'   ? 'success'
                                : row.status === 'inactive' ? 'negative'
                                : 'warning'
                              }
                              size="sm"
                            >
                              {row.status}
                            </Badge>
                          }
                        />
                        <TableCell align="right">
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                            <span className="body-body1-regular">{row.score}</span>
                            <Chip size="sm" selected={row.tier === 'Elite'}>{row.tier}</Chip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* D. Zebra + compact */}
              <div style={{ marginTop: 32 }}>
                <SectionLabel>D — Zebra + compact density</SectionLabel>
                <Table variant="zebra" density="compact">
                  <TableHeader>
                    <TableHeaderRow>
                      <TableHeaderCell>Name</TableHeaderCell>
                      <TableHeaderCell>Role</TableHeaderCell>
                      <TableHeaderCell align="right">Score</TableHeaderCell>
                    </TableHeaderRow>
                  </TableHeader>
                  <TableBody>
                    {TABLE_ROWS.map(row => (
                      <TableRow key={row.id}>
                        <TableCell primary={row.name} />
                        <TableCell primary={row.role} />
                        <TableCell primary={String(row.score)} align="right" />
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* E. Visual (standout) — pill rows */}
              <div style={{ marginTop: 32 }}>
                <SectionLabel>E — Visual (standout) — pill rows</SectionLabel>
                <Table variant="standout">
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
                              tone={
                                row.status === 'active'   ? 'success'
                                : row.status === 'inactive' ? 'negative'
                                : 'warning'
                              }
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
              </div>
            </section>

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

            {/* Avatar */}
            <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
              <ComponentHeader id="avatar" title="Avatar" />

              <SectionLabel>With image</SectionLabel>
              <Row>
                {[1, 2, 3, 4, 5].map(i => (
                  <Avatar key={i} src={`https://i.pravatar.cc/150?img=${i}`} alt={`User ${i}`} fallback={`U${i}`} />
                ))}
              </Row>

              <div style={{ marginTop: 24 }}>
                <SectionLabel>Fallback (initials)</SectionLabel>
                <Row>
                  <Avatar fallback="AL" />
                  <Avatar fallback="BM" />
                  <Avatar fallback="CW" />
                  <Avatar fallback="DP" />
                </Row>
              </div>
            </section>

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
                    <Switch label="Show inactive members" checked={false} onCheckedChange={() => {}} />
                    <Switch label="Include archived"      checked={false} onCheckedChange={() => {}} />
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
