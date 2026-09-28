import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { getLenis } from '@/lib/animations/lenis'

export function RootLayout() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      const el = document.getElementById(id)
      if (el) {
        const lenis = getLenis()
        if (lenis) {
          lenis.scrollTo(el, { offset: 0 })
        } else {
          el.scrollIntoView()
        }
        return
      }
    }

    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
    }
  }, [pathname, hash])

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
