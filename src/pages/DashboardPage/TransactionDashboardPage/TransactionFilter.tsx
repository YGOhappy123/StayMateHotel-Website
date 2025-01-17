import { useEffect, useState } from 'react';
import { PopoverContent } from '@/components/ui/Popover';
import { TransactionSortAndFilterParams } from '@/services/transactionService'
import { DateRange } from 'react-day-picker';

import Button from '@/components/common/Button';
import TextInput from '@/components/common/TextInput';
import SelectInput from '@/components/common/SelectInput';
import DateRangePicker from '@/components/common/DateRangePicker';



type TransactionFilterProps = {
    setHavingFilters: (value: boolean) => void;
    onChange: (params: TransactionSortAndFilterParams) => void;
    onSearch: () => void;
    onReset: () => void;
};

const TransactionFilter = ({ setHavingFilters, onChange, onSearch, onReset }: TransactionFilterProps) => {
    const [searchBookingId, setSearchBookingId] = useState<string>('')
    const [paymentMethod, setPaymentMethod] = useState<string>('')
    const [range, setRange] = useState<string[] | any[]>()
    const [sort, setSort] = useState<string>('-paymentTime')
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
        onChange({ searchBookingId, paymentMethod, sort, range })
    }, [searchBookingId, paymentMethod, sort, range])

    const handleSearch = () => {
        onSearch()

        if (!searchBookingId && !paymentMethod && sort === '-paymentTime' && !range?.length) {
            setHavingFilters(false)
        } else {
            setHavingFilters(true)
        }
    }

    const handleReset = () => {
        setSearchBookingId('')
        setPaymentMethod('')
        setSort('-paymentTime')
        setDate(undefined)
        setHavingFilters(false)
        onReset()
    }

    return (
        <PopoverContent className="w-[400px] bg-white">
            <div className="mb-4 flex items-center justify-between">
                <Button
                    text="Tìm kiếm"
                    variant="gradient"
                    className="rounded-2xl border-primary px-3 py-1.5 text-xs"
                    onClick={handleSearch}
                />
                <Button
                    text="Đặt lại"
                    variant="danger"
                    className="rounded-2xl px-3 py-1.5 text-xs"
                    onClick={handleReset}
                />
            </div>
            <form>
                <div className="mb-4">
                    <TextInput
                        fieldName="bookingId"
                        placeholder="Lọc theo mã đơn đặt phòng"
                        error=""
                        value={searchBookingId || ''}
                        onChange={(value: string) => setSearchBookingId(Number.parseInt(value) >= 1 ? value : '')}
                        onFocus={() => {}}
                        type="number"
                        labelClassName="bg-white"
                        inputClassName="leading-2"
                    />
                </div>
                <div className="mb-4">
                    <DateRangePicker
                        placeHolder='Lọc theo ngày thanh toán'
                        date={date}
                        setDate={setDate}
                        triggerClassName="leading-normal"
                    />
                </div>
                <div className="mb-4">
                    <SelectInput
                        fieldName="paymentMethod"
                        placeholder="Phương thức thanh toán"
                        options={[
                            { value: 'CreditCard', label: 'Thẻ tín dụng' },
                            { value: 'Transfer', label: 'Chuyển khoản ngân hàng' },
                            { value: 'Cash', label: 'Tiền mặt' },
                        ]}
                        value={paymentMethod || ''}
                        onChange={(value) => setPaymentMethod(value as string)}
                        onFocus={() => {}}
                        error=""
                        labelClassName="bg-white"
                        selectClassName="py-[9px]"
                    />
                </div>
                <div className="mb-4">
                    <SelectInput
                        fieldName="sort"
                        placeholder="Sắp xếp theo"
                        options={[
                            { value: '-paymentTime', label: 'Ngày tạo giảm dần' },
                            { value: '+paymentTime', label: 'Ngày tạo tăng dần' },
                            { value: '-amount', label: 'Giá trị giảm dần' },
                            { value: '+amount', label: 'Giá trị tăng dần' },
                        ]}
                        value={sort || ''}
                        onChange={(value) => setSort(value as string)}
                        onFocus={() => {}}
                        error=""
                        labelClassName="bg-white"
                        selectClassName="py-[9px]"
                    />
                </div>
            </form>
        </PopoverContent>
    );
};

export default TransactionFilter;
