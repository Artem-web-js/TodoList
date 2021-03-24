import {v1} from "uuid";
import {TodolistType, todolistsAPI} from "../../api/todolists-api";
import {ThunkAction} from "redux-thunk";
import {AppRootStateType} from "../../app/store";
import {setAppErrorAC, SetAppErrorType, setAppStatusAC, SetAppStatusType} from "../../app/app-reducer";
import {Dispatch} from "redux";

const initialState: Array<TodolistDomainType> = []

export const todolistReducer = (state = initialState, action: ActionType): Array<TodolistDomainType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return state.filter(tl => tl.id !== action.id)
        case "ADD-TODOLIST":
            return [{id: action.id, title: action.title, filter: "all"}, ...state]
        case "CHANGE-TODOLIST-TITLE":
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case "CHANGE-TODOLIST-FILTER":
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case "SET-TODOLISTS":
            return action.todolists.map(tl => ({...tl, filter: "all"}))
        default:
            return state
    }
}

//action creators
export const removeTodolistAC = (id: string) =>
    ({type: "REMOVE-TODOLIST", id} as const)
export const addTodoListAC = (title: string) =>
    ({type: "ADD-TODOLIST", title, id: v1()} as const)
export const changeTodoListTitleAC = (title: string, id: string) =>
    ({type: "CHANGE-TODOLIST-TITLE", title, id} as const)
export const changeTodoListFilterAC = (filter: FilterValuesType, id: string) =>
    ({type: "CHANGE-TODOLIST-FILTER", filter, id} as const)
export const setTodolistsAC = (todolists: Array<TodolistType>) =>
    ({type: 'SET-TODOLISTS', todolists} as const)

//thunks
export const fetchTodolistsThunk = (): ThunkType => {
    return (dispatch: Dispatch<ActionType>) => {
        dispatch(setAppStatusAC("loading"))
        todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(setTodolistsAC(res.data))
                dispatch(setAppStatusAC('succeeded'))
            })
    }
}

export const addTodolistTC = (title: string): ThunkType => {
    return (dispatch: Dispatch<ActionType>) => {
        dispatch(setAppStatusAC('loading'))
        todolistsAPI.createTodolis(title)
            .then((res) => {
                if(res.data.resultCode === 0) {
                    const action = addTodoListAC(title);
                    dispatch(action);
                    dispatch(setAppStatusAC('succeeded'))
                } else {
                    if(res.data.messages.length) {
                        dispatch(setAppErrorAC(res.data.messages[0]))
                    } else {
                        dispatch(setAppErrorAC('Some error occurred'))
                    }
                    dispatch(setAppStatusAC('failed'))
                }

            })
    }
}

export const removeTodolistTC = (todolistID: string): ThunkType => {
    return (dispatch: Dispatch<ActionType>) => {
        dispatch(setAppStatusAC('loading'))
        todolistsAPI.deleteTodolist(todolistID)
            .then(() => {
                const action = removeTodolistAC(todolistID);
                dispatch(action);
                dispatch(setAppStatusAC('succeeded'))
            })
    }
}

export const changeTodolistTitleTC = (id: string, title: string): ThunkType => {
    return (dispatch: Dispatch<ActionType>) => {
        dispatch(setAppStatusAC('loading'))
        todolistsAPI.updateTodolistTitle(id, title)
            .then(() => {
                const action = changeTodoListTitleAC(id, title);
                dispatch(action);
                dispatch(setAppStatusAC('succeeded'))
            })
    }
}

//types
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & { filter: FilterValuesType }

type ActionType = ReturnType<typeof changeTodoListFilterAC>
    | ReturnType<typeof changeTodoListTitleAC>
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