import { useMemo, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { differenceInDays, format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/Accordion'
import { getMappedBookingStatus } from '@/utils/bookingStatusMapping'
import dayjs from 'dayjs'

type MyBookingCardProps = {
    booking: IBooking
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

const MyBookingCard = ({ booking }: MyBookingCardProps) => {
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
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room!.unitPrice as number)}
                                    </p>
                                </div>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                </div>

                <div className="h-1 bg-black/10"></div>
                <div className="flex flex-col gap-3">
                    <AccordionItem value="item-2" className="border-none">
                        <AccordionTrigger>
                            <h3 className="text-2xl font-semibold text-primary">Lịch sử thanh toán</h3>
                        </AccordionTrigger>
                        <AccordionContent className="p-0">
                            {booking.payments.map((payment, index) => (
                                <div key={index} className="mt-3 flex flex-col gap-2">
                                    <h4 className="text-xl font-semibold text-secondary">
                                        Mã giao dịch {(payment.id ?? 0).toString().padStart(2, '0')}:
                                    </h4>
                                    {/* <p className="flex items-center justify-between text-lg">
                                        <span className="font-semibold">Thông tin phòng: </span>
                                        Mã {room!.roomNumber} - Tầng {room!.floor} - Loại {room!.roomClass}
                                    </p>
                                    <p className="flex items-center justify-between text-lg">
                                        <span className="font-semibold">Đơn giá theo ngày: </span>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room!.unitPrice as number)}
                                    </p> */}
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
            </div>
        </Accordion>
    )
}

export default MyBookingCard
