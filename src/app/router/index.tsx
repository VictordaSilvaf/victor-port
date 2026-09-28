import type { ReactNode } from 'react'
import { createBrowserRouter } from 'react-router'
import { AdminLayout } from '@/app/admin/AdminLayout'
import { AdminProviders } from '@/app/admin/AdminProviders'
import { RootLayout } from '@/app/router/RootLayout'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
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
import { ErrorPage, NotFoundPage } from '@/features/error'
import { HomePage } from '@/features/home/HomePage'
import { ProjectPage } from '@/features/projects'

function AdminRoot() {
  return (
    <AdminProviders>
      <RequireAuth />
    </AdminProviders>
  )
}

function PublicChrome({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: (
      <PublicChrome>
        <ErrorPage />
      </PublicChrome>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'sobre', element: <AboutPage /> },
      { path: 'contato', element: <ContactPage /> },
      { path: 'projetos/:slug', element: <ProjectPage /> },
      { path: '*', element: <NotFoundPage /> },
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
    errorElement: (
      <AdminProviders>
        <div className="flex min-h-dvh flex-col bg-background">
          <ErrorPage />
        </div>
      </AdminProviders>
    ),
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
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
])
