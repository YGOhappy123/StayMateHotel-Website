import { useEffect, useState } from 'react'
import { PopoverContent } from '@/components/ui/Popover'
import { RoomClassSortAndFilterParams } from '@/services/roomClassService'
import Button from '@/components/common/Button'
import TextInput from '@/components/common/TextInput'
import SelectInput from '@/components/common/SelectInput'

type RoomClassFilterProps = {
    setHavingFilters: (value: boolean) => void
    onChange: (params: RoomClassSortAndFilterParams) => void
    onSearch: () => void
    onReset: () => void
}

const RoomClassFilter = ({ setHavingFilters, onChange, onSearch, onReset }: RoomClassFilterProps) => {
    const [searchClassName, setSearchClassName] = useState<string>('')
    const [range, setRange] = useState<string[] | any[]>()
    const [sort, setSort] = useState<string>('-createdAt')

    const [rangePickerDate, setRangePickerDate] = useState<any[]>([])


    useEffect(() => {
        onChange({ searchClassName, sort, range })
    }, [searchClassName, sort, range])

    const handleSearch = () => {
        onSearch()

        if (!searchClassName && sort === '-createdAt' && !range?.length) {
            setHavingFilters(false)
        } else {
            setHavingFilters(true)
        }
    }

    const handleReset = () => {
        setSearchClassName('')
        setSort('-createdAt')
        setRangePickerDate([])
        setHavingFilters(false)
        onReset()
    }

    return (
        <PopoverContent className="w-[400px] bg-white">
            <div className="mb-4 flex items-center justify-between">
                <Button text="Tìm kiếm" variant="gradient" className="rounded-2xl border-primary px-3 py-1.5 text-xs" onClick={handleSearch} />
                <Button text="Đặt lại" variant="danger" className="rounded-2xl px-3 py-1.5 text-xs" onClick={handleReset} />
            </div>
            <form>
                <div className="mb-4">
                    <TextInput
                        fieldName="className"
                        placeholder="Lọc theo tên loại phòng"
                        error=""
                        value={searchClassName}
                        onChange={(value: string) => setSearchClassName(value)}
                        onFocus={() => {}}
                        labelClassName="bg-white"
                        inputClassName="leading-2"
                    />
                </div>
                <div>
                    <SelectInput
                        fieldName="roomClassClassId"
                        placeholder="Sắp xếp theo"
                        options={[
                            { value: '-createdAt', label: 'Ngày tạo giảm dần' },
                            { value: '+createdAt', label: 'Ngày tạo tăng dần' },
                        ]}
                        error=""
                        value={sort}
                        onChange={(value: string | number) => setSort(value as string)}
                        onFocus={() => {}}
                        labelClassName="bg-white"
                        selectClassName="py-[9px]"
                    />
                </div>
            </form>
        </PopoverContent>
    )
}

export default RoomClassFilter
