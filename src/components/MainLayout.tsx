import { Outlet } from "react-router";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useState } from "react";
import { Plus } from "lucide-react";

export const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    return (
        <div className="flex min-h-screen bg-gray-50 w-full">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
                {/* Floating Action Button */}
                <button
                    onClick={() => console.log('Create Invoice')}
                    className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-colors duration-200 flex items-center justify-center group"
                    aria-label="Create Invoice"
                >
                    <Plus className="h-6 w-6" />
                    <span className="absolute right-14 bg-gray-900 text-white px-3 py-2 rounded text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
                        Crear Factura
                    </span>
                </button>
            </div>
        </div>
    );
}
