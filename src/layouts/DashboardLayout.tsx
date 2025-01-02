import { Outlet } from 'react-router-dom'
import DashboardSidebar from '@/components/layout/DashboardSidebar'

const DashboardLayout = () => {
    return (
        <div className="flex">
            <DashboardSidebar />
            <main className="h-screen flex-1 overflow-y-auto p-4">
                <Outlet />
            </main>
        </div>
    )
}

export default DashboardLayout
