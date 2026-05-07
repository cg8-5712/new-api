import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { getSelf } from '@/lib/api'
import { toAppPath } from '@/lib/base-path'
import { AuthenticatedLayout } from '@/components/layout'

// 内存中的验证标记，避免同一会话中重复验证
let sessionVerified = false

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const { auth } = useAuthStore.getState()

    if (!auth.user) {
      throw redirect({
        to: '/sign-in',
        search: { redirect: toAppPath(location.href, '/') },
      })
    }

    if (!sessionVerified) {
      const res = await getSelf().catch(() => null)
      if (res?.success && res.data) {
        auth.setUser(res.data)
        sessionVerified = true
      } else {
        auth.reset()
        throw redirect({
          to: '/sign-in',
          search: { redirect: toAppPath(location.href, '/') },
        })
      }
    }
  },
  component: AuthenticatedLayout,
})
