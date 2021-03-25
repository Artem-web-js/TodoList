import {TodolistType, todolistsAPI} from "../../api/todolists-api";
import {ThunkAction} from "redux-thunk";
import {AppRootStateType} from "../../app/store";
import {
    RequestStatusType,
    setAppErrorAC,
    SetAppErrorType,
    setAppStatusAC,
    SetAppStatusType
} from "../../app/app-reducer";
import {Dispatch} from "redux";
import {ResultCodeStatuses} from "../../api/tasks-api";

const initialState: Array<TodolistDomainType> = []

export const todolistReducer = (state = initialState, action: ActionType): Array<TodolistDomainType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return state.filter(tl => tl.id !== action.id)
        case "ADD-TODOLIST":
            return [{id: action.todolist.id, title: action.todolist.title, filter: "all", entityStatus: "idle"}, ...state]
        case "CHANGE-TODOLIST-TITLE":
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case "CHANGE-TODOLIST-FILTER":
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case "SET-TODOLISTS":
            return action.todolists.map(tl => ({...tl, filter: "all", entityStatus: "idle"}))
        case "CHANGE-TODOLIST-ENTITY-STATUS":
            return state.map(tl => tl.id === action.todolistId ? {...tl, entityStatus: action.entityStatus}: tl)
        default:
            return state
    }
}

//action creators
export const removeTodolistAC = (id: string) =>
    ({type: "REMOVE-TODOLIST", id} as const)
export const addTodoListAC = (todolist: TodolistType) =>
    ({type: "ADD-TODOLIST", todolist} as const)
export const changeTodoListTitleAC = (title: string, id: string) =>
    ({type: "CHANGE-TODOLIST-TITLE", title, id} as const)
export const changeTodoListFilterAC = (filter: FilterValuesType, id: string) =>
    ({type: "CHANGE-TODOLIST-FILTER", filter, id} as const)
export const setTodolistsAC = (todolists: Array<TodolistType>) =>
    ({type: 'SET-TODOLISTS', todolists} as const)
export const changeTodolistEntityStatusAC = (todolistId: string, entityStatus: RequestStatusType) => ({
    type: 'CHANGE-TODOLIST-ENTITY-STATUS', todolistId, entityStatus} as const)

//thunks
export const fetchTodolistsThunk = (): ThunkType => {
    return async (dispatch: Dispatch<ActionType>) => {
        dispatch(setAppStatusAC("loading"))
        let res = await todolistsAPI.getTodolists()
        dispatch(setTodolistsAC(res.data))
        dispatch(setAppStatusAC('succeeded'))
    }
}

export const addTodolistTC = (title: string): ThunkType => {
    return async (dispatch: Dispatch<ActionType>) => {
        try {
            dispatch(setAppStatusAC('loading'))
            let res = await todolistsAPI.createTodolis(title)
            if (res.data.resultCode === ResultCodeStatuses.Success) {
                dispatch(addTodoListAC(res.data.data.item));
                dispatch(setAppStatusAC('succeeded'))
            }
        } catch (err) {
            if (err.data.messages.length) {
                dispatch(setAppErrorAC(err.data.messages[0]))
            } else {
                dispatch(setAppErrorAC('Some error occurred'))
            }
        } finally {
            dispatch(setAppStatusAC('failed'))

        }
    }
}

export const removeTodolistTC = (todolistID: string): ThunkType => {
    return async (dispatch: Dispatch<ActionType>) => {
        dispatch(setAppStatusAC('loading'))
        dispatch(changeTodolistEntityStatusAC(todolistID, 'loading'))
        await todolistsAPI.deleteTodolist(todolistID)
        dispatch(removeTodolistAC(todolistID));
        dispatch(setAppStatusAC('succeeded'))
    }
}

export const changeTodolistTitleTC = (id: string, title: string): ThunkType => {
    return async (dispatch: Dispatch<ActionType>) => {
        dispatch(setAppStatusAC('loading'))
        await todolistsAPI.updateTodolistTitle(id, title)
        const action = changeTodoListTitleAC(id, title);
        dispatch(action);
        dispatch(setAppStatusAC('succeeded'))
    }
}

//types
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

type ActionType = ReturnType<typeof changeTodoListFilterAC>
    | ReturnType<typeof changeTodoListTitleAC>
    | ReturnType<typeof changeTodolistEntityStatusAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | SetAppStatusType
    | SetAppErrorType

export type AddTodolistActionType = ReturnType<typeof addTodoListAC>
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>

//thunks Type
type ThunkType = ThunkAction<void, AppRootStateType, unknown, ActionType>