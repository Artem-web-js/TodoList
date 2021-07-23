import {Dispatch} from "redux";
import {authAPI} from "../api/todolists-api";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {ThunkAction} from "redux-thunk";
import {AppRootStateType} from "./store";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type ErrorType = null | string

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as ErrorType,
    isInitialized: false
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case "APP/IS-INITIALIZED":
            return {...state, isInitialized: action.isInitialized}
        default:
            return state
    }
}

export const setAppStatusAC = (status: RequestStatusType) => ({type: "APP/SET-STATUS", status} as const)
export const setAppErrorAC = (error: ErrorType) => ({type: "APP/SET-ERROR", error} as const)
export const setIsInitializedAC = (isInitialized: boolean) => ({type: "APP/IS-INITIALIZED", isInitialized} as const)

export const initializeAppTC = (): ThunkType => async (dispatch: Dispatch) => {
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true));
        }
    } finally {
        dispatch(setIsInitializedAC(true))
    }

}

export type SetAppStatusType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorType = ReturnType<typeof setAppErrorAC>
export type SetIsInitializedType = ReturnType<typeof setIsInitializedAC>

type ActionsType = SetAppStatusType | SetAppErrorType | SetIsInitializedType

//thunks Type
type ThunkType = ThunkAction<void, AppRootStateType, unknown, ActionsType>

