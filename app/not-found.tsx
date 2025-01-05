'use client'

import Link from 'next/link'
import { useClientSide } from '@/hooks/use-client-side'

export default function NotFound() {
  const isClient = useClientSide()

  if (!isClient) {
    return null // 或者返回一个加载状态
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">
          页面未找到
        </h2>
        <p className="text-gray-500 mb-8">
          抱歉，您访问的页面不存在。
        </p>
        <Link 
          href="/"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          返回首页
        </Link>
      </div>
    </div>
  )
}