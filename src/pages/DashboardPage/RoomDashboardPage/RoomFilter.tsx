import { useEffect, useState } from 'react'
import { PopoverContent } from '@/components/ui/Popover'
import { RoomSortAndFilterParams } from '@/services/roomService'
import { DateRange } from 'react-day-picker'

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
    const [searchPriceQuery, setSearchPriceQuery] = useState<string>('')
    const [searchFloor, setSearchFloor] = useState<number>(0)
    const [searchRoomClass, setSearchRoomClass] = useState<number>(0)
    const [range, setRange] = useState<string[] | any[]>()
    const [sort, setSort] = useState<string>('-createdAt')

    const [searchPrice, setSearchPrice] = useState<string>('')
    const [priceSort, setPriceSort] = useState<string>('$lte')
    const [date, setDate] = useState<DateRange | undefined>(undefined)

    useEffect(() => {
        if (searchPrice) {
            const query = { [priceSort]: searchPrice }
            setSearchPriceQuery(JSON.stringify(query))
        } else {
            setSearchPriceQuery('')
        }
    }, [searchPrice, priceSort])

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
        onChange({ searchRoomNumber, searchPriceQuery, searchFloor, searchRoomClass, sort, range })
    }, [searchRoomNumber, searchPriceQuery, searchFloor, searchRoomClass, sort, range])

    const handleSearch = () => {
        onSearch()

        if (!searchRoomNumber && !searchPriceQuery && !searchFloor && !searchRoomClass && sort === '-createdAt' && !range?.length) {
            setHavingFilters(false)
        } else {
            setHavingFilters(true)
        }
    }

    const handleReset = () => {
        setSearchRoomNumber('')
        setSearchPriceQuery('')
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
                    <DateRangePicker date={date} setDate={setDate} triggerClassName="leading-normal" />
                </div>
                <div className="mb-4 flex gap-2">
                    <TextInput
                        fieldName="price"
                        placeholder="Lọc theo giá tiền"
                        error=""
                        value={searchPrice}
                        onChange={(value: string) => setSearchPrice(Number.parseInt(value) >= 0 ? value : '')}
                        onFocus={() => {}}
                        type="number"
                        wrapperClassName="flex-1"
                        labelClassName="bg-white"
                        inputClassName="leading-2"
                    />
                    <SelectInput
                        fieldName="priceSort"
                        placeholder="Chọn mốc"
                        options={[
                            { value: '$lte', label: 'Bé hơn hoặc bằng' },
                            { value: '$gte', label: 'Lớn hơn hoặc bằng' }
                        ]}
                        error=""
                        value={priceSort}
                        onChange={(value: string | number) => setPriceSort(value as string)}
                        onFocus={() => {}}
                        havingDefaultOptions={false}
                        labelClassName="bg-white"
                        selectClassName="py-[9px]"
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
