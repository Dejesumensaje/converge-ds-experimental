import * as React from 'react'
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  Avatar, Button,
} from '../../components/ui'
import { Plus } from 'lucide-react'
import { ComponentHeader } from '../helpers'

export function CardSection() {
  return (
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
  )
}
