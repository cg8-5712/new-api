import { z } from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { toAppPath } from '@/lib/base-path'
import { SignIn } from '@/features/auth/sign-in'

const searchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/(auth)/sign-in')({
  component: SignIn,
  validateSearch: searchSchema,
  beforeLoad: async ({ search }) => {
    const { auth } = useAuthStore.getState()

    // 如果已经有用户信息，说明已登录
    if (auth.user) {
      throw redirect({
        to: toAppPath(search?.redirect || '/dashboard', '/dashboard'),
      })
    }
  },
})
