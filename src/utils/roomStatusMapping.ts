const STATUS_MAPPING = {
    Available: 'Đang khả dụng',
    Occupied: 'Đang cho thuê',
    UnderCleaning: 'Đang dọn dẹp',
    OutOfService: 'Đang bảo trì'
}

const getMappedStatus = (status: string) => {
    return STATUS_MAPPING[status as keyof typeof STATUS_MAPPING] ?? 'Không xác định'
}

export { STATUS_MAPPING, getMappedStatus }
