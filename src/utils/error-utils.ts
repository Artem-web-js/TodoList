import {setAppErrorAC} from '../app/app-reducer'
import {Dispatch} from 'redux'
import {TodolistResponseType} from "../api/todolists-api";

export const handleServerAppError = <D>(data: TodolistResponseType<D>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC({error: data.messages[0]}))
    } else {
        dispatch(setAppErrorAC({error: 'Some error occurred'}))
    }
}

export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch) => {
    dispatch(setAppErrorAC(error.message ? {error: error.message} : {error: 'Some error occurred'}))
}