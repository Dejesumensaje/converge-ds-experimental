import * as React from 'react'
import {
  Table, TableHeader, TableHeaderRow, TableHeaderCell, TableHeaderGroup,
  TableBody, TableRow, TableCell,
  Badge, Dot, Avatar, Tooltip, Chip,
} from '../../components/ui'
import { ComponentHeader, SectionLabel } from '../helpers'

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

export function TableSection() {
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc' | null>(null)

  const toggleSort = () =>
    setSortDir(d => d === null ? 'asc' : d === 'asc' ? 'desc' : null)

  const sortedRows = [...TABLE_ROWS].sort((a, b) => {
    if (!sortDir) return 0
    return sortDir === 'asc' ? a.score - b.score : b.score - a.score
  })

  return (
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

      {/* E. Visual (standout) — pill rows on tinted surface */}
      <div style={{ marginTop: 32 }}>
        <SectionLabel>E — Visual (standout) — pill rows</SectionLabel>
        <div
          style={{
            background: 'var(--neutral-gray-background)',
            borderRadius: 'var(--radius-l)',
            padding: 'var(--spacing-l)',
          }}
        >
          <p className="caption-caption" style={{ margin: '0 0 var(--spacing-m)', color: 'var(--muted-foreground)' }}>
            Pill rows — sobre superficie tintada
          </p>
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
      </div>
    </section>
  )
}
