import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import ServicesGallerySection from '@/pages/OurServicesPage/ServicesGallerySection'

const DESCRIPTION_IMAGES = {
    gallery: {
        feature:
            'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        top: [
            'https://images.unsplash.com/photo-1618220048045-10a6dbdf83e0?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1615529179035-e760f6a2dcee?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ],
        bottom: [
            'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1617806265182-7b3f847f0b75?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1602872029708-84d970d3382b?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        ]
    },
    banner: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2906&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
}

const HIGHLIGHTED_ROOM_CLASSES = [
    {
        image: 'https://images.unsplash.com/photo-1595871201981-b5e6b1bced23?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        name: 'Standard',
        description:
            'Đây là loại phòng nhỏ dành cho 2 người, phù hợp với các cặp đôi muốn có không gian riêng tư cùng nhau, với giá thuê chỉ từ 250.000đ mỗi đêm'
    },
    {
        image: 'https://images.unsplash.com/photo-1578503439976-f0c1f7daf1cd?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        name: 'Family',
        description: 'Đây là loại phòng với sức chứa khoảng 4 người, thường được ưa bởi các gia đình nhỏ, với giá thuê chỉ từ 400.000đ mỗi đêm'
    },
    {
        image: 'https://images.unsplash.com/photo-1597425842320-de0c26b33327?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        name: 'VIP',
        description:
            'Đây là loại phòng với sức chứa khoảng 6 người, thích hợp cho các gia đình đông người hoặc hội bạn thân, với giá thuê chỉ từ 600.000đ mỗi đêm'
    }
]

const GallerySection = () => {
    return (
        <section className="flex flex-col items-center bg-ivory px-5 py-[100px]">
            <ServicesGallerySection images={DESCRIPTION_IMAGES} />

            <div className="flex w-full max-w-container flex-col gap-9 pt-[100px]">
                <div className="flex items-center justify-between">
                    <div className="flex max-w-[70%] flex-col gap-5">
                        <p className="font-semibold uppercase tracking-widest text-secondary">Vài hạng phòng nổi bật của chúng tôi</p>
                        <p className="text-balance font-serif text-5xl font-semibold leading-[1.4]">
                            Stay Mate Hotel mang cho bạn các hạng phòng với giá cả và các tiện ích đa dạng.
                        </p>
                    </div>
                    <Link to="/booking">
                        <div className="font-semibold uppercase tracking-widest text-primary">
                            Đặt phòng ngay <FontAwesomeIcon icon={faArrowRight} />
                        </div>
                    </Link>
                </div>
                <div className="grid grid-cols-3 gap-[30px] px-3">
                    {HIGHLIGHTED_ROOM_CLASSES.map(roomClass => (
                        <div key={roomClass.name} className="flex flex-col overflow-hidden rounded-3xl">
                            <div
                                className="aspect-[8/5] bg-cover bg-center"
                                style={{
                                    backgroundImage: `url(${roomClass.image})`
                                }}
                            ></div>
                            <div className="flex flex-1 flex-col gap-[26px] bg-white p-[35px]">
                                <div>
                                    <p className="text-balance font-serif text-[25px] font-semibold">Hạng phòng {roomClass.name}</p>
                                    <div className="mt-[15px] line-clamp-3 text-lg text-[#6E6E6E]">{roomClass.description}</div>
                                </div>
                                <Link to="/booking" className="mt-auto">
                                    <div className="font-semibold uppercase tracking-widest text-primary">
                                        Đặt phòng ngay <FontAwesomeIcon icon={faArrowRight} />
                                    </div>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default GallerySection
