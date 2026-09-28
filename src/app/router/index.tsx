import { createBrowserRouter } from 'react-router'
import { AdminLayout } from '@/app/admin/AdminLayout'
import { AdminProviders } from '@/app/admin/AdminProviders'
import { RootLayout } from '@/app/router/RootLayout'
import { AboutPage } from '@/features/about'
import {
  ChangePasswordPage,
  ForgotPasswordPage,
  ResetPasswordPage,
} from '@/features/admin/auth/AuthPages'
import { LoginPage } from '@/features/admin/auth/LoginPage'
import { RequireAuth } from '@/features/admin/auth/RequireAuth'
import {
  ContactDetailPage,
  ContactInboxPage,
} from '@/features/admin/contact/ContactPages'
import { OverviewPage } from '@/features/admin/overview/OverviewPage'
import { PageFormPage } from '@/features/admin/pages/PageFormPage'
import { PagesListPage } from '@/features/admin/pages/PagesListPage'
import { ProjectFormPage } from '@/features/admin/projects/ProjectFormPage'
import { ProjectsListPage } from '@/features/admin/projects/ProjectsListPage'
import { RbacPage } from '@/features/admin/rbac/RbacPage'
import { SettingsPage } from '@/features/admin/settings/SettingsPage'
import { UserFormPage, UsersListPage } from '@/features/admin/users/UsersPages'
import { ContactPage } from '@/features/contact'
import { HomePage } from '@/features/home/HomePage'
import { ProjectPage } from '@/features/projects'

function AdminRoot() {
  return (
    <AdminProviders>
      <RequireAuth />
    </AdminProviders>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'sobre', element: <AboutPage /> },
      { path: 'contato', element: <ContactPage /> },
      { path: 'projetos/:slug', element: <ProjectPage /> },
    ],
  },
  {
    path: '/admin/login',
    element: (
      <AdminProviders>
        <LoginPage />
      </AdminProviders>
    ),
  },
  {
    path: '/admin/forgot-password',
    element: (
      <AdminProviders>
        <ForgotPasswordPage />
      </AdminProviders>
    ),
  },
  {
    path: '/admin/reset-password',
    element: (
      <AdminProviders>
        <ResetPasswordPage />
      </AdminProviders>
    ),
  },
  {
    path: '/admin',
    element: <AdminRoot />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <OverviewPage /> },
          { path: 'projects', element: <ProjectsListPage /> },
          { path: 'projects/new', element: <ProjectFormPage /> },
          { path: 'projects/:id', element: <ProjectFormPage /> },
          { path: 'pages', element: <PagesListPage /> },
          { path: 'pages/new', element: <PageFormPage /> },
          { path: 'pages/:id', element: <PageFormPage /> },
          { path: 'contact', element: <ContactInboxPage /> },
          { path: 'contact/:id', element: <ContactDetailPage /> },
          { path: 'settings', element: <SettingsPage /> },
          { path: 'users', element: <UsersListPage /> },
          { path: 'users/new', element: <UserFormPage /> },
          { path: 'users/:id', element: <UserFormPage /> },
          { path: 'rbac', element: <RbacPage /> },
          { path: 'change-password', element: <ChangePasswordPage /> },
        ],
      },
    ],
  },
])
