import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '@/store'
import { signOut } from '@/slices/authSlice'
import useTitle from '@/hooks/useTitle'

const HomePage = () => {
    useTitle('Stay Mate Hotel | Trang Chủ')
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const { user, isLogged } = useSelector((state: RootState) => state.auth)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    return (
        <div className="flex min-h-screen flex-col items-center justify-center text-xl font-bold text-red-700">
            {isLogged ? <button onClick={() => dispatch(signOut())}>Đăng xuất</button> : <button onClick={() => navigate('/auth')}>Đăng nhập</button>}

            {user && user.role === 'Admin' && <button onClick={() => navigate('/dashboard')}>Đến trang quản lý</button>}
        </div>
    )
}

export default HomePage
