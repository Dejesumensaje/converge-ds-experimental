import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cva } from 'class-variance-authority'
import { cn } from '../../../lib/utils'
import './modal.css'

/* =================================================================
   Types
   ================================================================= */

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

export type ModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Visible title rendered in the sticky header. */
  title?: string
  /**
   * Accessible title for screen readers when no visual header is shown.
   * Falls back to `title`, then 'Dialog'.
   */
  a11yTitle?: string
  /** Optional slot to the left of the close button. */
  headerActions?: React.ReactNode
  /**
   * Controls whether the close (X) button is rendered.
   * Defaults to `dismissible`. Set to `false` to remove the button
   * without disabling Esc / overlay-click dismissal.
   */
  showCloseButton?: boolean
  /**
   * Optional sticky footer. Pass your own action buttons — no opinionated
   * API. Right-aligned automatically.
   */
  footer?: React.ReactNode
  size?: ModalSize
  /**
   * When false, Esc and overlay click do not close the modal.
   * Useful for blocking states (e.g. loading). Defaults to true.
   */
  dismissible?: boolean
  children: React.ReactNode
  className?: string
}

/* =================================================================
   CVA — content panel sizes
   ================================================================= */

const contentVariants = cva(
  [
    'modal-content',
    'fixed left-1/2 top-1/2 z-[60]',
    '-translate-x-1/2 -translate-y-1/2',
    'flex flex-col',
    'w-[calc(100vw-var(--spacing-xxl))]',
    'max-h-[80vh]',
    'bg-background',
    'rounded-[var(--radius-xl)]',
    'shadow-2xl',
    'outline-none',
  ],
  {
    variants: {
      size: {
        sm: 'max-w-[400px]',
        md: 'max-w-[560px]',
        lg: 'max-w-[720px]',
        xl: 'max-w-[960px]',
      },
    },
    defaultVariants: { size: 'md' },
  }
)

/* =================================================================
   Modal
   ================================================================= */

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      onOpenChange,
      title,
      a11yTitle,
      headerActions,
      showCloseButton: showCloseButtonProp,
      footer,
      size = 'md',
      dismissible = true,
      children,
      className,
    },
    ref
  ) => {
    /* Derive close-button visibility — default matches dismissible */
    const showCloseButton = showCloseButtonProp ?? dismissible

    /* Visible header when there is content or a close button to show */
    const showHeader = !!title || !!headerActions || showCloseButton

    /* Block Radix from firing onOpenChange(false) when non-dismissible */
    const handleOpenChange = (next: boolean) => {
      if (!next && !dismissible) return
      onOpenChange(next)
    }

    return (
      <Dialog.Root open={open} onOpenChange={handleOpenChange}>
        <Dialog.Portal>

          {/* ── Overlay ── */}
          <Dialog.Overlay
            className={cn(
              'modal-overlay',
              'fixed inset-0 z-[59]',
              'bg-black/25',
              'backdrop-blur-[8px]',
            )}
          />

          {/* ── Content panel ── */}
          <Dialog.Content
            ref={ref}
            aria-describedby={undefined}
            className={cn(contentVariants({ size }), className)}
          >
            {/* ── Accessible title — always present for screen readers ── */}
            {showHeader ? (
              <div
                className={cn(
                  'flex items-center justify-between shrink-0',
                  'px-[var(--spacing-xl)] py-[var(--spacing-l)]',
                  'border-b border-border',
                )}
              >
                <Dialog.Title className="titles-h6 text-foreground truncate mr-[var(--spacing-m)]">
                  {title ?? ''}
                </Dialog.Title>

                <div className="flex items-center gap-[var(--spacing-s)] shrink-0">
                  {headerActions}
                  {showCloseButton && (
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
                  )}
                </div>
              </div>
            ) : (
              /* No visible header — title is still announced by screen readers */
              <Dialog.Title className="sr-only">
                {a11yTitle ?? title ?? 'Dialog'}
              </Dialog.Title>
            )}

            {/* ── Scrollable body ── */}
            <div className="flex-1 overflow-y-auto min-h-0 px-[var(--spacing-xl)] py-[var(--spacing-l)]">
              {children}
            </div>

            {/* ── Footer (optional, sticky, right-aligned) ── */}
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
  }
)

Modal.displayName = 'Modal'
