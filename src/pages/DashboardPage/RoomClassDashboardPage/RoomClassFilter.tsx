import { useEffect, useState } from 'react'
import { PopoverContent } from '@/components/ui/Popover'
import { RoomClassSortAndFilterParams } from '@/services/roomClassService'
import { DateRange } from 'react-day-picker'

import Button from '@/components/common/Button'
import TextInput from '@/components/common/TextInput'
import SelectInput from '@/components/common/SelectInput'
import DateRangePicker from '@/components/common/DateRangePicker'

type RoomClassFilterProps = {
    features: IFeature[]
    setHavingFilters: (value: boolean) => void
    onChange: (params: RoomClassSortAndFilterParams) => void
    onSearch: () => void
    onReset: () => void
}

const RoomClassFilter = ({ features, setHavingFilters, onChange, onSearch, onReset }: RoomClassFilterProps) => {
    const [searchClassName, setSearchClassName] = useState<string>('')
    const [searchPriceQuery, setSearchPriceQuery] = useState<string>('')
    const [searchCapacityQuery, setSearchCapacityQuery] = useState<string>('')
    const [searchFeatures, setSearchFeatures] = useState<number[]>([])
    const [range, setRange] = useState<string[] | any[]>()
    const [sort, setSort] = useState<string>('-createdAt')

    const [searchPrice, setSearchPrice] = useState<string>('')
    const [searchPrice1, setSearchPrice1] = useState<string>('')
    const [searchPrice2, setSearchPrice2] = useState<string>('')
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
        } else {
            setRange([])
        }
    }, [date])

    useEffect(() => {
        onChange({ searchClassName, searchPriceQuery, searchCapacityQuery, searchFeatures, sort, range, searchPrice1, searchPrice2 })
    }, [searchClassName, searchPriceQuery, searchCapacityQuery, searchFeatures, sort, range, searchPrice1, searchPrice2])

    const handleSearch = () => {
        onSearch()

        if (!searchClassName && !searchPriceQuery && !searchCapacityQuery && sort === '-createdAt' && !range?.length && !searchFeatures?.length) {
            setHavingFilters(false)
        } else {
            setHavingFilters(true)
        }
    }

    const handleReset = () => {
        setSearchClassName('')
        setSearchPriceQuery('')
        setSearchCapacityQuery('')
        setSearchFeatures([])
        setSort('-createdAt')
        setDate(undefined)
        setHavingFilters(false)
        onReset()
    }

    return (
        <PopoverContent className="w-[800px] bg-white">
            <div className="mb-4 flex items-center justify-between">
                <Button text="Tìm kiếm" variant="gradient" className="rounded-2xl border-primary px-3 py-1.5 text-xs" onClick={handleSearch} />
                <Button text="Đặt lại" variant="danger" className="rounded-2xl px-3 py-1.5 text-xs" onClick={handleReset} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="relative rounded border-2 border-primary py-2 pl-3 pr-1">
                    <h3 className="absolute -left-2 -top-0.5 -translate-y-1/2 scale-[0.8] bg-white px-1 font-medium text-primary">
                        Lọc theo tiện ích của phòng
                    </h3>
                    <div className="mt-2 flex max-h-[256px] flex-col gap-2 overflow-y-auto pr-2">
                        {features.map(feature => (
                            <div key={feature.id} className="flex items-center gap-3">
                                <p className="flex-1 truncate">
                                    {feature.name} {feature.name}
                                </p>

                                <input
                                    type="checkbox"
                                    className="scale-150"
                                    checked={searchFeatures.includes(feature.id)}
                                    onChange={e => {
                                        setSearchFeatures(prev => {
                                            if (e.target.checked) {
                                                return [...prev, feature.id].sort()
                                            } else {
                                                return prev.filter(ft => ft !== feature.id)
                                            }
                                        })
                                    }}
                                />
                            </div>
                        ))}
                    </div>
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
                        {/* <TextInput
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
                        /> */}
                        <TextInput
                            fieldName="price1"
                            placeholder="Lọc theo giá min"
                            error=""
                            value={searchPrice1}
                            onChange={(value: string) => setSearchPrice1(Number.parseInt(value) >= 0 ? value : '')}
                            onFocus={() => {}}
                            type="number"
                            wrapperClassName="flex-1"
                            labelClassName="bg-white"
                            inputClassName="leading-2"
                        />
                        <TextInput
                            fieldName="price2"
                            placeholder="Lọc theo giá max"
                            error=""
                            value={searchPrice2}
                            onChange={(value: string) => setSearchPrice2(Number.parseInt(value) >= 0 ? value : '')}
                            onFocus={() => {}}
                            type="number"
                            wrapperClassName="flex-1"
                            labelClassName="bg-white"
                            inputClassName="leading-2"
                        />
                    </div>
                    <div className="mb-4 flex gap-2">
                        <TextInput
                            fieldName="capacity"
                            placeholder="Lọc theo sức chứa"
                            error=""
                            value={searchCapacity}
                            onChange={(value: string) => setSearchCapacity(Number.parseInt(value) >= 0 ? value : '')}
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
            </div>
        </PopoverContent>
    )
}

export default RoomClassFilter
