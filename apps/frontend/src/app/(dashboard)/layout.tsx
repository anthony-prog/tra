import Navbar from "@/components/navbar";
import { Sidebar } from "@/components/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="flex h-screen w-full overflow-hidden">
          <Sidebar />
          <div className="flex flex-1 flex-col">
            <Navbar />
            <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
} 