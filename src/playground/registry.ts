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
import { TableSection } from './sections/TableSection'
import { CardSection } from './sections/CardSection'
import { MetricCardSection } from './sections/MetricCardSection'
import { InformativeCardSection } from './sections/InformativeCardSection'
import { BadgeSection } from './sections/BadgeSection'
import { CountBadgeSection } from './sections/CountBadgeSection'
import { DotSection } from './sections/DotSection'
import { ChipSection } from './sections/ChipSection'
import { AvatarSection } from './sections/AvatarSection'

export type SectionEntry = {
  group: string
  id: string
  label: string
  Component: ComponentType
}

export const SECTION_REGISTRY: SectionEntry[] = [
  { group: 'foundations',  id: 'colors',          label: 'Colors',          Component: ColorsSection },
  { group: 'foundations',  id: 'typography',       label: 'Typography',      Component: TypographySection },
  { group: 'foundations',  id: 'spacing',          label: 'Spacing',         Component: SpacingSection },
  { group: 'actions',      id: 'button',           label: 'Button',          Component: ButtonSection },
  { group: 'forms',        id: 'input',            label: 'Input',           Component: InputSection },
  { group: 'forms',        id: 'select',           label: 'Select',          Component: SelectSection },
  { group: 'forms',        id: 'switch',           label: 'Switch',          Component: SwitchSection },
  { group: 'forms',        id: 'togglegroup',      label: 'ToggleGroup',     Component: ToggleGroupSection },
  { group: 'forms',        id: 'searchinput',      label: 'SearchInput',     Component: SearchInputSection },
  { group: 'data-display', id: 'table',            label: 'Table',           Component: TableSection },
  { group: 'data-display', id: 'card',             label: 'Card',            Component: CardSection },
  { group: 'data-display', id: 'metriccard',       label: 'MetricCard',      Component: MetricCardSection },
  { group: 'data-display', id: 'informativecard',  label: 'InformativeCard', Component: InformativeCardSection },
  { group: 'data-display', id: 'badge',            label: 'Badge',           Component: BadgeSection },
  { group: 'data-display', id: 'countbadge',       label: 'CountBadge',      Component: CountBadgeSection },
  { group: 'data-display', id: 'dot',              label: 'Dot',             Component: DotSection },
  { group: 'data-display', id: 'chip',             label: 'Chip',            Component: ChipSection },
  { group: 'data-display', id: 'avatar',           label: 'Avatar',          Component: AvatarSection },
]
