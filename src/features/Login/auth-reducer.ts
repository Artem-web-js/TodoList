import {Dispatch} from 'redux'
import {SetAppErrorType, setAppStatusAC, SetAppStatusType, setIsInitializedAC} from '../../app/app-reducer'
import {ResultCodeStatuses} from "../../api/tasks-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {authAPI, LoginParamsType} from "../../api/auth-api";

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
export const loginTC = (data: LoginParamsType) => async (dispatch: Dispatch<ActionsType>) => {
    try {
        dispatch(setAppStatusAC('loading'))
        let res = await authAPI.login(data.email, data.password, data.rememberMe)
        if (res.data.resultCode === ResultCodeStatuses.Success) {
            dispatch(setIsLoggedInAC(true))
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (err) {
        handleServerNetworkError(err, dispatch)
    } finally {
        dispatch(setAppStatusAC('succeeded'))
    }
}

export const initializeAppTC = () => async (dispatch: Dispatch) => {
    let res = await authAPI.me()
    if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(true));
        dispatch(setIsInitializedAC(true))
    }
}

export const logoutTC = () => async (dispatch: Dispatch<ActionsType>) => {
    try {
        dispatch(setAppStatusAC('loading'))
        let res = await authAPI.logout()
        if (res.data.resultCode === ResultCodeStatuses.Success) {
            dispatch(setIsLoggedInAC(false))
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (err) {
        handleServerNetworkError(err, dispatch)
    } finally {
        dispatch(setAppStatusAC('succeeded'))
    }
}

// types
type ActionsType = ReturnType<typeof setIsLoggedInAC> | SetAppStatusType | SetAppErrorType