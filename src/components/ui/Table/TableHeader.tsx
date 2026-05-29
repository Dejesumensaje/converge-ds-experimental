import * as React from 'react'

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ children, ...props }, ref) => (
  <thead ref={ref} {...props}>
    {children}
  </thead>
))

TableHeader.displayName = 'TableHeader'
