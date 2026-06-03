import * as React from 'react'
import {
  Drawer, Button, Input, Chip, Switch, Badge,
  Table, TableHeader, TableHeaderRow, TableHeaderCell,
  TableBody, TableRow, TableCell,
} from '../../components/ui'
import { Mail, Download } from 'lucide-react'
import { ComponentHeader, SectionLabel, Row } from '../helpers'

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

export function DrawerSection() {
  const [drawerSmOpen, setDrawerSmOpen] = React.useState(false)
  const [drawerMdOpen, setDrawerMdOpen] = React.useState(false)
  const [drawerLgOpen, setDrawerLgOpen] = React.useState(false)
  const [drawerSwInactive, setDrawerSwInactive] = React.useState(false)
  const [drawerSwArchived, setDrawerSwArchived] = React.useState(false)

  return (
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
  )
}
