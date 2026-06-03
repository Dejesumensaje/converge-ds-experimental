import * as React from 'react'
import { SearchInput } from '../../components/ui'
import { ComponentHeader, SectionLabel } from '../helpers'

export function SearchInputSection() {
  const [search, setSearch] = React.useState('')

  return (
    <section style={{ marginBottom: 'var(--spacing-jumbo)' }}>
      <ComponentHeader id="searchinput" title="SearchInput" />

      <SectionLabel>Grows right</SectionLabel>
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <SearchInput
          aria-label="Search"
          value={search}
          onValueChange={setSearch}
          expandDirection="right"
          placeholder="Search…"
        />
      </div>

      <div style={{ marginTop: 24 }}>
        <SectionLabel>Grows left</SectionLabel>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <SearchInput
            aria-label="Search right-anchored"
            value={search}
            onValueChange={setSearch}
            expandDirection="left"
            placeholder="Search…"
          />
        </div>
      </div>
    </section>
  )
}
