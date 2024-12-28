import { useGoogleLogin } from '@react-oauth/google'
import authService from '@/services/authService'

type GoogleAuthButtonProps = {
    text: string
}

const GoogleAuthButton = ({ text }: GoogleAuthButtonProps) => {
    const { googleAuthMutation } = authService()
    const handleGoogleAuth = useGoogleLogin({
        onSuccess: async res => {
            googleAuthMutation.mutate(res.access_token)
        }
    })

    return (
        <button
            type="button"
            className="mt-8 flex w-full items-center rounded-full bg-black p-1 hover:bg-black/90"
            onClick={() => handleGoogleAuth()}
        >
            <div className="flex aspect-square w-[50px] items-center justify-center rounded-full bg-white p-[10px]">
                <img src="/images/google-brand.png" className="object-contain" />
            </div>
            <span className="mr-[50px] w-full text-center text-white">{text}</span>
        </button>
    )
}

export default GoogleAuthButton
