import { Suspense } from 'react'
import AuthProtector from '@/components/container/AuthProtector'
import FragmentLayout from '@/layouts/FragmentLayout'
import ErrorPage from '@/pages/ErrorPage'
import ThankYouPage from '@/pages/ThankYouPage'

const FragmentRoutes = [
    {
        path: '/',
        element: (
            <Suspense>
                <FragmentLayout />
            </Suspense>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: 'thank-you/:bookingId',
                element: <AuthProtector children={<ThankYouPage />} redirect="/auth" allowedRoles={['Guest']} />
            }
        ]
    }
]

export default FragmentRoutes
