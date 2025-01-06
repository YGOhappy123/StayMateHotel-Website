import { twMerge } from 'tailwind-merge'

type ButtonProps = {
    text: string
    type?: 'submit' | 'reset' | 'button' | undefined
    variant?: 'primary' | 'gradient' | 'info' | 'success' | 'warning' | 'danger' | undefined
    className?: string
    disabled?: boolean
    onClick?: () => void
}

const Button = ({ text, type = 'button', variant, className, disabled = false, onClick }: ButtonProps) => {
    let variantStyles = ''
    switch (variant) {
        case 'primary':
            variantStyles = 'border-primary bg-primary text-white disabled:border-gray-600 disabled:bg-gray-100 disabled:text-gray-600'
            break
        case 'gradient':
            variantStyles = 'border-primary bg-gradient-to-r from-accent to-primary text-white'
            break
        case 'info':
            variantStyles = 'border-blue-600 bg-blue-100 text-blue-600 disabled:border-gray-600 disabled:bg-gray-100 disabled:text-gray-600'
            break
        case 'success':
            variantStyles = 'border-green-600 bg-green-100 text-green-600 disabled:border-gray-600 disabled:bg-gray-100 disabled:text-gray-600'
            break
        case 'warning':
            variantStyles = 'border-yellow-600 bg-yellow-100 text-yellow-600 disabled:border-gray-600 disabled:bg-gray-100 disabled:text-gray-600'
            break
        case 'danger':
            variantStyles = 'border-red-600 bg-red-100 text-red-600 disabled:border-gray-600 disabled:bg-gray-100 disabled:text-gray-600'
            break
        default:
            variantStyles = 'border-black bg-black/10 disabled:border-gray-600 disabled:bg-gray-100 disabled:text-gray-600'
    }

    const handleClick = () => {
        if (disabled) return
        if (typeof onClick === 'function') onClick()
    }

    return (
        <button
            className={twMerge(
                `min-w-[120px] rounded-md border-2 border-solid px-6 py-3 font-medium hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${variantStyles} ${className}`
            )}
            type={type}
            disabled={disabled}
            onClick={handleClick}
        >
            {text}
        </button>
    )
}

export default Button
