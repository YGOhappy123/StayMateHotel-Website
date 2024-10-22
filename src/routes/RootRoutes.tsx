import { Suspense } from 'react'
import MainLayout from '@/layouts/MainLayout'
import ErrorPage from '@/pages/ErrorPage'
import HomePage from '@/pages/HomePage'

const RootRoutes = [
    {
        path: '/',
        element: (
            <Suspense>
                <MainLayout />
            </Suspense>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: '',
                element: <HomePage />
            }
        ]
    }
]

export default RootRoutes
