import { useEffect, useState, type ReactNode } from 'react'
import {
  SiteSettingsContext,
} from '@/app/providers/site-settings-context'
import { getSiteSettings } from '@/lib/api/site'
import {
  mergeSiteSettings,
  siteConfig as defaultSiteConfig,
  type SiteConfig,
} from '@/lib/constants/site'

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [site, setSite] = useState<SiteConfig>(defaultSiteConfig)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    getSiteSettings()
      .then((settings) => {
        if (cancelled) return
        setSite(mergeSiteSettings(defaultSiteConfig, settings))
      })
      .catch(() => {
        if (cancelled) return
        setSite(defaultSiteConfig)
      })
      .finally(() => {
        if (!cancelled) setReady(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <SiteSettingsContext.Provider value={{ site, ready }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}
