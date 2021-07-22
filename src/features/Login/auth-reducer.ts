import { Dispatch } from 'redux'
import { SetAppErrorType, setAppStatusAC, SetAppStatusType } from '../../app/app-reducer'
import {ResultCodeStatuses} from "../../api/tasks-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {ThunkAction} from "redux-thunk";
import {AppRootStateType} from "../../app/store";
import {authAPI, LoginParamsType} from "../../api/todolists-api";

const initialState = {
    isLoggedIn: false
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}
// actions
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)

// thunks
export const loginTC = (data: LoginParamsType): ThunkType => async (dispatch: Dispatch<ActionsType>) => {
    try {
        dispatch(setAppStatusAC('loading'))
        let res = await authAPI.login(data)
        if(res.data.resultCode === ResultCodeStatuses.Success) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setAppStatusAC('succeeded'))
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
    }
}

export const logoutTC = (): ThunkType => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(false))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}


// types
type ActionsType = ReturnType<typeof setIsLoggedInAC> | SetAppStatusType | SetAppErrorType

//thunks Type
type ThunkType = ThunkAction<void, AppRootStateType, unknown, ActionsType>