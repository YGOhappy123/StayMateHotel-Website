import { Suspense } from 'react'
import { Navigate } from 'react-router-dom'
import { EditProfilePage, ChangeAvatarPage, ChangePasswordPage, ManageBookingsPage } from '@/pages/ProfilePage'
import ProfileLayout from '@/layouts/ProfileLayout'
import ErrorPage from '@/pages/ErrorPage'
import AuthProtector from '@/components/container/AuthProtector'

const ProfileRoutes = [
    {
        path: '/profile',
        element: (
            <Suspense>
                <AuthProtector children={<ProfileLayout />} redirect="/auth" allowedRoles={['Guest', 'Admin']} />
            </Suspense>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: '',
                element: <Navigate to="/profile/edit" replace />
            },
            {
                path: 'edit',
                element: <EditProfilePage />
            },
            {
                path: 'change-avatar',
                element: <ChangeAvatarPage />
            },
            {
                path: 'change-password',
                element: <ChangePasswordPage />
            },
            {
                path: 'bookings',
                element: <AuthProtector children={<ManageBookingsPage />} redirect="/auth" allowedRoles={['Guest']} />
            }
        ]
    }
]

export default ProfileRoutes
