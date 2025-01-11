import { useMemo, useState } from 'react'
import { UseQueryResult } from 'react-query'
import { twMerge } from 'tailwind-merge'
import { differenceInDays, format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/Accordion'
import { Dialog, DialogTrigger } from '@/components/ui/Dialog'
import { getMappedBookingServiceStatus, getMappedBookingStatus, getMappedPaymentMethod } from '@/utils/bookingStatusMapping'
import dayjs from 'dayjs'
import bookingService from '@/services/bookingService'
import serviceReservationService from '@/services/serviceReservationService'
import ConfirmationDialog from '@/components/common/ConfirmationDialog'
import BookServiceDialog from '@/pages/ProfilePage/ManageBookingsPage/BookServiceDialog'

type MyBookingCardProps = {
    booking: IBooking
    services: IService[]
    fetchMyBookingsQuery: UseQueryResult<IResponseData<IBooking[]>, unknown>
}

const baseButtonClass =
    'min-w-[120px] rounded-md border-2 border-solid px-6 py-3 font-medium hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'
const statusTheme = {
    Pending: 'bg-pink-100 border-pink-600 text-pink-600',
    Confirmed: 'bg-green-100 border-green-600 text-green-600',
    Cancelled: 'bg-red-100 border-red-600 text-red-600',
    CheckedIn: 'bg-blue-100 border-blue-600 text-blue-600',
    CheckedOut: 'bg-blue-100 border-blue-600 text-blue-600',
    PaymentDone: 'bg-yellow-100 border-yellow-600 text-yellow-600'
}

const MyBookingCard = ({ booking, services, fetchMyBookingsQuery }: MyBookingCardProps) => {
    const { cancelBookingMutation } = bookingService({ enableFetching: false })
    const { bookServiceMutation } = serviceReservationService({ enableFetching: false })
    const [bookServiceDialogOpen, setBookServiceDialogOpen] = useState(false)

    const bookingDays = Math.abs(differenceInDays(new Date(booking.checkInTime), new Date(booking.checkOutTime)))
    const totalPaymentAmount = useMemo(() => {
        return booking.payments.reduce((total, payment) => total + (payment.amount ?? 0), 0)
    }, [booking])

    return (
        <Accordion type="single" collapsible className="w-full">
            <div className="flex flex-col gap-3 rounded-2xl border-2 border-primary bg-white px-11 py-9">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-3">
                        <h2 className="text-3xl font-semibold text-accent">Mã booking {booking.id}</h2>
                        <p className="text-lg">
                            <span className="font-semibold">Ngày đặt:</span> {dayjs(booking.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                        </p>
                        <p className="text-lg">
                            <span className="font-semibold">Email: </span>
                            {booking.email}
                        </p>
                        <p className="text-lg">
                            <span className="font-semibold">Số điện thoại: </span>
                            {booking.phoneNumber}
                        </p>
                    </div>
                    <div
                        className={twMerge(
                            `flex min-w-[160px] items-center justify-center rounded-full border-2 px-5 py-2 font-semibold ${statusTheme[booking.status]}`
                        )}
                    >
                        {getMappedBookingStatus(booking.status)}
                    </div>
                </div>

                <div className="h-1 bg-black/10"></div>
                <div className="flex flex-col gap-3">
                    <h3 className="text-2xl font-semibold text-primary">Thời gian thuê phòng</h3>
                    <p className="flex items-center justify-between text-lg">
                        <span className="font-semibold">Ngày check-in: </span>
                        {format(booking.checkInTime, 'dd LLL, y  HH:mm:ss', { locale: vi })}
                    </p>
                    <p className="flex items-center justify-between text-lg">
                        <span className="font-semibold">Ngày check-out: </span>
                        {format(booking.checkOutTime, 'dd LLL, y HH:mm:ss', { locale: vi })}
                    </p>
                    <p className="flex items-center justify-between text-lg">
                        <span className="font-semibold">Số ngày thuê: </span>
                        {(bookingDays > 0 ? bookingDays : 1).toString().padStart(2, '0')} ngày
                    </p>
                </div>

                <div className="h-1 bg-black/10"></div>
                <div className="flex flex-col gap-3">
                    <AccordionItem value="item-1" className="border-none">
                        <AccordionTrigger>
                            <h3 className="text-2xl font-semibold text-primary">Các phòng được chọn</h3>
                        </AccordionTrigger>
                        <AccordionContent className="p-0">
                            {booking.bookingRooms.map((room, index) => (
                                <div key={index} className="mt-3 flex flex-col gap-2">
                                    <h4 className="text-xl font-semibold text-secondary">Phòng {(index + 1).toString().padStart(2, '0')}:</h4>
                                    <p className="flex items-center justify-between text-lg">
                                        <span className="font-semibold">Thông tin phòng: </span>
                                        Mã {room!.roomNumber} - Tầng {room!.floor} - Loại {room!.roomClass}
                                    </p>
                                    <p className="flex items-center justify-between text-lg">
                                        <span className="font-semibold">Đơn giá theo ngày: </span>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.unitPrice!)}
                                    </p>
                                    {index !== booking.bookingRooms.length - 1 && <div className="mt-1 h-0.5 bg-black/10"></div>}
                                </div>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                </div>

                <div className="h-1 bg-black/10"></div>
                <div className="flex flex-col gap-3">
                    <AccordionItem value="item-2" className="border-none">
                        <AccordionTrigger>
                            <h3 className="text-2xl font-semibold text-primary">Các dịch vụ được đặt kèm</h3>
                        </AccordionTrigger>
                        <AccordionContent className="p-0">
                            {booking.bookingServices.map((service, index) => (
                                <div key={index} className="mt-3 flex flex-col gap-2">
                                    <h4 className="text-xl font-semibold text-secondary">Mã đơn {service.id!.toString().padStart(2, '0')}:</h4>
                                    <p className="flex items-center justify-between text-lg">
                                        <span className="font-semibold">Tên dịch vụ: </span>
                                        {service.name}
                                    </p>
                                    <p className="flex items-center justify-between text-lg">
                                        <span className="font-semibold">Đơn giá và số lượng: </span>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.unitPrice!)} -{' '}
                                        {service.quantity?.toString().padStart(2, '0')}
                                    </p>
                                    <p className="flex items-center justify-between text-lg">
                                        <span className="font-semibold">Trạng thái: </span>
                                        {getMappedBookingServiceStatus(service.status!)}
                                    </p>
                                    {index !== booking.bookingServices.length - 1 && <div className="mt-1 h-0.5 bg-black/10"></div>}
                                </div>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                </div>

                <div className="h-1 bg-black/10"></div>
                <div className="flex flex-col gap-3">
                    <AccordionItem value="item-3" className="border-none">
                        <AccordionTrigger>
                            <h3 className="text-2xl font-semibold text-primary">Lịch sử thanh toán</h3>
                        </AccordionTrigger>
                        <AccordionContent className="p-0">
                            {booking.payments.map((payment, index) => (
                                <div key={index} className="mt-3 flex flex-col gap-2">
                                    <h4 className="text-xl font-semibold text-secondary">Mã giao dịch {payment.id!.toString().padStart(2, '0')}:</h4>
                                    <p className="flex items-center justify-between text-lg">
                                        <span className="font-semibold">Số tiền giao dịch: </span>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payment.amount!)}
                                    </p>
                                    <p className="flex items-center justify-between text-lg">
                                        <span className="font-semibold">Hình thức giao dịch: </span>
                                        {getMappedPaymentMethod(payment.method!)}
                                    </p>
                                    <p className="flex items-center justify-between text-lg">
                                        <span className="font-semibold">Thời gian giao dịch: </span>
                                        {dayjs(payment.paymentTime).format('DD/MM/YYYY HH:mm:ss')}
                                    </p>
                                    {index !== booking.payments.length - 1 && <div className="mt-1 h-0.5 bg-black/10"></div>}
                                </div>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                </div>

                <div className="h-1 bg-black/10"></div>
                <div className="flex flex-col gap-3">
                    <h3 className="flex items-center justify-between text-2xl font-semibold text-primary">Tổng tiền cần thanh toán</h3>
                    <p className="flex items-center justify-between text-lg">
                        <span className="font-semibold">Tổng tiền thuê phòng và dịch vụ: </span>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.totalAmount)}
                    </p>
                    <p className="flex items-center justify-between text-lg">
                        <span className="font-semibold">Tổng tiền đã nhận: </span>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPaymentAmount)}
                    </p>
                    <p className="flex items-center justify-between text-lg">
                        <span className="font-semibold">Số tiền cần thu thêm: </span>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.totalAmount - totalPaymentAmount)}
                    </p>
                </div>

                <div className="h-1 bg-black/10"></div>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
                    <Dialog open={bookServiceDialogOpen} onOpenChange={setBookServiceDialogOpen}>
                        <DialogTrigger asChild>
                            <button
                                disabled={booking.status !== 'CheckedIn'}
                                className={twMerge(
                                    `${baseButtonClass} border-yellow-600 bg-yellow-100 text-yellow-600 disabled:border-gray-600 disabled:bg-gray-100 disabled:text-gray-600`
                                )}
                            >
                                Đặt dịch vụ
                            </button>
                        </DialogTrigger>
                        <BookServiceDialog
                            isOpen={bookServiceDialogOpen}
                            closeDialog={() => setBookServiceDialogOpen(false)}
                            services={services}
                            bookingId={booking.id}
                            bookServiceMutation={bookServiceMutation}
                            fetchMyBookingsQuery={fetchMyBookingsQuery}
                        />
                    </Dialog>

                    <ConfirmationDialog
                        Trigger={
                            <button
                                disabled={
                                    booking.status === 'Cancelled' || // Already cancelled
                                    (booking.status !== 'Pending' && booking.status !== 'Confirmed') // Not pending or confirmed
                                }
                                className={twMerge(
                                    `${baseButtonClass} border-red-600 bg-red-100 text-red-600 disabled:border-gray-600 disabled:bg-gray-100 disabled:text-gray-600`
                                )}
                            >
                                Hủy đơn
                            </button>
                        }
                        title="Xác nhận hủy đơn"
                        body="Bạn có chắc muốn hủy đơn này không? Bạn sẽ không nhận lại được tiền cọc (nếu có). Thao tác này sẽ không thể hoàn tác."
                        onConfirm={async () => {
                            await cancelBookingMutation.mutateAsync(booking.id).then(() => fetchMyBookingsQuery.refetch())
                        }}
                    />
                </div>
            </div>
        </Accordion>
    )
}

export default MyBookingCard
