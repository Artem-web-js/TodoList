import {setAppErrorAC, SetAppErrorType, setAppStatusAC, SetAppStatusType} from '../app/app-reducer'
import {Dispatch} from 'redux'
import {TodolistResponseType} from "../api/todolists-api";

export const handleServerAppError = <D>(data: TodolistResponseType<D>, dispatch: Dispatch<SetAppErrorType | SetAppStatusType>) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC('Some error occurred'))
    }
    dispatch(setAppStatusAC('failed'))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch<SetAppErrorType | SetAppStatusType>) => {
    dispatch(setAppErrorAC(error.message ? error.message : 'Some error occurred'))
    dispatch(setAppStatusAC('failed'))
}