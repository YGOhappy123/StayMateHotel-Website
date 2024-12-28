import AwardsSection from '@/pages/AboutPage/AwardsSection'

const DescriptionSection = () => {
    return (
        <section className="flex flex-col items-center bg-ivory px-5 py-[100px]">
            <AwardsSection />

            <div className="flex w-full max-w-container flex-col gap-9 pt-[100px]">
                <div className="flex flex-col gap-5">
                    <p className="font-semibold uppercase tracking-widest text-secondary">Mục tiêu của chúng tôi</p>
                    <p className="max-w-[70%] text-balance font-serif text-5xl font-semibold leading-[1.4]">
                        Giúp du khách có trải nghiệm tuyệt vời thông qua dịch vụ của chúng tôi!
                    </p>
                    <p className="font-semibold text-[#6E6E6E]">
                        Vị trí thuận lợi, phòng nghỉ tiện nghi, hiện đại và chất lượng phục vụ tốt là điểm tự tin nhất của chúng tôi! Chắc hẳn sẽ giúp
                        bạn có một chuyến đi thật hài lòng
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-[30px]">
                    <div className="flex flex-col gap-[30px] rounded-3xl bg-white p-[50px]">
                        <p className="font-serif text-2xl font-semibold">Sứ mệnh của chúng tôi</p>
                        <div className="border-t border-solid border-[#DADADA]"></div>
                        <div className="flex gap-[25px]">
                            <p className="font-serif text-4xl font-semibold text-secondary">01</p>
                            <div>
                                <p className="font-serif text-xl font-semibold text-[#2D2D2D]">Trở thành khách sạn lý tưởng tại Vũng Tàu</p>
                                <p className="mt-2 text-justify text-lg text-[#6E6E6E]">Cung cấp dịch vụ và không gian lưu trú tốt nhất</p>
                            </div>
                        </div>
                        <div className="flex gap-[25px]">
                            <p className="font-serif text-4xl font-semibold text-secondary">02</p>
                            <div>
                                <p className="font-serif text-xl font-semibold text-[#2D2D2D]">Đáp ứng mọi mong đợi của du khách</p>
                                <p className="mt-2 text-justify text-lg text-[#6E6E6E]">Đáp ứng nhu cầu và mong đợi của mỗi du khách 24/24</p>
                            </div>
                        </div>
                        <div className="flex gap-[25px]">
                            <p className="font-serif text-4xl font-semibold text-secondary">03</p>
                            <div>
                                <p className="font-serif text-xl font-semibold text-[#2D2D2D]">Tạo ra những trải nghiệm khó quên</p>
                                <p className="mt-2 text-justify text-lg text-[#6E6E6E]">Mang lại trải nghiệm lưu trú khó quên cho mọi khách hàng</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-[30px] rounded-3xl bg-white p-[50px]">
                        <p className="font-serif text-xl font-semibold text-[#2D2D2D]">"Stay Comfortably, Stay Happily, Stay Mate!"</p>
                        <p className="text-justify text-lg text-[#6E6E6E]">
                            Trải nghiệm sự kết hợp hoàn hảo giữa sự thoải mái và nét hiện đại tại khách sạn Stay Mate Hotel. Với lòng hiếu khách tận
                            tâm cùng không gian ấm cúng được trang trí độc nhất, chúng tôi đảm bảo mọi khoảnh khắc lưu trú của bạn đều như ở nhà. Niềm
                            hạnh phúc của bạn là ưu tiên hàng đầu của chúng tôi! <br></br>
                            <br></br> Dù bạn đến để nghỉ dưỡng, công tác hay khám phá, Stay Mate luôn sẵn sàng đáp ứng mọi nhu cầu của bạn. Từ những
                            tiện nghi hiện đại đến phong cách phục vụ chu đáo, chúng tôi mang đến trải nghiệm lưu trú vượt mong đợi, giúp bạn tận
                            hưởng từng giây phút đáng nhớ. Stay Mate Hotel - nơi hành trình của bạn trọn vẹn hơn bao giờ hết!
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex w-full max-w-container flex-col gap-9 pt-[100px]">
                <div className="flex flex-col items-center gap-5">
                    <p className="font-semibold uppercase tracking-widest text-secondary">Dịch vụ của chúng tôi hoạt động như thế nào?</p>
                    <p className="text-balance font-serif text-5xl font-semibold leading-[1.4]">Lộ trình làm việc nhanh chóng và dễ dàng</p>
                </div>
                <div className="grid grid-cols-4 gap-[30px]">
                    <div className="flex flex-col items-center gap-[25px] p-[35px]">
                        <p className="font-serif text-4xl font-semibold text-secondary">01</p>
                        <div>
                            <p className="text-center font-serif text-xl font-semibold text-[#2D2D2D]">Xác nhận đơn đặt phòng</p>
                            <p className="mt-2 text-center text-lg text-[#6E6E6E]">
                                Nhân viên của Stay Me Hotel sẽ liên hệ với bạn thông quan email/ số điện thoại để xác nhận đơn đặt phòng
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-[25px] p-[35px]">
                        <p className="font-serif text-4xl font-semibold text-secondary">02</p>
                        <div>
                            <p className="text-center font-serif text-xl font-semibold text-[#2D2D2D]">Thanh toán cọc 10%</p>
                            <p className="mt-2 text-center text-lg text-[#6E6E6E]">
                                Khi đơn đặt phòng được xác nhận, bạn sẽ được yêu cầu thanh toán trước 10% số tiền thuê phòng, và sẽ được trừ vào tổng
                                hóa đơn lúc thanh toán
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-[25px] p-[35px]">
                        <p className="font-serif text-4xl font-semibold text-secondary">03</p>
                        <div>
                            <p className="text-center font-serif text-xl font-semibold text-[#2D2D2D]">Gửi email xác nhận</p>
                            <p className="mt-2 text-center text-lg text-[#6E6E6E]">
                                Khi đã nhận tiện cọc, Stay Mate Hotel sẽ gửi cho bạn một email xác nhận đặt phòng thành công, bạn vui lòng xuất trình
                                email và CCCD khi nhận phòng
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-[25px] p-[35px]">
                        <p className="font-serif text-4xl font-semibold text-secondary">04</p>
                        <div>
                            <p className="text-center font-serif text-xl font-semibold text-[#2D2D2D]">Hoàn thành</p>
                            <p className="mt-2 text-center text-lg text-[#6E6E6E]">Xin chúc mừng, bạn đã đặt phòng tại Stay Mate Hotel thành công!</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DescriptionSection
