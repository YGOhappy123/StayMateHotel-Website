import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/Pagination'
import { getMappedBookingStatus } from '@/utils/bookingStatusMapping'
import useTitle from '@/hooks/useTitle'
import useAxiosIns from '@/hooks/useAxiosIns'
import Button from '@/components/common/Button'
import MyBookingCard from '@/pages/ProfilePage/ManageBookingsPage/MyBookingCard'

const ManageBookingsPage = () => {
    const [page, setPage] = useState(1)

    useTitle('Stay Mate Hotel | Đơn Đặt Phòng')
    useEffect(() => {
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
    }, [page])

    const navigate = useNavigate()
    const axios = useAxiosIns()
    const limit = 4
    const [activeStatus, setActiveStatus] = useState<BookingStatus>()

    useEffect(() => setPage(1), [activeStatus])

    const fetchMyBookingsQuery = useQuery(['my-bookings'], {
        queryFn: () => {
            return axios.get<IResponseData<IBooking[]>>('/bookings/my-bookings')
        },
        refetchOnWindowFocus: false,
        refetchInterval: 30000,
        enabled: true,
        select: res => res.data
    })

    const fetchAvailableServicesQuery = useQuery(['available-services'], {
        queryFn: () => {
            return axios.get<IResponseData<IService[]>>(`/services?filter=${JSON.stringify({ isAvailable: true })}`)
        },
        refetchOnWindowFocus: false,
        refetchInterval: 30000,
        enabled: true,
        select: res => res.data
    })

    const myBookings = fetchMyBookingsQuery.data?.data ?? []
    const availableServices = fetchAvailableServicesQuery.data?.data ?? []
    const lastPage = Math.ceil([...myBookings.filter(bk => !activeStatus || bk.status === activeStatus)].length / limit)

    return (
        <div className="flex w-full flex-col gap-6 lg:w-auto lg:flex-1">
            <h3 className="font-oswald text-4xl uppercase leading-[50px] text-primary">Đơn đặt phòng của tôi</h3>

            <div className="grid grid-cols-3 justify-center gap-4">
                <Button
                    text="Tất cả"
                    variant={activeStatus === undefined ? 'gradient' : undefined}
                    onClick={() => setActiveStatus(undefined)}
                    className="w-full rounded-full text-lg font-semibold capitalize"
                />
                {['Pending', 'Confirmed', 'Cancelled', 'CheckedIn', 'CheckedOut', 'PaymentDone'].map(status => (
                    <Button
                        key={status}
                        text={getMappedBookingStatus(status)}
                        variant={activeStatus === status ? 'gradient' : undefined}
                        onClick={() => setActiveStatus(prev => (prev === status ? undefined : (status as BookingStatus)))}
                        className="w-full rounded-full text-lg font-semibold capitalize"
                    />
                ))}
            </div>

            {myBookings.length > 0 ? (
                <>
                    {[...myBookings.filter(bk => !activeStatus || bk.status === activeStatus)]
                        .slice((page - 1) * limit, page * limit)
                        .map(booking => (
                            <MyBookingCard
                                key={booking.id}
                                booking={booking}
                                fetchMyBookingsQuery={fetchMyBookingsQuery}
                                services={availableServices}
                            />
                        ))}

                    <div className="mt-2">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious onClick={() => setPage(page === 1 ? 1 : page - 1)} />
                                </PaginationItem>
                                {Array.from({ length: lastPage }, (_, i) => i + 1).map(num => (
                                    <PaginationItem key={num}>
                                        <PaginationLink isActive={num === page} onClick={() => setPage(num)}>
                                            {num}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext onClick={() => setPage(page === lastPage ? lastPage : page + 1)} />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
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
