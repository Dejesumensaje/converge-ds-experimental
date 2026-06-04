import * as React from 'react'
import * as RadixToast from '@radix-ui/react-toast'
import { Check, XCircle, TriangleAlert, Info, X } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Button } from '../Button'
import './toast.css'

/* =================================================================
   Types
   ================================================================= */

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export type ToastActionOptions = {
  label: string
  onClick: () => void
}

export type ToastOptions = {
  description?: string
  /**
   * Duration in milliseconds. Pass `Infinity` (or omit `duration` and set
   * `persistent: true`) to prevent auto-dismiss. Default: 5000.
   */
  duration?: number
  /** Shorthand for duration=Infinity */
  persistent?: boolean
  action?: ToastActionOptions
  /** Optional stable id — if omitted a random id is generated. */
  id?: string
}

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export type ToastProviderProps = {
  /** Where toasts stack on screen. Default: 'bottom-right' */
  position?: ToastPosition
  children: React.ReactNode
}

/* =================================================================
   Internal entry shape
   ================================================================= */

type ToastEntry = {
  id: string
  type: ToastType
  message: string
  description?: string
  /** Radix duration — ms or Infinity */
  duration: number
  action?: ToastActionOptions
  open: boolean
}

/* =================================================================
   Context
   ================================================================= */

type ToastContextValue = {
  add: (type: ToastType, message: string, opts?: ToastOptions) => string
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

/* =================================================================
   Per-type config
   Text contrast (title + description at full opacity, WCAG relative luminance):
     success:  --success #207F19 on --success-bg-light #E6F5EB       → 4.53:1 ✓ AA
     error:    --destructive #DA291C on --error-bg-light #FDF5F4     → 4.53:1 ✓ AA
     warning:  --warning-foreground #9F6514 on --warning-bg-light    → 4.51:1 ✓ AA
               (--warning #ED8B00 only 2.37:1 — fails, NOT used)
     info:     --informative #005587 on --informative-bg-light       → 6.91:1 ✓ AAA
   Focus ring (--ring #26890D solid, WCAG 1.4.11 ≥3:1 non-text contrast):
     success tint #E6F5EB: 3.99:1 ✓ / error tint #FDF5F4: 4.19:1 ✓
     warning tint #FEF6EA: 4.20:1 ✓ / info tint #E6F1F7: 3.92:1 ✓
   ================================================================= */

type TypeConfig = {
  Icon: React.ElementType
  bg: string
  color: string
  /** Radix aria-live mode: foreground=assertive, background=polite */
  radixType: 'foreground' | 'background'
  srPrefix: string
}

const TYPE_CONFIG: Record<ToastType, TypeConfig> = {
  success: {
    Icon: Check,
    bg: 'var(--success-bg-light)',
    color: 'var(--success)',
    radixType: 'background',
    srPrefix: 'Success',
  },
  error: {
    Icon: XCircle,
    bg: 'var(--error-bg-light)',
    color: 'var(--destructive)',
    radixType: 'foreground',
    srPrefix: 'Error',
  },
  warning: {
    Icon: TriangleAlert,
    bg: 'var(--warning-bg-light)',
    color: 'var(--warning-foreground)',
    radixType: 'foreground',
    srPrefix: 'Warning',
  },
  info: {
    Icon: Info,
    bg: 'var(--informative-bg-light)',
    color: 'var(--informative)',
    radixType: 'background',
    srPrefix: 'Information',
  },
}

/* =================================================================
   Viewport position styles
   ================================================================= */

const VIEWPORT_POSITION: Record<ToastPosition, React.CSSProperties> = {
  'top-left':      { top: 'var(--spacing-xl)', left: 'var(--spacing-xl)' },
  'top-center':    { top: 'var(--spacing-xl)', left: '50%', transform: 'translateX(-50%)' },
  'top-right':     { top: 'var(--spacing-xl)', right: 'var(--spacing-xl)' },
  'bottom-left':   { bottom: 'var(--spacing-xl)', left: 'var(--spacing-xl)' },
  'bottom-center': { bottom: 'var(--spacing-xl)', left: '50%', transform: 'translateX(-50%)' },
  'bottom-right':  { bottom: 'var(--spacing-xl)', right: 'var(--spacing-xl)' },
}

/* =================================================================
   ToastItem — single pill notification
   ================================================================= */

type ToastItemProps = {
  entry: ToastEntry
  isTop: boolean
  onDismiss: (id: string) => void
}

function ToastItem({ entry, isTop, onDismiss }: ToastItemProps) {
  const config = TYPE_CONFIG[entry.type]
  const { Icon } = config
  const isPersistent = !isFinite(entry.duration)

  return (
    <RadixToast.Root
      open={entry.open}
      onOpenChange={(open) => { if (!open) onDismiss(entry.id) }}
      type={config.radixType}
      duration={isPersistent ? Infinity : entry.duration}
      className={cn('toast-root', isTop ? 'toast-enter-top' : 'toast-enter-bottom')}
      style={{
        backgroundColor: config.bg,
        color: config.color,
        borderRadius: entry.description ? 'var(--radius-l)' : 'var(--radius-full)',
      }}
    >
      {/* Pill inner layout */}
      <div
        className={cn(
          'flex items-start',
          'gap-[var(--spacing-s)]',
          'px-[var(--spacing-l)] py-[var(--spacing-m)]',
          'min-w-0',
        )}
      >
        {/* Semantic icon — decorative, type is communicated via sr-prefix in title */}
        <Icon size={16} aria-hidden="true" className="shrink-0 mt-[1px]" />

        {/* Text block */}
        <div className="flex flex-col gap-[var(--spacing-xxs)] min-w-0 flex-1">
          <RadixToast.Title className="body-body2-semibold">
            <span className="sr-only">{config.srPrefix}: </span>
            {entry.message}
          </RadixToast.Title>
          {entry.description && (
            <RadixToast.Description className="body-body2-regular">
              {entry.description}
            </RadixToast.Description>
          )}
        </div>

        {/* Action + Close row */}
        <div className="flex items-center gap-[var(--spacing-xxs)] shrink-0 self-start ml-[var(--spacing-xxs)]">
          {entry.action && (
            <RadixToast.Action asChild altText={entry.action.label}>
              <Button
                variant="text-link"
                size="sm"
                onClick={entry.action.onClick}
                style={{ color: config.color }}
                className="toast-action-ring"
              >
                {entry.action.label}
              </Button>
            </RadixToast.Action>
          )}

          <RadixToast.Close asChild>
            <button
              type="button"
              aria-label="Dismiss notification"
              className={cn(
                'toast-close-btn',
                'inline-flex items-center justify-center shrink-0',
                // W5: 24×24 meets WCAG 2.2 SC 2.5.8 minimum; W4: DS radius token
                'w-6 h-6 rounded-[var(--radius-full)]',
                'cursor-pointer',
                // hover: defined in toast.css so reduced-motion can suppress it
                'hover:opacity-70',
                // C2: solid ring (no color-mix) + offset for visibility on light tints
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                'focus-visible:ring-[var(--ring)]',
              )}
            >
              <X size={12} aria-hidden="true" />
            </button>
          </RadixToast.Close>
        </div>
      </div>
    </RadixToast.Root>
  )
}

/* =================================================================
   ToastProvider — mounts Radix provider + viewport, manages queue
   ================================================================= */

export function ToastProvider({ position = 'bottom-right', children }: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastEntry[]>([])

  const isTop = position.startsWith('top')

  const dismiss = React.useCallback((id: string) => {
    // Mark closed (triggers Radix exit animation via data-state="closed")
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, open: false } : t)))
    // Remove from React state after exit animation completes (250ms + buffer)
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 400)
  }, [])

  const add = React.useCallback(
    (type: ToastType, message: string, opts: ToastOptions = {}): string => {
      const id = opts.id ?? `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      const duration =
        opts.persistent || opts.duration === Infinity
          ? Infinity
          : (opts.duration ?? 5000)

      setToasts((prev) => [
        ...prev,
        {
          id,
          type,
          message,
          description: opts.description,
          duration,
          action: opts.action,
          open: true,
        },
      ])
      return id
    },
    []
  )

  const contextValue = React.useMemo(() => ({ add, dismiss }), [add, dismiss])

  const swipeDirection: RadixToast.SwipeDirection =
    position.endsWith('left')
      ? 'left'
      : position.endsWith('right')
        ? 'right'
        : isTop
          ? 'up'
          : 'down'

  return (
    <ToastContext.Provider value={contextValue}>
      <RadixToast.Provider swipeDirection={swipeDirection} duration={5000}>
        {children}

        {toasts.map((entry) => (
          <ToastItem
            key={entry.id}
            entry={entry}
            isTop={isTop}
            onDismiss={dismiss}
          />
        ))}

        <RadixToast.Viewport
          className="toast-viewport"
          style={{
            position: 'fixed',
            zIndex: 110,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-s)',
            width: '380px',
            maxWidth: 'calc(100vw - var(--spacing-jumbo))',
            padding: 0,
            margin: 0,
            listStyle: 'none',
            outline: 'none',
            ...VIEWPORT_POSITION[position],
          }}
        />
      </RadixToast.Provider>
    </ToastContext.Provider>
  )
}

ToastProvider.displayName = 'ToastProvider'

/* =================================================================
   useToast — consume the toast queue from any component
   ================================================================= */

export type UseToastReturn = {
  success: (message: string, opts?: ToastOptions) => string
  error:   (message: string, opts?: ToastOptions) => string
  warning: (message: string, opts?: ToastOptions) => string
  info:    (message: string, opts?: ToastOptions) => string
  add:     (type: ToastType, message: string, opts?: ToastOptions) => string
  dismiss: (id: string) => void
}

export function useToast(): UseToastReturn {
  const ctx = React.useContext(ToastContext)
  if (!ctx) {
    throw new Error('[Toast] useToast() must be called inside a <ToastProvider>.')
  }

  return React.useMemo(
    () => ({
      success: (msg, opts) => ctx.add('success', msg, opts),
      error:   (msg, opts) => ctx.add('error',   msg, opts),
      warning: (msg, opts) => ctx.add('warning', msg, opts),
      info:    (msg, opts) => ctx.add('info',    msg, opts),
      add:     ctx.add,
      dismiss: ctx.dismiss,
    }),
    [ctx]
  )
}
