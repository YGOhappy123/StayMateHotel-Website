import { ChangeEvent } from 'react'
import Button from '@/components/common/Button'

type ImageUploaderProps = {
    isLoading: boolean
    onUpload: (image: File) => Promise<void>
}

const ImageUploader = ({ isLoading, onUpload }: ImageUploaderProps) => {
    const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        if (isLoading) return

        const file = e.target.files?.[0]
        if (file) {
            await onUpload(file)
        }
    }

    return (
        <div>
            <label
                htmlFor="image"
                className={`block min-w-[120px] cursor-pointer rounded-2xl border-2 border-solid border-primary bg-gradient-to-r from-accent to-primary px-3 py-1.5 text-center text-xs font-medium text-white hover:opacity-90 ${isLoading ? 'pointer-events-none opacity-90' : ''}`}
            >
                {isLoading ? 'Đang tải ...' : 'Thêm ảnh'}
            </label>
            <input type="file" name="image" id="image" accept="image/*" className="hidden" onChange={handleUpload} />
        </div>
    )
}

export default ImageUploader
