import { useMemo, useState } from 'react'
import { UseMutationResult } from 'react-query'
import { differenceInDays, format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { twMerge } from 'tailwind-merge'
import { getMappedBookingStatus } from '@/utils/bookingStatusMapping'
import { Dialog, DialogTrigger } from '@/components/ui/Dialog'
import { PaymentPayload } from '@/services/bookingService'
import dayjs from '@/libs/dayjs'
import ConfirmationDialog from '@/components/common/ConfirmationDialog'
import PaymentDialog from '@/pages/DashboardPage/BookingDashboardPage/PaymentDialog'
import PaymentRecordDialog from '@/pages/DashboardPage/BookingDashboardPage/PaymentRecordDialog'
import BookingServiceRecordDialog from '@/pages/DashboardPage/BookingDashboardPage/BookingServiceRecordDialog'

type BookingCardProps = {
    booking: IBooking
    acceptBookingMutation: UseMutationResult<any, Error, number, unknown>
    cancelBookingMutation: UseMutationResult<any, Error, number, unknown>
    checkInBookingMutation: UseMutationResult<any, Error, number, unknown>
    checkOutBookingMutation: UseMutationResult<any, Error, number, unknown>
    depositMutation: UseMutationResult<any, Error, PaymentPayload, unknown>
    makePaymentMutation: UseMutationResult<any, Error, PaymentPayload, unknown>
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

const BookingCard = ({
    booking,
    acceptBookingMutation,
    cancelBookingMutation,
    checkInBookingMutation,
    checkOutBookingMutation,
    depositMutation,
    makePaymentMutation
}: BookingCardProps) => {
    const [depositDialogOpen, setDepositDialogOpen] = useState(false)
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
    const [bookingServiceRecordDialogOpen, setBookingServiceRecordDialogOpen] = useState(false)
    const [paymentRecordDialogOpen, setPaymentRecordDialogOpen] = useState(false)

    const today = dayjs().startOf('day')
    const bookingDays = Math.abs(differenceInDays(new Date(booking.checkInTime), new Date(booking.checkOutTime)))
    const totalPaymentAmount = useMemo(() => {
        return booking.payments.reduce((total, payment) => total + (payment.amount ?? 0), 0)
    }, [booking])

    return (
        <div className="flex flex-col gap-3 rounded-2xl border-2 border-primary bg-white px-11 py-9">
            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-3">
                    <h2 className="text-3xl font-semibold text-accent">Mã booking {booking.id}</h2>
                    <p className="text-lg">
                        <span className="font-semibold">Khách hàng: </span>
                        {booking.guest?.lastName} {booking.guest?.firstName}
                    </p>
                    <p className="text-lg">
                        <span className="font-semibold">Ngày đặt:</span> {dayjs(booking.createdAt).format('DD/MM/YYYY HH:mm:ss')}
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
                <h3 className="text-2xl font-semibold text-primary">Thông tin liên hệ</h3>
                <p className="flex items-center justify-between gap-3 text-lg">
                    <span className="font-semibold">Email: </span>
                    {booking.email}
                </p>
                <p className="flex items-center justify-between gap-3 text-lg">
                    <span className="font-semibold">Số điện thoại: </span>
                    {booking.phoneNumber}
                </p>
            </div>

            <div className="h-1 bg-black/10"></div>
            <div className="flex flex-col gap-3">
                <h3 className="text-2xl font-semibold text-primary">Các phòng được chọn</h3>
                {booking.bookingRooms.map((room, index) => (
                    <div key={index} className="flex flex-col gap-2">
                        <h4 className="text-xl font-semibold text-secondary">Phòng {(index + 1).toString().padStart(2, '0')}:</h4>
                        <p className="flex items-center justify-between text-lg">
                            <span className="font-semibold">Thông tin phòng: </span>
                            Mã {room!.roomNumber} - Tầng {room!.floor} - Loại {room!.roomClass}
                        </p>
                        <p className="flex items-center justify-between text-lg">
                            <span className="font-semibold">Đơn giá theo ngày: </span>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room!.unitPrice as number)}
                        </p>
                    </div>
                ))}
            </div>

            <div className="h-1 bg-black/10"></div>
            <div className="flex flex-col gap-3">
                <h3 className="flex items-center justify-between text-2xl font-semibold text-primary">
                    Các dịch vụ được đặt kèm
                    <Dialog open={bookingServiceRecordDialogOpen} onOpenChange={setBookingServiceRecordDialogOpen}>
                        <DialogTrigger>
                            <span className="cursor-pointer text-lg hover:underline">Xem chi tiết</span>
                        </DialogTrigger>
                        <BookingServiceRecordDialog services={booking.bookingServices} closeDialog={() => setBookingServiceRecordDialogOpen(false)} />
                    </Dialog>
                </h3>
                <p className="flex items-center justify-between text-lg">
                    <span className="font-semibold">Tổng số dịch vụ đã đặt: </span>
                    {booking.bookingServices.length.toString().padStart(2, '0')} dịch vụ
                </p>
                <p className="flex items-center justify-between text-lg">
                    <span className="font-semibold">Tổng số dịch vụ đã bàn giao: </span>
                    {booking.bookingServices
                        .filter(bks => bks.status === 'Done')
                        .length.toString()
                        .padStart(2, '0')}{' '}
                    dịch vụ
                </p>
                <p className="flex items-center justify-between text-lg">
                    <span className="font-semibold">Tổng số tiền dịch vụ: </span>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                        booking.bookingServices
                            .filter(bks => bks.status === 'Done')
                            .reduce((total, bks) => total + (bks.unitPrice ?? 0) * (bks.quantity ?? 0), 0)
                    )}
                </p>
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
                <h3 className="flex items-center justify-between text-2xl font-semibold text-primary">
                    Tổng tiền cần thanh toán
                    <Dialog open={paymentRecordDialogOpen} onOpenChange={setPaymentRecordDialogOpen}>
                        <DialogTrigger>
                            <span className="cursor-pointer text-lg hover:underline">Xem chi tiết</span>
                        </DialogTrigger>
                        <PaymentRecordDialog payments={booking.payments} closeDialog={() => setPaymentRecordDialogOpen(false)} />
                    </Dialog>
                </h3>
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
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                <ConfirmationDialog
                    Trigger={
                        <button
                            disabled={booking.status !== 'Pending'}
                            className={twMerge(
                                `${baseButtonClass} border-green-600 bg-green-100 text-green-600 disabled:border-gray-600 disabled:bg-gray-100 disabled:text-gray-600`
                            )}
                        >
                            Chấp nhận đơn
                        </button>
                    }
                    title="Xác nhận chấp nhận đơn"
                    body="Bạn có chắc muốn chấp nhận đơn này không? Thao tác này sẽ không thể hoàn tác."
                    onConfirm={async () => {
                        await acceptBookingMutation.mutateAsync(booking.id)
                    }}
                />

                <Dialog open={depositDialogOpen} onOpenChange={setDepositDialogOpen}>
                    <DialogTrigger asChild>
                        <button
                            disabled={booking.status !== 'Confirmed' || totalPaymentAmount > 0}
                            className={twMerge(
                                `${baseButtonClass} border-green-600 bg-green-100 text-green-600 disabled:border-gray-600 disabled:bg-gray-100 disabled:text-gray-600`
                            )}
                        >
                            Đã nhận cọc
                        </button>
                    </DialogTrigger>
                    <PaymentDialog
                        mode="deposit"
                        bookingId={booking.id}
                        isOpen={depositDialogOpen}
                        title="Xác nhận đã nhận tiền cọc"
                        body="Bạn có chắc muốn xác nhận đã nhận được tiền cọc 10% cho đơn này không? Thao tác này sẽ không thể hoàn tác."
                        closeDialog={() => setDepositDialogOpen(false)}
                        submitPaymentMutation={depositMutation}
                    />
                </Dialog>

                <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                    <DialogTrigger asChild>
                        <button
                            disabled={booking.status !== 'CheckedOut'}
                            className={twMerge(
                                `${baseButtonClass} border-yellow-600 bg-yellow-100 text-yellow-600 disabled:border-gray-600 disabled:bg-gray-100 disabled:text-gray-600`
                            )}
                        >
                            Thanh toán
                        </button>
                    </DialogTrigger>
                    <PaymentDialog
                        mode="payment"
                        bookingId={booking.id}
                        maxValue={booking.totalAmount - totalPaymentAmount}
                        isOpen={paymentDialogOpen}
                        title="Tạo lịch sử thanh toán mới"
                        closeDialog={() => setPaymentDialogOpen(false)}
                        submitPaymentMutation={makePaymentMutation}
                    />
                </Dialog>

                <ConfirmationDialog
                    Trigger={
                        <button
                            disabled={booking.status !== 'Confirmed' || today.isBefore(dayjs(booking.checkInTime), 'day') || totalPaymentAmount === 0}
                            className={twMerge(
                                `${baseButtonClass} border-blue-600 bg-blue-100 text-blue-600 disabled:border-gray-600 disabled:bg-gray-100 disabled:text-gray-600`
                            )}
                        >
                            Check-in
                        </button>
                    }
                    title="Xác nhận khách đã check-in"
                    body="Bạn có chắc muốn xác nhận khách đã check-in cho đơn này không? Thao tác này sẽ không thể hoàn tác."
                    onConfirm={async () => {
                        await checkInBookingMutation.mutateAsync(booking.id)
                    }}
                />

                <ConfirmationDialog
                    Trigger={
                        <button
                            disabled={booking.status !== 'CheckedIn'}
                            className={twMerge(
                                `${baseButtonClass} border-blue-600 bg-blue-100 text-blue-600 disabled:border-gray-600 disabled:bg-gray-100 disabled:text-gray-600`
                            )}
                        >
                            Check-out
                        </button>
                    }
                    title="Xác nhận khách đã check-out"
                    body="Bạn có chắc muốn xác nhận khách đã check-out cho đơn này không? Thao tác này sẽ không thể hoàn tác."
                    onConfirm={async () => {
                        await checkOutBookingMutation.mutateAsync(booking.id)
                    }}
                />

                <ConfirmationDialog
                    Trigger={
                        <button
                            disabled={
                                booking.status === 'Cancelled' || // Already cancelled
                                (booking.status !== 'Pending' && // Not pending
                                    (booking.status !== 'Confirmed' || totalPaymentAmount > 0) && // Not confirmed or has deposit
                                    (!today.isBefore(dayjs(booking.checkInTime), 'day') || totalPaymentAmount > 0)) // After check-in or has deposit
                            }
                            className={twMerge(
                                `${baseButtonClass} border-red-600 bg-red-100 text-red-600 disabled:border-gray-600 disabled:bg-gray-100 disabled:text-gray-600`
                            )}
                        >
                            Từ chối đơn
                        </button>
                    }
                    title="Xác nhận từ chối đơn"
                    body="Bạn có chắc muốn từ chối đơn này không? Thao tác này sẽ không thể hoàn tác."
                    onConfirm={async () => {
                        await cancelBookingMutation.mutateAsync(booking.id)
                    }}
                />
            </div>
        </div>
    )
}

export default BookingCard
