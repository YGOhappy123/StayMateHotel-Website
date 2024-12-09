import { Suspense } from 'react'
import { OverallDashboardPage, RoomDashboardPage, RoomClassDashboardPage, FloorDashboardPage, FeatureDashboardPage } from '@/pages/DashboardPage'
import DashboardLayout from '@/layouts/DashboardLayout'
import ErrorPage from '@/pages/ErrorPage'
import AuthProtector from '@/components/container/AuthProtector'

const DashboardRoutes = [
    {
        path: '/dashboard',
        element: (
            <Suspense>
                <AuthProtector children={<DashboardLayout />} redirect="/auth" allowedRoles={['Admin']} />
            </Suspense>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: '',
                element: <OverallDashboardPage />
            },
            {
                path: 'rooms',
                element: <RoomDashboardPage />
            },
            {
                path: 'room-classes',
                element: <RoomClassDashboardPage />
            },
            {
                path: 'floors',
                element: <FloorDashboardPage />
            },
            {
                path: 'features',
                element: <FeatureDashboardPage />
            }
        ]
    }
]

export default DashboardRoutes
