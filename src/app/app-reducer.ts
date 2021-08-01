import {Dispatch} from "redux";
import {authAPI} from "../api/todolists-api";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
// @ts-ignore
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type RequestStatusType = PayloadAction<{status: 'idle' | 'loading' | 'succeeded' | 'failed'}>
export type ErrorType = null | string

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as ErrorType,
    isInitialized: false
}

type IStateType = typeof initialState

const slice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        setAppStatusAC(state: IStateType, action: RequestStatusType) {
            state.status = action.payload.status
        },
        setAppErrorAC(state: IStateType, action: PayloadAction<{error: null | string}>) {
            state.error = action.payload.error
        },
        setIsInitializedAC(state: IStateType, action: PayloadAction<{isInitialized: boolean}>) {
            state.isInitialized = action.payload.isInitialized
        }
    }
})

export const appReducer = slice.reducer;
export const { setIsInitializedAC, setAppStatusAC, setAppErrorAC } = slice.actions

export const initializeAppTC = () => async (dispatch: Dispatch) => {
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: true}));
        }
    } finally {
        dispatch(setIsInitializedAC({isInitialized: true}))
    }
}

