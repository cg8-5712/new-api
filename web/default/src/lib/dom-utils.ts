import { resolveBasePathAssetUrl } from '@/lib/base-path'

export function applyFaviconToDom(url: string) {
  if (typeof document === 'undefined' || !url) return
  try {
    const resolved = resolveBasePathAssetUrl(url)
    const next = new URL(resolved, window.location.href).href
    const existing =
      document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]')
    if (existing.length === 1 && existing[0].href === next) return
    const link = document.createElement('link')
    link.rel = 'icon'
    link.href = resolved
    existing.forEach((l) => l.remove())
    document.head.appendChild(link)
  } catch {
    // Ignore malformed URLs
  }
}
