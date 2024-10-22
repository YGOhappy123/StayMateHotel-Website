declare global {
    interface IUser {
        userId: number
        role: IRole
    }

    type IRole = 'Customer' | 'Staff' | 'Admin'
}

export {}
