import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'

const DashboardLayout = () => {
    return (
        <div className="flex">
            <Sidebar />
            <div className="h-screen flex-1 overflow-y-auto p-4">
                <Outlet />
            </div>
        </div>
    )
}

export default DashboardLayout
