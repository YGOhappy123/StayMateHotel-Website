import { useEffect, useState } from 'react'
import { PopoverContent } from '@/components/ui/Popover'
import { FeatureSortAndFilterParams } from '@/services/featureService'
import { DateRange } from 'react-day-picker'

import Button from '@/components/common/Button'
import TextInput from '@/components/common/TextInput'
import SelectInput from '@/components/common/SelectInput'
import DateRangePicker from '@/components/common/DateRangePicker'

type FeatureFilterProps = {
    roomClasses: IRoomClass[]
    setHavingFilters: (value: boolean) => void
    onChange: (params: FeatureSortAndFilterParams) => void
    onSearch: () => void
    onReset: () => void
}

const FeatureFilter = ({ roomClasses, setHavingFilters, onChange, onSearch, onReset }: FeatureFilterProps) => {
    const [searchFeatureName, setSearchFeatureName] = useState<string>('')
    const [searchRoomClasses, setSearchRoomClasses] = useState<number[]>([])
    const [startTime, setStartTime] = useState<string>('')
    const [endTime, setEndTime] = useState<string>('')
    const [sort, setSort] = useState<string>('-createdAt')
    const [range, setRange] = useState<string[] | any[]>()

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
        onChange({
            searchFeatureName,
            searchRoomClasses,
            //startTime,
            //endTime,
            sort,
            range
        })
    }, [searchFeatureName, searchRoomClasses, sort, range])

    const handleSearch = () => {
        onSearch()

        if (
            !searchFeatureName &&
            !searchRoomClasses.length &&
            !startTime &&
            !endTime &&
            sort === '-createdAt'
        ) {
            setHavingFilters(false)
        } else {
            setHavingFilters(true)
        }
    }

    const handleReset = () => {
        setSearchFeatureName('')
        setSearchRoomClasses([])
        setStartTime('')
        setEndTime('')
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
                {/* Lọc theo lớp phòng */}
                <div className="relative rounded border-2 border-primary py-2 pl-3 pr-1">
                    <h3 className="absolute -left-2 -top-0.5 -translate-y-1/2 scale-[0.8] bg-white px-1 font-medium text-primary">
                        Lọc theo lớp phòng
                    </h3>
                    <div className="mt-2 flex max-h-[256px] flex-col gap-2 overflow-y-auto pr-2">
                        {roomClasses.map(roomClass => (
                            <div key={roomClass.id} className="flex items-center gap-3">
                                <p className="flex-1 truncate">{roomClass.className}</p>
                                <input
                                    type="checkbox"
                                    className="scale-150"
                                    checked={searchRoomClasses.includes(roomClass.id)}
                                    onChange={e => {
                                        setSearchRoomClasses(prev => {
                                            if (e.target.checked) {
                                                return [...prev, roomClass.id].sort()
                                            } else {
                                                return prev.filter(rc => rc !== roomClass.id)
                                            }
                                        })
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Lọc theo tên tính năng */}
                <form>
                    <div className="mb-4">
                        <TextInput
                            fieldName="featureName"
                            placeholder="Lọc theo tên tính năng"
                            error=""
                            value={searchFeatureName}
                            onChange={(value: string) => setSearchFeatureName(value)}
                            onFocus={() => { }}
                            labelClassName="bg-white"
                            inputClassName="leading-2"
                        />
                    </div>

                    {/* Lọc theo thời gian */}
                    <div className="mb-4">
                        <DateRangePicker date={date} setDate={setDate} triggerClassName="leading-normal" />
                    </div>

                    {/* Sắp xếp */}
                    <div>
                        <SelectInput
                            fieldName="sort"
                            placeholder="Sắp xếp theo"
                            options={[
                                { value: '-createdAt', label: 'Ngày tạo giảm dần' },
                                { value: '+createdAt', label: 'Ngày tạo tăng dần' },
                            ]}
                            error=""
                            value={sort}
                            onChange={(value: string | number) => setSort(value as string)}
                            onFocus={() => { }}
                            labelClassName="bg-white"
                            selectClassName="py-[9px]"
                        />
                    </div>
                </form>
            </div>
        </PopoverContent>
    )
}

export default FeatureFilter
