import * as React from 'react'

/* ===================================================================
   ComponentHeader — section anchor heading
   =================================================================== */

export function ComponentHeader({ id, title }: { id: string; title: string }) {
  return (
    <h2
      id={id}
      style={{
        scrollMarginTop: 64,
        fontSize: 20,
        fontWeight: 700,
        color: 'var(--foreground)',
        margin: '0 0 24px',
        paddingBottom: 12,
        borderBottom: '1px solid var(--border)',
      }}
    >
      {title}
    </h2>
  )
}

/* ===================================================================
   SectionLabel — group label within a section
   =================================================================== */

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--muted-foreground)',
      marginBottom: 12,
      marginTop: 0,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
    }}>
      {children}
    </p>
  )
}

/* ===================================================================
   Row — flex row with consistent gap, used across showcase sections
   =================================================================== */

export function Row({ children, wrap = true }: { children: React.ReactNode; wrap?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: wrap ? 'wrap' : 'nowrap' }}>
      {children}
    </div>
  )
}

/* ===================================================================
   PreviewFrame — boxed frame for layout component demos
   `contained` adds translateZ(0) to create a stacking context,
   needed when the child uses position:fixed (e.g. Header).
   =================================================================== */

export function PreviewFrame({
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
