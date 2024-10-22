import type { ToastOptions, TypeOptions } from 'react-toastify'

export default (type: TypeOptions): ToastOptions => ({
    type,
    position: 'top-right',
    hideProgressBar: true,
    progress: undefined,
    theme: 'dark',
    pauseOnHover: false,
    autoClose: 2000
})
