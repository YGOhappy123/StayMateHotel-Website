import { useEffect, useState } from 'react'
import { PopoverContent } from '@/components/ui/Popover'
import { RoomClassSortAndFilterParams } from '@/services/roomClassService'
import { DateRange } from 'react-day-picker'

import Button from '@/components/common/Button'
import TextInput from '@/components/common/TextInput'
import SelectInput from '@/components/common/SelectInput'
import DateRangePicker from '@/components/common/DateRangePicker'

type RoomClassFilterProps = {
    setHavingFilters: (value: boolean) => void
    onChange: (params: RoomClassSortAndFilterParams) => void
    onSearch: () => void
    onReset: () => void
}

const RoomClassFilter = ({ setHavingFilters, onChange, onSearch, onReset }: RoomClassFilterProps) => {
    const [searchClassName, setSearchClassName] = useState<string>('')
    const [searchPriceQuery, setSearchPriceQuery] = useState<string>('')
    const [searchCapacityQuery, setSearchCapacityQuery] = useState<string>('')
    const [range, setRange] = useState<string[] | any[]>()
    const [sort, setSort] = useState<string>('-createdAt')

    const [searchPrice, setSearchPrice] = useState<string>('')
    const [priceSort, setPriceSort] = useState<string>('$lte')
    const [searchCapacity, setSearchCapacity] = useState<string>('')
    const [capacitySort, setCapacitySort] = useState<string>('$lte')
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
        if (searchCapacity) {
            const query = { [capacitySort]: searchCapacity }
            setSearchCapacityQuery(JSON.stringify(query))
        } else {
            setSearchCapacityQuery('')
        }
    }, [searchCapacity, capacitySort])
    
    useEffect(() => {
        if (date) {
            const dateRange = [date.from]
            if (date.to) dateRange.push(date.to)

            setRange(dateRange)
        }
    }, [date])

    useEffect(() => {
        onChange({ searchClassName, searchPriceQuery, searchCapacityQuery, sort, range })
    }, [searchClassName, searchPriceQuery, searchCapacityQuery, sort, range])

    const handleSearch = () => {
        onSearch()

        if (!searchClassName && !searchPriceQuery && !searchCapacityQuery && sort === '-createdAt' && !range?.length) {
            setHavingFilters(false)
        } else {
            setHavingFilters(true)
        }
    }

    const handleReset = () => {
        setSearchClassName('')
        setSearchPriceQuery('')
        setSearchCapacityQuery('')
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
                <div className="mb-4">
                    <DateRangePicker date={date} setDate={setDate} triggerClassName="leading-normal" />
                </div>
                <div className="mb-4 flex gap-2">
                    <TextInput
                        fieldName="price"
                        placeholder="Lọc theo giá tiền"
                        error=""
                        value={searchPrice}
                        onChange={(value: string) => setSearchPrice(value)}
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
                <div className="mb-4 flex gap-2">
                    <TextInput
                        fieldName="capacity"
                        placeholder="Lọc theo sức chứa"
                        error=""
                        value={searchCapacity}
                        onChange={(value: string) => setSearchCapacity(value)}
                        onFocus={() => {}}
                        type="number"
                        wrapperClassName="flex-1"
                        labelClassName="bg-white"
                        inputClassName="leading-2"
                    />
                    <SelectInput
                        fieldName="capacitySort"
                        placeholder="Chọn mốc"
                        options={[
                            { value: '$lte', label: 'Bé hơn hoặc bằng' },
                            { value: '$gte', label: 'Lớn hơn hoặc bằng' }
                        ]}
                        error=""
                        value={capacitySort}
                        onChange={(value: string | number) => setCapacitySort(value as string)}
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
                            { value: '-basePrice', label: 'Tiền thuê giảm dần' },
                            { value: '+basePrice', label: 'Tiền thuê tăng dần' }
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
