import { useEffect, useState } from 'react'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/Carousel'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

import Button from '@/components/common/Button'
import TextInput from '@/components/common/TextInput'
import SelectInput from '@/components/common/SelectInput'
import ImageUploader from '@/components/common/ImageUploader'
import fileService from '@/services/fileService'

type UpdateRoomDialogProps = {
    selectedRoom: IRoom | null
    isOpen: boolean
    closeDialog: () => void
    floors: IFloor[]
    roomClasses: IRoomClass[]
    updateRoomMutation: any
}

const UpdateRoomDialog = ({ selectedRoom, isOpen, closeDialog, floors, roomClasses, updateRoomMutation }: UpdateRoomDialogProps) => {
    const { uploadMutation, deleteMutation } = fileService()
    const [images, setImages] = useState<string[]>([])
    const [imagesToBeDeleted, setImagesToBeDeleted] = useState<string[]>([])

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
            await Promise.all(imagesToBeDeleted.map(async image => await deleteMutation.mutateAsync(image)))
            await updateRoomMutation
                .mutateAsync({
                    roomId: selectedRoom?.id!,
                    data: { ...formValues, images: images }
                })
                .then(() => closeDialog())
        } else {
            setErrors(formErrors)
        }
    }

    const handleUploadFile = async (image: File) => {
        const res = await uploadMutation.mutateAsync({
            file: image,
            folder: 'rooms'
        })
        const { imageUrl } = res?.data?.data
        if (imageUrl) {
            setImages(prev => [...prev, imageUrl])
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
        if (isOpen && selectedRoom) {
            setFormValues({
                roomNumber: selectedRoom.roomNumber,
                floorId: selectedRoom.floorId,
                roomClassId: selectedRoom.roomClassId
            })
            setImages(selectedRoom.images || [])
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
                <DialogTitle>Cập nhật thông tin phòng</DialogTitle>
                <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="border-b-2"></div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Thêm ảnh phòng</h3>
                        <ImageUploader isLoading={uploadMutation.isLoading} onUpload={handleUploadFile} />
                    </div>
                    {images.length === 0 ? (
                        <div className="flex flex-col items-center gap-4">
                            <img src="/images/no-data.png" alt="no data" className="max-h-[150px]" />
                            <h4 className="text-base font-medium">Chưa có ảnh nào được chọn</h4>
                        </div>
                    ) : (
                        <Carousel className="w-full">
                            <CarouselContent className="mb-4 h-[300px]">
                                {images.map((image, index) => (
                                    <CarouselItem key={index}>
                                        <div className="relative flex h-full items-center justify-center">
                                            <img src={image} alt="room image" className="max-h-full object-contain" />
                                            <button
                                                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-red-600 hover:opacity-90"
                                                onClick={() => {
                                                    setImages(prev => [...prev.filter(img => img !== image)])
                                                    setImagesToBeDeleted(prev => [...prev, image])
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="text-white" />
                                            </button>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <div className="flex justify-center gap-4">
                                <CarouselPrevious className="static translate-y-0" />
                                <CarouselNext className="static translate-y-0" />
                            </div>
                        </Carousel>
                    )}
                </div>

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

export default UpdateRoomDialog
