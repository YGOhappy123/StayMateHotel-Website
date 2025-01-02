import { useEffect } from 'react'
import useTitle from '@/hooks/useTitle'
import BookingHeroSection from '@/pages/BookingPage/BookingHeroSection'
import RoomListSection from '@/pages/BookingPage/RoomListSection'

const BookingPage = () => {
    useTitle('Stay Mate Hotel | Đặt Phòng')
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="-mt-[150px]">
            <BookingHeroSection />
            <RoomListSection />
        </div>
    )
}

export default BookingPage
