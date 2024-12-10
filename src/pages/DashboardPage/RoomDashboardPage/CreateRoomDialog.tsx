import { useEffect, useState } from 'react'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import Button from '@/components/common/Button'
import TextInput from '@/components/common/TextInput'
import SelectInput from '@/components/common/SelectInput'
import roomService from '@/services/roomService'

type CreateRoomDialogProps = {
    isOpen: boolean
    closeDialog: () => void
    floors: IFloor[]
    roomClasses: IRoomClass[]
}

const CreateRoomDialog = ({ isOpen, closeDialog, floors, roomClasses }: CreateRoomDialogProps) => {
    const { createNewRoomMutation } = roomService({ enableFetching: false })
    const [images, setImages] = useState<string[]>([])

    const [formValues, setFormValues] = useState({
        roomNumber: '',
        floorId: 0,
        roomClassId: 0
    })

    const [errors, setErrors] = useState({
        roomNumber: '',
        floorId: '',
        roomClassId: ''
    })

    const handleSubmit = async () => {
        const formErrors = validateFormValues()

        if (!formErrors.roomNumber && !formErrors.floorId && !formErrors.roomClassId) {
            await createNewRoomMutation.mutateAsync({ ...formValues, images: images }).then(() => closeDialog())
        } else {
            setErrors(formErrors)
        }
    }

    const validateFormValues = () => {
        const { roomNumber, floorId, roomClassId } = formValues
        const formErrors = { ...errors }

        if (!roomNumber.trim()) formErrors.roomNumber = formErrors.roomNumber || 'Mã phòng không được để trống.'
        if (!floorId) formErrors.floorId = formErrors.floorId || 'Vui lòng chọn tầng.'
        if (!roomClassId) formErrors.roomClassId = formErrors.roomClassId || 'Vui lòng chọn loại phòng.'

        return formErrors
    }

    useEffect(() => {
        if (isOpen) {
            setFormValues({
                roomNumber: '',
                floorId: 0,
                roomClassId: 0
            })
            setImages([])
            setErrors({
                roomNumber: '',
                floorId: '',
                roomClassId: ''
            })
        }
    }, [isOpen])

    return (
        <DialogContent className="max-w-[1000px] bg-white">
            <DialogHeader>
                <DialogTitle>Tạo phòng mới</DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="border-b-2"></div>
            <div className="grid grid-cols-2 gap-4">
                <div>images carousel</div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-10">
                        <TextInput
                            fieldName="roomNumber"
                            placeholder="Số phòng"
                            error={errors.roomNumber}
                            value={formValues.roomNumber}
                            onChange={(value: string) => setFormValues(prev => ({ ...prev, roomNumber: value }))}
                            onFocus={() => setErrors(prev => ({ ...prev, roomNumber: '' }))}
                            labelClassName="bg-white"
                        />
                    </div>
                    <div className="mb-10">
                        <SelectInput
                            fieldName="floorId"
                            placeholder="Tầng"
                            options={floors.map(floor => ({ value: floor.id, label: floor.floorNumber }))}
                            error={errors.floorId}
                            value={formValues.floorId}
                            onChange={(value: string | number) => setFormValues(prev => ({ ...prev, floorId: value as number }))}
                            onFocus={() => setErrors(prev => ({ ...prev, floorId: '' }))}
                            labelClassName="bg-white"
                        />
                    </div>
                    <div>
                        <SelectInput
                            fieldName="roomClassId"
                            placeholder="Loại phòng"
                            options={roomClasses.map(roomClass => ({ value: roomClass.id, label: roomClass.className }))}
                            error={errors.roomClassId}
                            value={formValues.roomClassId}
                            onChange={(value: string | number) => setFormValues(prev => ({ ...prev, roomClassId: value as number }))}
                            onFocus={() => setErrors(prev => ({ ...prev, roomClassId: '' }))}
                            labelClassName="bg-white"
                        />
                    </div>
                </form>
            </div>
            <div className="border-b-2"></div>
            <DialogFooter>
                <Button text="Hủy bỏ" variant="danger" onClick={closeDialog} />
                <Button text="Xác nhận" variant="success" onClick={handleSubmit} />
            </DialogFooter>
        </DialogContent>
    )
}

export default CreateRoomDialog
