import type { LinkProps } from '@tanstack/react-router'
import { toAppPath } from '@/lib/base-path'
import type { NavCollapsible, NavItem } from '../types'

/**
 * Convert LinkProps['to'] to string
 * Handles both string URLs and object URLs (e.g., { pathname, search })
 */
function urlToString(url: LinkProps['to'] | (string & {})): string | null {
  if (typeof url === 'string') {
    return url
  }
  if (url && typeof url === 'object' && !Array.isArray(url)) {
    const urlObj = url as Record<string, unknown>
    const pathname = typeof urlObj.pathname === 'string' ? urlObj.pathname : ''
    const search = typeof urlObj.search === 'string' ? urlObj.search : ''
    return pathname + search
  }
  return null
}

function normalizeComparableHref(href: string): string {
  const appHref = toAppPath(href, '/')
  const [pathWithQuery = '/'] = appHref.split('#')
  const [pathname, search = ''] = pathWithQuery.split('?')
  const normalizedPath =
    pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname

  return search ? `${normalizedPath}?${search}` : normalizedPath
}

/**
 * Normalize URL by removing query parameters and trailing slashes.
 */
export function normalizeHref(href: string): string {
  return normalizeComparableHref(href).split('?')[0]
}

/**
 * Check if a navigation item is active
 * @param href - Current URL
 * @param item - Navigation item
 * @param mainNav - Whether this is a main navigation item (matches first-level path)
 */
export function checkIsActive(
  href: string,
  item: NavItem,
  mainNav = false
): boolean {
  const normalizedHref = normalizeComparableHref(href)
  const hrefWithoutQuery = normalizedHref.split('?')[0]

  if (
    item.activeUrls?.some((url) => {
      const activeUrl = urlToString(url)
      if (!activeUrl) return false
      return normalizeHref(activeUrl) === hrefWithoutQuery
    })
  ) {
    return true
  }

  if ('items' in item && item.items) {
    const collapsibleItem = item as NavCollapsible
    const items = collapsibleItem.items

    if (
      items.some((i) => {
        if (!i?.url) return false
        const subItemUrl = urlToString(i.url)
        if (!subItemUrl) return false

        const normalizedSubItemUrl = normalizeComparableHref(subItemUrl)
        if (normalizedHref === normalizedSubItemUrl) return true

        const subItemUrlWithoutQuery = normalizedSubItemUrl.split('?')[0]
        const subItemUrlHasQuery = normalizedSubItemUrl.includes('?')

        if (subItemUrlWithoutQuery === hrefWithoutQuery) {
          if (!subItemUrlHasQuery) return true
          if (normalizedHref === normalizedSubItemUrl) return true
        }

        return false
      })
    ) {
      return true
    }
  }

  if (!item.url) return false

  const itemUrl = urlToString(item.url)
  if (!itemUrl) return false

  const normalizedItemUrl = normalizeComparableHref(itemUrl)
  if (normalizedHref === normalizedItemUrl) return true

  const itemUrlWithoutQuery = normalizedItemUrl.split('?')[0]
  const itemUrlHasQuery = normalizedItemUrl.includes('?')

  if (hrefWithoutQuery === itemUrlWithoutQuery) {
    if (!itemUrlHasQuery) return true
    if (normalizedHref === normalizedItemUrl) return true
  }

  if (mainNav && hrefWithoutQuery.split('/')[1] && itemUrlWithoutQuery) {
    const hrefFirstPath = hrefWithoutQuery.split('/')[1]
    const itemFirstPath = itemUrlWithoutQuery.split('/')[1]
    return hrefFirstPath === itemFirstPath
  }

  return false
}
