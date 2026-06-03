import type { ComponentType } from 'react'
import { ColorsSection } from './sections/ColorsSection'
import { TypographySection } from './sections/TypographySection'
import { SpacingSection } from './sections/SpacingSection'
import { ToggleGroupSection } from './sections/ToggleGroupSection'

export type SectionEntry = {
  group: string
  id: string
  label: string
  Component: ComponentType
}

export const SECTION_REGISTRY: SectionEntry[] = [
  { group: 'foundations', id: 'colors',      label: 'Colors',      Component: ColorsSection },
  { group: 'foundations', id: 'typography',  label: 'Typography',  Component: TypographySection },
  { group: 'foundations', id: 'spacing',     label: 'Spacing',     Component: SpacingSection },
  { group: 'forms',       id: 'togglegroup', label: 'ToggleGroup', Component: ToggleGroupSection },
]
