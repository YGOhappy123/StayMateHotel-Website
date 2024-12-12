const RES_MESSAGE_MAPPING = {
    USERNAME_EXISTED: 'Tên đăng nhập đã tồn tại.',
    DUPLICATE_ROOM_NUMBER: 'Só phòng này đã được sử dụng.'
}

const getMappedMessage = (originalMessage: string) => {
    return RES_MESSAGE_MAPPING[originalMessage as keyof typeof RES_MESSAGE_MAPPING] ?? originalMessage
}

export { RES_MESSAGE_MAPPING, getMappedMessage }
