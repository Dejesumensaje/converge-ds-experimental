import type { ComponentType } from 'react'
import { ColorsSection } from './sections/ColorsSection'
import { TypographySection } from './sections/TypographySection'
import { SpacingSection } from './sections/SpacingSection'
import { ButtonSection } from './sections/ButtonSection'
import { InputSection } from './sections/InputSection'
import { SelectSection } from './sections/SelectSection'
import { SwitchSection } from './sections/SwitchSection'
import { CheckboxSection } from './sections/CheckboxSection'
import { RadioSection } from './sections/RadioSection'
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
import { TooltipSection } from './sections/TooltipSection'
import { ModalSection } from './sections/ModalSection'
import { AlertModalSection } from './sections/AlertModalSection'
import { FullScreenAlertSection } from './sections/FullScreenAlertSection'
import { DrawerSection } from './sections/DrawerSection'
import { TabsSection } from './sections/TabsSection'
import { HeaderSection } from './sections/HeaderSection'
import { SidebarSection } from './sections/SidebarSection'
import { FooterSection } from './sections/FooterSection'

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
  { group: 'forms',        id: 'checkbox',         label: 'Checkbox',        Component: CheckboxSection },
  { group: 'forms',        id: 'radio',            label: 'RadioGroup',      Component: RadioSection },
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
  { group: 'data-display', id: 'avatar',            label: 'Avatar',          Component: AvatarSection },
  { group: 'feedback',     id: 'tooltip',           label: 'Tooltip',         Component: TooltipSection },
  { group: 'feedback',     id: 'modal',             label: 'Modal',           Component: ModalSection },
  { group: 'feedback',     id: 'alertmodal',        label: 'AlertModal',      Component: AlertModalSection },
  { group: 'feedback',     id: 'fullscreenalert',   label: 'FullScreenAlert', Component: FullScreenAlertSection },
  { group: 'feedback',     id: 'drawer',            label: 'Drawer',          Component: DrawerSection },
  { group: 'layout',      id: 'tabs',              label: 'Tabs',            Component: TabsSection },
  { group: 'layout',      id: 'header',            label: 'Header',          Component: HeaderSection },
  { group: 'layout',      id: 'sidebar',           label: 'Sidebar',         Component: SidebarSection },
  { group: 'layout',      id: 'footer',            label: 'Footer',          Component: FooterSection },
]
