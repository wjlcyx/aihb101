'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { useGuard } from '@authing/guard-react18'
import { useRouter } from 'next/navigation'
import type { User } from '@authing/guard-react18'

export default function Jump() {
  const guard = useGuard()
  const router = useRouter()
  const [userInfo, setUserInfo] = useState<User | null>(null)

  const getLoginState = useCallback(async () => {
    try {
      const loginStatus = await guard.checkLoginStatus()
      if (loginStatus) {
        const user = await guard.trackSession()
        setUserInfo(user)
        router.push('/personal')
      } else {
        // 如果未登录，直接开始登录流程
        guard.startWithRedirect({
          state: 'some-random-string'
        })
      }
    } catch (error) {
      console.error('Get login state error:', error)
    }
  }, [guard, router])

  useEffect(() => {
    getLoginState()
  }, [getLoginState])

  // 返回一个加载提示，因为页面会很快跳转
  return <div>正在跳转登录页面...</div>
}