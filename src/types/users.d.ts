declare global {
    interface IUser {
        id: number
        firstName: string
        lastName: string
        role: IRole
        createdAt: string

        email?: string
        address?: string
        phoneNumber?: string
        avatar?: string

        createdById?: number
        createdBy?: Partial<IAdmin> | string
    }

    interface IGuest {
        id: number
        firstName: string
        lastName: string
        createdAt: string

        email?: string
        address?: string
        phoneNumber?: string
        avatar?: string
        isActive?: boolean

        bookingCount?: number
        totalPayment?: number
    }

    interface IAdmin {
        id: number
        firstName: string
        lastName: string
        createdAt: string

        email: string
        avatar?: string

        phoneNumber: string
        createdById?: number
        createdBy?: Partial<IAdmin> | string
        isActive?: boolean
    }

    type IRole = 'Guest' | 'Admin'
}

export {}
