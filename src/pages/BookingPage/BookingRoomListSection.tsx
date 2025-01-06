import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { WishedRoom } from '@/services/bookingService'
import RoomSearching from '@/pages/BookingPage/RoomSearching'
import RoomCard from '@/components/ui/RoomCard'
import ChosenRoomsForm from '@/pages/BookingPage/ChosenRoomsForm'

export type ChosenRoom = {
    index: number
    roomId: IRoom['id']
}

export type BookingRequirements = {
    dateRange: [string, string]
    guests: WishedRoom[]
}

const BookingRoomListSection = () => {
    const user = useSelector((state: RootState) => state.auth.user)
    const [availableRooms, setAvailableRooms] = useState<IRoom[][]>([])
    const [activeRoomList, setActiveRoomList] = useState(0)
    const [selectedRooms, setSelectedRooms] = useState<ChosenRoom[]>([])
    const [bookingRequirements, setBookingRequirements] = useState<BookingRequirements | undefined>()

    useEffect(() => {
        setActiveRoomList(0)
        setSelectedRooms([])
    }, [availableRooms])

    return (
        <section className="flex flex-col items-center bg-ivory px-5 py-[100px]">
            <div className="w-full max-w-container bg-ivory">
                <RoomSearching setAvailableRooms={setAvailableRooms} setBookingRequirements={setBookingRequirements} />
            </div>

            {availableRooms.length > 0 && (
                <div className="grid w-full max-w-container grid-cols-3 items-start gap-[60px] bg-ivory pt-[100px]">
                    <div className={`flex flex-col gap-[60px] ${user && user.role === 'Guest' ? 'col-span-2' : 'col-span-3'}`}>
                        <div className="flex gap-[30px]">
                            {availableRooms.map((_, idx) => (
                                <button
                                    key={idx}
                                    className={`flex h-[60px] w-[240px] items-center justify-center rounded-full border-2 border-primary font-semibold uppercase tracking-widest ${idx === activeRoomList ? 'bg-primary text-ivory hover:bg-primary/90' : 'bg-ivory text-primary hover:bg-[#DBD6CA]'}`}
                                    onClick={() => setActiveRoomList(idx)}
                                >
                                    Chọn phòng {(idx + 1).toString().padStart(2, '0')}
                                </button>
                            ))}
                        </div>
                        <div>
                            {availableRooms[activeRoomList].length > 0 ? (
                                <div className="flex flex-col gap-[45px]">
                                    {availableRooms[activeRoomList].map(room => (
                                        <RoomCard
                                            key={room.id}
                                            room={room}
                                            selectRoom={() =>
                                                setSelectedRooms(prev => {
                                                    if (prev.find(rm => rm.index === activeRoomList)) {
                                                        return prev.map(rm =>
                                                            rm.index === activeRoomList ? { index: activeRoomList, roomId: room.id } : rm
                                                        )
                                                    } else {
                                                        return [...prev, { index: activeRoomList, roomId: room.id }]
                                                    }
                                                })
                                            }
                                            removeRoom={() => setSelectedRooms(prev => prev.filter(rm => rm.roomId !== room.id))}
                                            expanded={!user || user.role !== 'Guest'}
                                            isSelected={selectedRooms.find(x => x.roomId === room.id) != null}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="font-semibold text-[#6E6E6E]">
                                    <p className="text-lg">Xin lỗi!</p>
                                    <p>Không tìm thấy phòng phù hợp với nhu cầu của bạn</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {user && user.role === 'Guest' && (
                        <ChosenRoomsForm
                            availableRooms={availableRooms}
                            chosenRooms={[...selectedRooms].sort((a, b) => a.index - b.index)}
                            bookingRequirements={bookingRequirements!}
                        />
                    )}
                </div>
            )}
        </section>
    )
}

export default BookingRoomListSection
