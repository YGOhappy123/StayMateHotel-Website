import { PropsWithChildren, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { AuthState, setLogged, setUser } from '@/slices/authSlice'
import { RootState } from '@/store'
import cookies from '@/libs/cookies'
import toastConfig from '@/configs/toast'

interface AuthProtectorProps extends PropsWithChildren {
    redirect: string
    allowedRoles?: IRole[]
}

export default function AuthProtector({ children, redirect, allowedRoles }: AuthProtectorProps) {
    const accessToken = cookies.get('access_token') || localStorage.getItem('access_token')
    const auth = useSelector((state: RootState) => state.auth as AuthState)
    const location = useLocation()
    const dispatch = useDispatch()

    useEffect(() => {
        cookies.set('redirect_path', location.pathname, { path: '/' })

        if (accessToken) {
            cookies.remove('redirect_path', { path: '/' })
        }
    }, [location])

    const redirectFn = () => {
        dispatch(setLogged(false))
        dispatch(setUser(null as any))
        return <Navigate to={redirect} replace />
    }

    if (!auth.isLogged) {
        return redirectFn()
    } else {
        const isAllowed = allowedRoles?.includes(auth.user?.role!)
        if (isAllowed) {
            return <>{children}</>
        } else {
            toast('Bạn không có quyền truy cập trang này', toastConfig('error'))
            return redirectFn()
        }
    }
}
