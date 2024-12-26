import { Suspense } from 'react'
import MainLayout from '@/layouts/MainLayout'
import ErrorPage from '@/pages/ErrorPage'
import HomePage from '@/pages/HomePage'
import AboutPage from '@/pages/AboutPage'
import OurServicesPage from '@/pages/OurServicesPage'

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
            },
            {
                path: 'about-us',
                element: <AboutPage />
            },
            {
                path: 'our-services',
                element: <OurServicesPage />
            }
        ]
    }
]

export default RootRoutes
