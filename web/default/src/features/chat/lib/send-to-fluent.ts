import { getOriginWithBasePath } from '@/lib/base-path'

export function sendToFluent(apiKey: string, serverAddress?: string): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  const container = document.getElementById('fluent-new-api-container')
  if (!container) {
    return false
  }

  const payload = {
    id: 'new-api',
    baseUrl: serverAddress || getOriginWithBasePath(),
    apiKey: `sk-${apiKey}`,
  }

  container.dispatchEvent(
    new CustomEvent('fluent:prefill', {
      detail: payload,
    })
  )

  return true
}
