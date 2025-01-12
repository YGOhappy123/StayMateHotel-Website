import { useState } from 'react'
import { useQuery } from 'react-query'
import { Popover, PopoverTrigger } from '@/components/ui/Popover'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/Pagination'
import dayjs from 'dayjs'
import serviceReservationService from '@/services/serviceReservationService'
import Button from '@/components/common/Button'
import BookingServiceCard from '@/pages/DashboardPage/ServiceBookingDashboardPage/BookingServiceCard'
import { exportToCSV } from '@/utils/exportCsvFile'
import BookingServiceFilter from '@/pages/DashboardPage/ServiceBookingDashboardPage/BookingServiceFilter'
import useAxiosIns from '@/hooks/useAxiosIns'

const ServiceBookingDashboardPage = () => {
    const axios = useAxiosIns()
    const {
        bookingServices,
        bookingServicesCount,
        limit,
        total,
        page,
        setPage,
        buildQuery,
        onFilterSearch,
        onResetFilterSearch,
        getCsvBookingServicesQuery,
        acceptBookingMutation,
        rejectBookingMutation,
        handOverBookingMutation
    } = serviceReservationService({ enableFetching: true })

    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [havingFilters, setHavingFilters] = useState(false)
    const lastPage = Math.ceil(total / limit)
    const fetchAllServicesQuery = useQuery(['services-all'], {
        queryFn: () => axios.get<IResponseData<IService[]>>(`/services`),
        refetchOnWindowFocus: false,
        enabled: true,
        select: res => res.data,
        onSuccess: data => console.log('Room classes data:', data),
        onError: error => console.error('Error fetching room classes:', error),
    })

    const services = fetchAllServicesQuery.data?.data || []

    const exportCsvFile = () => {
        getCsvBookingServicesQuery.refetch().then(res => {
            if (!getCsvBookingServicesQuery.data) return;
            const bookingServices = res.data?.data?.data ?? [];
            const formattedBookingServices = bookingServices.map((bookingService) => ({
                ['Mã đơn đặt dịch vụ']: bookingService.id,
                ['Tên Dịch Vụ']: bookingService.service?.name,
                ['Số Lượng']: bookingService.quantity,
                ['Đơn Giá']: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(bookingService.unitPrice as number),
                ['Trạng Thái']: bookingService.status,
                ['Tên Khách Hàng']: `${bookingService?.booking?.guest?.lastName} ${bookingService?.booking?.guest?.firstName}`,
                ['Số điện thoại']: bookingService.booking?.phoneNumber,
                ['Email']: bookingService.booking?.email,
                ['Ngày Tạo']: dayjs(bookingService.createdAt).format('DD/MM/YYYY HH:mm'),
            }));
            exportToCSV(formattedBookingServices, `Danh_sách_đơn_đặt_dịch_vụ_${dayjs(Date.now()).format('DD_MM_YYYY')}`, [
                { wch: 15 },
                { wch: 30 },
                { wch: 10 },
                { wch: 10 },
                { wch: 15 },
                { wch: 15 },
                { wch: 15 },
                { wch: 15 },
                { wch: 15 },
            ]);
        });
    };

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
                        <BookingServiceFilter
                            services={services}
                            setHavingFilters={setHavingFilters}
                            onChange={buildQuery}
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
                        Thống kê sơ bộ số lượng đơn đặt dịch vụ trong ngày {dayjs(new Date()).format('DD/MM/YYYY')}
                    </div>
                    <div className="w-fit shrink-0">
                        <h3 className="flex items-center justify-between text-xl font-semibold">
                            Số đơn đặt dịch vụ cần được xử lý:{' '}
                            <span className="ml-5 font-bold">{(bookingServicesCount?.Pending ?? 0).toString().padStart(2, '0')}</span>
                        </h3>
                        <h3 className="flex items-center justify-between text-xl font-semibold">
                            Số đơn đặt dịch vụ đã được duyệt và chờ bàn giao:
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
