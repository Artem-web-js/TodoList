import {TodolistType, todolistsAPI} from "../../api/todolists-api";
import {
    RequestStatusType,
    setAppStatusAC,
} from "../../app/app-reducer";
import {Dispatch} from "redux";
import {ResultCodeStatuses} from "../../api/tasks-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
// @ts-ignore
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
    name: 'todolists',
    initialState: initialState,
    reducers: {
        removeTodolistAC(state: Array<TodolistDomainType>, action: PayloadAction<{ id: string }>) {
            return state.filter(tl => tl.id !== action.payload.id)
        },
        addTodoListAC(state: Array<TodolistDomainType>, action: PayloadAction<{ todolist: TodolistType }>) {
            state.unshift({
                ...action.payload.todolist,
                filter: "all",
                entityStatus: "idle"
            })
        },
        changeTodoListTitleAC(state: Array<TodolistDomainType>, action: PayloadAction<{ title: string, id: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].title = action.payload.title
        },
        changeTodoListFilterAC(state: Array<TodolistDomainType>, action: PayloadAction<{ filter: FilterValuesType, id: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        setTodolistsAC(state: Array<TodolistDomainType>, action: PayloadAction<{ todolists: Array<TodolistType> }>) {
            return action.payload.todolists.map((tl: TodolistDomainType) => ({
                ...tl,
                filter: "all",
                entityStatus: "idle"
            }))
        },
        changeTodolistEntityStatusAC(state: Array<TodolistDomainType>, action: PayloadAction<{ todolistId: string, entityStatus: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].entityStatus = action.payload.entityStatus
        }
    }
})

export const todolistReducer = slice.reducer;

//action creators
export const {
    changeTodoListTitleAC,
    changeTodoListFilterAC,
    addTodoListAC,
    changeTodolistEntityStatusAC,
    removeTodolistAC,
    setTodolistsAC
} = slice.actions;

//thunks
export const fetchTodolistsThunk = () => {
    return async (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: "loading"}))
        let res = await todolistsAPI.getTodolists()
        dispatch(setTodolistsAC({todolists: res.data}))
        dispatch(setAppStatusAC({status: 'succeeded'}))
    }
}

export const addTodolistTC = (title: string) => {
    return async (dispatch: Dispatch) => {
        try {
            dispatch(setAppStatusAC({status: 'loading'}))
            let res = await todolistsAPI.createTodolis(title)
            if (res.data.resultCode === ResultCodeStatuses.Success) {
                dispatch(addTodoListAC({todolist: res.data.data.item}));
            } else {
                handleServerAppError(res.data, dispatch);
            }
        } catch (err) {
            handleServerNetworkError(err, dispatch)
        } finally {
            dispatch(setAppStatusAC({status: 'succeeded'}))
        }
    }
}

export const removeTodolistTC = (todolistID: string) => {
    return async (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        dispatch(changeTodolistEntityStatusAC({todolistId: todolistID, entityStatus: 'loading'}))
        await todolistsAPI.deleteTodolist(todolistID)
        dispatch(removeTodolistAC({id: todolistID}));
        dispatch(setAppStatusAC({status: 'succeeded'}))
    }
}

export const changeTodolistTitleTC = (id: string, title: string) => {
    return async (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        await todolistsAPI.updateTodolistTitle(id, title)
        const action = changeTodoListTitleAC({title, id});
        dispatch(action);
        dispatch(setAppStatusAC({status: 'succeeded'}))
    }
}

//types
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}