import * as React from 'react'
import { useState } from 'react'
import { ActionBar, ActionBarLeading, ActionBarActions, Button } from '../../components/ui'
import { Trash2, Download, Archive, Share2, Check } from 'lucide-react'
import { ComponentHeader, SectionLabel } from '../helpers'

export function ActionBarSection() {
  /* Each instance is independent */
  const [demo1Visible, setDemo1Visible] = useState(true)
  const [demo3Visible, setDemo3Visible] = useState(true)

  return (
    <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
      <ComponentHeader id="actionbar" title="ActionBar" />

      {/* ── Demo 1: Bulk-action bar (main pattern) ────────────────── */}
      <SectionLabel>Bulk actions — leading · actions · dismiss</SectionLabel>
      <p style={{ fontSize: 12, color: 'var(--muted-foreground)', margin: '0 0 12px' }}>
        The container announces the count via{' '}
        <code style={{ fontFamily: 'monospace', fontSize: 11 }}>aria-live="polite"</code>{' '}
        on the leading text, not on the region.
      </p>

      <div style={{ minHeight: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {demo1Visible ? (
          <ActionBar aria-label="Bulk actions" onDismiss={() => setDemo1Visible(false)}>
            <ActionBarLeading>
              {/* aria-live on the changing text, not the region */}
              <span aria-live="polite" style={{ minWidth: 110 }}>3 items selected</span>
            </ActionBarLeading>
            <ActionBarActions>
              <Button variant="secondary" glass size="sm" iconLeft={Download} aria-label="Download">
                Download
              </Button>
              <Button variant="primary" size="sm" iconLeft={Trash2}>
                Delete
              </Button>
            </ActionBarActions>
          </ActionBar>
        ) : (
          <Button variant="secondary" size="sm" onClick={() => setDemo1Visible(true)}>
            Show bar again
          </Button>
        )}
      </div>

      {/* ── Demo 2: Simulated fixed preset (bottom-center) ───────── */}
      <div style={{ marginTop: 40 }}>
        <SectionLabel>Position preset — bottom-center (simulated inside frame)</SectionLabel>
        <p style={{ fontSize: 12, color: 'var(--muted-foreground)', margin: '0 0 12px' }}>
          In production use{' '}
          <code style={{ fontFamily: 'monospace', fontSize: 11 }}>position="bottom-center"</code>{' '}
          for viewport-fixed anchoring. Here it's simulated inside a relative container.
        </p>
        <div
          style={{
            position: 'relative',
            height: 140,
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-l)',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingBottom: 'var(--spacing-l)',
            overflow: 'hidden',
          }}
        >
          {/* Rendered inline but visually positioned like bottom-center */}
          <ActionBar aria-label="Approval queue">
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
        </div>
      </div>

      {/* ── Demo 3: Flexible slots ───────────────────────────────── */}
      <div style={{ marginTop: 40 }}>
        <SectionLabel>Flexible slots — any children, no dismiss</SectionLabel>
        <div style={{ minHeight: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {demo3Visible ? (
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
          ) : (
            <Button variant="secondary" size="sm" onClick={() => setDemo3Visible(true)}>
              Show bar again
            </Button>
          )}
        </div>
        <p style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 8 }}>
          No dismiss prop → no X button. Consumer adds their own dismiss inside a slot.
        </p>
      </div>

      {/* ── Demo 4: Anatomy reference ────────────────────────────── */}
      <div style={{ marginTop: 40 }}>
        <SectionLabel>Anatomy — two layers visible on white bg</SectionLabel>
        <p style={{ fontSize: 12, color: 'var(--muted-foreground)', margin: '0 0 12px' }}>
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
