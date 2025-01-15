import { useEffect, useState } from 'react'
import { PopoverContent } from '@/components/ui/Popover'
import { RoomSortAndFilterParams } from '@/services/roomService'
import { DateRange } from 'react-day-picker'

import { STATUS_MAPPING } from '@/utils/roomStatusMapping'
import Button from '@/components/common/Button'
import TextInput from '@/components/common/TextInput'
import SelectInput from '@/components/common/SelectInput'
import DateRangePicker from '@/components/common/DateRangePicker'

type RoomFilterProps = {
    floors: IFloor[]
    roomClasses: IRoomClass[]
    setHavingFilters: (value: boolean) => void
    onChange: (params: RoomSortAndFilterParams) => void
    onSearch: () => void
    onReset: () => void
}

const RoomFilter = ({ floors, roomClasses, setHavingFilters, onChange, onSearch, onReset }: RoomFilterProps) => {
    const [searchRoomNumber, setSearchRoomNumber] = useState<string>('')
    const [searchFloor, setSearchFloor] = useState<number>(0)
    const [searchRoomClass, setSearchRoomClass] = useState<number>(0)
    const [searchStatus, setSearchStatus] = useState<string>('')
    const [searchMinPrice, setSearchMinPrice] = useState<string>('')
    const [searchMaxPrice, setSearchMaxPrice] = useState<string>('')
    const [range, setRange] = useState<string[] | any[]>()
    const [sort, setSort] = useState<string>('-createdAt')

    const [date, setDate] = useState<DateRange | undefined>(undefined)

    useEffect(() => {
        if (date) {
            const dateRange = [date.from]
            if (date.to) dateRange.push(date.to)

            setRange(dateRange)
        } else {
            setRange([])
        }
    }, [date])

    useEffect(() => {
        onChange({ searchRoomNumber, searchStatus, searchFloor, searchRoomClass, searchMinPrice, searchMaxPrice, sort, range })
    }, [searchRoomNumber, searchStatus, searchFloor, searchRoomClass, searchMinPrice, searchMaxPrice, sort, range])

    const handleSearch = () => {
        onSearch()
        if (!searchRoomNumber && !searchMinPrice && !searchMaxPrice && !searchFloor && !searchRoomClass && sort === '-createdAt' && !range?.length) {
            setHavingFilters(false)
        } else {
            setHavingFilters(true)
        }
    }

    const handleReset = () => {
        setSearchRoomNumber('')
        setSearchMinPrice('')
        setSearchMaxPrice('')
        setSearchStatus('')
        setSearchFloor(0)
        setSearchRoomClass(0)
        setSort('-createdAt')
        setDate(undefined)
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
                        fieldName="roomNumber"
                        placeholder="Lọc theo số phòng"
                        error=""
                        value={searchRoomNumber}
                        onChange={(value: string) => setSearchRoomNumber(value)}
                        onFocus={() => {}}
                        labelClassName="bg-white"
                        inputClassName="leading-2"
                    />
                </div>
                <div className="mb-4">
                    <SelectInput
                        fieldName="floorId"
                        placeholder="Lọc theo tầng"
                        options={floors.map(floor => ({ value: floor.id, label: floor.floorNumber }))}
                        error=""
                        value={searchFloor}
                        onChange={(value: string | number) => setSearchFloor(value as number)}
                        onFocus={() => {}}
                        labelClassName="bg-white"
                        selectClassName="py-[9px]"
                    />
                </div>
                <div className="mb-4">
                    <SelectInput
                        fieldName="roomClassId"
                        placeholder="Loại phòng"
                        options={roomClasses.map(roomClass => ({ value: roomClass.id, label: roomClass.className }))}
                        error=""
                        value={searchRoomClass}
                        onChange={(value: string | number) => setSearchRoomClass(value as number)}
                        onFocus={() => {}}
                        labelClassName="bg-white"
                        selectClassName="py-[9px]"
                    />
                </div>
                <div className="mb-4">
                    <SelectInput
                        fieldName="status"
                        placeholder="Trạng thái"
                        options={['Available', 'Occupied', 'UnderCleaning', 'OutOfService'].map(stt => ({
                            value: stt,
                            label: STATUS_MAPPING[stt as keyof typeof STATUS_MAPPING]
                        }))}
                        error=""
                        value={searchStatus}
                        onChange={(value: string | number) => setSearchStatus(value as string)}
                        onFocus={() => {}}
                        labelClassName="bg-white"
                        selectClassName="py-[9px]"
                    />
                </div>
                <div className="mb-4">
                    <DateRangePicker date={date} setDate={setDate} triggerClassName="leading-normal" />
                </div>
                <div className="mb-4 flex gap-2">
                    <TextInput
                        fieldName="minPrice"
                        placeholder="Chọn giá tối thiểu"
                        error=""
                        value={searchMinPrice}
                        onChange={(value: string) => setSearchMinPrice(Number.parseInt(value) >= 0 ? value : '')}
                        onFocus={() => {}}
                        type="number"
                        labelClassName="bg-white"
                        inputClassName="leading-2"
                    />
                    <TextInput
                        fieldName="maxPrice"
                        placeholder="Chọn giá tối đa"
                        error=""
                        value={searchMaxPrice}
                        onChange={(value: string) => setSearchMaxPrice(Number.parseInt(value) >= 0 ? value : '')}
                        onFocus={() => {}}
                        type="number"
                        labelClassName="bg-white"
                        inputClassName="leading-2"
                    />
                </div>
                <div>
                    <SelectInput
                        fieldName="sort"
                        placeholder="Sắp xếp theo"
                        options={[
                            { value: '-createdAt', label: 'Ngày tạo giảm dần' },
                            { value: '+createdAt', label: 'Ngày tạo tăng dần' },
                            { value: '-price', label: 'Tiền thuê giảm dần' },
                            { value: '+price', label: 'Tiền thuê tăng dần' }
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

export default RoomFilter
