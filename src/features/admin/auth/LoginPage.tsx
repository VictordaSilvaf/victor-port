import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { useAuth } from '@/features/admin/auth/auth-context'
import { ApiError } from '@/lib/api/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginPage() {
  const { login, isAuthenticated, ready } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const from =
    (location.state as { from?: string } | null)?.from &&
    (location.state as { from?: string }).from !== '/admin/login'
      ? (location.state as { from: string }).from
      : '/admin'

  if (ready && isAuthenticated) {
    return <Navigate to={from} replace />
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    try {
      await login(email.trim(), password)
      toast.success('Sessão iniciada')
      navigate(from, { replace: true })
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : 'Não foi possível entrar. Verifique as credenciais.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin</CardTitle>
          <CardDescription>
            Entre com a sua conta para gerir o portfólio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'A entrar…' : 'Entrar'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              <Link
                to="/admin/forgot-password"
                className="underline underline-offset-4"
              >
                Esqueci a senha
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
