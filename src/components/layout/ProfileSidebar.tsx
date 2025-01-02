import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

const ProfileSidebar = () => {
    const navigate = useNavigate()
    const user = useSelector((state: RootState) => state.auth.user)

    return (
        <div className="relative rounded-xl bg-black p-[55px] pb-[45px] pt-[70px] text-white lg:w-[440px]">
            <div className="absolute left-[91px] top-0 h-[35px] w-[14px] bg-primary before:absolute before:-left-[22px] before:top-0 before:h-full before:w-full before:bg-primary after:absolute after:-right-[22px] after:top-0 after:h-full after:w-full after:bg-primary"></div>
            <button className="h-[80px] overflow-hidden rounded-lg" onClick={() => navigate('/')}>
                <img src="/images/white-bg-logo.png" alt="app-logo" className="h-full object-contain" />
            </button>
            <h2 className="font-oswald mt-8 text-4xl font-semibold uppercase">Xin chào !</h2>
            <h3 className="font-oswald mt-4 text-2xl font-semibold uppercase">
                {user.lastName} {user.firstName}
            </h3>
            <span className="mt-6 inline-block cursor-pointer capitalize underline hover:text-white/90">Đăng xuất</span>
            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-1">
                <NavLink to="/profile/edit" className={({ isActive }) => `text-lg ${isActive ? 'text-primary' : 'text-white/50 hover:text-white'}`}>
                    Chỉnh sửa tài khoản
                </NavLink>
                {user.role === 'Guest' && (
                    <NavLink
                        to="/profile/bookings"
                        className={({ isActive }) => `text-lg ${isActive ? 'text-primary' : 'text-white/50 hover:text-white'}`}
                    >
                        Quản lý đơn đặt phòng
                    </NavLink>
                )}
                <NavLink
                    to="/profile/change-password"
                    className={({ isActive }) => `text-lg ${isActive ? 'text-primary' : 'text-white/50 hover:text-white'}`}
                >
                    Đổi mật khẩu
                </NavLink>
                <NavLink
                    to="/profile/change-avatar"
                    className={({ isActive }) => `text-lg ${isActive ? 'text-primary' : 'text-white/50 hover:text-white'}`}
                >
                    Đổi ảnh đại diện
                </NavLink>
            </div>
            <div className="mb-3 mt-5 h-0.5 bg-white/50"></div>
            <span className="inline-block cursor-pointer text-lg font-medium capitalize text-[#FF0000]">Khóa tài khoản</span>
        </div>
    )
}

export default ProfileSidebar
