import * as React from 'react'
import {
  Modal, Button, Input, Badge,
  Table, TableHeader, TableHeaderRow, TableHeaderCell,
  TableBody, TableRow, TableCell,
} from '../../components/ui'
import { Mail, Plus, Download } from 'lucide-react'
import { ComponentHeader, SectionLabel, Row } from '../helpers'

const TABLE_ROWS = [
  { id: 1, name: 'Alice Johnson',  role: 'Admin',   status: 'active',   score: 98 },
  { id: 2, name: 'Bob Martinez',   role: 'Editor',  status: 'inactive', score: 74 },
  { id: 3, name: 'Carol White',    role: 'Viewer',  status: 'active',   score: 85 },
  { id: 4, name: 'David Park',     role: 'Editor',  status: 'pending',  score: 61 },
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

export function ModalSection() {
  const [modalSmOpen, setModalSmOpen] = React.useState(false)
  const [modalMdOpen, setModalMdOpen] = React.useState(false)
  const [modalLgOpen, setModalLgOpen] = React.useState(false)
  const [modalXlOpen, setModalXlOpen] = React.useState(false)

  return (
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
  )
}
