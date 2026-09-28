import { createContext, useContext } from 'react'
import {
  siteConfig as defaultSiteConfig,
  type SiteConfig,
} from '@/lib/constants/site'

export type SiteSettingsContextValue = {
  site: SiteConfig
  ready: boolean
}

export const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  site: defaultSiteConfig,
  ready: false,
})

export function useSiteConfig() {
  return useContext(SiteSettingsContext).site
}

export function useSiteSettingsReady() {
  return useContext(SiteSettingsContext).ready
}
