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
        features?: Partial<IFeature>[]
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
        rooms?: Partial<IRoom>[]
    }

    interface IFeature {
        id: number
        name: string
        createdAt: string

        createdById?: number
        createdBy?: Partial<IAdmin>
    }

    type RoomStatus = 'Available' | 'Reserved' | 'Occupied' | 'UnderCleaning' | 'OutOfService'
}

export {}
