"use client"

import React, { useEffect, useState } from 'react'
import { useGuard } from '@authing/guard-react18'
import { useRouter } from 'next/navigation'
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

// 这里是默认值的设置
const defaultUser = {
  name: '游客',
  email: '',
  avatar: 'https://files.authing.co/authing-console/default-user-avatar.png'
}

export function NavUser() {
  const { isMobile } = useSidebar()
  const guard = useGuard()
  const router = useRouter()
  const [userInfo, setUserInfo] = useState(defaultUser)  // 使用默认值

  useEffect(() => {
    const updateUserInfo = async () => {
      if (typeof window !== 'undefined') {
        try {
          const loginStatus = await guard.checkLoginStatus()
          if (loginStatus) {
            const authingUser = await guard.trackSession()
            if (authingUser) {
              setUserInfo({
                name: authingUser.username || authingUser.nickname || 'cool',
                email: authingUser.email || '新年好',
                avatar: authingUser.photo || 'https://files.authing.co/authing-console/default-user-avatar.png'
              })
            }
          }
        } catch (error) {
          console.error('Get user info error:', error)
        }
      }
    }

    updateUserInfo()
  }, [guard])

  const handleLogin = () => {
    guard.startWithRedirect({
      state: 'some-random-string'
    })
  }

  const handleLogout = async () => {
    try {
      await guard.logout()
      // 重置用户信息
      setUserInfo({
        name: '游客',
        email: '未登录',
        avatar: 'https://files.authing.co/authing-console/default-user-avatar.png'
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{userInfo.name}</span>
                <span className="truncate text-xs">{userInfo.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{userInfo.name}</span>
                  <span className="truncate text-xs">{userInfo.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleLogin}>
                <Sparkles className="mr-2 h-4 w-4" />
                登录
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              登出
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
