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

        createdById?: number | string | null
        createdBy?: IAdmin | null
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
    }

    interface IAdmin {
        id: number
        firstName: string
        lastName: string
        createdAt: string

        email: string
        avatar?: string
        phoneNumber: string
        createdBy?: IAdmin | null
        createdById?: number | string | null
        isActive?: boolean
    }

    type IRole = 'Guest' | 'Admin'
}

export {}
