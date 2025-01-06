import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/Carousel'
import { RootState } from '@/store'
import Autoplay from 'embla-carousel-autoplay'
import toastConfig from '@/configs/toast'

type RoomCardProps = {
    room: IRoom
    selectRoom: () => void
    removeRoom: () => void
    expanded: boolean
    isSelected: boolean
    isRoomList?: boolean
}

const RoomCard = ({ room, selectRoom, removeRoom, expanded, isSelected, isRoomList = false }: RoomCardProps) => {
    const navigate = useNavigate()
    const user = useSelector((state: RootState) => state.auth.user)

    return (
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
                <div className={`overflow-hidden rounded-2xl`}>
                    {room.images && room.images.length > 0 ? (
                        <Carousel
                            plugins={[
                                Autoplay({
                                    delay: 2000
                                })
                            ]}
                        >
                            <CarouselContent className={`${expanded ? 'h-[400px] w-[616px]' : 'h-[300px] w-[416px]'}`}>
                                {room.images?.map((image, index) => (
                                    <CarouselItem key={index}>
                                        <div className="flex h-full items-center justify-center overflow-hidden rounded-2xl">
                                            <img src={image} alt="room image" className="min-h-full min-w-full object-cover" />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                    ) : (
                        <div className={`${expanded ? 'h-[400px] w-[616px]' : 'h-[300px] w-[416px]'}`}>
                            <div className="flex h-full items-center justify-center overflow-hidden rounded-2xl">
                                <img
                                    src="https://img.freepik.com/free-photo/luxury-classic-modern-bedroom-suite-hotel_105762-1787.jpg"
                                    alt="room image"
                                    className="min-h-full min-w-full object-cover"
                                />
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex flex-1 flex-col gap-3">
                    <p className="text-lg">
                        <span className="font-semibold">Danh sách tiện nghi: </span>
                    </p>
                    <div className={`grid gap-2 ${expanded ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {room.features?.map(ft => (
                            <span key={ft.featureId}>
                                ({ft.quantity}x) {ft.name}
                            </span>
                        ))}
                    </div>
                    <div className="h-1 bg-black/10"></div>
                    <p className="text-lg">
                        <span className="font-semibold">Giá thuê theo ngày:</span> chỉ từ{' '}
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.roomClass?.basePrice as number)}
                    </p>
                    <div className="h-1 bg-black/10"></div>
                    <div className={`grid grid-cols-2 ${expanded ? 'mt-auto gap-6' : 'mt-8 gap-4'}`}>
                        <button
                            className={`flex items-center justify-center rounded-full border-2 border-primary bg-primary font-semibold uppercase tracking-widest text-ivory hover:bg-primary/90 ${expanded ? 'h-[60px]' : 'h-[50px] text-sm'}`}
                            onClick={() => {
                                isRoomList ? navigate(`/rooms/${room.id}`) : window.open(`${window.location.origin}/rooms/${room.id}`, '_blank')
                            }}
                        >
                            Xem chi tiết
                        </button>
                        {isRoomList ? (
                            <button
                                className={`flex items-center justify-center rounded-full border-2 border-primary bg-ivory font-semibold uppercase tracking-widest text-primary hover:bg-[#DBD6CA] ${expanded ? 'h-[60px]' : 'h-[50px] text-sm'}`}
                                onClick={() => navigate('/booking')}
                            >
                                Đặt phòng ngay
                            </button>
                        ) : (
                            <button
                                className={`flex items-center justify-center rounded-full border-2 border-primary bg-ivory font-semibold uppercase tracking-widest text-primary hover:bg-[#DBD6CA] ${expanded ? 'h-[60px]' : 'h-[50px] text-sm'}`}
                                onClick={() => {
                                    if (!user) return toast('Bạn phải đăng nhập để sử dụng tính năng này', toastConfig('info'))
                                    if (user.role !== 'Guest')
                                        return toast('Tính năng này chỉ khả dụng cho vai trò "Khách hàng"', toastConfig('info'))

                                    isSelected ? removeRoom() : selectRoom()
                                }}
                            >
                                {isSelected ? 'Xóa phòng' : 'Chọn phòng'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RoomCard
