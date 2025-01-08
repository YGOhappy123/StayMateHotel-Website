import { useEffect } from 'react'
import useTitle from '@/hooks/useTitle'

const ManageBookingsPage = () => {
    useTitle('Stay Mate Hotel | Đơn Đặt Phòng')
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="flex-1">
            <h3 className="font-oswald mb-6 text-4xl uppercase leading-[50px] text-primary">Đơn đặt phòng của tôi</h3>
        </div>
    )
}

export default ManageBookingsPage
