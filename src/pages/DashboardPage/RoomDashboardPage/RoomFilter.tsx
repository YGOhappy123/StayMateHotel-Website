import { useEffect, useState } from 'react'
import { PopoverContent } from '@/components/ui/Popover'
import { RoomSortAndFilterParams } from '@/services/roomService'
import Button from '@/components/common/Button'
import TextInput from '@/components/common/TextInput'
import SelectInput from '@/components/common/SelectInput'

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
    const [rangePickerDate, setRangePickerDate] = useState<any[]>([])

    useEffect(() => {
        if (searchPrice) {
            const query = { [priceSort]: searchPrice }
            setSearchPriceQuery(JSON.stringify(query))
        } else {
            setSearchPriceQuery('')
        }
    }, [searchPrice, priceSort])

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
                <div>
                    <SelectInput
                        fieldName="roomClassId"
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
