import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import DashboardSidebar from '@/components/layout/DashboardSidebar'
import useTitle from '@/hooks/useTitle'

const DashboardLayout = () => {
    useTitle('Stay Mate Hotel | Quản Lý Khách Sạn')
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

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
