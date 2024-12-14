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
    const [searchFeatures, setSearchFeatures] = useState<number[]>([])
    const [searchMinPrice, setSearchMinPrice] = useState<string>('')
    const [searchMaxPrice, setSearchMaxPrice] = useState<string>('')
    const [searchMinCapacity, setSearchMinCapacity] = useState<string>('')
    const [searchMaxCapacity, setSearchMaxCapacity] = useState<string>('')
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
        onChange({ searchClassName, searchMinCapacity, searchMaxCapacity, searchMinPrice, searchMaxPrice, searchFeatures, sort, range })
    }, [searchClassName, searchMinCapacity, searchMaxCapacity, searchMinPrice, searchMaxPrice, searchFeatures, sort, range])

    const handleSearch = () => {
        onSearch()

        if (
            !searchClassName &&
            !searchMinPrice &&
            !searchMaxPrice &&
            !searchMinCapacity &&
            !searchMaxCapacity &&
            sort === '-createdAt' &&
            !range?.length &&
            !searchFeatures?.length
        ) {
            setHavingFilters(false)
        } else {
            setHavingFilters(true)
        }
    }

    const handleReset = () => {
        setSearchClassName('')
        setSearchMinCapacity('')
        setSearchMaxCapacity('')
        setSearchMinPrice('')
        setSearchMaxPrice('')
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
                    <div className="mb-4 grid grid-cols-2 gap-2">
                        <TextInput
                            fieldName="minPrice"
                            placeholder="Mức giá tối thiểu"
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
                            placeholder="Mức giá tối đa"
                            error=""
                            value={searchMaxPrice}
                            onChange={(value: string) => setSearchMaxPrice(Number.parseInt(value) >= 0 ? value : '')}
                            onFocus={() => {}}
                            type="number"
                            labelClassName="bg-white"
                            inputClassName="leading-2"
                        />
                    </div>
                    <div className="mb-4 grid grid-cols-2 gap-2">
                        <TextInput
                            fieldName="minCapacity"
                            placeholder="Sức chứa tối thiểu"
                            error=""
                            value={searchMinCapacity}
                            onChange={(value: string) => setSearchMinCapacity(Number.parseInt(value) >= 0 ? value : '')}
                            onFocus={() => {}}
                            type="number"
                            labelClassName="bg-white"
                            inputClassName="leading-2"
                        />
                        <TextInput
                            fieldName="maxCapacity"
                            placeholder="Sức chứa tối đa"
                            error=""
                            value={searchMaxCapacity}
                            onChange={(value: string) => setSearchMaxCapacity(Number.parseInt(value) >= 0 ? value : '')}
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
