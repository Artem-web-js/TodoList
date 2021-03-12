import {v1} from "uuid";
import {TodolistType, todolistsAPI} from "../api/todolists-api";
import {ThunkAction} from "redux-thunk";
import {AppRootStateType} from "./store";

export type RemoveTodolistActionType = {
    type: "REMOVE-TODOLIST",
    id: string
}
export type AddTodolistActionType = {
    id: string
    type: "ADD-TODOLIST",
    title: string
}
export type ChangeTodolistTitleActionType = {
    type: "CHANGE-TODOLIST-TITLE",
    title: string
    id: string
}
export type ChangeTodolistFilterActionType = {
    type: "CHANGE-TODOLIST-FILTER",
    filter: FilterValuesType
    id: string
}
export type SetTodolistsActionType = {
    type: 'SET-TODOLISTS'
    todolists: Array<TodolistType>
}

const initialState: Array<TodolistDomainType> = []

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}

type ActionType = ChangeTodolistFilterActionType
    | ChangeTodolistTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType

export const todolistReducer = (state = initialState, action: ActionType): Array<TodolistDomainType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return state.filter(tl => tl.id !== action.id)
        case "ADD-TODOLIST":
            return [{
                id: action.id,
                title: action.title,
                filter: "all"
            }, ...state]
        case "CHANGE-TODOLIST-TITLE": {
            const todoList = state.find(tl => tl.id === action.id)
            if (todoList) {
                todoList.title = action.title
                return [...state]
            }
            return state
        }
        case "CHANGE-TODOLIST-FILTER": {
            const todoList = state.find(tl => tl.id === action.id)
            if (todoList) {
                todoList.filter = action.filter
                return [...state]
            }
            return state
        }
        case "SET-TODOLISTS": {
            return action.todolists.map(tl => ({
                ...tl,
                filter: "all"
            }))
        }
        default:
            return state
    }
}

export const removeTodolistAC = (todolistID: string): RemoveTodolistActionType => ({
    type: "REMOVE-TODOLIST",
    id: todolistID
})
export const addTodoListAC = (title: string): AddTodolistActionType => ({type: "ADD-TODOLIST", title, id: v1()})
export const changeTodoListTitleAC = (title: string, id: string): ChangeTodolistTitleActionType => ({
    type: "CHANGE-TODOLIST-TITLE",
    title: title,
    id: id
})

export const changeTodoListFilterAC = (filter: FilterValuesType, id: string): ChangeTodolistFilterActionType => ({
    type: "CHANGE-TODOLIST-FILTER",
    filter: filter,
    id: id
})

export const setTodolistsAC = (todolists: Array<TodolistType>): SetTodolistsActionType => {
    return {type: 'SET-TODOLISTS', todolists}
}

//thunks Type
type ThunkType = ThunkAction<void, AppRootStateType, unknown, ActionType>

//thunks
export const fetchTodolistsThunk = (): ThunkType => {
    return (dispatch) => {
        todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(setTodolistsAC(res.data))
            })
    }
}

export const addTodolistTC = (title: string): ThunkType => {
    return (dispatch) => {
        todolistsAPI.createTodolis(title)
            .then(() => {
                const action = addTodoListAC(title);
                dispatch(action);
            })
    }
}

export const removeTodolistTC = (todolistID: string): ThunkType => {
    return (dispatch) => {
        todolistsAPI.deleteTodolist(todolistID)
            .then(() => {
                const action = removeTodolistAC(todolistID);
                dispatch(action);
            })
    }
}

export const changeTodolistTitleTC = (id: string, title: string): ThunkType => {
    return (dispatch) => {
        todolistsAPI.updateTodolistTitle(id, title)
            .then(() => {
                const action = changeTodoListTitleAC(id, title);
                dispatch(action);
            })
    }
}