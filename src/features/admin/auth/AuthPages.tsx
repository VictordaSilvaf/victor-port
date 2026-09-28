import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import {
  forgotPassword,
  resetPassword,
} from '@/lib/api/auth'
import { ApiError } from '@/lib/api/client'
import { useAuth } from '@/features/admin/auth/auth-context'
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
import { PageHeader } from '@/features/admin/shared/PageHeader'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    try {
      const response = await forgotPassword(email.trim())
      toast.success(response.message)
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Falha')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Esqueci a senha" description="Enviaremos instruções se o e-mail existir.">
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'A enviar…' : 'Enviar'}
        </Button>
        <p className="text-center text-sm">
          <Link to="/admin/login" className="underline underline-offset-4">
            Voltar ao login
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    try {
      const response = await resetPassword({
        code: code.trim(),
        password,
        password_confirmation: passwordConfirmation,
      })
      toast.success(response.message)
      navigate('/admin/login')
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Falha')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Redefinir senha" description="Use o código recebido por e-mail.">
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="code">Código</Label>
          <Input
            id="code"
            required
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Nova senha</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password_confirmation">Confirmar senha</Label>
          <Input
            id="password_confirmation"
            type="password"
            required
            minLength={8}
            value={passwordConfirmation}
            onChange={(event) => setPasswordConfirmation(event.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'A guardar…' : 'Redefinir'}
        </Button>
      </form>
    </AuthShell>
  )
}

export function ChangePasswordPage() {
  const { changePassword: change } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    try {
      await change({
        current_password: currentPassword,
        password,
        password_confirmation: passwordConfirmation,
      })
      toast.success('Senha atualizada')
      setCurrentPassword('')
      setPassword('')
      setPasswordConfirmation('')
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Falha')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader title="Alterar senha" />
      <Card className="max-w-md">
        <CardContent className="pt-6">
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label>Senha atual</Label>
              <Input
                type="password"
                required
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Nova senha</Label>
              <Input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Confirmar senha</Label>
              <Input
                type="password"
                required
                minLength={8}
                value={passwordConfirmation}
                onChange={(event) =>
                  setPasswordConfirmation(event.target.value)
                }
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'A guardar…' : 'Atualizar senha'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function AuthShell({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  )
}
