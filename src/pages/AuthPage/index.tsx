import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { RootState } from '@/store'
import useTitle from '@/hooks/useTitle'
import toastConfig from '@/configs/toast'
import SignInForm from '@/pages/AuthPage/SignInForm'

export type FormType = 'signIn' | 'signUp' | 'forgot' | 'reset'

const AuthPage = () => {
    useTitle('Stay Mate Hotel | Tài Khoản')
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const { isLogged } = useSelector(
        (state: RootState) => state.auth,
        () => true
    )
    const [formType, setFormType] = useState<FormType>('signIn')

    if (isLogged) {
        toast('Bạn đã đăng nhập rồi. Nếu bạn muốn sử dụng một tài khoản khác, vui lòng đăng xuất khỏi tài khoản hiện tại.', toastConfig('info'))
        return <Navigate to="/" />
    } else {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-accent">
                <div className="flex gap-3 rounded-xl bg-ivory p-3">
                    <div className="h-[610px] w-[500px] bg-secondary"></div>
                    <div className="h-[610px] w-[500px]">{formType === 'signIn' && <SignInForm changeFormType={setFormType} />}</div>
                </div>
            </div>
        )
    }
}

export default AuthPage
