import {
  FolderKanban,
  FileText,
  Inbox,
  LayoutDashboard,
  Settings,
  Shield,
  Users,
  type LucideIcon,
} from 'lucide-react'

export type AdminNavItem = {
  title: string
  href: string
  icon: LucideIcon
  permission?: string | string[]
  anyOf?: string[]
}

export const adminNavItems: AdminNavItem[] = [
  {
    title: 'Overview',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Projetos',
    href: '/admin/projects',
    icon: FolderKanban,
    permission: 'projects.view',
  },
  {
    title: 'Páginas',
    href: '/admin/pages',
    icon: FileText,
    permission: 'pages.view',
  },
  {
    title: 'Contacto',
    href: '/admin/contact',
    icon: Inbox,
    permission: 'contact.view',
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    permission: 'site.update',
  },
  {
    title: 'Utilizadores',
    href: '/admin/users',
    icon: Users,
    permission: 'users.view',
  },
  {
    title: 'RBAC',
    href: '/admin/rbac',
    icon: Shield,
    anyOf: ['roles.view', 'permissions.view'],
  },
]
