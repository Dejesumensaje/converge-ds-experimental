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
