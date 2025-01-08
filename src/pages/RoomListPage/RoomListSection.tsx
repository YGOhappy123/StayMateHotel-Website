import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import useAxiosIns from '@/hooks/useAxiosIns'
import RoomCard from '@/components/ui/RoomCard'

const RoomListSection = () => {
    const axios = useAxiosIns()
    const [roomClassQuery, setRoomClassQuery] = useSearchParams()
    const [searchRoomQuery, setSearchRoomQuery] = useState<string>('')

    const DEFAULT_FILTER = { isAvailable: 1 }
    const fetchRoomClassesQuery = useQuery(['room-list-room-classes'], {
        queryFn: () => axios.get<IResponseData<IRoomClass[]>>(`/roomClasses`),
        enabled: true,
        refetchIntervalInBackground: true,
        refetchInterval: 10000,
        select: res => res.data
    })

    const fetchRoomsQuery = useQuery(['room-list-rooms', searchRoomQuery], {
        queryFn: () => axios.get<IResponseData<IRoom[]>>(`/rooms?filter=${searchRoomQuery}`),
        enabled: true,
        refetchIntervalInBackground: true,
        refetchInterval: 10000,
        select: res => res.data
    })

    const roomClasses = fetchRoomClassesQuery.data?.data ?? []
    const rooms = fetchRoomsQuery.data?.data ?? []

    useEffect(() => {
        const activeRoomClass = roomClasses?.find(rc => rc.className.toLowerCase() === roomClassQuery.get('roomClass')?.toLowerCase())
        if (activeRoomClass) {
            setSearchRoomQuery(JSON.stringify({ roomClassId: activeRoomClass.id, ...DEFAULT_FILTER }))
        } else {
            setSearchRoomQuery(JSON.stringify({ ...DEFAULT_FILTER }))
        }
    }, [roomClassQuery.get('roomClass'), roomClasses])

    return (
        <section className="flex flex-col items-center bg-ivory px-5 py-[100px]">
            <div className="flex w-full max-w-container flex-col gap-9 bg-ivory">
                <div className="flex flex-col items-center gap-5">
                    <p className="font-semibold uppercase tracking-widest text-secondary">Danh sách phòng của khách sạn</p>
                    <p className="text-balance font-serif text-5xl font-semibold leading-[1.4]">Các phòng đang kinh doanh tại Stay Mate Hotel</p>
                </div>

                {!fetchRoomClassesQuery.isLoading && roomClasses.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-[30px] px-[200px]">
                        <button
                            className={`flex h-[60px] w-[200px] items-center justify-center rounded-full border-2 border-primary font-semibold uppercase tracking-widest ${roomClassQuery.get('roomClass') == null ? 'bg-primary text-ivory hover:bg-primary/90' : 'bg-ivory text-primary hover:bg-[#DBD6CA]'}`}
                            onClick={() => setRoomClassQuery({})}
                        >
                            Tất cả
                        </button>
                        {roomClasses.map(rc => (
                            <button
                                key={rc.id}
                                className={`flex h-[60px] w-[200px] items-center justify-center rounded-full border-2 border-primary font-semibold uppercase tracking-widest ${roomClassQuery.get('roomClass')?.toLowerCase() === rc.className.toLowerCase() ? 'bg-primary text-ivory hover:bg-primary/90' : 'bg-ivory text-primary hover:bg-[#DBD6CA]'}`}
                                onClick={() => setRoomClassQuery({ roomClass: rc.className })}
                            >
                                {rc.className}
                            </button>
                        ))}
                    </div>
                )}

                {!fetchRoomsQuery.isLoading && (
                    <div className="mt-5">
                        {rooms.length > 0 ? (
                            <div className="flex flex-col gap-[45px]">
                                {rooms.map(room => (
                                    <RoomCard
                                        key={room.id}
                                        room={room}
                                        selectRoom={() => {}}
                                        removeRoom={() => {}}
                                        expanded={true}
                                        isSelected={false}
                                        isRoomList={true}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center font-semibold text-[#6E6E6E]">
                                <p className="text-lg">Xin lỗi!</p>
                                <p>Hiện tại chúng tôi không có phòng khả dụng thuộc hạng phòng {roomClassQuery.get('roomClass')}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    )
}

export default RoomListSection
