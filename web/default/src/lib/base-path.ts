declare const __APP_BASE_PATH__: string | undefined

const ABSOLUTE_URL_RE = /^(?:[a-z]+:)?\/\//i
const SPECIAL_SCHEME_RE = /^(?:data:|blob:|mailto:|tel:|ccswitch:)/i

function normalizeBasePath(value = ''): string {
  let path = String(value).trim()
  if (!path || path === '/') {
    return ''
  }
  if (!path.startsWith('/')) {
    path = `/${path}`
  }
  path = path.replace(/\/+$/, '')
  return path === '/' ? '' : path
}

function isExternalPath(path = ''): boolean {
  return ABSOLUTE_URL_RE.test(path) || SPECIAL_SCHEME_RE.test(path)
}

export const BASE_PATH = normalizeBasePath(__APP_BASE_PATH__ || '')

export function withBasePath(path = ''): string {
  if (!path) {
    return BASE_PATH || '/'
  }
  if (isExternalPath(path)) {
    return path
  }
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${BASE_PATH}${normalizedPath}` || normalizedPath
}

export function getOriginWithBasePath(): string {
  if (typeof window === 'undefined') {
    return BASE_PATH || ''
  }
  return `${window.location.origin}${BASE_PATH}`
}

export function resolveBasePathAssetUrl(url = ''): string {
  if (!url) {
    return withBasePath('/logo.png')
  }
  if (isExternalPath(url) || !url.startsWith('/')) {
    return url
  }
  return withBasePath(url)
}
