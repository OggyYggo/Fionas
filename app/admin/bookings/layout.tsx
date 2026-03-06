import { SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from '@/components/layout/app-sidebar'

export default function BookingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <main className="flex-1 overflow-auto w-full" style={{ width: 'calc(100% - 288px) !important', marginLeft: '288px' }}>
          <div className="w-full px-4 sm:px-6 lg:px-8 pt-[50px]" style={{ width: '100% !important', maxWidth: 'none !important' }}>
            {children}
          </div>
        </main>
      </SidebarProvider>
    </div>
  )
}
