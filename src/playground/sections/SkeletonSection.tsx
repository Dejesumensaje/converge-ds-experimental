import * as React from 'react'
import { Skeleton } from '../../components/ui'
import { ComponentHeader, SectionLabel } from '../helpers'

export function SkeletonSection() {
  return (
    <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
      <ComponentHeader id="skeleton" title="Skeleton" />

      {/* ── Text lines ───────────────────────────────────────────── */}
      <SectionLabel>Text — line placeholders</SectionLabel>
      <div
        role="status"
        aria-busy="true"
        aria-label="Loading content"
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-s)', maxWidth: 400 }}
      >
        <Skeleton variant="text" />
        <Skeleton variant="text" width="83%" />
        <Skeleton variant="text" width="60%" />
      </div>

      {/* ── Circle ───────────────────────────────────────────────── */}
      <div style={{ marginTop: 32 }}>
        <SectionLabel>Circle — avatar / icon placeholder</SectionLabel>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-l)' }}>
          <Skeleton variant="circle" width={28}  height={28}  />
          <Skeleton variant="circle" width={40}  height={40}  />
          <Skeleton variant="circle" width={56}  height={56}  />
          <Skeleton variant="circle" width={80}  height={80}  />
        </div>
      </div>

      {/* ── Rect ─────────────────────────────────────────────────── */}
      <div style={{ marginTop: 32 }}>
        <SectionLabel>Rect — block placeholders</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-m)', maxWidth: 560 }}>
          <Skeleton variant="rect" height={80} />
          <Skeleton variant="rect" height={120} />
          <Skeleton variant="rect" height={200} />
        </div>
      </div>

      {/* ── Composed: Card skeleton ───────────────────────────────── */}
      <div style={{ marginTop: 32 }}>
        <SectionLabel>Composed — Card loading state</SectionLabel>
        <p style={{ fontSize: 12, color: 'var(--muted-foreground)', margin: '0 0 12px' }}>
          Compose primitives to match any layout. The container carries{' '}
          <code style={{ fontFamily: 'monospace', fontSize: 11 }}>role="status" aria-busy="true"</code>{' '}
          — not each skeleton.
        </p>
        <div
          role="status"
          aria-busy="true"
          aria-label="Loading card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-m)',
            padding: 'var(--spacing-l)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-l)',
            maxWidth: 360,
          }}
        >
          {/* Avatar + name row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-s)' }}>
            <Skeleton variant="circle" width={32} height={32} />
            <Skeleton variant="text" width={120} />
          </div>
          {/* Metric block */}
          <Skeleton variant="rect" height={48} />
          {/* Description lines */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-s)' }}>
            <Skeleton variant="text" />
            <Skeleton variant="text" width="70%" />
          </div>
        </div>
      </div>

      {/* ── Composed: Table skeleton ─────────────────────────────── */}
      <div style={{ marginTop: 32 }}>
        <SectionLabel>Composed — Table loading state</SectionLabel>
        <div
          role="status"
          aria-busy="true"
          aria-label="Loading table"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-s)',
            maxWidth: 560,
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', gap: 'var(--spacing-m)' }}>
            <Skeleton variant="text" width="30%" />
            <Skeleton variant="text" width="25%" />
            <Skeleton variant="text" width="20%" />
          </div>
          {/* Rows */}
          {[100, 85, 90, 75].map((w, i) => (
            <div key={i} style={{ display: 'flex', gap: 'var(--spacing-m)' }}>
              <Skeleton variant="text" width="30%" />
              <Skeleton variant="text" width={`${w * 0.25}%`} />
              <Skeleton variant="text" width="20%" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
