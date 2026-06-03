import * as React from 'react'
import { MetricCard, Badge } from '../../components/ui'
import { TrendingUp } from 'lucide-react'
import { ComponentHeader } from '../helpers'

export function MetricCardSection() {
  return (
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
  )
}
