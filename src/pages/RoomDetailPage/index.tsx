import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'
import useTitle from '@/hooks/useTitle'

const RoomDetailPage = () => {
    useTitle('Stay Mate Hotel | Chi Tiết Phòng')
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const { roomId } = useParams()
    const navigate = useNavigate()

    return (
        <div className="-mt-[150px] bg-ivory pt-[150px]">
            <section className="flex flex-col items-center gap-14 bg-ivory px-5 pb-[100px]">
                <div className="w-full max-w-container">
                    <p className="flex items-center gap-3 font-semibold uppercase text-primary">
                        <span className="cursor-pointer" onClick={() => navigate('/')}>
                            Trang chủ
                        </span>
                        <FontAwesomeIcon icon={faCaretRight} />
                        <span className="cursor-pointer" onClick={() => navigate('/rooms')}>
                            Danh sách phòng
                        </span>
                        <FontAwesomeIcon icon={faCaretRight} />
                        <span className="cursor-pointer" onClick={() => navigate(`/rooms?roomClass=${'VIP'}`)}>
                            Loại phòng {'Vip'}
                        </span>
                        <FontAwesomeIcon icon={faCaretRight} />
                        <span className="text-secondary">Phòng 1001</span>
                    </p>
                </div>
            </section>
        </div>
    )
}

export default RoomDetailPage
