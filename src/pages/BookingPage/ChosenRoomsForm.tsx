import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { differenceInDays, format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { RootState } from '@/store'
import { BookingRequirements, ChosenRoom } from '@/pages/BookingPage/BookingRoomListSection'
import bookingService from '@/services/bookingService'
import toastConfig from '@/configs/toast'
import dayjs from 'dayjs'

type ChosenRoomsFormProps = {
    availableRooms: IRoom[][]
    chosenRooms: ChosenRoom[]
    bookingRequirements: BookingRequirements
}

const ChosenRoomsForm = ({ availableRooms, chosenRooms, bookingRequirements }: ChosenRoomsFormProps) => {
    const navigate = useNavigate()
    const user = useSelector((state: RootState) => state.auth.user)
    const [bookingEmail, setBookingEmail] = useState(user.email)
    const [bookingPhone, setBookingPhone] = useState(user.phoneNumber)

    const bookingDays = Math.abs(differenceInDays(new Date(bookingRequirements.dateRange[1]), new Date(bookingRequirements.dateRange[0])))
    const totalPrice = useMemo(() => {
        return chosenRooms.reduce((total, { index, roomId }) => {
            const room = availableRooms[index].find(rm => rm.id === roomId)!
            return total + (room.roomClass?.basePrice ?? 0) * bookingDays
        }, 0)
    }, [chosenRooms])

    const { placeBookingMutation } = bookingService({ enableFetching: false })
    const handleBooking = async () => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/

        if (placeBookingMutation.isLoading) return
        if (!bookingEmail) return toast('Vui lòng cung cập địa chỉ email của bạn', toastConfig('info'))
        if (!emailRegex.test(bookingEmail)) return toast('Địa chỉ email của bạn không hợp lệ', toastConfig('info'))
        if (!bookingPhone) return toast('Vui lòng cung cập số điện thoại của bạn', toastConfig('info'))
        if (!phoneRegex.test(bookingPhone)) return toast('Số điện thoại của bạn không hợp lệ', toastConfig('info'))
        if (chosenRooms.length < (bookingRequirements?.guests?.length ?? 0)) return toast('Vui lòng chọn đủ số lượng phòng', toastConfig('info'))

        placeBookingMutation
            .mutateAsync({
                checkInTime: dayjs(bookingRequirements.dateRange[0]).format('YYYY-MM-DD'),
                checkOutTime: dayjs(bookingRequirements.dateRange[1]).format('YYYY-MM-DD'),
                email: bookingEmail,
                phoneNumber: bookingPhone,
                bookingRooms: bookingRequirements.guests.map((guest, index) => ({
                    numberOfGuests: guest.numberOfGuests,
                    roomId: chosenRooms[index].roomId
                }))
            })
            .then(res => navigate(`/thank-you/${res.data.data}`))
    }

    return (
        <div className="flex flex-col gap-6 rounded-3xl bg-white px-11 py-9">
            <h2 className="text-3xl font-semibold text-accent">Tổng hợp thông tin</h2>
            <div className="h-1 bg-black/10"></div>
            <div className="flex flex-col gap-3">
                <h3 className="text-2xl font-semibold text-primary">Thông tin khách hàng</h3>
                <p className="text-lg">
                    <span className="font-semibold">Họ và tên: </span>
                    {user.lastName} {user.firstName}
                </p>
                <p className="flex items-center justify-between gap-3 text-lg">
                    <span className="font-semibold">Email: </span>
                    <input
                        className="flex-1 border-b-2 border-neutral-500 px-2 text-primary caret-primary outline-none focus:border-primary"
                        id="email"
                        placeholder="(Chưa cập nhật)"
                        spellCheck={false}
                        value={bookingEmail}
                        onChange={e => setBookingEmail(e.target.value)}
                    />
                </p>
                <p className="flex items-center justify-between gap-3 text-lg">
                    <span className="min-w-max font-semibold">Số điện thoại: </span>
                    <input
                        className="flex-1 border-b-2 border-neutral-500 px-2 text-primary caret-primary outline-none focus:border-primary"
                        id="phone"
                        placeholder="(Chưa cập nhật)"
                        spellCheck={false}
                        value={bookingPhone}
                        onChange={e => setBookingPhone(e.target.value)}
                    />
                </p>
            </div>
            <div className="h-1 bg-black/10"></div>
            <div className="flex flex-col gap-3">
                <h3 className="text-2xl font-semibold text-primary">
                    Các phòng đã chọn ({chosenRooms.length}/{bookingRequirements?.guests?.length ?? 0})
                </h3>
                {chosenRooms.map(room => {
                    const matchingRoom = availableRooms[room.index].find(rm => rm.id === room.roomId)
                    return (
                        <div key={room.roomId} className="flex flex-col gap-2">
                            <h4 className="text-xl font-semibold text-secondary">Phòng {(room.index + 1).toString().padStart(2, '0')}:</h4>
                            <p className="flex items-center justify-between text-lg">
                                <span className="font-semibold">Số phòng: </span>
                                {matchingRoom!.roomNumber}
                            </p>
                            <p className="flex items-center justify-between text-lg">
                                <span className="font-semibold">Loại phòng: </span>
                                {matchingRoom!.roomClass?.className}
                            </p>
                            <p className="flex items-center justify-between text-lg">
                                <span className="font-semibold">Số khách: </span>
                                {bookingRequirements.guests[room.index].numberOfGuests.toString().padStart(2, '0')} người
                            </p>
                            <p className="flex items-center justify-between text-lg">
                                <span className="font-semibold">Giá thuê theo ngày: </span>
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                    matchingRoom!.roomClass?.basePrice ?? 0
                                )}
                            </p>
                        </div>
                    )
                })}
            </div>
            <div className="h-1 bg-black/10"></div>
            <div className="flex flex-col gap-3">
                <h3 className="text-2xl font-semibold text-primary">Thời gian thuê phòng</h3>
                <p className="flex items-center justify-between text-lg">
                    <span className="font-semibold">Ngày check-in: </span>
                    {format(bookingRequirements?.dateRange?.[0], 'dd LLL, y', { locale: vi })}
                </p>
                <p className="flex items-center justify-between text-lg">
                    <span className="font-semibold">Ngày check-out: </span>
                    {format(bookingRequirements?.dateRange?.[1], 'dd LLL, y', { locale: vi })}
                </p>
                <p className="flex items-center justify-between text-lg">
                    <span className="font-semibold">Số ngày thuê: </span>
                    {bookingDays.toString().padStart(2, '0')} ngày
                </p>
            </div>
            <div className="h-1 bg-black/10"></div>
            <div className="flex flex-col gap-3">
                <h3 className="text-2xl font-semibold text-primary">Tổng tiền cần thanh toán</h3>
                <p className="flex items-center justify-between text-lg">
                    <span className="font-semibold">Tổng tiền thuê phòng: </span>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                </p>
                <p className="flex items-center justify-between text-lg">
                    <span className="font-semibold">Tiền đặt cọc 10%: </span>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Math.ceil(totalPrice / 10000) * 1000)}
                </p>
            </div>
            <button
                className="flex h-[60px] w-full items-center justify-center rounded-full bg-primary font-semibold uppercase tracking-widest text-ivory hover:bg-primary/90"
                onClick={() => handleBooking()}
            >
                {placeBookingMutation.isLoading ? (
                    <div className="flex items-center gap-3">
                        <svg
                            aria-hidden="true"
                            className="inline h-6 w-6 animate-spin fill-green-600 text-gray-200"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                            />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                            />
                        </svg>
                        Đang tải
                    </div>
                ) : (
                    'Đặt phòng'
                )}
            </button>
        </div>
    )
}

export default ChosenRoomsForm
