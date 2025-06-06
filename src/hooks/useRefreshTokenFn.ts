import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { signOut } from '@/slices/authSlice'
import { AxiosInstance } from 'axios'
import toastConfig from '@/configs/toast'
import cookies from '@/libs/cookies'
import dayjs from '@/libs/dayjs'

const useRefreshTokenFn = (axiosIns: AxiosInstance) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleError = () => {
        toast('Phiên đăng nhập hết hạn. Xin vui lòng đăng nhập lại.', toastConfig('info'))
        dispatch(signOut())
        navigate('/auth')
    }

    const refreshTokenFn = async (refreshToken: string) =>
        new Promise<string | null>((resolve, reject) => {
            axiosIns({
                url: '/auth/refresh-token',
                method: 'POST',
                validateStatus: null,
                data: {
                    refreshToken: refreshToken
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

    return refreshTokenFn
}

export default useRefreshTokenFn
