import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { faArrowRight, faCalendarAlt, faEdit, faHotel, faUserFriends } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Calendar } from '@/components/ui/Calendar'
import { Dialog, DialogTrigger } from '@/components/ui/Dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import bookingService, { WishedRoom } from '@/services/bookingService'
import toastConfig from '@/configs/toast'
import SelectRoomAndGuestDialog from '@/pages/BookingPage/SelectRoomAndGuestDialog'

type RoomSearchingProps = {
    setAvailableRooms: (rooms: IRoom[][]) => void
    setBookingRequirements: (requirements: any) => void
}

const RoomSearching = ({ setAvailableRooms, setBookingRequirements }: RoomSearchingProps) => {
    const { buildQuery, getAvailableRoomsQuery } = bookingService()
    const [date, setDate] = useState<DateRange | undefined>(undefined)
    const [range, setRange] = useState<string[] | any[]>([])
    const [wishedRooms, setWishedRooms] = useState<WishedRoom[]>([{ numberOfGuests: 1 }])
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleSearch = async () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (getAvailableRoomsQuery.isLoading) return
        if (range.length === 0) {
            return toast('Vui lòng chọn ngày check in và check out', toastConfig('info'))
        }
        if (range.length === 1) {
            return toast('Vui lòng chọn ngày check out', toastConfig('info'))
        }
        if (date!.from! < today) {
            return toast(`Ngày check in phải lớn hơn hoặc bằng hôm nay (${format(today, 'dd LLL, y', { locale: vi })})`, toastConfig('info'))
        }

        getAvailableRoomsQuery.refetch().then(result => setAvailableRooms([...(result.data?.data.data ?? [])]))
        setBookingRequirements({
            dateRange: range,
            guests: wishedRooms
        })
    }

    useEffect(() => {
        if (date) {
            const dateRange = [date.from]
            if (date.to) dateRange.push(date.to)

            setRange(dateRange)
        } else {
            setRange([])
        }
    }, [date])

    useEffect(() => {
        buildQuery({ range: range, roomsAndGuests: wishedRooms })
    }, [range, wishedRooms])

    return (
        <div className="flex h-[88px] w-full justify-between rounded-full border-2 border-solid border-[#9C9C9C] bg-[#FFFBF2] p-[15px] text-[#4D4D4D]">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger>
                    <div className="ml-[10px] flex items-center gap-5 text-lg">
                        <FontAwesomeIcon icon={faHotel} size="xl" className="text-secondary" />
                        Số lượng phòng: {wishedRooms.length.toString().padStart(2, '0')}{' '}
                        <FontAwesomeIcon icon={faEdit} size="xl" className="cursor-pointer" />
                    </div>
                </DialogTrigger>
                <div className="w-[2px] border-l-2 border-solid border-secondary"></div>
                <DialogTrigger>
                    <div className="flex items-center gap-5 text-lg">
                        <FontAwesomeIcon icon={faUserFriends} size="xl" className="text-secondary" />
                        Số lượng khách:{' '}
                        {wishedRooms
                            .reduce((total, curr) => total + curr.numberOfGuests, 0)
                            .toString()
                            .padStart(2, '0')}{' '}
                        <FontAwesomeIcon icon={faEdit} size="xl" className="cursor-pointer" />
                    </div>
                </DialogTrigger>
                <SelectRoomAndGuestDialog closeDialog={() => setIsModalOpen(false)} wishedRooms={wishedRooms} setWishedRooms={setWishedRooms} />
            </Dialog>

            <div className="w-[2px] border-l-2 border-solid border-secondary"></div>

            <Popover>
                <PopoverTrigger asChild>
                    <div className="flex cursor-pointer items-center gap-5 text-lg">
                        <FontAwesomeIcon icon={faCalendarAlt} size="xl" className="text-secondary" />
                        <p className="w-[130px] text-center">{date?.from ? format(date.from, 'dd LLL, y', { locale: vi }) : 'Check-in'}</p>
                        <FontAwesomeIcon icon={faArrowRight} size="xl" />
                        <p className="w-[130px] text-center">{date?.to ? format(date.to, 'dd LLL, y', { locale: vi }) : 'Check-out'}</p>
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto bg-white p-0">
                    <Calendar initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={setDate} numberOfMonths={2} locale={vi} />
                </PopoverContent>
            </Popover>
            <button
                className="flex w-[200px] items-center justify-center rounded-full bg-primary font-semibold uppercase tracking-widest text-ivory hover:bg-primary/90"
                onClick={() => handleSearch()}
            >
                {getAvailableRoomsQuery.isLoading ? (
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
                    'Tìm phòng'
                )}
            </button>
        </div>
    )
}
export default RoomSearching
