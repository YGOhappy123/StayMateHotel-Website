import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faPhoneSquare } from '@fortawesome/free-solid-svg-icons'
import { RootState } from '@/store'
import { signOut } from '@/slices/authSlice'
import { NAVIGATION_TABS, SOCIAL_LINKS } from '@/configs/constants'
import toastConfig from '@/configs/toast'

type AppbarProps = {
    showTopBar: boolean
}

const Appbar = ({ showTopBar }: AppbarProps) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user, isLogged } = useSelector((state: RootState) => state.auth)

    return (
        <header className={`sticky top-0 z-[1000] flex flex-col items-center px-5 ${showTopBar ? '' : 'bg-primary'}`}>
            {showTopBar && (
                <div className="flex h-topbar w-full max-w-container items-center justify-between rounded-b-3xl bg-primary px-5 text-ivory">
                    <div className="flex items-center gap-9">
                        <div className="flex items-center gap-[10px]">
                            <FontAwesomeIcon icon={faEnvelope} className="min-w-max" size="lg" />
                            <span className="font-normal">Staymatehotel@gmail.com</span>
                        </div>
                        <div className="flex items-center gap-[10px]">
                            <FontAwesomeIcon icon={faPhoneSquare} className="min-w-max" size="lg" />
                            <span className="font-normal">(+84)913.283.742</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {SOCIAL_LINKS.map(link => (
                            <Link key={link.url} to={link.url}>
                                <FontAwesomeIcon icon={link.icon} className="min-w-max" size="lg" />
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex h-navbar w-full max-w-container items-center justify-between">
                <div
                    className="flex cursor-pointer items-center justify-center gap-2.5 py-3 font-medium"
                    style={{
                        height: 'var(--sidebar-logo-height)'
                    }}
                    onClick={() => navigate('/')}
                >
                    <img src="/images/no-text-logo.png" width={45} alt="" />
                    <span className="whitespace-pre text-xl tracking-widest text-white">StayMateHotel</span>
                </div>

                <div className="flex items-center gap-9">
                    {NAVIGATION_TABS.filter(tab => !tab.roles || tab.roles?.includes(user?.role)).map(tab => (
                        <NavLink key={tab.href} to={tab.href} className={({ isActive }) => (isActive ? 'text-secondary' : 'text-white')}>
                            <span className="font-semibold uppercase tracking-wide hover:text-secondary">{tab.label}</span>
                        </NavLink>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    {user?.avatar && (
                        <button
                            className="flex aspect-square h-[60px] items-center justify-center overflow-hidden rounded-full border-2 border-primary bg-ivory"
                            onClick={() => navigate('/profile')}
                        >
                            <img src={user.avatar} alt="user avatar" className="h-full w-full object-cover" />
                        </button>
                    )}
                    <button
                        className="flex h-[60px] w-[200px] items-center justify-center rounded-full border-2 border-primary bg-ivory font-semibold uppercase tracking-widest text-primary hover:bg-[#DBD6CA]"
                        onClick={() => {
                            if (isLogged) {
                                dispatch(signOut())
                                navigate('/')
                                toast('Đăng xuất thành công', toastConfig('success'))
                            } else {
                                navigate('/auth')
                            }
                        }}
                    >
                        {isLogged ? 'đăng xuất' : 'đăng nhập'}
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Appbar
