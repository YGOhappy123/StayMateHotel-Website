import { twMerge } from 'tailwind-merge'
import { UseMutationResult } from 'react-query'
import { getMappedBookingServiceStatus } from '@/utils/bookingStatusMapping'
import dayjs from '@/libs/dayjs'
import ConfirmationDialog from '@/components/common/ConfirmationDialog'

type BookingServiceCardProps = {
    bookingService: IBookingService
    acceptBookingMutation: UseMutationResult<any, Error, number, unknown>
    rejectBookingMutation: UseMutationResult<any, Error, number, unknown>
    handOverBookingMutation: UseMutationResult<any, Error, number, unknown>
}

const baseButtonClass =
    'min-w-[120px] rounded-md border-2 border-solid px-6 py-3 font-medium hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'
const statusTheme = {
    Pending: 'bg-pink-100 border-pink-600 text-pink-600',
    Accepted: 'bg-green-100 border-green-600 text-green-600',
    Rejected: 'bg-red-100 border-red-600 text-red-600',
    Done: 'bg-yellow-100 border-yellow-600 text-yellow-600'
}

const BookingServiceCard = ({ bookingService, acceptBookingMutation, rejectBookingMutation, handOverBookingMutation }: BookingServiceCardProps) => {
    return (
        <div className="flex flex-col gap-3 rounded-2xl border-2 border-primary bg-white px-11 py-9">
            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-3">
                    <h2 className="text-3xl font-semibold text-accent">Mã đơn dịch vụ {bookingService.id}</h2>
                    <p className="text-lg">
                        <span className="font-semibold">Khách hàng: </span>
                        {bookingService?.booking?.guest?.lastName} {bookingService?.booking?.guest?.firstName}
                    </p>
                    <p className="text-lg">
                        <span className="font-semibold">Ngày đặt:</span> {dayjs(bookingService.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                    </p>
                </div>
                <div
                    className={twMerge(
                        `flex min-w-[160px] items-center justify-center rounded-full border-2 px-5 py-2 font-semibold ${statusTheme[bookingService.status]}`
                    )}
                >
                    {getMappedBookingServiceStatus(bookingService.status)}
                </div>
            </div>

            <div className="h-1 bg-black/10"></div>
            <div className="flex flex-col gap-3">
                <h3 className="text-2xl font-semibold text-primary">Thông tin dịch vụ</h3>
                <p className="flex items-center justify-between text-lg">
                    <span className="font-semibold">Tên dịch vụ: </span>
                    {bookingService.service?.name}
                </p>
                <p className="flex items-center justify-between text-lg">
                    <span className="font-semibold">Số lượng: </span>
                    {bookingService.quantity.toString().padStart(2, '0')}
                </p>
                <p className="flex items-center justify-between text-lg">
                    <span className="font-semibold">Đơn giá: </span>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(bookingService.unitPrice as number)}
                </p>
            </div>

            <div className="h-1 bg-black/10"></div>
            <div className="flex flex-col gap-3">
                <h3 className="text-2xl font-semibold text-primary">Thông tin đơn đặt phòng</h3>
                <p className="flex items-center justify-between text-lg">
                    <span className="font-semibold">Mã đơn đặt phòng: </span>
                    {bookingService.booking?.id}
                </p>
                <p className="flex items-center justify-between gap-3 text-lg">
                    <span className="font-semibold">Email: </span>
                    {bookingService.booking?.email}
                </p>
                <p className="flex items-center justify-between gap-3 text-lg">
                    <span className="font-semibold">Số điện thoại: </span>
                    {bookingService.booking?.phoneNumber}
                </p>
            </div>

            <div className="h-1 bg-black/10"></div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <ConfirmationDialog
                    Trigger={
                        <button
                            disabled={bookingService.status !== 'Pending'}
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
                        await acceptBookingMutation.mutateAsync(bookingService.id)
                    }}
                />

                <ConfirmationDialog
                    Trigger={
                        <button
                            disabled={bookingService.status !== 'Accepted'}
                            className={twMerge(
                                `${baseButtonClass} border-blue-600 bg-blue-100 text-blue-600 disabled:border-gray-600 disabled:bg-gray-100 disabled:text-gray-600`
                            )}
                        >
                            Bàn giao dịch vụ
                        </button>
                    }
                    title="Xác nhận đã bàn giao dịch vụ"
                    body="Bạn có chắc đã bàn giao dịch vụ này không? Thao tác này sẽ không thể hoàn tác."
                    onConfirm={async () => {
                        await handOverBookingMutation.mutateAsync(bookingService.id)
                    }}
                />

                <ConfirmationDialog
                    Trigger={
                        <button
                            disabled={bookingService.status === 'Rejected' || bookingService.status !== 'Pending'}
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
                        await rejectBookingMutation.mutateAsync(bookingService.id)
                    }}
                />
            </div>
        </div>
    )
}

export default BookingServiceCard
