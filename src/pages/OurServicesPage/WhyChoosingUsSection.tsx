import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faComments, faList, faPlay, faQuoteLeft, faShieldAlt } from '@fortawesome/free-solid-svg-icons'
import { INTRODUCTION_VIDEO_URL } from '@/configs/constants'

type WhyChoosingUsSectionProps = {
    featureImageUrl: string
}

const WhyChoosingUsSection = ({ featureImageUrl }: WhyChoosingUsSectionProps) => {
    return (
        <section className="flex justify-center bg-accent px-5 py-[100px]">
            <div className="grid w-full max-w-container grid-cols-3 gap-[60px]">
                <div className="col-span-2">
                    <div className="flex flex-col gap-5">
                        <p className="font-semibold uppercase tracking-widest text-secondary">Tại sao bạn nên sử dụng dịch vụ của chúng tôi?</p>
                        <p className="text-balance font-serif text-5xl font-semibold leading-[1.4] text-ivory">
                            Chúng tôi tự tin sẽ mang lại dịch vụ tận tâm và giúp bạn hài lòng!
                        </p>
                    </div>
                    <div className="mt-9 grid grid-cols-2 gap-[35px]">
                        <div className="relative min-h-[300px] rounded-3xl bg-ivory p-[10px]">
                            <div
                                className="h-full rounded-2xl bg-cover bg-center"
                                style={{
                                    backgroundImage: `url(${featureImageUrl})`
                                }}
                            ></div>
                            <Link
                                className="absolute left-1/2 top-1/2 flex aspect-square w-[90px] -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-secondary hover:bg-secondary/90"
                                to={INTRODUCTION_VIDEO_URL}
                            >
                                <FontAwesomeIcon icon={faPlay} className="text-white" size="2xl" />
                            </Link>
                        </div>
                        <div className="flex flex-col gap-[25px] py-[30px]">
                            <div className="flex gap-5">
                                <FontAwesomeIcon icon={faShieldAlt} className="text-secondary" size="2xl" />
                                <div>
                                    <p className="font-serif text-2xl font-semibold text-ivory">An ninh nghiêm ngặt</p>
                                    <p className="mt-2 text-justify text-lg text-white/75">
                                        Có bảo vệ canh cổng 24/24, đảm bảo vấn đề an ninh của khách sạn
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-5">
                                <FontAwesomeIcon icon={faList} className="text-secondary" size="2xl" />
                                <div>
                                    <p className="font-serif text-2xl font-semibold text-ivory">Loại phòng đa dạng</p>
                                    <p className="mt-2 text-justify text-lg text-white/75">
                                        Có nhiều hạng phòng với đa dạng sức chứa, tiện ích và giá thuê, phù hợp với nhu cầu của bạn
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-5">
                                <FontAwesomeIcon icon={faComments} className="text-secondary" size="2xl" />
                                <div>
                                    <p className="font-serif text-2xl font-semibold text-ivory">Hotline hỗ trợ miễn phí</p>
                                    <p className="mt-2 text-justify text-lg text-white/75">
                                        Có nhân viên hỗ trợ 24/24, đảm bảo phục vụ tốt mọi nhu cầu bạn đề ra
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-start gap-5 rounded-3xl bg-tertiary p-[50px]">
                    <FontAwesomeIcon icon={faQuoteLeft} className="z-[1] text-[#DADADA]" size="3x" />
                    <p className="text-[22px] font-semibold italic leading-relaxed text-white/75">"Stay Comfortably, Stay Happily, Stay Mate!"</p>
                    <p className="text-justify text-lg text-white/75">
                        Trải nghiệm sự kết hợp hoàn hảo giữa sự thoải mái và nét hiện đại tại khách sạn Stay Mate Hotel. Với lòng hiếu khách tận tâm
                        cùng không gian ấm cúng được trang trí độc nhất, chúng tôi đảm bảo mọi khoảnh khắc lưu trú của bạn đều như ở nhà. Niềm hạnh
                        phúc của bạn là ưu tiên hàng đầu của chúng tôi!
                    </p>
                    <div className="flex flex-col gap-[15px]">
                        <div className="flex items-center gap-[15px] text-ivory">
                            <FontAwesomeIcon icon={faCheckCircle} size="lg" />
                            <p className="text-lg text-white/75">Tư vấn 24 giờ</p>
                        </div>
                        <div className="flex items-center gap-[15px] text-ivory">
                            <FontAwesomeIcon icon={faCheckCircle} size="lg" />
                            <p className="text-lg text-white/75">Giữ xe miễn phí</p>
                        </div>
                        <div className="flex items-center gap-[15px] text-ivory">
                            <FontAwesomeIcon icon={faCheckCircle} size="lg" />
                            <p className="text-lg text-white/75">Giờ giấc ra vào tự do</p>
                        </div>
                        <div className="flex items-center gap-[15px] text-ivory">
                            <FontAwesomeIcon icon={faCheckCircle} size="lg" />
                            <p className="text-lg text-white/75">Không tăng giá dịp lễ, Tết</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default WhyChoosingUsSection
