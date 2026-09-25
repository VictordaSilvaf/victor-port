import { Container } from '@/components/layout/Container'
import { Seo } from '@/components/seo'
import { ContactForm } from '@/features/contact/components/ContactForm'
import { ContactInfo } from '@/features/contact/components/ContactInfo'
import { ContactVisual } from '@/features/contact/components/ContactVisual'
import { siteConfig } from '@/lib/constants/site'

export function ContactPage() {
  const { contact } = siteConfig.routes

  return (
    <>
      <Seo
        title={contact.title}
        description={contact.description}
        path={contact.path}
      />
      <section className="pt-28 pb-12 md:pt-36 md:pb-20">
        <Container>
          <div className="grid items-stretch gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20">
            <ContactForm />
            <ContactVisual />
          </div>
        </Container>
      </section>
      <ContactInfo />
    </>
  )
}
