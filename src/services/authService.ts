import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'

import { onError } from '@/utils/errorsHandler'
import { setLogged, setUser } from '@/slices/authSlice'
import { getMappedMessage } from '@/utils/resMessageMapping'
import useAxiosIns from '@/hooks/useAxiosIns'
import cookies from '@/libs/cookies'
import toastConfig from '@/configs/toast'

interface SignInResponse {
    user: IUser
    accessToken: string
    refreshToken: string
}

const authService = () => {
    const axios = useAxiosIns()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const signInMutation = useMutation({
        mutationFn: (account: { username: string; password: string }) => axios.post<IResponseData<SignInResponse>>(`/auth/sign-in`, account),
        onError: onError,
        onSuccess: res => {
            const redirectPath = cookies.get('redirect_path') || '/'
            const { user, accessToken, refreshToken } = res.data.data
            cookies.set('access_token', accessToken, { path: '/', expires: new Date(dayjs(Date.now()).add(30, 'day').toISOString()) })
            cookies.set('refresh_token', refreshToken, { path: '/', expires: new Date(dayjs(Date.now()).add(30, 'day').toISOString()) })

            navigate(redirectPath as string)
            dispatch(setLogged(true))
            dispatch(setUser(user))
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const signUpMutation = useMutation({
        mutationFn: (data: { firstName: string; lastName: string; username: string; password: string; confirmPassword: string }) =>
            axios.post<IResponseData<SignInResponse>>('/auth/sign-up', data),
        onError: onError,
        onSuccess: res => {
            const redirectPath = cookies.get('redirect_path') || '/'
            const { user, accessToken, refreshToken } = res.data.data
            cookies.set('access_token', accessToken, { path: '/', expires: new Date(dayjs(Date.now()).add(30, 'day').toISOString()) })
            cookies.set('refresh_token', refreshToken, { path: '/', expires: new Date(dayjs(Date.now()).add(30, 'day').toISOString()) })

            navigate(redirectPath as string)
            dispatch(setLogged(true))
            dispatch(setUser(user))
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    const googleAuthMutation = useMutation({
        mutationFn: (googleAccessToken: string) => axios.post('/auth/google-auth', { googleAccessToken }),
        onError: onError,
        onSuccess: res => {
            const redirectPath = cookies.get('redirect_path') || '/'
            const { user, accessToken, refreshToken } = res.data.data
            cookies.set('access_token', accessToken, { path: '/', expires: new Date(dayjs(Date.now()).add(30, 'day').toISOString()) })
            cookies.set('refresh_token', refreshToken, { path: '/', expires: new Date(dayjs(Date.now()).add(30, 'day').toISOString()) })

            navigate(redirectPath as string)
            dispatch(setLogged(true))
            dispatch(setUser(user))
            toast(getMappedMessage(res.data.message), toastConfig('success'))
        }
    })

    return {
        signInMutation,
        signUpMutation,
        googleAuthMutation
    }
}

export default authService
