import { useEffect, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/Carousel'
import Autoplay from 'embla-carousel-autoplay'

import { RootState } from '@/store'
import useTitle from '@/hooks/useTitle'
import toastConfig from '@/configs/toast'
import SignInForm from '@/pages/AuthPage/SignInForm'
import SignUpForm from '@/pages/AuthPage/SignUpForm'
import ForgotPasswordForm from '@/pages/AuthPage/ForgotPasswordForm'
import ResetPasswordForm from '@/pages/AuthPage/ResetPasswordForm'

export type FormType = 'signIn' | 'signUp' | 'forgot' | 'reset'

const POSTER_IMAGES = [
    'https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=2400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
]

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
                    <Carousel
                        plugins={[
                            Autoplay({
                                delay: 2000
                            })
                        ]}
                    >
                        <CarouselContent className="h-[640px] w-[540px]">
                            {POSTER_IMAGES.map(imageUrl => (
                                <CarouselItem key={imageUrl}>
                                    <div className="flex h-full items-center justify-center overflow-hidden rounded-lg">
                                        <img src={imageUrl} alt="room image" className="min-h-full min-w-full object-cover" />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>

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
