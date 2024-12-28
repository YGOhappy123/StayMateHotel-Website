import { Link, useNavigate } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faArrowRight, faDraftingCompass, faHome, faHotel, faPaintRoller, faShieldAlt, faUtensils } from '@fortawesome/free-solid-svg-icons'

type HighlightedServicesSectionProps = {
    isSummarized?: boolean
    containerClassNames?: string
}

type ServiceSummary = {
    icon: IconProp
    name: string
    description: string
    isActive: boolean
}

const HIGHLIGHTED_SERVICES: ServiceSummary[] = [
    {
        icon: faDraftingCompass,
        name: 'Đa dạng phòng',
        description: 'Cung cấp nhiều hạng phòng khác nhau với giá cả và các tiện ích phù hợp với mọi nhu cầu của bạn',
        isActive: true
    },
    {
        icon: faHome,
        name: 'Tiện nghi hiện đại',
        description: 'Các phòng đều được lắp đặt các thiết bị hiện đại và cao cấp, kể cả các loại phòng tiêu chuẩn hay VIP',
        isActive: false
    },
    {
        icon: faPaintRoller,
        name: 'Decor độc đáo',
        description: 'Mỗi căn phòng tại Stay Mate đều được trang trí theo một chủ đề khác nhau, giúp bạn tìm được căn phòng phù hợp nhất',
        isActive: false
    },
    {
        icon: faShieldAlt,
        name: 'An ninh cao',
        description: 'An ninh luôn được đảm bảo 24/24 trong tình trạng tốt nhất để du khách cảm thấy an toàn hơn',
        isActive: false
    },
    {
        icon: faHotel,
        name: 'Vị trí thuận lợi',
        description: 'Vị trí thuận lợi, tiện cho việc di chuyển khi gần bến tàu, biển và các địa điểm vui chơi',
        isActive: false
    },
    {
        icon: faUtensils,
        name: 'Ẩm thực đa dạng',
        description: 'Khách sạn có phục vụ các món Á, Âu, buffet, hải sản,... với khẩu vị có thể tùy chỉnh theo yêu cầu của quý khách',
        isActive: false
    }
]

const HighlightedServicesSection = ({ isSummarized = false, containerClassNames }: HighlightedServicesSectionProps) => {
    const navigate = useNavigate()

    return (
        <div className={twMerge(`flex w-full max-w-container flex-col gap-9 ${containerClassNames}`)}>
            <div className="flex flex-col items-center gap-5">
                <p className="font-semibold uppercase tracking-widest text-secondary">Các dịch vụ chúng tôi cung cấp</p>
                <p className="text-balance font-serif text-5xl font-semibold leading-[1.4]">Các dịch vụ nổi bật tại Stay Mate Hotel</p>
            </div>
            <div className={`grid grid-cols-3 gap-[30px] ${isSummarized ? '' : 'grid-rows-2'}`}>
                {HIGHLIGHTED_SERVICES.filter((_, index) => (isSummarized && index >= 3 ? false : true)).map(service => (
                    <div
                        key={service.name}
                        className={`flex flex-col items-center gap-6 rounded-3xl p-[50px] ${service.isActive ? 'bg-accent' : 'bg-white'}`}
                    >
                        <FontAwesomeIcon icon={service.icon} className="text-secondary" size="3x" />
                        <div>
                            <p
                                className={`text-center font-serif text-3xl font-semibold capitalize ${service.isActive ? 'text-ivory' : 'text-[#2D2D2D]'}`}
                            >
                                {service.name}
                            </p>
                            <p className={`mt-[10px] text-center text-lg ${service.isActive ? 'text-ivory' : 'text-[#6E6E6E]'}`}>
                                {service.description}
                            </p>
                        </div>
                        <button
                            className="mt-auto flex h-[60px] w-full items-center justify-center gap-2 rounded-full bg-primary font-semibold uppercase tracking-widest text-ivory hover:bg-primary/90"
                            onClick={() => navigate(isSummarized ? '/our-services' : '/booking')}
                        >
                            {isSummarized ? 'Tìm hiểu thêm' : 'Đặt phòng ngay'} <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    </div>
                ))}
            </div>
            <div className="flex justify-center gap-3">
                <div className="font-semibold uppercase tracking-widest">
                    {isSummarized
                        ? 'Bạn quan tâm các dịch vụ khác tại Stay Mate Hotel?'
                        : 'Bạn cảm thấy hứng thú với các dịch vụ tại Stay Mate Hotel?'}
                </div>
                {isSummarized ? (
                    <Link to="/our-services">
                        <div className="font-semibold uppercase tracking-widest text-primary">
                            Tìm hiểu thêm <FontAwesomeIcon icon={faArrowRight} />
                        </div>
                    </Link>
                ) : (
                    <Link to="/booking">
                        <div className="font-semibold uppercase tracking-widest text-primary">
                            Đặt phòng ngay <FontAwesomeIcon icon={faArrowRight} />
                        </div>
                    </Link>
                )}
            </div>
        </div>
    )
}

export default HighlightedServicesSection
