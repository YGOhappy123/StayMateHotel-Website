import { Outlet } from 'react-router-dom'
import Appbar from '@/components/layout/Appbar'
import Footer from '@/components/layout/Footer'
import ProfileSidebar from '@/components/layout/ProfileSidebar'

const ProfileLayout = () => {
    return (
        <div className="flex min-h-screen flex-col bg-ivory">
            <Appbar showTopBar={true} />
            <main className="flex flex-col items-center bg-ivory px-5 pb-[100px]">
                <div className="flex w-full max-w-container flex-col items-start gap-12 lg:flex-row">
                    <ProfileSidebar />
                    <Outlet />
                </div>
            </main>
            <Footer />
        </div>
    )
}
export default ProfileLayout
