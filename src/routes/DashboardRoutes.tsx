import { Suspense } from 'react'
//<<<<<<< HEAD
//import { OverallDashboardPage, RoomDashboardPage, RoomClassDashboardPage, FloorDashboardPage, FeatureDashboardPage, ServiceDashboardPage } from '@/pages/DashboardPage'
//=======
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
//>>>>>>> 1cd8cab0707b2854f923c894484e4e03cb486432
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
                path: 'services',
                element: <ServiceDashboardPage />
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
