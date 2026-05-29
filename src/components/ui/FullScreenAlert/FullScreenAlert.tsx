import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { cn } from '../../../lib/utils'
import './fullscreen-alert.css'

/* =================================================================
   Assets
   ================================================================= */

import alertGif   from '../../../assets/error.gif'
import successGif from '../../../assets/success.gif'
import loadingGif from '../../../assets/loading.gif'

const VARIANT_ASSET: Record<FullScreenAlertVariant, string> = {
  alert:   alertGif,
  success: successGif,
  loading: loadingGif,
}

const VARIANT_ALT: Record<FullScreenAlertVariant, string> = {
  alert:   'Alert',
  success: 'Success',
  loading: 'Loading…',
}

/* =================================================================
   Types
   ================================================================= */

export type FullScreenAlertVariant = 'alert' | 'success' | 'loading'

export type FullScreenAlertProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  variant: FullScreenAlertVariant
  /** Primary message — rendered visually and used as the accessible dialog label. */
  title: string
  /** Supporting copy beneath the title. */
  description?: string
  /**
   * Optional centered action area. Pass one or two Buttons.
   * Loading typically has no footer; alert/success carry primary CTA(s).
   */
  footer?: React.ReactNode
  /**
   * Whether the alert can be closed by pressing Escape.
   * Defaults to `true` for alert/success, `false` for loading.
   * Override explicitly when needed.
   */
  dismissible?: boolean
  className?: string
}

/* =================================================================
   FullScreenAlert
   ================================================================= */

export const FullScreenAlert = React.forwardRef<HTMLDivElement, FullScreenAlertProps>(
  (
    {
      open,
      onOpenChange,
      variant,
      title,
      description,
      footer,
      dismissible,
      className,
    },
    ref
  ) => {
    /*
     * Loading is non-dismissible by default.
     * Consumer can explicitly override (e.g. for showcase / testing).
     */
    const isDismissible = dismissible ?? (variant !== 'loading')

    const handleOpenChange = (next: boolean) => {
      if (!next && !isDismissible) return
      onOpenChange(next)
    }

    return (
      <Dialog.Root open={open} onOpenChange={handleOpenChange}>
        <Dialog.Portal>
          {/*
           * FullScreenAlert has no Dialog.Overlay — the content IS the screen.
           * Esc dismissal is handled by Dialog.Root. There is no "outside" to click.
           * z-[80] sits above the Modal stack (z-[60]).
           */}
          <Dialog.Content
            ref={ref}
            aria-describedby={undefined}
            className={cn(
              'fullscreen-alert-content',
              'fixed inset-0 z-[80]',
              'flex flex-col items-center justify-center',
              'bg-background',
              'outline-none',
              className,
            )}
          >
            {/* Content region — constrained width for readability on large viewports */}
            <div className="flex flex-col items-center text-center gap-[var(--spacing-l)] max-w-[360px] w-full px-[var(--spacing-xl)]">

              <img
                src={VARIANT_ASSET[variant]}
                alt={VARIANT_ALT[variant]}
                width={80}
                height={80}
                className="object-contain"
                draggable={false}
              />

              <div className="flex flex-col gap-[var(--spacing-s)]">
                {/*
                 * Dialog.Title IS the visible title — avoids duplicate content.
                 * titles-h6 (20px/600) — same calibration as AlertModal.
                 */}
                <Dialog.Title className="titles-h6 text-foreground">
                  {title}
                </Dialog.Title>
                {description && (
                  <p className="body-body1-regular text-muted-foreground">{description}</p>
                )}
              </div>

              {footer && (
                <div className="flex items-center justify-center gap-[var(--spacing-m)] flex-wrap">
                  {footer}
                </div>
              )}

            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    )
  }
)

FullScreenAlert.displayName = 'FullScreenAlert'
