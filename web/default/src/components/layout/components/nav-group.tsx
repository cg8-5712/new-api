import { type ReactNode, useEffect, useState } from 'react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { checkIsActive } from '../lib/url-utils'
import {
  type NavCollapsible,
  type NavChatPresets,
  type NavGroup as NavGroupProps,
  type NavLink,
} from '../types'
import { ChatPresetsItem } from './chat-presets-item'

type NavTarget = NavLink['url']

export function NavGroup({ title, items }: NavGroupProps) {
  const { state, isMobile } = useSidebar()
  const navigate = useNavigate()
  const href = useLocation({ select: (location) => location.href })

  const handleNavigate = (to: NavTarget) => {
    void navigate({ to: to as never })
  }

  return (
    <SidebarGroup className='px-2 py-1'>
      <SidebarGroupLabel className='text-muted-foreground/70 px-2 text-[11px] font-medium tracking-wider uppercase'>
        {title}
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const key = `${item.title}-${item.url || item.type}`

          if (item.type === 'chat-presets') {
            return <ChatPresetsItem key={key} item={item as NavChatPresets} />
          }

          if (!item.items) {
            return (
              <SidebarMenuLink
                key={key}
                item={item as NavLink}
                href={href}
                onNavigate={handleNavigate}
              />
            )
          }

          if (state === 'collapsed' && !isMobile) {
            return (
              <SidebarMenuCollapsedDropdown
                key={key}
                item={item as NavCollapsible}
                href={href}
                onNavigate={handleNavigate}
              />
            )
          }

          return (
            <SidebarMenuCollapsible
              key={key}
              item={item as NavCollapsible}
              href={href}
              onNavigate={handleNavigate}
            />
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function NavBadge({ children }: { children: ReactNode }) {
  return <Badge className='rounded-full px-1 py-0 text-xs'>{children}</Badge>
}

function SidebarMenuLink({
  item,
  href,
  onNavigate,
}: {
  item: NavLink
  href: string
  onNavigate: (to: NavTarget) => void
}) {
  const { setOpenMobile } = useSidebar()
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={checkIsActive(href, item)}
        tooltip={item.title}
        onClick={() => {
          setOpenMobile(false)
          onNavigate(item.url)
        }}
      >
        {item.icon && <item.icon />}
        <span>{item.title}</span>
        {item.badge && <NavBadge>{item.badge}</NavBadge>}
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function SidebarMenuCollapsible({
  item,
  href,
  onNavigate,
}: {
  item: NavCollapsible
  href: string
  onNavigate: (to: NavTarget) => void
}) {
  const { setOpenMobile } = useSidebar()
  const isSubItemActive = checkIsActive(href, item)
  const [isOpen, setIsOpen] = useState(() => isSubItemActive)

  useEffect(() => {
    if (isSubItemActive) {
      setIsOpen(true)
    }
  }, [isSubItemActive])

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className='group/collapsible'
      render={<SidebarMenuItem />}
    >
      <CollapsibleTrigger
        className='group/collapsible-trigger'
        render={<SidebarMenuButton tooltip={item.title} />}
      >
        {item.icon && <item.icon />}
        <span>{item.title}</span>
        {item.badge && <NavBadge>{item.badge}</NavBadge>}
        <ChevronRight className='ms-auto transition-transform duration-200 group-data-[panel-open]/collapsible-trigger:rotate-90' />
      </CollapsibleTrigger>
      <CollapsibleContent className='CollapsibleContent'>
        <SidebarMenuSub>
          {item.items.map((subItem) => (
            <SidebarMenuSubItem key={subItem.title}>
              <SidebarMenuSubButton
                isActive={checkIsActive(href, subItem)}
                onClick={() => {
                  setOpenMobile(false)
                  onNavigate(subItem.url)
                }}
              >
                {subItem.icon && <subItem.icon />}
                <span>{subItem.title}</span>
                {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  )
}

function SidebarMenuCollapsedDropdown({
  item,
  href,
  onNavigate,
}: {
  item: NavCollapsible
  href: string
  onNavigate: (to: NavTarget) => void
}) {
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger
          className='group/dropdown-trigger'
          render={
            <SidebarMenuButton
              tooltip={item.title}
              isActive={checkIsActive(href, item)}
            />
          }
        >
          {item.icon && <item.icon />}
          <span>{item.title}</span>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
          <ChevronRight className='ms-auto transition-transform duration-200 group-data-[popup-open]/dropdown-trigger:rotate-90' />
        </DropdownMenuTrigger>
        <DropdownMenuContent side='right' align='start' sideOffset={4}>
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              {item.title} {item.badge ? `(${item.badge})` : ''}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {item.items.map((sub) => (
              <DropdownMenuItem
                key={`${sub.title}-${sub.url}`}
                className={checkIsActive(href, sub) ? 'bg-secondary' : ''}
                onClick={() => onNavigate(sub.url)}
              >
                {sub.icon && <sub.icon />}
                <span className='max-w-52 text-wrap'>{sub.title}</span>
                {sub.badge && (
                  <span className='ms-auto text-xs'>{sub.badge}</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}
