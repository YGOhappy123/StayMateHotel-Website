import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'
import BackgroundPoster from '@/components/ui/BackgroundPoster'

const BookingHeroSection = () => {
    const navigate = useNavigate()

    return (
        <section className="relative">
            <BackgroundPoster
                imageUrl="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                size="small"
            />

            <div className="absolute bottom-[100px] left-1/2 grid w-full max-w-container -translate-x-1/2 grid-cols-5 gap-[60px] px-5 2xl:bottom-[150px]">
                <div className="col-span-3 flex flex-col gap-6">
                    <p className="flex items-center gap-3 font-semibold uppercase text-secondary">
                        <span className="cursor-pointer" onClick={() => navigate('/')}>
                            Trang chủ
                        </span>
                        <FontAwesomeIcon icon={faCaretRight} />
                        <span className="text-ivory">Đặt phòng</span>
                    </p>
                    <p className="font-serif text-5xl font-semibold capitalize leading-[1.4] text-ivory">
                        Tra cứu <span className="text-secondary">phòng khách sạn nhanh chóng</span> và{' '}
                        <span className="text-secondary">tiện lợi...</span>
                    </p>
                    <p className="font-semibold capitalize text-ivory">
                        Hãy chọn thời gian check in - check out, số lượng phòng, số lượng khách và một số tiện nghi bạn cần, việc còn lại cứ để Stay
                        Mate Hotel lo!
                    </p>
                </div>
            </div>
        </section>
    )
}

export default BookingHeroSection
