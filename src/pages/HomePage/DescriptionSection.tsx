import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faQuoteLeft } from '@fortawesome/free-solid-svg-icons'
import AwardsSection from '@/pages/AboutPage/AwardsSection'
import HighlightedServicesSection from '@/pages/OurServicesPage/HighlightedServicesSection'

const DESCRIPTION_IMAGES = [
    'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=3027&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1618219944342-824e40a13285?q=80&w=3027&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
]

const DescriptionSection = () => {
    return (
        <section className="flex flex-col items-center bg-ivory px-5 py-[100px]">
            <div className="flex w-full max-w-container flex-col gap-9">
                <div className="flex items-center justify-between">
                    <div className="flex max-w-[70%] flex-col gap-5">
                        <p className="font-semibold uppercase tracking-widest text-secondary">Vài nét về chúng tôi</p>
                        <p className="text-balance font-serif text-5xl font-semibold leading-[1.4]">
                            Phòng khách sạn với giá cả phải chăng cùng không gian hiện đại
                        </p>
                    </div>
                    <Link to="/about-us">
                        <div className="font-semibold uppercase tracking-widest text-primary">
                            Tìm hiểu thêm <FontAwesomeIcon icon={faArrowRight} />
                        </div>
                    </Link>
                </div>
                <div className="grid grid-cols-4 gap-[30px] pt-10">
                    <div className="relative flex flex-col items-start gap-5 pl-[50px] pr-5">
                        <div
                            className="absolute bottom-0 left-0 rounded-t-3xl bg-accent"
                            style={{
                                width: 'calc(100% + 120px)',
                                height: 'calc(100% + 40px)'
                            }}
                        ></div>
                        <FontAwesomeIcon icon={faQuoteLeft} className="z-[1] text-[#DADADA]" size="3x" />
                        <p className="z-[1] text-lg font-semibold italic text-white/75 xl:text-[22px] xl:leading-[1.2] 2xl:text-[26px] 2xl:leading-[1.3]">
                            "Stay Comfortably, Stay Happily, Stay Mate!"
                        </p>
                    </div>
                    {DESCRIPTION_IMAGES.map(imageUrl => (
                        <div key={imageUrl} className="z-[1] h-[175px] rounded-t-3xl bg-ivory px-[10px] pt-[10px] lg:h-[200px]">
                            <div
                                className="h-full rounded-t-2xl bg-cover bg-center"
                                style={{
                                    backgroundImage: `url(${imageUrl})`
                                }}
                            ></div>
                        </div>
                    ))}
                </div>
            </div>

            <AwardsSection isSummarized containerClassNames="pt-[100px]" />
            <HighlightedServicesSection isSummarized containerClassNames="pt-[100px]" />
        </section>
    )
}

export default DescriptionSection
