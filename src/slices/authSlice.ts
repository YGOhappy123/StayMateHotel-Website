import { createSlice } from '@reduxjs/toolkit'
import cookies from '@/libs/cookies'

export interface AuthState {
    isLogged: boolean
    user: IUser | null
}

const initialState: Partial<AuthState> = {
    isLogged: false,
    user: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, { payload }: { payload: IUser }) => {
            state.user = payload
        },
        setLogged: (state, { payload }: { payload: boolean }) => {
            state.isLogged = payload
        },
        signOut: () => {
            cookies.remove('access_token', { path: '/' })
            cookies.remove('refresh_token', { path: '/' })
            return initialState
        }
    }
})

export const { setUser, setLogged, signOut } = authSlice.actions
export default authSlice.reducer
