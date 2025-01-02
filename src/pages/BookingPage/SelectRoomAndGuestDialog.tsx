import { Dispatch, Fragment, SetStateAction, useState } from 'react'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog'
import { WishedRoom } from '@/services/bookingService'
import Button from '@/components/common/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'

type SelectRoomAndGuestDialogProps = {
    closeDialog: () => void
    wishedRooms: WishedRoom[]
    setWishedRooms: (wishedRooms: WishedRoom[]) => void
}

const SelectRoomAndGuestDialog = ({ closeDialog, wishedRooms, setWishedRooms }: SelectRoomAndGuestDialogProps) => {
    const [internalWishedRooms, setInternalWishedRooms] = useState<WishedRoom[]>(wishedRooms)

    return (
        <DialogContent className="max-w-[500px] bg-white">
            <DialogHeader>
                <DialogTitle>Chọn phòng và số lượng khách thuê</DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="border-b-2"></div>
            <div className="grid grid-cols-[3fr_2fr_2fr] gap-5">
                <h2 className="font-medium">Phòng</h2>
                <h2 className="text-center font-medium">Xóa phòng</h2>
                <h2 className="text-center font-medium">Số khách</h2>
                {internalWishedRooms.map((wr, idx) => (
                    <RoomRow
                        key={idx}
                        roomIndex={idx}
                        guestNumber={wr.numberOfGuests}
                        setRooms={setInternalWishedRooms}
                        removeRoomDisabled={internalWishedRooms.length === 1}
                    />
                ))}
            </div>
            <div className="border-b-2"></div>
            <button
                className="flex items-center gap-3 disabled:cursor-not-allowed disabled:border-gray-600 disabled:bg-gray-100 disabled:text-gray-600 disabled:opacity-50"
                disabled={internalWishedRooms.length === 3}
                onClick={() => setInternalWishedRooms(prev => [...prev, { numberOfGuests: 1 }])}
            >
                <div className="flex aspect-square w-[32px] items-center justify-center rounded-full border-2 border-green-600 bg-green-100 text-green-600">
                    <FontAwesomeIcon icon={faPlus} size="1x" />
                </div>
                <span>
                    Thêm phòng <i>{internalWishedRooms.length === 3 && '(Tối đa 3 phòng cho mỗi đơn đặt)'}</i>
                </span>
            </button>
            <div className="border-b-2"></div>
            <DialogFooter>
                <Button text="Hủy bỏ" variant="danger" onClick={closeDialog} />
                <Button
                    text="Xác nhận"
                    variant="success"
                    onClick={() => {
                        setWishedRooms(internalWishedRooms)
                        closeDialog()
                    }}
                />
            </DialogFooter>
        </DialogContent>
    )
}

type RoomRowProps = {
    roomIndex: number
    guestNumber: number
    setRooms: Dispatch<SetStateAction<WishedRoom[]>>
    removeRoomDisabled: boolean
}

const RoomRow = ({ roomIndex, guestNumber, setRooms, removeRoomDisabled }: RoomRowProps) => {
    return (
        <Fragment>
            <p>Phòng số {roomIndex + 1}</p>
            <div className="flex justify-center">
                <button
                    className="flex aspect-square w-[32px] items-center justify-center rounded-full border-2 border-red-600 bg-red-100 text-red-600 disabled:cursor-not-allowed disabled:border-gray-600 disabled:bg-gray-100 disabled:text-gray-600 disabled:opacity-50"
                    disabled={removeRoomDisabled}
                    onClick={() => setRooms(prev => prev.filter((_, idx) => idx !== roomIndex))}
                >
                    <FontAwesomeIcon icon={faTimes} size="1x" />
                </button>
            </div>
            <div className="flex items-center justify-center gap-3">
                <button
                    className="flex aspect-square w-[32px] items-center justify-center rounded-full border-2 border-green-600 bg-green-100 text-green-600 disabled:cursor-not-allowed disabled:border-gray-600 disabled:bg-gray-100 disabled:text-gray-600 disabled:opacity-50"
                    disabled={guestNumber === 1}
                    onClick={() => setRooms(prev => prev.map((rm, idx) => (idx === roomIndex ? { numberOfGuests: rm.numberOfGuests - 1 } : rm)))}
                >
                    <FontAwesomeIcon icon={faMinus} size="1x" />
                </button>
                <span>{guestNumber.toString().padStart(2, '0')}</span>
                <button
                    className="flex aspect-square w-[32px] items-center justify-center rounded-full border-2 border-green-600 bg-green-100 text-green-600 disabled:cursor-not-allowed disabled:border-gray-600 disabled:bg-gray-100 disabled:text-gray-600 disabled:opacity-50"
                    disabled={guestNumber >= 8}
                    onClick={() => setRooms(prev => prev.map((rm, idx) => (idx === roomIndex ? { numberOfGuests: rm.numberOfGuests + 1 } : rm)))}
                >
                    <FontAwesomeIcon icon={faPlus} size="1x" />
                </button>
            </div>
        </Fragment>
    )
}

export default SelectRoomAndGuestDialog
