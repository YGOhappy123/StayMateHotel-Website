import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faHotel } from '@fortawesome/free-solid-svg-icons'
import useTitle from '@/hooks/useTitle'

const ThankYouPage = () => {
    useTitle('Stay Mate Hotel | Tri Ân')
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const { bookingId } = useParams()
    const navigate = useNavigate()

    return (
        <div className="flex h-screen items-center justify-between bg-[#FAFAFB] text-[#699282]">
            <img src="/images/tkp-left-pattern.png" alt="thank-you-page-asset" className="h-full" />

            <div>
                <div className="mb-[45px] flex flex-col items-center gap-5">
                    <img src="/images/tkp-title.png" alt="thank-you-page-asset" className="w-[650px]" />
                    <p className="text-xl font-medium uppercase">Cảm ơn bạn đã ủng hộ Stay Mate Hotel</p>
                </div>
                <div className="flex flex-col items-center">
                    <h4 className="text-lg font-medium">Đơn đặt phòng của bạn đã được ghi nhận!</h4>
                    <h4 className="text-lg font-medium">Chúng tôi sẽ sớm liên hệ với bạn thông qua email và số điện thoại</h4>
                    <p className="mb-[30px] text-black/45">Mã đơn đặt phòng: {bookingId}</p>
                    <div className="flex items-center gap-6">
                        <button
                            className="flex h-[60px] w-[250px] items-center justify-center gap-3 rounded-full bg-[#699282] font-semibold uppercase tracking-widest text-[#D9D9D9] hover:bg-[#699282]/90"
                            onClick={() => navigate('/profile/bookings')}
                        >
                            <FontAwesomeIcon icon={faHotel} size="lg" /> Quản lý đơn
                        </button>
                        <button
                            className="flex h-[60px] w-[250px] items-center justify-center gap-3 rounded-full bg-[#D9D9D9] font-semibold uppercase tracking-widest text-[#699282] hover:bg-[#D9D9D9]/90"
                            onClick={() => navigate('/')}
                        >
                            <FontAwesomeIcon icon={faHome} size="lg" /> Về trang chủ
                        </button>
                    </div>
                </div>
            </div>

            <img src="/images/tkp-right-pattern.png" alt="thank-you-page-asset" className="h-full" />
        </div>
    )
}

export default ThankYouPage
