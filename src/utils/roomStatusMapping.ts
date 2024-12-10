const STATUS_MAPPING = {
    Available: 'Đang khả dụng',
    Reserved: 'Đã được đặt',
    Occupied: 'Đang cho thuê',
    UnderCleaning: 'Đang dọn dẹp',
    OutOfService: 'Đang bảo trì'
}

const getMappedStatus = (statUs: string) => {
    return STATUS_MAPPING[statUs as keyof typeof STATUS_MAPPING] ?? 'Không xác định'
}

export { STATUS_MAPPING, getMappedStatus }
