import { useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faChartLine, faChevronRight, faConciergeBell, faHome, faTasks, faUser, faUserFriends } from '@fortawesome/free-solid-svg-icons'

import { RootState } from '@/store'
import { signOut } from '@/slices/authSlice'
import SidebarSubMenu from '@/components/layout/SidebarSubMenu'
import Button from '@/components/common/Button'

const SUB_MENU_LIST = [
    {
        label: 'Chăm sóc khách hàng',
        icon: faUser,
        items: [
            {
                label: 'Khách hàng',
                navigation: 'customers'
            },
            {
                label: 'Đơn đặt phòng',
                navigation: 'bookings'
            }
        ]
    },
    {
        label: 'Vật tư khách sạn',
        icon: faBuilding,
        items: [
            {
                label: 'Phòng khách sạn',
                navigation: 'rooms'
            },
            {
                label: 'Loại phòng',
                navigation: 'room-classes'
            },
            {
                label: 'Tầng khách sạn',
                navigation: 'floors'
            }
        ]
    },
    {
        label: 'Tiện ích và dịch vụ',
        icon: faConciergeBell,
        items: [
            {
                label: 'Tiện ích',
                navigation: 'features'
            },
            {
                label: 'Dịch vụ',
                navigation: 'services'
            },
            {
                label: 'Đơn đặt dịch vụ',
                navigation: 'service-bookings'
            }
        ]
    }
]

export const MOTION_EFFECTS = {
    openSubMenu: { height: 'fit-content' },
    closeSubMenu: { height: 0 },
    wideScreenVariants: {
        open: {
            width: '16rem',
            transition: {
                damping: 40
            }
        },
        closed: {
            width: '4rem',
            transition: {
                damping: 40
            }
        }
    }
}

const Sidebar = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const user = useSelector((state: RootState) => state.auth.user)
    const [isOpen, setIsOpen] = useState(true)
    const sidebarRef = useRef(null)

    return (
        <div>
            <motion.div
                ref={sidebarRef}
                variants={MOTION_EFFECTS.wideScreenVariants}
                animate={isOpen ? 'open' : 'closed'}
                initial={{ x: 0 }}
                className="sticky top-0 flex h-screen w-64 max-w-[16rem] flex-col overflow-hidden bg-white shadow-xl"
            >
                <div
                    className="mx-3 flex cursor-pointer items-center justify-center gap-2.5 border-b border-slate-300 py-3 font-medium"
                    style={{
                        height: 'var(--sidebar-logo-height)'
                    }}
                    onClick={() => navigate('/')}
                >
                    <img src="/images/no-text-logo.png" width={45} alt="" />
                    <span className={`whitespace-pre text-xl ${!isOpen && 'hidden'}`}>StayMeHotel</span>
                </div>

                <div className="flex flex-col" style={{ height: 'calc(100% - var(--sidebar-logo-height))' }}>
                    <ul className="scrollbar-thin scrollbar-track-white scrollbar-thumb-slate-100 flex flex-1 flex-col gap-1 overflow-hidden overflow-y-auto whitespace-pre px-2.5 py-5 text-[0.9rem] font-medium">
                        <li>
                            <NavLink to={'/'} className="link">
                                <div className="flex w-6 justify-center">
                                    <FontAwesomeIcon icon={faHome} className="min-w-max" size="xl" />
                                </div>
                                Về trang chủ
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to={'/dashboard'} className="link">
                                <div className="flex w-6 justify-center">
                                    <FontAwesomeIcon icon={faTasks} className="min-w-max" size="xl" />
                                </div>
                                Tình hình hoạt động
                            </NavLink>
                        </li>

                        {isOpen && (
                            <div className="border-y border-slate-300 py-5">
                                <small className="mb-2 inline-block pl-3 text-slate-500">Khách sạn</small>
                                {SUB_MENU_LIST?.map(({ label, icon, items }) => (
                                    <div key={label} className="flex flex-col gap-1">
                                        <SidebarSubMenu label={label} Icon={icon} items={items} />
                                    </div>
                                ))}
                            </div>
                        )}

                        <li>
                            <NavLink to={'/dashboard/admins'} className="link">
                                <div className="flex w-6 justify-center">
                                    <FontAwesomeIcon icon={faUserFriends} className="min-w-max" size="xl" />
                                </div>
                                Nhân sự
                            </NavLink>
                        </li>

                        <li>
                            <NavLink to={'/dashboard/statistics'} className="link">
                                <div className="flex w-6 justify-center">
                                    <FontAwesomeIcon icon={faChartLine} className="min-w-max" size="xl" />
                                </div>
                                Thống kê
                            </NavLink>
                        </li>
                    </ul>

                    <div className="z-50 mt-auto max-h-48 w-full whitespace-pre text-sm font-medium">
                        {isOpen && (
                            <div className="flex items-center justify-between border-y border-slate-300 p-4">
                                <div>
                                    <p>
                                        {user.lastName} {user.firstName}
                                    </p>
                                    <small>Mã admin: {user.id}</small>
                                </div>
                                <Button
                                    text="Đăng xuất"
                                    variant="gradient"
                                    className="min-w-fit rounded-2xl px-3 py-1.5 text-xs"
                                    onClick={() => dispatch(signOut())}
                                />
                            </div>
                        )}

                        <button className="flex w-full cursor-pointer items-center justify-center p-3" onClick={() => setIsOpen(prev => !prev)}>
                            <FontAwesomeIcon icon={faChevronRight} className={`${!isOpen && 'rotate-180'} duration-200 ease-in-out`} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default Sidebar
