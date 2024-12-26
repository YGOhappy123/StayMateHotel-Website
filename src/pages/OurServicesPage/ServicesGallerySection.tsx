import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { INTRODUCTION_VIDEO_URL } from '@/configs/constants'

type ServicesGallerySectionProps = {
    images: {
        gallery: {
            feature: string
            top: string[]
            bottom: string[]
        }
        banner: string
    }
}

const ServicesGallerySection = ({ images }: ServicesGallerySectionProps) => {
    const navigate = useNavigate()

    return (
        <>
            <div className="flex w-full max-w-container flex-col gap-9">
                <div className="flex flex-col items-center gap-5">
                    <p className="font-semibold uppercase tracking-widest text-secondary">Bộ sưu tập các phòng tốt nhất</p>
                    <p className="text-balance font-serif text-5xl font-semibold leading-[1.4]">Các phòng nổi bật tại Stay Mate Hotel</p>
                </div>
                <div className="grid grid-cols-12 gap-[30px]">
                    <div className="relative col-span-6 h-[320px] rounded-tl-3xl">
                        <div
                            className="h-full rounded-3xl bg-cover bg-center"
                            style={{
                                backgroundImage: `url(${images.gallery.feature})`
                            }}
                        ></div>
                        <div className="absolute inset-0 flex flex-col justify-end rounded-3xl bg-image-cover p-[35px]">
                            <div className="flex items-center gap-[60px]">
                                <div className="flex-1">
                                    <p className="font-serif text-2xl font-semibold text-ivory">Phòng hiện đại</p>
                                    <p className="mt-2 text-justify text-lg text-white/75">
                                        Các phòng đều được lắp đặt các thiết bị hiện đại và cao cấp, kể cả các loại phòng tiêu chuẩn hay VIP
                                    </p>
                                </div>
                                <Link
                                    className="flex aspect-square w-[90px] cursor-pointer items-center justify-center rounded-full bg-secondary hover:bg-secondary/90"
                                    to={INTRODUCTION_VIDEO_URL}
                                >
                                    <FontAwesomeIcon icon={faPlay} className="text-white" size="2xl" />
                                </Link>
                            </div>
                        </div>
                    </div>
                    {images.gallery.top.map(imageUrl => (
                        <div key={imageUrl} className="col-span-3 h-[320px] rounded-tl-3xl">
                            <div
                                className="h-full rounded-3xl bg-cover bg-center"
                                style={{
                                    backgroundImage: `url(${imageUrl})`
                                }}
                            ></div>
                        </div>
                    ))}
                    {images.gallery.bottom.map(imageUrl => (
                        <div key={imageUrl} className="col-span-4 h-[320px] rounded-tl-3xl">
                            <div
                                className="h-full rounded-3xl bg-cover bg-center"
                                style={{
                                    backgroundImage: `url(${imageUrl})`
                                }}
                            ></div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full max-w-container pt-[100px]">
                <div className="relative aspect-[10/4] rounded-tl-3xl">
                    <div
                        className="h-full rounded-3xl bg-cover bg-center"
                        style={{
                            backgroundImage: `url(${images.banner})`
                        }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-banner-cover p-[35px]">
                        <div className="flex max-w-[720px] flex-col items-center gap-5">
                            <p className="text-balance text-center font-serif text-5xl font-semibold leading-[1.4] text-ivory">
                                Cùng tận hưởng căn phòng phù hợp với ước mơ của bạn!
                            </p>
                            <p className="text-justify text-xl text-white/75">
                                Còn rất nhiều căn phòng tuyệt vời đang chờ bạn khám phá tại Stay Mate Hotel
                            </p>
                            <button
                                className="flex h-[60px] w-[280px] items-center justify-center rounded-full bg-primary font-semibold uppercase tracking-widest text-ivory hover:bg-primary/90"
                                onClick={() => navigate('/booking')}
                            >
                                Đặt phòng ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ServicesGallerySection
