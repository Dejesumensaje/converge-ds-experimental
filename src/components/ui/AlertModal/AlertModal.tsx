import * as React from 'react'
import { cn } from '../../../lib/utils'
import { Modal, type ModalSize } from '../Modal'

/* =================================================================
   Assets
   ================================================================= */

import alertGif   from '../../../assets/error.gif'
import successGif from '../../../assets/success.gif'
import loadingGif from '../../../assets/loading.gif'

const VARIANT_ASSET: Record<AlertModalVariant, string> = {
  alert:   alertGif,
  success: successGif,
  loading: loadingGif,
}

const VARIANT_ALT: Record<AlertModalVariant, string> = {
  alert:   'Alert',
  success: 'Success',
  loading: 'Loading…',
}

/* =================================================================
   Types
   ================================================================= */

export type AlertModalVariant = 'alert' | 'success' | 'loading'

export type AlertModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  variant: AlertModalVariant
  /**
   * Optional accessible title for screen readers.
   * Never rendered visually — AlertModal has no header chrome.
   * Defaults to `headline` when omitted.
   */
  title?: string
  /**
   * Small contextual label above the headline.
   * Use for step indicators, category labels, etc.
   */
  step?: string
  /** Primary message — large, centered, always required. */
  headline: string
  /** Supporting copy beneath the headline. */
  description?: string
  /**
   * Optional footer. Pass your own action buttons — no opinionated API.
   * Not needed for `loading` in production (use programmatic close only),
   * but can be passed for demo/showcase purposes.
   */
  footer?: React.ReactNode
  /** `sm` or `md`. Defaults to `sm` — alerts stay focused and compact. */
  size?: Extract<ModalSize, 'sm' | 'md'>
  className?: string
}

/* =================================================================
   AlertModal
   ================================================================= */

export const AlertModal = React.forwardRef<HTMLDivElement, AlertModalProps>(
  (
    {
      open,
      onOpenChange,
      variant,
      title,
      step,
      headline,
      description,
      footer,
      size = 'sm',
      className,
    },
    ref
  ) => {
    /*
     * Loading is non-dismissible — blocks Esc + overlay click.
     * Alert + Success remain dismissible via overlay / Esc.
     */
    const dismissible = variant !== 'loading'

    return (
      <Modal
        ref={ref}
        open={open}
        onOpenChange={onOpenChange}
        /*
         * AlertModal never renders a visible header.
         * `title` is passed only as the sr-only accessible label;
         * `headline` is used as the fallback. This keeps `showHeader=false`
         * always — no header chrome, no divider, no X button.
         */
        title={undefined}
        a11yTitle={title ?? headline}
        /*
         * Alert recipes never show the close (X) button.
         * Dismissal is via overlay click / Esc (when allowed), or via footer actions.
         */
        showCloseButton={false}
        dismissible={dismissible}
        footer={footer}
        size={size}
        className={className}
      >
        {/* ── Centered anatomy — gif · step · headline · description ── */}
        <div
          className={cn(
            'flex flex-col items-center text-center',
            'gap-[var(--spacing-m)]',
            /* Generous vertical padding so content breathes */
            'py-[var(--spacing-l)]',
          )}
        >
          {step && (
            <p className="body-body2-regular text-muted-foreground">
              {step}
            </p>
          )}

          <img
            src={VARIANT_ASSET[variant]}
            alt={VARIANT_ALT[variant]}
            width={80}
            height={80}
            className="object-contain"
            draggable={false}
          />

          <div className="flex flex-col gap-[var(--spacing-s)]">
            {/* titles-h6 (20px/600) — more contained than h5 (24px) for focused alerts */}
            <h2 className="titles-h6 text-foreground">{headline}</h2>
            {description && (
              <p className="body-body1-regular text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
      </Modal>
    )
  }
)

AlertModal.displayName = 'AlertModal'
