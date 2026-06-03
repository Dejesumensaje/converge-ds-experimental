import type { ComponentType } from 'react'
import { ColorsSection } from './sections/ColorsSection'
import { TypographySection } from './sections/TypographySection'
import { SpacingSection } from './sections/SpacingSection'
import { ButtonSection } from './sections/ButtonSection'
import { InputSection } from './sections/InputSection'
import { SelectSection } from './sections/SelectSection'
import { SwitchSection } from './sections/SwitchSection'
import { ToggleGroupSection } from './sections/ToggleGroupSection'
import { SearchInputSection } from './sections/SearchInputSection'

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
  { group: 'actions',     id: 'button',      label: 'Button',      Component: ButtonSection },
  { group: 'forms',       id: 'input',       label: 'Input',       Component: InputSection },
  { group: 'forms',       id: 'select',      label: 'Select',      Component: SelectSection },
  { group: 'forms',       id: 'switch',      label: 'Switch',      Component: SwitchSection },
  { group: 'forms',       id: 'togglegroup', label: 'ToggleGroup', Component: ToggleGroupSection },
  { group: 'forms',       id: 'searchinput', label: 'SearchInput', Component: SearchInputSection },
]
