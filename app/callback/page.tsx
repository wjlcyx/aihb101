'use client'
import React, { useCallback, useEffect } from 'react'
import { JwtTokenStatus, useGuard, User } from '@authing/guard-react18'
import { useRouter } from 'next/navigation'

export default function Callback() {
  const router = useRouter()
  const guard = useGuard()

  const getLoginState = useCallback(async () => {
    try {
      // 检查登录状态
      const loginStatus: JwtTokenStatus | undefined = await guard.checkLoginStatus()
      if (!loginStatus) {
        throw new Error('Not logged in')
      }

      // 获取用户信息
      const userInfo: User | null = await guard.trackSession()
      console.log('Login success:', userInfo)
      
      // 登录成功后返回首页，而不是跳转到个人中心
      router.replace('/')
    } catch (error) {
      console.error('Login state error:', error)
      // 登录失败，跳回登录页
      router.replace('/jump')
    }
  }, [guard, router])

  useEffect(() => {
    // 处理登录回调
    const handleCallback = async () => {
      try {
        await guard.handleRedirectCallback()
        await getLoginState()
      } catch (error) {
        console.error('Callback error:', error)
        router.replace('/jump')
      }
    }

    handleCallback()
  }, [guard, getLoginState, router])

  return <div>登录处理中...</div>
} 