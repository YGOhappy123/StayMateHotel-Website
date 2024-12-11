declare global {
    interface IFloor {
        id: number
        floorNumber: string
        createdAt: string

        createdById?: number
        createdBy?: Partial<IAdmin>
        rooms?: Partial<IRoom>[]
    }

    interface IRoom {
        id: number
        roomNumber: string
        status: RoomStatus
        createdAt: string
        floorId: number
        roomClassId: number

        floor?: Partial<IFloor>
        createdBy?: Partial<IAdmin>
    }
}

export {}
