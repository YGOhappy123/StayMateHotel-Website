import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { INTRODUCTION_VIDEO_URL } from '@/configs/constants'
import BackgroundPoster from '@/components/ui/BackgroundPoster'

const HomeHeroSection = () => {
    const navigate = useNavigate()

    return (
        <section className="relative">
            <BackgroundPoster
                imageUrl="https://images.unsplash.com/photo-1600054648630-e10e710825f6?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                size="big"
            />

            <div className="absolute bottom-[100px] left-1/2 grid w-full max-w-container -translate-x-1/2 grid-cols-5 gap-[60px] px-5 2xl:bottom-[200px]">
                <div className="col-span-3 flex flex-col gap-6">
                    <p className="font-semibold uppercase text-secondary">Nơi tốt nhất để thuê phòng nghỉ tại Vũng Tàu</p>
                    <p className="font-serif text-5xl font-semibold capitalize leading-[1.4] text-ivory">
                        Nào, <span className="text-secondary">hãy tìm</span> căn phòng lý tưởng của bạn{' '}
                        <span className="text-secondary">ở đây ...</span>
                    </p>
                    <p className="font-semibold capitalize text-ivory">
                        Căn phòng mơ ước của bạn, chỉ cách một cú nhấp chuột: Tìm sự thoải mái cho chuyến đi của bạn tại thành phố Vùng Tàu
                    </p>
                    <div className="flex items-center gap-6">
                        <button
                            className="flex h-[60px] w-[280px] items-center justify-center rounded-full bg-primary font-semibold uppercase tracking-widest text-ivory hover:bg-primary/90"
                            onClick={() => navigate('/about-us')}
                        >
                            Tìm hiểu thêm
                        </button>
                        <button
                            className="flex h-[60px] w-[230px] items-center justify-center rounded-full bg-ivory font-semibold uppercase tracking-widest text-primary hover:bg-ivory/90"
                            onClick={() => navigate('/booking')}
                        >
                            Đặt phòng
                        </button>
                    </div>
                </div>
                <div className="col-span-2 flex items-center justify-center">
                    <Link
                        className="flex aspect-square w-[90px] cursor-pointer items-center justify-center rounded-full bg-secondary hover:bg-secondary/90"
                        to={INTRODUCTION_VIDEO_URL}
                    >
                        <FontAwesomeIcon icon={faPlay} className="text-white" size="2xl" />
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default HomeHeroSection
