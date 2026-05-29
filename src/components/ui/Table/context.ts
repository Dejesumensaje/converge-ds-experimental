import { createContext, useContext } from 'react'

export type TableVariant = 'default' | 'zebra' | 'standout' | 'minimal'
export type TableDensity = 'compact' | 'normal' | 'comfortable'

export type TableContextValue = {
  variant: TableVariant
  density: TableDensity
}

export const TableContext = createContext<TableContextValue>({
  variant: 'default',
  density: 'normal',
})

export const useTableContext = () => useContext(TableContext)
