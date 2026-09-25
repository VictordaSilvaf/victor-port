import { useState, type FormEvent } from 'react'
import { Reveal } from '@/components/motion/Reveal'
import { Link } from '@/components/ui/Link'
import { contactContent } from '@/features/contact/data/contact'
import { cn } from '@/lib/utils/cn'

const fieldClass =
  'w-full rounded-none border-0 bg-[oklch(0.94_0_0)] px-4 py-4 text-base text-foreground outline-none transition-[box-shadow,background-color] duration-300 placeholder:text-foreground/40 focus:bg-[oklch(0.92_0_0)] focus:ring-2 focus:ring-foreground/15'

export function ContactForm() {
  const { title, note, formLead, email, fields, submitLabel, successMessage } =
    contactContent
  const [status, setStatus] = useState<'idle' | 'sent'>('idle')

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const from = String(data.get('email') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()

    const subject = encodeURIComponent(
      name ? `Contato — ${name}` : 'Contato pelo site',
    )
    const body = encodeURIComponent(
      `${message}\n\n—\n${name}${from ? `\n${from}` : ''}`,
    )

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
    setStatus('sent')
  }

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
        />

        <label className="sr-only" htmlFor="contact-message">
          Mensagem
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder={fields.message}
          className={cn(fieldClass, 'min-h-36 resize-y')}
        />

        <button
          type="submit"
          data-cursor="interactive"
          className="mt-1 w-full bg-foreground px-6 py-4 text-sm font-bold tracking-[0.12em] text-background uppercase transition-opacity duration-300 hover:opacity-90"
        >
          {submitLabel}
        </button>

        {status === 'sent' ? (
          <p className="text-sm text-foreground/60" role="status">
            {successMessage}
          </p>
        ) : null}
      </form>
    </Reveal>
  )
}
