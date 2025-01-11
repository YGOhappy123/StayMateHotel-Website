import { useState } from 'react'
import { Popover, PopoverTrigger } from '@/components/ui/Popover'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/Pagination'
import dayjs from 'dayjs'
import serviceReservationService from '@/services/serviceReservationService'
import Button from '@/components/common/Button'
import BookingServiceCard from '@/pages/DashboardPage/ServiceBookingDashboardPage/BookingServiceCard'

const ServiceBookingDashboardPage = () => {
    const {
        bookingServices,
        bookingServicesCount,
        limit,
        total,
        page,
        setPage,
        acceptBookingMutation,
        rejectBookingMutation,
        handOverBookingMutation
    } = serviceReservationService({ enableFetching: true })

    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [havingFilters, setHavingFilters] = useState(false)
    const lastPage = Math.ceil(total / limit)

    const exportCsvFile = () => {}

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between p-4">
                <h2 className="text-2xl font-bold">Quản lý đơn đặt dịch vụ</h2>
                <div className="flex justify-center gap-4">
                    <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                        <PopoverTrigger asChild>
                            <div className="relative min-w-[120px] cursor-pointer rounded-md border-2 border-solid border-black bg-black/10 px-6 py-3 font-medium text-black hover:opacity-90">
                                Tìm kiếm
                                {havingFilters && <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-600"></div>}
                            </div>
                        </PopoverTrigger>
                        {/* <BookingFilter
                        ...
                /> */}
                    </Popover>

                    <Button text="Xuất CSV" variant="primary" onClick={exportCsvFile} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 flex items-center justify-between gap-10 rounded-2xl border-2 border-primary bg-white px-11 py-9 text-primary">
                    <div className="font-oswald text-balance text-4xl font-semibold leading-[50px]">
                        Thống kê sơ bộ số lượng đơn đặt dịch vụ trong ngày {dayjs(new Date()).format('DD/MM/YYYY')}
                    </div>
                    <div className="w-fit shrink-0">
                        <h3 className="flex items-center justify-between text-xl font-semibold">
                            Số đơn đặt dịch vụ cần được xử lý:{' '}
                            <span className="ml-5 font-bold">{(bookingServicesCount?.Pending ?? 0).toString().padStart(2, '0')}</span>
                        </h3>
                        <h3 className="flex items-center justify-between text-xl font-semibold">
                            Số đơn đặt dịch vụ dã được duyệt và chờ bàn giao:
                            <span className="ml-5 font-bold">{(bookingServicesCount?.Accepted ?? 0).toString().padStart(2, '0')}</span>
                        </h3>
                    </div>
                </div>

                {bookingServices.map(bookingService => (
                    <BookingServiceCard
                        key={bookingService.id}
                        bookingService={bookingService}
                        acceptBookingMutation={acceptBookingMutation}
                        rejectBookingMutation={rejectBookingMutation}
                        handOverBookingMutation={handOverBookingMutation}
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

export default ServiceBookingDashboardPage
