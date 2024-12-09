import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'

const DashboardLayout = () => {
    return (
        <div className="flex">
            <Sidebar />
            <div>
                <Outlet />
            </div>
        </div>
    )
}

export default DashboardLayout
