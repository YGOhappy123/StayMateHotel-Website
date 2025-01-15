import { useEffect, useState } from 'react'
import { Popover, PopoverTrigger } from '@/components/ui/Popover'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/Pagination'
import dayjs from 'dayjs'

import { exportToCSV } from '@/utils/exportCsvFile'
import bookingService from '@/services/bookingService'
import Button from '@/components/common/Button'
import BookingCard from '@/pages/DashboardPage/BookingDashboardPage/BookingCard'
import BookingFilter from '@/pages/DashboardPage/BookingDashboardPage/BookingFilter'

const BookingDashboardPage = () => {
    const {
        bookings,
        bookingsCount,
        total,
        page,
        limit,
        setPage,
        buildBookingQuery,
        onFilterSearch,
        onResetFilterSearch,
        getCsvBookingsQuery,
        acceptBookingMutation,
        cancelBookingMutation,
        checkInBookingMutation,
        checkOutBookingMutation,
        depositMutation,
        makePaymentMutation
    } = bookingService({
        enableFetching: true
    })

    useEffect(() => {
        window.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
    }, [page])

    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [havingFilters, setHavingFilters] = useState(false)
    const lastPage = Math.ceil(total / limit)

    const exportCsvFile = () => {
        getCsvBookingsQuery.refetch().then(res => {
            const csvBookings = res.data?.data?.data || []

            const formattedBookings = csvBookings.map(booking => {
                const totalPaymentAmount = booking.payments.reduce((total, payment) => total + (payment.amount ?? 0), 0)

                return {
                    ['Mã Đơn']: booking.id,
                    ['Tên Khách Hàng']: `${booking.guest?.lastName} ${booking.guest?.firstName}`,
                    ['Email']: booking.email,
                    ['Số điện thoại']: booking.phoneNumber,
                    ['Các phòng']: booking.bookingRooms.map(bookingRoom => bookingRoom.roomNumber).join(', '),
                    ['Ngày tạo']: dayjs(booking.createdAt).format('DD/MM/YYYY HH:mm:ss'),
                    ['Ngày check-in']: dayjs(booking.checkInTime).format('DD/MM/YYYY HH:mm:ss'),
                    ['Ngày check-out']: dayjs(booking.checkOutTime).format('DD/MM/YYYY HH:mm:ss'),
                    ['Tổng tiền']: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.totalAmount as number),
                    ['Số tiền đã trả']: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPaymentAmount as number),
                    ['Số tiền thêm']: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                        (booking.totalAmount - totalPaymentAmount) as number
                    )
                }
            })

            exportToCSV(formattedBookings, `SMH_Danh_sách_đơn_đặt_phòng_${dayjs(Date.now()).format('DD/MM/YYYY')}`, [
                { wch: 10 },
                { wch: 25 },
                { wch: 40 },
                { wch: 20 },
                { wch: 20 },
                { wch: 30 },
                { wch: 30 },
                { wch: 30 },
                { wch: 15 },
                { wch: 15 },
                { wch: 15 }
            ])
        })
    }

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between p-4">
                <h2 className="text-2xl font-bold">Quản lý đơn đặt phòng</h2>
                <div className="flex justify-center gap-4">
                    <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                        <PopoverTrigger asChild>
                            <div className="relative min-w-[120px] cursor-pointer rounded-md border-2 border-solid border-black bg-black/10 px-6 py-3 font-medium text-black hover:opacity-90">
                                Tìm kiếm
                                {havingFilters && <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-600"></div>}
                            </div>
                        </PopoverTrigger>
                        <BookingFilter
                            setHavingFilters={setHavingFilters}
                            onChange={buildBookingQuery}
                            onSearch={onFilterSearch}
                            onReset={onResetFilterSearch}
                        />
                    </Popover>

                    <Button text="Xuất CSV" variant="primary" onClick={exportCsvFile} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 flex items-center justify-between gap-10 rounded-2xl border-2 border-primary bg-white px-11 py-9 text-primary">
                    <div className="font-oswald text-balance text-4xl font-semibold leading-[50px]">
                        Thống kê sơ bộ số lượng đơn đặt phòng trong ngày {dayjs(new Date()).format('DD/MM/YYYY')}
                    </div>
                    <div className="w-fit shrink-0">
                        <h3 className="flex items-center justify-between text-xl font-semibold">
                            Số đơn đặt phòng cần được xử lý:{' '}
                            <span className="ml-5 font-bold">{(bookingsCount?.Pending ?? 0).toString().padStart(2, '0')}</span>
                        </h3>
                        <h3 className="flex items-center justify-between text-xl font-semibold">
                            Số đơn đặt phòng đang check-in:{' '}
                            <span className="ml-5 font-bold">{(bookingsCount?.CheckedIn ?? 0).toString().padStart(2, '0')}</span>
                        </h3>
                        <h3 className="flex items-center justify-between text-xl font-semibold">
                            Số đơn đặt phòng đã check-out và chờ thanh toán:
                            <span className="ml-5 font-bold">{(bookingsCount?.CheckedOut ?? 0).toString().padStart(2, '0')}</span>
                        </h3>
                    </div>
                </div>

                {bookings.map(booking => (
                    <BookingCard
                        key={booking.id}
                        booking={booking}
                        acceptBookingMutation={acceptBookingMutation}
                        cancelBookingMutation={cancelBookingMutation}
                        checkInBookingMutation={checkInBookingMutation}
                        checkOutBookingMutation={checkOutBookingMutation}
                        depositMutation={depositMutation}
                        makePaymentMutation={makePaymentMutation}
                    />
                ))}
            </div>

            <div className="mt-4">
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
        </div>
    )
}

export default BookingDashboardPage
