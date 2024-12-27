import { useEffect, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { RootState } from '@/store'
import useTitle from '@/hooks/useTitle'
import toastConfig from '@/configs/toast'
import SignInForm from '@/pages/AuthPage/SignInForm'
import SignUpForm from '@/pages/AuthPage/SignUpForm'
import ForgotPasswordForm from '@/pages/AuthPage/ForgotPasswordForm'
import ResetPasswordForm from '@/pages/AuthPage/ResetPasswordForm'

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
    const [query] = useSearchParams()
    const [formType, setFormType] = useState<FormType>('signIn')

    useEffect(() => {
        if (query.get('type')) {
            setFormType(query.get('type') as FormType)
        }
    }, [query])

    if (isLogged) {
        toast('Bạn đã đăng nhập rồi. Nếu bạn muốn sử dụng một tài khoản khác, vui lòng đăng xuất khỏi tài khoản hiện tại.', toastConfig('info'))
        return <Navigate to="/" />
    } else {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-accent">
                <div className="flex gap-3 rounded-xl bg-ivory p-3">
                    <div className="h-[640px] w-[540px] bg-secondary"></div>
                    <div className="h-[640px] w-[540px]">
                        {formType === 'signIn' && <SignInForm changeFormType={setFormType} />}
                        {formType === 'signUp' && <SignUpForm changeFormType={setFormType} />}
                        {formType === 'forgot' && <ForgotPasswordForm changeFormType={setFormType} />}
                        {formType === 'reset' && <ResetPasswordForm changeFormType={setFormType} />}
                    </div>
                </div>
            </div>
        )
    }
}

export default AuthPage
