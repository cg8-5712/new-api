import { getOriginWithBasePath } from '@/lib/base-path'

// ============================================================================
// Affiliate Functions
// ============================================================================

/**
 * Generate affiliate registration link
 */
export function generateAffiliateLink(affCode: string): string {
  if (typeof window === 'undefined') return ''
  return `${getOriginWithBasePath()}/register?aff=${affCode}`
}
