import {FiltersValuesType, TodoListType} from "../App";
import {v1} from "uuid";

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
    filter: FiltersValuesType
    id: string
}

type ActionType = ChangeTodolistFilterActionType | ChangeTodolistTitleActionType |
    AddTodolistActionType | RemoveTodolistActionType

export const todoListReducer = (state: Array<TodoListType>, action: ActionType): Array<TodoListType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return state.filter(tl => tl.id !== action.id)
        case "ADD-TODOLIST":
            const newTodoList: TodoListType = {
                id: action.id,
                title: action.title,
                filter: "all"
            }
            return [...state, newTodoList]
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
        default:
            throw new Error("I don't understand this type")
    }
}

export const removeTodoListAC = (todolistID: string): RemoveTodolistActionType => ({type: "REMOVE-TODOLIST", id: todolistID})
export const addTodoListAC = (title: string): AddTodolistActionType => ({type: "ADD-TODOLIST", title, id: v1()})
export const changeTodoListTitleAC = (title: string, id: string): ChangeTodolistTitleActionType => ({type: "CHANGE-TODOLIST-TITLE", title: title, id: id})

export const changeTodoListFilterAC = (id: string, filter: FiltersValuesType): ChangeTodolistFilterActionType => ({type: "CHANGE-TODOLIST-FILTER", id: id, filter: filter})