"use client";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, profile } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen bg-space-900 flex items-center justify-center"><Loader2 className="h-6 w-6 text-purple-500 animate-spin" /></div>;
  }

  return (
    <div className="flex h-screen bg-space-900 overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">{children}</div>
      </main>
    </div>
  );
}
