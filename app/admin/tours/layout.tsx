import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from '@/components/layout/app-sidebar'

export default function ToursLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset className="flex-1" style={{ marginLeft: '288px' }}>
          <div className="flex-1 overflow-auto">
            <div className="w-full px-6 lg:px-8 pt-[50px] pb-12">
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
