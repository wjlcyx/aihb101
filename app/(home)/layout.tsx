import Layout from '@/components/home/Layout'
import { ReactNode } from 'react'

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <Layout>
      {children}
    </Layout>
  )
}



 

 