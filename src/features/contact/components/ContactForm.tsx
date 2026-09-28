import { useState, type FormEvent } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import { useSiteConfig } from '@/app/providers/site-settings-context'
import { Reveal } from '@/components/motion/Reveal'
import { Link } from '@/components/ui/Link'
import { contactContent } from '@/features/contact/data/contact'
import { ApiError, submitContact } from '@/lib/api'
import { cn } from '@/lib/utils/cn'

const fieldClass =
  'w-full rounded-none border-0 bg-[oklch(0.94_0_0)] px-4 py-4 text-base text-foreground outline-none transition-[box-shadow,background-color] duration-300 placeholder:text-foreground/40 focus:bg-[oklch(0.92_0_0)] focus:ring-2 focus:ring-foreground/15'

const turnstileSiteKey =
  (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined)?.trim() || ''

type FormStatus = 'idle' | 'submitting' | 'sent' | 'error' | 'rateLimited'

export function ContactForm() {
  const site = useSiteConfig()
  const { title, note, formLead, fields, submitLabel, successMessage } =
    contactContent
  const email = site.email
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileKey, setTurnstileKey] = useState(0)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') ?? '').trim()
    const from = String(data.get('email') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()
    const website = String(data.get('website') ?? '')

    if (!name || !from || message.length < 10) {
      setStatus('error')
      setErrorMessage('Preencha nome, e-mail e uma mensagem com pelo menos 10 caracteres.')
      return
    }

    if (turnstileSiteKey && !turnstileToken) {
      setStatus('error')
      setErrorMessage('Confirme o captcha antes de enviar.')
      return
    }

    setStatus('submitting')
    setErrorMessage(null)

    try {
      await submitContact({
        name,
        email: from,
        message,
        website: website || undefined,
        cf_turnstile_response: turnstileToken || '',
      })
      setStatus('sent')
      form.reset()
      setTurnstileToken('')
      setTurnstileKey((key) => key + 1)
    } catch (error) {
      setTurnstileToken('')
      setTurnstileKey((key) => key + 1)

      if (error instanceof ApiError && error.status === 429) {
        setStatus('rateLimited')
        setErrorMessage(
          error.message ||
            'Muitas tentativas. Aguarde alguns minutos e tente de novo.',
        )
        return
      }

      setStatus('error')
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : 'Não foi possível enviar. Tente novamente em instantes.',
      )
    }
  }

  const feedback =
    status === 'sent'
      ? successMessage
      : status === 'rateLimited' || status === 'error'
        ? errorMessage
        : null

  return (
    <Reveal className="flex flex-col justify-center">
      <h1 className="text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.9] font-extrabold tracking-tight uppercase">
        {title}
      </h1>
      <p className="mt-5 max-w-md text-base leading-relaxed text-foreground/55 md:text-lg">
        {note}
      </p>

      <p className="mt-10 text-sm font-bold tracking-[0.04em] text-foreground uppercase md:text-base">
        {formLead}{' '}
        <Link
          href={`mailto:${email}`}
          className="underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
        >
          {email}
        </Link>
      </p>

      <form className="mt-6 flex flex-col gap-3" onSubmit={onSubmit} noValidate>
        <label className="sr-only" htmlFor="contact-name">
          Nome
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder={fields.name}
          className={fieldClass}
          disabled={status === 'submitting'}
        />

        <label className="sr-only" htmlFor="contact-email">
          E-mail
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={fields.email}
          className={fieldClass}
          disabled={status === 'submitting'}
        />

        <label className="sr-only" htmlFor="contact-message">
          Mensagem
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          minLength={10}
          placeholder={fields.message}
          className={cn(fieldClass, 'min-h-36 resize-y')}
          disabled={status === 'submitting'}
        />

        {/* Honeypot — must stay empty */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />

        {turnstileSiteKey ? (
          <div className="pt-1">
            <Turnstile
              key={turnstileKey}
              siteKey={turnstileSiteKey}
              onSuccess={setTurnstileToken}
              onExpire={() => setTurnstileToken('')}
              onError={() => setTurnstileToken('')}
              options={{ theme: 'light' }}
            />
          </div>
        ) : null}

        <button
          type="submit"
          data-cursor="interactive"
          disabled={status === 'submitting'}
          className="mt-1 w-full bg-foreground px-6 py-4 text-sm font-bold tracking-[0.12em] text-background uppercase transition-opacity duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'submitting' ? 'Enviando…' : submitLabel}
        </button>

        {feedback ? (
          <p
            className={cn(
              'text-sm',
              status === 'sent' ? 'text-foreground/60' : 'text-red-700/80',
            )}
            role="status"
          >
            {feedback}
          </p>
        ) : null}
      </form>
    </Reveal>
  )
}
