import * as React from 'react'
import { useState, useCallback } from 'react'
import { ActionBar, ActionBarLeading, ActionBarActions, Button } from '../../components/ui'
import { Trash2, Download, Archive, Share2, Check } from 'lucide-react'
import { ComponentHeader, SectionLabel } from '../helpers'

export function ActionBarSection() {
  /* Demo 1 — bulk actions with dynamic live region */
  const [demo1Visible, setDemo1Visible]   = useState(true)
  const [selectedCount, setSelectedCount] = useState(3)

  /* Demo 2 — real viewport-fixed bottom-center */
  const [demo2Visible, setDemo2Visible]   = useState(false)

  /* Memoized dismiss callbacks — prevent effect churn in dismissStack */
  const dismissDemo1 = useCallback(() => setDemo1Visible(false), [])
  const dismissDemo2 = useCallback(() => setDemo2Visible(false), [])

  /* Clicking Download decrements the selection count; auto-dismisses at 0 */
  const handleDownload = useCallback(() => {
    setSelectedCount(c => {
      const next = c - 1
      if (next <= 0) setDemo1Visible(false)
      return next
    })
  }, [])

  const handleShowDemo1 = useCallback(() => {
    setSelectedCount(3)
    setDemo1Visible(true)
  }, [])

  return (
    <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
      <ComponentHeader id="actionbar" title="ActionBar" />

      {/* ── Demo 1: Bulk-action bar (main pattern) ────────────────── */}
      <SectionLabel>Bulk actions — leading · actions · dismiss</SectionLabel>
      <p className="caption-caption text-muted-foreground mb-[var(--spacing-m)] mt-0">
        The counter uses{' '}
        <code style={{ fontFamily: 'monospace' }}>aria-live="polite"</code>{' '}
        on the leading text. Click Download to decrement — screen readers announce each change.
      </p>
      <div style={{ minHeight: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {demo1Visible ? (
          <ActionBar aria-label="Bulk actions" onDismiss={dismissDemo1}>
            <ActionBarLeading>
              {/* Dynamic text: live region fires on every count change */}
              <span aria-live="polite">
                {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
              </span>
            </ActionBarLeading>
            <ActionBarActions>
              <Button variant="secondary" glass size="sm" iconLeft={Download} onClick={handleDownload}>
                Download
              </Button>
              <Button variant="primary" size="sm" iconLeft={Trash2}>
                Delete
              </Button>
            </ActionBarActions>
          </ActionBar>
        ) : (
          <Button variant="secondary" size="sm" onClick={handleShowDemo1}>
            Show bar again
          </Button>
        )}
      </div>

      {/* ── Demo 2: Viewport-fixed bottom-center ─────────────────── */}
      <div style={{ marginTop: 'var(--spacing-xxl)' }}>
        <SectionLabel>Position preset — bottom-center (viewport-fixed)</SectionLabel>
        <p className="caption-caption text-muted-foreground mb-[var(--spacing-m)] mt-0">
          Pass <code style={{ fontFamily: 'monospace' }}>position="bottom-center"</code> for
          true viewport-fixed anchoring. Press Esc or Dismiss to close.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setDemo2Visible(true)}
            disabled={demo2Visible}
          >
            Show ActionBar bottom-center
          </Button>
        </div>
        {demo2Visible && (
          <ActionBar
            aria-label="Approval queue"
            position="bottom-center"
            onDismiss={dismissDemo2}
          >
            <ActionBarLeading>
              <Check size={14} aria-hidden />
              <span>2 pending approvals</span>
            </ActionBarLeading>
            <ActionBarActions>
              <Button variant="secondary" glass size="sm">
                Approve all
              </Button>
            </ActionBarActions>
          </ActionBar>
        )}
      </div>

      {/* ── Demo 3: Flexible slots, no dismiss ───────────────────── */}
      <div style={{ marginTop: 'var(--spacing-xxl)' }}>
        <SectionLabel>Flexible slots — no dismiss</SectionLabel>
        <div style={{ minHeight: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ActionBar aria-label="Content actions">
            <ActionBarLeading>
              <Archive size={14} aria-hidden />
              <span>Draft saved · 2m ago</span>
            </ActionBarLeading>
            <ActionBarActions>
              <Button variant="secondary" glass size="sm" iconLeft={Share2}>
                Share
              </Button>
              <Button variant="secondary" glass size="sm" iconLeft={Archive}>
                Archive
              </Button>
              <Button variant="primary" size="sm">
                Publish
              </Button>
            </ActionBarActions>
          </ActionBar>
        </div>
        <p className="caption-caption text-muted-foreground mt-[var(--spacing-s)]">
          No <code style={{ fontFamily: 'monospace' }}>onDismiss</code> prop → no X button.
          Consumer adds their own dismiss action inside a slot.
        </p>
      </div>

      {/* ── Demo 4: Anatomy reference ────────────────────────────── */}
      <div style={{ marginTop: 'var(--spacing-xxl)' }}>
        <SectionLabel>Anatomy — two layers visible on white bg</SectionLabel>
        <p className="caption-caption text-muted-foreground mb-[var(--spacing-m)] mt-0">
          Glass outer container wraps the dark pill. On dark/colorful backgrounds the glass
          refraction is visible; on white it renders as a subtle border.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBlock: 'var(--spacing-l)' }}>
          <ActionBar aria-label="Anatomy demo">
            <ActionBarLeading>Leading slot</ActionBarLeading>
            <ActionBarActions>
              <Button variant="secondary" glass size="sm">Secondary</Button>
              <Button variant="primary" size="sm">Primary</Button>
            </ActionBarActions>
          </ActionBar>
        </div>
      </div>
    </section>
  )
}
