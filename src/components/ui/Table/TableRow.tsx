import * as React from 'react'
import { cn } from '../../../lib/utils'

export type TableRowProps = React.HTMLAttributes<HTMLTableRowElement> & {
  /** Visual selection highlight. Does not manage checkboxes (out of scope v1). */
  selected?: boolean
  disabled?: boolean
}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ selected, disabled, className, onClick, children, ...props }, ref) => (
    <tr
      ref={ref}
      onClick={onClick}
      aria-selected={selected || undefined}
      aria-disabled={disabled || undefined}
      className={cn(
        selected  && 'tr-row-selected',
        disabled  && 'tr-row-disabled',
        onClick   && 'tr-row-clickable',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  )
)

TableRow.displayName = 'TableRow'
