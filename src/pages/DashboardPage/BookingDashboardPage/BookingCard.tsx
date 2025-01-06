import { useMemo } from 'react'
import { differenceInDays, format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { getMappedBookingStatus } from '@/utils/bookingStatusMapping'
import dayjs from '@/libs/dayjs'
import Button from '@/components/common/Button'

type BookingCardProps = {
    booking: IBooking
}

const BookingCard = ({ booking }: BookingCardProps) => {
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
                <div className="flex min-w-[160px] items-center justify-center rounded-full border-2 border-[#073937] bg-[#EAECE2] px-5 py-2 font-semibold text-[#073937]">
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
                    <div key={room.roomId} className="flex flex-col gap-2">
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
                    <span className="cursor-pointer text-lg hover:underline">Xem chi tiết</span>
                </h3>
                <p className="flex items-center justify-between text-lg">
                    <span className="font-semibold">Tổng số dịch vụ đã đặt: </span>
                    {20} dịch vụ
                </p>
                <p className="flex items-center justify-between text-lg">
                    <span className="font-semibold">Tổng số dịch vụ đã bàn giao: </span>
                    {12} dịch vụ
                </p>
                <p className="flex items-center justify-between text-lg">
                    <span className="font-semibold">Tổng số tiền dịch vụ: </span>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(99999)}
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
                    <span className="cursor-pointer text-lg hover:underline">Xem chi tiết</span>
                </h3>
                <p className="flex items-center justify-between text-lg">
                    <span className="font-semibold">Tổng tiền thuê phòng và dịch vụ: </span>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.totalAmount)}
                </p>
                <p className="flex items-center justify-between text-lg">
                    <span className="font-semibold">Tổng tiền đã nhận: </span>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPaymentAmount)}
                </p>
            </div>

            <div className="h-1 bg-black/10"></div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                <Button text="Chấp nhận đơn" variant="success" disabled={false} onClick={() => {}} />
                <Button text="Đã nhận cọc" variant="success" disabled={false} onClick={() => {}} />
                <Button text="Thanh toán" variant="warning" disabled={false} onClick={() => {}} />
                <Button text="Check-in" variant="info" disabled={false} onClick={() => {}} />
                <Button text="Check-out" variant="info" disabled={false} onClick={() => {}} />
                <Button text="Từ chối đơn" variant="danger" disabled={false} onClick={() => {}} />
            </div>
        </div>
    )
}

export default BookingCard
