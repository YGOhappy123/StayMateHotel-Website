import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'
import BackgroundPoster from '@/components/ui/BackgroundPoster'

const ServicesHeroSection = () => {
    const navigate = useNavigate()

    return (
        <section className="relative">
            <BackgroundPoster
                imageUrl="https://images.unsplash.com/photo-1531835551805-16d864c8d311?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                size="small"
            />

            <div className="absolute bottom-[100px] left-1/2 grid w-full max-w-container -translate-x-1/2 grid-cols-5 gap-[60px] px-5 2xl:bottom-[150px]">
                <div className="col-span-3 flex flex-col gap-6">
                    <p className="flex items-center gap-3 font-semibold uppercase text-secondary">
                        <span className="cursor-pointer" onClick={() => navigate('/')}>
                            Trang chủ
                        </span>
                        <FontAwesomeIcon icon={faCaretRight} />
                        <span className="text-ivory">Dịch vụ</span>
                    </p>
                    <p className="font-serif text-5xl font-semibold capitalize leading-[1.4] text-ivory">
                        Stay Comfortably, <span className="text-secondary">Stay Happily,</span> Stay Mate!
                    </p>
                    <p className="font-semibold capitalize text-ivory">
                        Cung cấp dịch vụ tốt nhất cho mọi du khách và cung cấp đầy đủ tiện nghi cho mọi nhu cầu lưu trú của bạn!
                    </p>
                </div>
            </div>
        </section>
    )
}

export default ServicesHeroSection
