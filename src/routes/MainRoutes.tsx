import { Suspense } from 'react'
import MainLayout from '@/layouts/MainLayout'
import ErrorPage from '@/pages/ErrorPage'
import HomePage from '@/pages/HomePage'
import AboutPage from '@/pages/AboutPage'
import OurServicesPage from '@/pages/OurServicesPage'
import BookingPage from '@/pages/BookingPage'
import RoomListPage from '@/pages/RoomListPage'
import RoomDetailPage from '@/pages/RoomDetailPage'

const MainRoutes = [
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
            },
            {
                path: 'rooms',
                element: <RoomListPage />
            },
            {
                path: 'rooms/:roomId',
                element: <RoomDetailPage />
            },
            {
                path: 'booking',
                element: <BookingPage />
            }
        ]
    }
]

export default MainRoutes
