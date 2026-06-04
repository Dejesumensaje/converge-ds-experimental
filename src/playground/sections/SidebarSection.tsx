import * as React from 'react'
import { useState } from 'react'
import { Sidebar, type SidebarItem } from '../../components/layout/Sidebar/Sidebar'
import { LayoutDashboard, ShoppingCart, BarChart2, Settings, Users } from 'lucide-react'
import { ComponentHeader, SectionLabel, PreviewFrame } from '../helpers'

const BASE_ITEMS: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders',    label: 'Orders',    icon: ShoppingCart },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'users',     label: 'Users',     icon: Users },
  { id: 'settings',  label: 'Settings',  icon: Settings },
]

export function SidebarSection() {
  const [sbLightCollapsed, setSbLightCollapsed] = useState(false)
  const [sbLightActive,    setSbLightActive]    = useState('dashboard')
  const [sbDarkCollapsed,  setSbDarkCollapsed]  = useState(true)
  const [sbDarkActive,     setSbDarkActive]     = useState('analytics')

  const lightItems = BASE_ITEMS.map(item => ({
    ...item,
    active: item.id === sbLightActive,
    onClick: () => setSbLightActive(item.id),
  }))

  const darkItems = BASE_ITEMS.map(item => ({
    ...item,
    active: item.id === sbDarkActive,
    onClick: () => setSbDarkActive(item.id),
  }))

  return (
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
                primaryItems={lightItems}
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
                primaryItems={darkItems}
              />
            </div>
          </PreviewFrame>
        </div>
      </div>
    </section>
  )
}
