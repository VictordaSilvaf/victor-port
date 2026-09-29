import { Link, Outlet, useLocation, useNavigate } from 'react-router'
import {
  ExternalLinkIcon,
  KeyRoundIcon,
  LogOutIcon,
} from 'lucide-react'
import { useAuth } from '@/features/admin/auth/auth-context'
import { adminNavItems } from '@/features/admin/shared/nav'
import { can, canAny } from '@/lib/auth/permissions'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils/cn'

export function AdminLayout() {
  const { user, permissions, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const items = adminNavItems.filter((item) => {
    if (item.anyOf) return canAny(permissions, item.anyOf)
    if (item.permission) return can(permissions, item.permission)
    return true
  })

  const initials =
    user?.name
      ?.split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'AD'

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link to="/admin">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    V
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Victor Admin</span>
                    <span className="truncate text-xs text-muted-foreground">
                      CMS
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const active =
                    item.href === '/admin'
                      ? location.pathname === '/admin'
                      : location.pathname.startsWith(item.href)
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                        <Link to={item.href}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="lg">
                    <Avatar className="size-8 rounded-lg">
                      <AvatarFallback className="rounded-lg">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {user?.name ?? 'Admin'}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user?.email}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56"
                  side="top"
                  align="start"
                >
                  <DropdownMenuLabel>Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/admin/change-password')}>
                    <KeyRoundIcon />
                    Alterar senha
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/" target="_blank" rel="noreferrer">
                      <ExternalLinkIcon />
                      Ver site
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      void logout().then(() => navigate('/admin/login'))
                    }}
                  >
                    <LogOutIcon />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-1 items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              Painel de gestão do portfólio
            </p>
            <div className="flex items-center gap-2">
              <ThemeToggle className="size-8 md:size-8" />
              <Button variant="outline" size="sm" asChild>
                <a href="/" target="_blank" rel="noreferrer">
                  Site
                  <ExternalLinkIcon />
                </a>
              </Button>
            </div>
          </div>
        </header>
        <div className={cn('flex flex-1 flex-col gap-4 p-4 md:p-6')}>
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
