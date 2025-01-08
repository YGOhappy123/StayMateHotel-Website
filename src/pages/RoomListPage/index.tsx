import { useEffect } from 'react'
import useTitle from '@/hooks/useTitle'
import RoomListHeroSection from '@/pages/RoomListPage/RoomListHeroSection'
import RoomListSection from '@/pages/RoomListPage/RoomListSection'

const RoomListPage = () => {
    useTitle('Stay Mate Hotel | Danh Sách Phòng')
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="-mt-[150px]">
            <RoomListHeroSection />
            <RoomListSection />
        </div>
    )
}

export default RoomListPage
