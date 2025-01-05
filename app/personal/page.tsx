'use client'
import { useGuard, User } from '@authing/guard-react18'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Personal() {
  const [userInfo, setUserInfo] = useState<User | null>(null)
  const guard = useGuard()
  const router = useRouter()

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const user = await guard.trackSession()
        setUserInfo(user)
      } catch (error) {
        console.error('Get user info error:', error)
        router.push('/jump')  // 如果获取用户信息失败，跳转到登录页
      }
    }

    getUserInfo()
  }, [guard, router])

  if (!userInfo) {
    return <div>加载中...</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">个人信息</h1>
      <div className="space-y-4">
        <div>
          <img 
            src={userInfo.photo || 'https://files.authing.co/authing-console/default-user-avatar.png'} 
            alt="avatar" 
            className="w-20 h-20 rounded-full"
          />
        </div>
        <div>
          <strong>用户名：</strong> {userInfo.username || '未设置'}
        </div>
        <div>
          <strong>昵称：</strong> {userInfo.nickname || '未设置'}
        </div>
        <div>
          <strong>邮箱：</strong> {userInfo.email || '未设置'}
        </div>
        <div>
          <strong>手机：</strong> {userInfo.phone || '未设置'}
        </div>
        <button 
          className="authing-button"
          onClick={() => router.push('/')}
        >
          返回首页
        </button>
      </div>
    </div>
  )
} 