declare global {
    interface IRoom {
        id: number
        roomNumber: string
        status: RoomStatus
        createdAt: string
        floorId: number
        roomClassId: number

        floor?: Partial<IFloor>
        roomClass?: Partial<IRoomClass>
        features?: Partial<IRoomClassFeature>[]
        createdBy?: Partial<IAdmin>
        images?: string[]

        statisticThisYear?: number
        statisticThisMonth?: number
        bookingCount?: number
    }

    interface IFloor {
        id: number
        floorNumber: string
        createdAt: string

        createdById?: number
        createdBy?: Partial<IAdmin>
        rooms?: Partial<IRoom>[]
    }

    interface IRoomClass {
        id: number
        className: string
        basePrice: number
        capacity: number
        createdAt: string

        createdById?: number
        createdBy?: Partial<IAdmin>
        features?: Partial<IRoomClassFeature>[]
        rooms?: Partial<IRoom>[]
    }

    interface IFeature {
        id: number
        name: string
        createdAt: string
        createdById?: number
        createdBy?: Partial<IAdmin>
    }

    interface IService {
        id: number // Service ID
        name: string // Name of the service
        price: number // Price in decimal format
        isAvailable: boolean // Availability status
        createdAt: string // ISO date string for CreatedAt
        createdById?: number // ID of the admin who created the service
        createdBy?: Partial<IAdmin>
        bookingServices: {
            id: number // BookingService ID
            serviceId: number // ID of related service
            bookingId: number // ID of the related booking
        }[] // List of related bookings
    }

    interface IRoomClassFeature {
        featureId: number
        roomClassId?: number
        quantity: number

        name?: string
        feature?: Partial<IFeature>
    }

    type RoomStatus = 'Available' | 'Occupied' | 'UnderCleaning' | 'OutOfService'
}

export {}
