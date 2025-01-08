const BOOKING_STATUS_MAPPING = {
    Pending: 'Chờ xử lý',
    Confirmed: 'Đã xác nhận',
    Cancelled: 'Bị hủy hoặc từ chối',
    CheckedIn: 'Đã check-in',
    CheckedOut: 'Đã check-out',
    PaymentDone: 'Đã thanh toán xong'
}

const getMappedBookingStatus = (status: string) => {
    return BOOKING_STATUS_MAPPING[status as keyof typeof BOOKING_STATUS_MAPPING] ?? 'Không xác định'
}

const BOOKING_SERVICE_STATUS_MAPPING = {
    Pending: 'Chờ xử lý',
    Accepted: 'Chờ bàn giao',
    Rejected: 'Bị từ chối',
    Done: 'Đã bàn giao xong'
}

const getMappedBookingServiceStatus = (status: string) => {
    return BOOKING_SERVICE_STATUS_MAPPING[status as keyof typeof BOOKING_SERVICE_STATUS_MAPPING] ?? 'Không xác định'
}

const PAYMENT_METHOD_MAPPING = {
    Cash: 'Tiền mặt',
    CreditCard: 'Quẹt thẻ tín dụng',
    Transfer: 'Chuyển khoản'
}

const getMappedPaymentMethod = (status: string) => {
    return PAYMENT_METHOD_MAPPING[status as keyof typeof PAYMENT_METHOD_MAPPING] ?? 'Không xác định'
}

export {
    BOOKING_STATUS_MAPPING,
    BOOKING_SERVICE_STATUS_MAPPING,
    PAYMENT_METHOD_MAPPING,
    getMappedBookingStatus,
    getMappedBookingServiceStatus,
    getMappedPaymentMethod
}
