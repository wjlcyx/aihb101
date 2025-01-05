'use client'
import React from 'react'
import { GuardProvider } from '@authing/guard-react18'

// Authing 配置
const guardConfig = {
  appId: '67779b0a999fafbd18f2ed7b',
  host: 'https://my-aihb.authing.cn',
  redirectUri: 'http://localhost:3000/callback',
  isSSO: true
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <GuardProvider
      {...guardConfig}
    >
      {children}
    </GuardProvider>
  )
} 