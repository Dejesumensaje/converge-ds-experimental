import * as React from 'react'
import { cn } from '../../../lib/utils'

export type TableCellProps = Omit<
  React.TdHTMLAttributes<HTMLTableCellElement>,
  'align'
> & {
  // ── Slot API ──────────────────────────────────────────────────────
  /** Leading element (icon, avatar, swatch). Does not grow. */
  leading?: React.ReactNode
  /** Primary text line. Truncates when truncate=true (default). */
  primary?: React.ReactNode
  /** Secondary/sub text line. Smaller, muted. Truncates with primary. */
  secondary?: React.ReactNode
  /** Trailing element (badge, chip, icon). Does not grow. */
  trailing?: React.ReactNode
  // ─────────────────────────────────────────────────────────────────
  align?: 'left' | 'center' | 'right'
  /**
   * Apply overflow-hidden + text-ellipsis to primary and secondary.
   * Requires the column to have a fixed/constrained width.
   * When true and the slot value is a plain string, also sets the native
   * `title` attribute for browser tooltip on hover.
   * @default true
   */
  truncate?: boolean
  /**
   * Escape hatch: render arbitrary content directly.
   * When provided, leading/primary/secondary/trailing are ignored.
   */
  children?: React.ReactNode
}

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  (
    {
      leading,
      primary,
      secondary,
      trailing,
      align = 'left',
      truncate = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const textAlignClass =
      align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'

    const justifyClass =
      align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'

    return (
      <td
        ref={ref}
        className={cn('td-cell', textAlignClass, className)}
        {...props}
      >
        {children !== undefined ? (
          children
        ) : (
          <div className={cn('cell-content', justifyClass)}>
            {leading && <div className="cell-leading">{leading}</div>}

            <div className="cell-text">
              {primary !== undefined && (
                <div
                  className={cn(
                    'body-body1-regular text-[var(--foreground)]',
                    truncate && 'truncate'
                  )}
                  title={
                    truncate && typeof primary === 'string' ? primary : undefined
                  }
                >
                  {primary}
                </div>
              )}
              {secondary !== undefined && (
                <div
                  className={cn(
                    'body-body2-regular text-[var(--muted-foreground)]',
                    truncate && 'truncate'
                  )}
                  title={
                    truncate && typeof secondary === 'string' ? secondary : undefined
                  }
                >
                  {secondary}
                </div>
              )}
            </div>

            {trailing && <div className="cell-trailing">{trailing}</div>}
          </div>
        )}
      </td>
    )
  }
)

TableCell.displayName = 'TableCell'
