import { useEffect } from 'react'
import { useQuery } from 'react-query'
import useTitle from '@/hooks/useTitle'
import useAxiosIns from '@/hooks/useAxiosIns'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/common/Button'
import MyBookingCard from '@/pages/ProfilePage/ManageBookingsPage/MyBookingCard'

const ManageBookingsPage = () => {
    useTitle('Stay Mate Hotel | Đơn Đặt Phòng')
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const navigate = useNavigate()
    const axios = useAxiosIns()

    const fetchMyBookingsQuery = useQuery(['my-bookings'], {
        queryFn: () => {
            return axios.get<IResponseData<IBooking[]>>('/bookings/my-bookings')
        },
        refetchOnWindowFocus: false,
        enabled: true,
        select: res => res.data
    })

    const myBookings = fetchMyBookingsQuery.data?.data ?? []

    console.log(myBookings)

    return (
        <div className="flex w-full flex-col gap-6 lg:w-auto lg:flex-1">
            <h3 className="font-oswald text-4xl uppercase leading-[50px] text-primary">Đơn đặt phòng của tôi</h3>

            {myBookings.length > 0 ? (
                <>
                    {myBookings.map(booking => (
                        <MyBookingCard key={booking.id} booking={booking} />
                    ))}
                </>
            ) : (
                <>
                    <div className="text-left font-semibold text-[#6E6E6E]">
                        <p className="text-lg">Bạn chưa có đơn đặt phòng nào!</p>
                        <p>Chúng tôi mong sẽ sớm được gặp bạn tại Stay Mate Hotel &hearts;</p>
                    </div>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
                        <Button
                            text="Tìm hiểu thêm"
                            onClick={() => navigate('/about-us')}
                            variant="gradient"
                            className="w-full rounded-full text-lg font-semibold capitalize"
                        />
                        <Button
                            text="Đặt phòng ngay"
                            onClick={() => navigate('/booking')}
                            className="w-full rounded-full text-lg font-semibold capitalize"
                        />
                    </div>
                </>
            )}
        </div>
    )
}

export default ManageBookingsPage
