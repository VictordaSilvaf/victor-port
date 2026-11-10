import { useSiteConfig } from '@/app/providers/site-settings-context'

/** Editable /sobre content from site settings (falls back to static defaults). */
export function useAboutContent() {
  return useSiteConfig().aboutPage
}
