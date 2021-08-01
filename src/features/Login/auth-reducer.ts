import { Dispatch } from 'redux'
import { setAppStatusAC } from '../../app/app-reducer'
import {ResultCodeStatuses} from "../../api/tasks-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {ThunkAction} from "redux-thunk";
import {AppRootStateType} from "../../app/store";
import {authAPI, LoginParamsType} from "../../api/todolists-api";
// @ts-ignore
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false
}
type IStateType = typeof initialState

const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setIsLoggedInAC(state: IStateType, action: PayloadAction<{value: boolean}>) {
            state.isLoggedIn = action.payload.value
        }
    }
})

export const authReducer = slice.reducer;
export const { setIsLoggedInAC } = slice.actions

// thunks
export const loginTC = (data: LoginParamsType): ThunkType => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC('loading'))
        let res = await authAPI.login(data)
        if(res.data.resultCode === ResultCodeStatuses.Success) {
            dispatch(setIsLoggedInAC({value: true}))
            dispatch(setAppStatusAC('succeeded'))
        }
    } catch (error) {
        handleServerNetworkError(error, dispatch)
    }
}

export const logoutTC = (): ThunkType => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: false}))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}

//thunks Type
type ThunkType = ThunkAction<void, AppRootStateType, unknown, any>