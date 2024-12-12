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

    interface IRoomClassFeature {
        featureId: number
        roomClassId?: number
        quantity: number

        name?: string
        feature?: Partial<IFeature>
    }

    type RoomStatus = 'Available' | 'Reserved' | 'Occupied' | 'UnderCleaning' | 'OutOfService'
}

export {}
