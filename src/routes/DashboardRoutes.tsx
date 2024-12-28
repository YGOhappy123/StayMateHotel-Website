import { Suspense } from 'react'
import {
    OverallDashboardPage,
    RoomDashboardPage,
    RoomClassDashboardPage,
    FloorDashboardPage,
    FeatureDashboardPage,
    ServiceDashboardPage,
    CustomerDashboardPage,
    AdminDashboardPage
} from '@/pages/DashboardPage'
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
            },
            {
                path: 'services',
                element: <ServiceDashboardPage />
            },
            {
                path: 'customers',
                element: <CustomerDashboardPage />
            },
            {
                path: 'admins',
                element: <AdminDashboardPage />
            }
        ]
    }
]

export default DashboardRoutes
