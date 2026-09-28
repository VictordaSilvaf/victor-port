import { apiFetch } from '@/lib/api/client'

export type AuthSessionResponse = {
  access_token: string
  token_type?: string
  message?: string
  id?: string
  roles?: string[]
  permissions?: string[]
}

export type AuthUser = {
  id: string
  name: string
  email: string
  roles: string[]
  permissions: string[]
}

export async function login(email: string, password: string) {
  return apiFetch<AuthSessionResponse>('/auth/login', {
    method: 'POST',
    auth: false,
    body: { email, password },
  })
}

export async function logout() {
  return apiFetch<{ message: string }>('/auth/logout', {
    method: 'POST',
    auth: false,
    body: {},
  })
}

export async function refreshSession() {
  return apiFetch<AuthSessionResponse>('/auth/refresh', {
    method: 'POST',
    body: {},
  })
}

export async function getMe() {
  return apiFetch<AuthUser>('/users/me')
}

export async function forgotPassword(email: string) {
  return apiFetch<{ message: string }>('/auth/forgot-password', {
    method: 'POST',
    auth: false,
    body: { email },
  })
}

export async function resetPassword(input: {
  code: string
  password: string
  password_confirmation: string
}) {
  return apiFetch<{ message: string }>('/auth/reset-password', {
    method: 'POST',
    auth: false,
    body: input,
  })
}

export async function changePassword(input: {
  current_password: string
  password: string
  password_confirmation: string
}) {
  return apiFetch<{ message: string }>('/auth/change-password', {
    method: 'POST',
    body: input,
  })
}
