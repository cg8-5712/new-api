/**
 * Application-wide constants
 */

import { resolveBasePathAssetUrl } from '@/lib/base-path'

// System Configuration Defaults
export const DEFAULT_SYSTEM_NAME = 'New API'
export const DEFAULT_LOGO = resolveBasePathAssetUrl('/logo.png')

// LocalStorage Keys
export const STORAGE_KEYS = {
  SYSTEM_NAME: 'system_name',
  LOGO: 'logo',
  FOOTER_HTML: 'footer_html',
} as const
