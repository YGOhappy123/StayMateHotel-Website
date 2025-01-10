import { useEffect, useState } from 'react'
import { PopoverContent } from '@/components/ui/Popover'
import { BookingSortAndFilterParams } from '@/services/bookingService'
import { DateRange } from 'react-day-picker'

import { BOOKING_STATUS_MAPPING } from '@/utils/bookingStatusMapping'
import Button from '@/components/common/Button'
import TextInput from '@/components/common/TextInput'
import SelectInput from '@/components/common/SelectInput'
import DateRangePicker from '@/components/common/DateRangePicker'

type BookingFilterProps = {
    setHavingFilters: (value: boolean) => void
    onChange: (params: BookingSortAndFilterParams) => void
    onSearch: () => void
    onReset: () => void
}

const BookingFilter = ({ setHavingFilters, onChange, onSearch, onReset }: BookingFilterProps) => {
    const [searchBookingId, setSearchBookingId] = useState<string>('')
    const [searchGuestName, setSearchGuestName] = useState<string>('')
    const [searchEmail, setSearchEmail] = useState<string>('')
    const [searchPhoneNumber, setSearchPhoneNumber] = useState<string>('')
    const [searchRoomNumber, setSearchRoomNumber] = useState<string>('')
    const [searchStatus, setSearchStatus] = useState<string>('')
    const [searchMinTotalAmount, setSearchMinTotalAmount] = useState<string>('')
    const [searchMaxTotalAmount, setSearchMaxTotalAmount] = useState<string>('')
    const [rangeBookingTime, setRangeBookingTime] = useState<string[] | any[]>()
    const [rangeCheckInTime, setRangeCheckInTime] = useState<string[] | any[]>()
    const [rangeCheckOutTime, setRangeCheckOutTime] = useState<string[] | any[]>()
    const [sort, setSort] = useState<string>('-createdAt')

    const [dateBooking, setDateBooking] = useState<DateRange | undefined>(undefined)
    const [dateCheckIn, setDateCheckIn] = useState<DateRange | undefined>(undefined)
    const [dateCheckOut, setDateCheckOut] = useState<DateRange | undefined>(undefined)

    useEffect(() => {
        if (dateBooking) {
            const dateRange = [dateBooking.from]
            if (dateBooking.to) dateRange.push(dateBooking.to)

            setRangeBookingTime(dateRange)
        } else {
            setRangeBookingTime([])
        }

        if (dateCheckIn) {
            const dateRange = [dateCheckIn.from]
            if (dateCheckIn.to) dateRange.push(dateCheckIn.to)

            setRangeCheckInTime(dateRange)
        } else {
            setRangeCheckInTime([])
        }

        if (dateCheckOut) {
            const dateRange = [dateCheckOut.from]
            if (dateCheckOut.to) dateRange.push(dateCheckOut.to)

            setRangeCheckOutTime(dateRange)
        } else {
            setRangeCheckOutTime([])
        }
    }, [dateBooking, dateCheckIn, dateCheckOut])

    useEffect(() => {
        onChange({
            searchBookingId,
            searchGuestName,
            searchEmail,
            searchPhoneNumber,
            searchRoomNumber,
            searchStatus,
            searchMinTotalAmount,
            searchMaxTotalAmount,
            sort,
            rangeBookingTime,
            rangeCheckInTime,
            rangeCheckOutTime
        })
    }, [
        searchBookingId,
        searchGuestName,
        searchEmail,
        searchPhoneNumber,
        searchRoomNumber,
        searchStatus,
        searchMinTotalAmount,
        searchMaxTotalAmount,
        sort,
        rangeBookingTime,
        rangeCheckInTime,
        rangeCheckOutTime
    ])

    const handleSearch = () => {
        onSearch()

        if (
            !searchBookingId &&
            !searchGuestName &&
            !searchEmail &&
            !searchPhoneNumber &&
            !searchRoomNumber &&
            !searchStatus &&
            !searchMinTotalAmount &&
            !searchMaxTotalAmount &&
            sort === '-createdAt' &&
            !rangeBookingTime?.length &&
            !rangeCheckInTime?.length &&
            !rangeCheckOutTime?.length
        ) {
            setHavingFilters(false)
        } else {
            setHavingFilters(true)
        }
    }

    const handleReset = () => {
        setSearchBookingId('')
        setSearchGuestName('')
        setSearchEmail('')
        setSearchPhoneNumber('')
        setSearchRoomNumber('')
        setSearchStatus('')
        setSearchMinTotalAmount('')
        setSearchMaxTotalAmount('')
        setSort('-createdAt')
        setDateBooking(undefined)
        setDateCheckIn(undefined)
        setDateCheckOut(undefined)
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
                        fieldName="bookingId"
                        placeholder="Lọc theo mã đơn"
                        error=""
                        value={searchBookingId}
                        onChange={(value: string) => setSearchBookingId(Number.parseInt(value) >= 1 ? value : '')}
                        onFocus={() => {}}
                        type="number"
                        labelClassName="bg-white"
                        inputClassName="leading-2"
                    />
                </div>
                <div className="mb-4">
                    <TextInput
                        fieldName="guestName"
                        placeholder="Lọc theo tên khách"
                        error=""
                        value={searchGuestName}
                        onChange={(value: string) => setSearchGuestName(value)}
                        onFocus={() => {}}
                        labelClassName="bg-white"
                        inputClassName="leading-2"
                    />
                </div>
                <div className="mb-4">
                    <SelectInput
                        fieldName="status"
                        placeholder="Trạng thái"
                        options={['Pending', 'Confirmed', 'Cancelled', 'CheckedIn', 'CheckedOut', 'PaymentDone'].map(stt => ({
                            value: stt,
                            label: BOOKING_STATUS_MAPPING[stt as keyof typeof BOOKING_STATUS_MAPPING]
                        }))}
                        error=""
                        value={searchStatus}
                        onChange={(value: string | number) => setSearchStatus(value as string)}
                        onFocus={() => {}}
                        labelClassName="bg-white"
                        selectClassName="py-[9px]"
                    />
                </div>
                <div className="mb-4 flex gap-2">
                    <TextInput
                        fieldName="minPrice"
                        placeholder="Tổng tiền tối thiểu"
                        error=""
                        value={searchMinTotalAmount}
                        onChange={(value: string) => setSearchMinTotalAmount(Number.parseInt(value) >= 0 ? value : '')}
                        onFocus={() => {}}
                        type="number"
                        labelClassName="bg-white"
                        inputClassName="leading-2"
                    />
                    <TextInput
                        fieldName="maxPrice"
                        placeholder="Tổng tiền tối đa"
                        error=""
                        value={searchMaxTotalAmount}
                        onChange={(value: string) => setSearchMaxTotalAmount(Number.parseInt(value) >= 0 ? value : '')}
                        onFocus={() => {}}
                        type="number"
                        labelClassName="bg-white"
                        inputClassName="leading-2"
                    />
                </div>
                <div className="mb-4">
                    <DateRangePicker date={dateBooking} setDate={setDateBooking} triggerClassName="leading-normal" />
                </div>
                <div className="mb-4">
                    <DateRangePicker
                        date={dateCheckIn}
                        setDate={setDateCheckIn}
                        triggerClassName="leading-normal"
                        placeHolder="Lọc theo ngày check-in"
                    />
                </div>
                <div className="mb-4">
                    <DateRangePicker
                        date={dateCheckOut}
                        setDate={setDateCheckOut}
                        triggerClassName="leading-normal"
                        placeHolder="Lọc theo ngày check-out"
                    />
                </div>
                <div>
                    <SelectInput
                        fieldName="sort"
                        placeholder="Sắp xếp theo"
                        options={[
                            { value: '-createdAt', label: 'Ngày tạo giảm dần' },
                            { value: '+createdAt', label: 'Ngày tạo tăng dần' },
                            { value: '-totalAmount', label: 'Tổng tiền giảm dần' },
                            { value: '+totalAmount', label: 'Tổng tiền tăng dần' }
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

export default BookingFilter
