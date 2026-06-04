import * as React from 'react'
import { ToastProvider, useToast } from '../../components/ui'
import { ComponentHeader, SectionLabel } from '../helpers'
import { Button } from '../../components/ui'

/* ── Inner demo — must be a child of ToastProvider ── */
function ToastDemo() {
  const toast = useToast()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>

      {/* ── 4 semantic types ──────────────────────────────── */}
      <div>
        <SectionLabel>Semantic types — transient (5s auto-dismiss)</SectionLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-m)' }}>
          <Button
            variant="secondary"
            size="md"
            onClick={() =>
              toast.success('Changes saved', {
                description: 'Your file has been saved successfully.',
              })
            }
          >
            Success
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={() =>
              toast.error('Upload failed', {
                description: 'The file could not be uploaded. Please try again.',
              })
            }
          >
            Error
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={() =>
              toast.warning('Storage almost full', {
                description: 'You are using 90% of your storage quota.',
              })
            }
          >
            Warning
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={() =>
              toast.info('New version available', {
                description: 'Refresh the page to get the latest updates.',
              })
            }
          >
            Info
          </Button>
        </div>
      </div>

      {/* ── Title only (no description) ──────────────────── */}
      <div>
        <SectionLabel>Title only — no description</SectionLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-m)' }}>
          <Button
            variant="secondary"
            size="md"
            onClick={() => toast.success('Copied to clipboard')}
          >
            Success (no desc)
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={() => toast.error('Permission denied')}
          >
            Error (no desc)
          </Button>
        </div>
      </div>

      {/* ── Persistent with action ───────────────────────── */}
      <div>
        <SectionLabel>Persistent — stays until dismissed + action button</SectionLabel>
        <p style={{ fontSize: 13, color: 'var(--muted-foreground)', margin: '0 0 12px' }}>
          Persistent toasts have <code style={{ fontFamily: 'monospace', fontSize: 12 }}>duration=Infinity</code>.
          They do not auto-dismiss — the user must act or close.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-m)' }}>
          <Button
            variant="secondary"
            size="md"
            onClick={() =>
              toast.warning('Row deleted', {
                description: '12 items were permanently removed.',
                persistent: true,
                action: {
                  label: 'Undo',
                  onClick: () => toast.success('Delete undone'),
                },
              })
            }
          >
            Warning + Undo action
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={() =>
              toast.error('Sync failed', {
                persistent: true,
                action: {
                  label: 'Retry',
                  onClick: () => toast.info('Retrying sync…'),
                },
              })
            }
          >
            Error + Retry action
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={() =>
              toast.info('Review pending', {
                description: 'A teammate requested your review.',
                persistent: true,
                action: {
                  label: 'View',
                  onClick: () => {},
                },
              })
            }
          >
            Info + View action
          </Button>
        </div>
      </div>

      {/* ── Multiple stacking ────────────────────────────── */}
      <div>
        <SectionLabel>Multiple — stack in the viewport</SectionLabel>
        <Button
          variant="secondary"
          size="md"
          onClick={() => {
            toast.success('Step 1 complete')
            setTimeout(() => toast.info('Step 2 starting…'), 200)
            setTimeout(() => toast.warning('Step 3 needs attention'), 400)
          }}
        >
          Fire 3 toasts at once
        </Button>
      </div>
    </div>
  )
}

/* ── Section wrapper — owns its own ToastProvider ── */
export function ToastSection() {
  return (
    <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
      <ComponentHeader id="toast" title="Toast" />

      <p style={{ fontSize: 14, color: 'var(--muted-foreground)', margin: '0 0 var(--spacing-xl)' }}>
        Pill-shaped notifications tinted by semantic type. Transient toasts auto-dismiss
        after 5 s (paused on hover/focus). Persistent toasts require an action or manual
        close.&nbsp; <strong style={{ color: 'var(--foreground)' }}>Position</strong> is
        configurable via <code style={{ fontFamily: 'monospace', fontSize: 12 }}>&lt;ToastProvider position="…"&gt;</code>.
        This section uses <code style={{ fontFamily: 'monospace', fontSize: 12 }}>bottom-right</code>.
      </p>

      <ToastProvider position="bottom-right">
        <ToastDemo />
      </ToastProvider>
    </section>
  )
}
