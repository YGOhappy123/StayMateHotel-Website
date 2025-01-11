import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQuery } from 'react-query'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'
import useTitle from '@/hooks/useTitle'
import useAxiosIns from '@/hooks/useAxiosIns'
import { Skeleton } from '@/components/ui/Skeleton'

const RoomDetailPage = () => {
    useTitle('Stay Mate Hotel | Chi Tiết Phòng')
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const { roomId } = useParams()
    const navigate = useNavigate()
    const axios = useAxiosIns()
    const [activeImageIndex, setActiveImageIndex] = useState(0)

    const fetchRoomDetailQuery = useQuery(['room-detail'], {
        queryFn: () => {
            return axios.get<IResponseData<IRoom>>(`/rooms/${roomId}`)
        },
        refetchOnWindowFocus: false,
        refetchInterval: 30000,
        enabled: true,
        select: res => res.data
    })

    const room = fetchRoomDetailQuery.data?.data

    return (
        <div className="-mt-[150px] bg-ivory pt-[150px]">
            <section className="flex flex-col items-center gap-14 bg-ivory px-5 pb-[100px]">
                <div className="w-full max-w-container">
                    <p className="flex items-center gap-3 font-semibold uppercase text-primary">
                        <span className="cursor-pointer" onClick={() => navigate('/')}>
                            Trang chủ
                        </span>
                        <FontAwesomeIcon icon={faCaretRight} />
                        <span className="cursor-pointer" onClick={() => navigate('/rooms')}>
                            Danh sách phòng
                        </span>
                        <FontAwesomeIcon icon={faCaretRight} />
                        <span className="cursor-pointer" onClick={() => navigate(`/rooms?roomClass=${'VIP'}`)}>
                            Loại phòng {'Vip'}
                        </span>
                        <FontAwesomeIcon icon={faCaretRight} />
                        <span className="text-secondary">Phòng {room?.roomNumber}</span>
                    </p>
                </div>

                <div className="w-full max-w-container">
                    {fetchRoomDetailQuery.isLoading && <Skeleton className="h-[400px] w-full rounded-3xl" />}

                    {!fetchRoomDetailQuery.isLoading && room == null && (
                        <div className="text-center font-semibold text-[#6E6E6E]">
                            <p className="text-lg">Xin lỗi!</p>
                            <p>Hiện tại chúng tôi phòng này không tìm thấy hoặc đang sửa chữa</p>
                        </div>
                    )}

                    {!fetchRoomDetailQuery.isLoading && room && (
                        <div className="rounded-3xl bg-white px-11 py-9">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-3xl font-semibold text-primary">Phòng số {room.roomNumber}</h2>
                                    <p className="mt-2 text-lg">
                                        <span className="font-semibold">Sức chứa tối đa:</span> {room.roomClass?.capacity} người
                                    </p>
                                    <p className="text-lg">
                                        <span className="font-semibold">Tầng:</span> {room.floor?.floorNumber}
                                    </p>
                                </div>
                                <div className="flex min-w-[160px] items-center justify-center rounded-full border-2 border-[#073937] bg-[#EAECE2] px-5 py-2 font-semibold text-[#073937]">
                                    {room.roomClass?.className}
                                </div>
                            </div>

                            <div className="mt-6 flex gap-[40px]">
                                <div className="grid w-[600px] grid-cols-4 gap-6">
                                    <div className="col-span-4 h-[380px] overflow-hidden rounded-2xl">
                                        <div className="flex h-full items-center justify-center overflow-hidden rounded-2xl">
                                            <img
                                                src={
                                                    room.images?.[activeImageIndex] ||
                                                    'https://img.freepik.com/free-photo/luxury-classic-modern-bedroom-suite-hotel_105762-1787.jpg'
                                                }
                                                alt="room image"
                                                className="min-h-full min-w-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    {room.images?.map((image, index) => (
                                        <div
                                            key={index}
                                            className="aspect-square cursor-pointer overflow-hidden rounded-2xl"
                                            onClick={() => setActiveImageIndex(index)}
                                        >
                                            <div className="flex h-full items-center justify-center overflow-hidden rounded-2xl">
                                                <img src={image} alt="room image" className="min-h-full min-w-full object-cover" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-1 flex-col gap-3">
                                    <p className="text-lg">
                                        <span className="font-semibold">Danh sách tiện nghi: </span>
                                    </p>
                                    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                                        {room.features?.map(ft => (
                                            <span key={ft.featureId}>
                                                ({ft.quantity}x) {ft.name}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="h-1 bg-black/10"></div>
                                    <p className="text-lg">
                                        <span className="font-semibold">Giá thuê theo ngày:</span> chỉ từ{' '}
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                            room.roomClass?.basePrice as number
                                        )}
                                    </p>

                                    <div className="h-1 bg-black/10"></div>
                                    <p className="text-lg">
                                        <span className="font-semibold">Số lượt thuê trong tháng này:</span>{' '}
                                        {(room.statisticThisMonth ?? 0).toString().padStart(2, '0')}
                                    </p>
                                    <p className="text-lg">
                                        <span className="font-semibold">Số lượt thuê trong năm nay:</span>{' '}
                                        {(room.statisticThisYear ?? 0).toString().padStart(2, '0')}
                                    </p>

                                    <div className="h-1 bg-black/10"></div>
                                    <div className="mt-auto grid grid-cols-2 gap-6">
                                        <button
                                            className="flex h-[60px] items-center justify-center rounded-full border-2 border-primary bg-primary font-semibold uppercase tracking-widest text-ivory hover:bg-primary/90"
                                            onClick={() => navigate('/rooms')}
                                        >
                                            Xem các phòng khác
                                        </button>
                                        <button
                                            className="flex h-[60px] items-center justify-center rounded-full border-2 border-primary bg-ivory font-semibold uppercase tracking-widest text-primary hover:bg-[#DBD6CA]"
                                            onClick={() => navigate('/booking')}
                                        >
                                            Đặt phòng ngay
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default RoomDetailPage
