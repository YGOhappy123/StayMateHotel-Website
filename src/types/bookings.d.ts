declare global {
    interface IBooking {
        id: number
        checkInTime: string
        checkOutTime: string
        email: string
        phoneNumber: string
        status: BookingStatus
        totalAmount: number
        createdAt: string

        guestId?: number
        guest?: Partial<IGuest>

        payments: Partial<IPayment>[]
        bookingRooms: Partial<IBookingRoom>[]
        bookingServices: Partial<IBookingService>[]
    }

    interface IBookingRoom {
        numberOfGuests: number
        unitPrice: number
        roomNumber?: string
        floor?: string
        roomClass?: string

        bookingId?: number
        booking?: Partial<IBooking>
        roomId?: number
        room?: Partial<IRoom>
    }

    interface IBookingService {
        id: number
        quantity: number
        unitPrice: number
        status: BookingServiceStatus
        createdAt: string
        name?: string

        bookingId?: number
        booking?: Partial<IBooking>
        serviceId?: number
        service?: Partial<IService>
    }

    interface IPayment {
        id: number
        amount: number
        paymentTime: string
        method: PaymentMethod
        bookingId?: number
        booking?: Partial<IBooking>
    }

    type BookingStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'CheckedIn' | 'CheckedOut' | 'PaymentDone'

    type BookingServiceStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Done'

    type PaymentMethod = 'Cash' | 'CreditCard' | 'Transfer'
}

export {}
