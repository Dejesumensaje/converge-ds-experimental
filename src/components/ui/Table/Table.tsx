import * as React from 'react'
import { cn } from '../../../lib/utils'
import { TableContext, type TableVariant, type TableDensity } from './context'
import './table.css'

export type TableProps = React.HTMLAttributes<HTMLTableElement> & {
  variant?: TableVariant
  density?: TableDensity
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ variant = 'default', density = 'normal', className, children, ...props }, ref) => (
    <TableContext.Provider value={{ variant, density }}>
      <table
        ref={ref}
        className={cn(
          'table-base',
          `table-variant-${variant}`,
          `table-density-${density}`,
          className
        )}
        {...props}
      >
        {children}
      </table>
    </TableContext.Provider>
  )
)

Table.displayName = 'Table'
