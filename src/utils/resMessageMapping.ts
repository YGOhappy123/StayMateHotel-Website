const RES_MESSAGE_MAPPING = {
    USERNAME_EXISTED: 'Tên đăng nhập đã tồn tại.',
    USER_NOT_FOUND: 'Người dùng không tồn tại.',
    INCORRECT_USERNAME_OR_PASSWORD: 'Tên đăng nhập hoặc mật khẩu không chính xác.',
    GOOGLE_AUTH_FAILED: 'Xác thực Google thất bại.',
    ROOM_NOT_FOUND: 'Phòng không tồn tại.',
    ROOM_NOT_FOUND_OR_UNAVAILABLE: 'Phòng không tồn tại hoặc không khả dụng.',
    ROOM_CANNOT_BE_UPDATED: 'Không thể cập nhật thông tin phòng.',
    ROOM_CANNOT_BE_DELETED: 'Không thể xóa phòng.',
    DUPLICATE_ROOM_NUMBER: 'Số phòng đã tồn tại.',
    INVALID_CREDENTIALS: 'Thông tin xác thực không hợp lệ.',
    DATA_VALIDATION_FAILED: 'Dữ liệu không hợp lệ.',
    UPLOAD_IMAGE_FAILED: 'Tải ảnh lên thất bại.',
    DELETE_IMAGE_FAILED: 'Xóa ảnh thất bại.',
    NO_PERMISSION: 'Bạn không có quyền thực hiện hành động này.',
    FEATURE_NOT_FOUND: 'Tiện ích không tồn tại.',
    DUPLICATE_FEATURE_NAME: 'Tên tiện ích đã tồn tại.',
    ROOM_CLASS_NOT_FOUND: 'Loại phòng không tồn tại.',
    DUPLICATE_ROOM_CLASS_NAME: 'Tên loại phòng đã tồn tại.',
    ROOM_CLASS_CANNOT_BE_DELETED: 'Không thể xóa loại phòng.',
    FLOOR_NOT_FOUND: 'Tầng không tồn tại.',
    DUPLICATE_FLOOR_NUMBER: 'Số tầng đã tồn tại.',
    FLOOR_CANNOT_BE_DELETED: 'Không thể xóa tầng.',

    SIGN_IN_SUCCESSFULLY: 'Đăng nhập thành công.',
    SIGN_UP_SUCCESSFULLY: 'Đăng ký thành công.',
    REFRESH_TOKEN_SUCCESSFULLY: 'Làm mới token thành công.',
    DEACTIVATE_ACCOUNT_SUCCESSFULLY: 'Hủy kích hoạt tài khoản thành công.',
    RESET_PASSWORD_EMAIL_SENT: 'Email đặt lại mật khẩu đã được gửi.',
    GOOGLE_AUTH_SUCCESSFULLY: 'Xác thực Google thành công.',
    RESET_PASSWORD_SUCCESSFULLY: 'Đặt lại mật khẩu thành công.',
    CHANGE_PASSWORD_SUCCESSFULLY: 'Thay đổi mật khẩu thành công.',
    CREATE_ROOM_SUCCESSFULLY: 'Tạo phòng thành công.',
    UPDATE_ROOM_SUCCESSFULLY: 'Cập nhật phòng thành công.',
    DELETE_ROOM_SUCCESSFULLY: 'Xóa phòng thành công.',
    UPLOAD_IMAGE_SUCCESSFULLY: 'Tải ảnh lên thành công.',
    DELETE_IMAGE_SUCCESSFULLY: 'Xóa ảnh thành công.',
    UPDATE_FEATURE_SUCCESSFULLY: 'Cập nhật tiện ích thành công.',
    CREATE_FEATURE_SUCCESSFULLY: 'Tạo tiện ích thành công.',
    DELETE_FEATURE_SUCCESSFULLY: 'Xóa tiện ích thành công.',
    CREATE_ROOM_CLASS_SUCCESSFULLY: 'Tạo loại phòng thành công.',
    UPDATE_ROOM_CLASS_SUCCESSFULLY: 'Cập nhật loại phòng thành công.',
    DELETE_ROOM_CLASS_SUCCESSFULLY: 'Xóa loại phòng thành công.',
    CREATE_FLOOR_SUCCESSFULLY: 'Tạo tầng thành công.',
    UPDATE_FLOOR_SUCCESSFULLY: 'Cập nhật tầng thành công.',
    DELETE_FLOOR_SUCCESSFULLY: 'Xóa tầng thành công.'
}

const getMappedMessage = (originalMessage: string) => {
    return RES_MESSAGE_MAPPING[originalMessage as keyof typeof RES_MESSAGE_MAPPING] ?? originalMessage
}

export { RES_MESSAGE_MAPPING, getMappedMessage }
