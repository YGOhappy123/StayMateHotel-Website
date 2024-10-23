import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { signOut } from '@/slices/authSlice'
import { AxiosInstance } from 'axios'
import toastConfig from '@/configs/toast'
import cookies from '@/libs/cookies'
import dayjs from '@/libs/dayjs'

export default function useRefreshTokenFn(axiosIns: AxiosInstance) {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleError = () => {
        toast('Phiên đăng nhập hết hạn. Xin vui lòng đăng nhập lại.', toastConfig('info'))
        dispatch(signOut())
        navigate('/auth')
    }

    const refreshToken = async () =>
        new Promise<string | null>((resolve, reject) => {
            axiosIns({
                url: '/auth/refresh',
                method: 'POST',
                validateStatus: null,
                data: {
                    refreshToken: cookies.get('refresh_token') || localStorage.getItem('refresh_token')
                }
            })
                .then(res => {
                    const { accessToken } = res?.data?.data
                    if (accessToken) {
                        cookies.set('access_token', accessToken, {
                            path: '/',
                            expires: new Date(dayjs(Date.now()).add(30, 'minutes').toISOString())
                        })
                        resolve(accessToken)
                    } else {
                        handleError()
                        resolve(null)
                    }
                })
                .catch(error => {
                    handleError()
                    reject(error)
                })
        })

    return refreshToken
}
