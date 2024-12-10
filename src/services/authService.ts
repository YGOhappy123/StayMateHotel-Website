import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'

import { onError } from '@/utils/errorsHandler'
import { setLogged, setUser } from '@/slices/authSlice'
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
            toast(res.data.message, toastConfig('success'))
        }
    })

    return {
        signInMutation
    }
}

export default authService
