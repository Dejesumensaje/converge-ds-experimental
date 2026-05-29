import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cva } from 'class-variance-authority'
import { cn } from '../../../lib/utils'
import './drawer.css'

/* =================================================================
   Types
   ================================================================= */

export type DrawerSize = 'sm' | 'md' | 'lg'

export type DrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Visible title in the sticky header — always shown, used as accessible label. */
  title: string
  /**
   * Optional slot to the left of the close button in the header.
   * Use for contextual actions, secondary buttons, or custom JSX.
   */
  headerActions?: React.ReactNode
  /**
   * Optional sticky footer. Pass your own action buttons — no opinionated API.
   * Right-aligned automatically.
   */
  footer?: React.ReactNode
  size?: DrawerSize
  children: React.ReactNode
  className?: string
}

/* =================================================================
   CVA — panel width variants
   ================================================================= */

const contentVariants = cva(
  [
    'drawer-content',
    /* Position — right-side workspace panel, full height */
    'fixed inset-y-0 right-0 z-[50]',
    'flex flex-col h-full',
    /* Surface — no border-radius (flush with viewport edge = workspace feel) */
    'bg-background',
    /* Left border provides subtle depth cue vs page content */
    'border-l border-border',
    'shadow-2xl',
    'outline-none',
  ],
  {
    variants: {
      size: {
        sm: 'w-[400px]',
        md: 'w-[560px]',
        lg: 'w-[720px]',
      },
    },
    defaultVariants: { size: 'md' },
  }
)

/* =================================================================
   Drawer
   ================================================================= */

export const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      open,
      onOpenChange,
      title,
      headerActions,
      footer,
      size = 'md',
      children,
      className,
    },
    ref
  ) => (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>

        {/*
         * Overlay — softer than Modal (bg-black/[0.16] + blur-[4px] vs Modal's
         * bg-black/25 + blur-[8px]). Context remains visible behind the panel;
         * user feels "alongside" their work, not "interrupted".
         */}
        <Dialog.Overlay
          className={cn(
            'drawer-overlay',
            'fixed inset-0 z-[49]',
            'bg-black/[0.16]',
            'backdrop-blur-[4px]',
          )}
        />

        {/* ── Panel ── */}
        <Dialog.Content
          ref={ref}
          aria-describedby={undefined}
          className={cn(contentVariants({ size }), className)}
        >

          {/* ── Sticky header ── */}
          <div
            className={cn(
              'flex items-center justify-between shrink-0',
              'px-[var(--spacing-xl)] py-[var(--spacing-l)]',
              'border-b border-border',
            )}
          >
            <Dialog.Title className="titles-h6 text-foreground truncate mr-[var(--spacing-m)]">
              {title}
            </Dialog.Title>

            <div className="flex items-center gap-[var(--spacing-s)] shrink-0">
              {headerActions}
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Close"
                  className={cn(
                    'flex items-center justify-center',
                    'w-8 h-8 rounded-[var(--radius-m)]',
                    'text-muted-foreground',
                    'hover:bg-muted hover:text-foreground',
                    'transition-colors duration-150',
                    'outline-none',
                    'focus-visible:ring-2 focus-visible:ring-inset',
                    'focus-visible:ring-[color-mix(in_srgb,var(--ring)_40%,transparent)]',
                  )}
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </Dialog.Close>
            </div>
          </div>

          {/* ── Scrollable body — header and footer stay sticky ── */}
          <div className="flex-1 overflow-y-auto min-h-0 px-[var(--spacing-xl)] py-[var(--spacing-l)]">
            {children}
          </div>

          {/* ── Sticky footer (optional, right-aligned) ── */}
          {footer && (
            <div
              className={cn(
                'flex items-center justify-end gap-[var(--spacing-m)] shrink-0',
                'px-[var(--spacing-xl)] py-[var(--spacing-l)]',
                'border-t border-border',
              )}
            >
              {footer}
            </div>
          )}

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
)

Drawer.displayName = 'Drawer'
