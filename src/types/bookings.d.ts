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

        bookingId?: number
        booking?: Partial<IBooking>
        roomId?: number
        room?: Partial<IRoom>
    }

    interface IBookingService {}

    interface IPayment {
        id: number
        amount: number
        paymentTime: string
        method: PaymentMethod
        bookingId?: number
        booking?: Partial<IBooking>
    }

    type BookingStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'CheckedIn' | 'CheckedOut' | 'PaymentDone'

    type PaymentMethod = 'Cash' | 'CreditCard' | 'Transfer'
}

export {}
