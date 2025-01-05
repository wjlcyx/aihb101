"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  SidebarClose,
} from "lucide-react"
import type { LucideIcon } from 'lucide-react'

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// 定义与 NavMain 组件匹配的类型
interface NavMainItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive: boolean;
  items: {
    title: string;
    url: string;
  }[];
}

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "不只执",
      logo: GalleryVerticalEnd,
    },
  ],
  navMain: [
    {
      title: "封面压缩与裁切(官方要求)",
      url: "/compress",
      icon: Frame as LucideIcon,
      isActive: true,
      items: [
        {
          title: "提示：",
          url: "#",
        },
        {
          title: "在工具内添加要修改图片后",
          url: "#",
        },
        {
          title: "即可压缩，尺寸可以不改,但",
          url: "#",
        },
        {
          title: "一定要压缩成500kb以内",
          url: "#",
        },
        {
          title: "点我进工具",
          url: "https://www.gaitubao.com/",
        },
        {
          title: "",
          url: "#",
        },
      ],
    },
    {
      title: "100粉解决方案",
      url: "/solution",
      icon: Bot as LucideIcon,
      isActive: true,
      isExpanded: true,
      items: [
        {
          title: "公众号⭐",
          url: "https://w0qtq148aw8.feishu.cn/wiki/RaRdwlaMkiE1jgkEFdDc66VSn5E?from=from_copylink",
        },
        {
          title: "视频号",
          url: "https://w0qtq148aw8.feishu.cn/wiki/RaRdwlaMkiE1jgkEFdDc66VSn5E?from=from_copylink",
        },
        {
          title: "",
          url: "#",
        },
      ],
    },
    {
      title: "相关网站",
      url: "/websites",
      icon: BookOpen as LucideIcon,
      isActive: true,
      isExpanded: true,
      items: [
        {
          title: "图片转提示词",
          url: "https://imagetoprompt.com/",
        },
        {
          title: "红包封面开放平台",
          url: "https://cover.weixin.qq.com/",
        },
      ],
    },
  ] as NavMainItem[],
  projects: [
    {
      name: "设计工程部",
      url: "#",
      icon: Frame,
    },
    {
      name: "营销部",
      url: "#",
      icon: PieChart,
    },
    {
      name: "差旅管理",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const handleSidebarToggle = () => {
    if (typeof window !== 'undefined') {
      const sidebar = document.querySelector('[role="sidebar"]');
      if (sidebar) {
        sidebar.classList.toggle('collapsed');
      }
    }
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarRail className="flex items-center justify-center">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-300">
          <SidebarClose 
            size={14} 
            className="opacity-25 cursor-pointer" 
            onClick={handleSidebarToggle}
          />
        </div>
      </SidebarRail>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
