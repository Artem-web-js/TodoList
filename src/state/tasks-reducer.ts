import {TasksStateType, TasksType} from "../App";
import {v1} from "uuid";
import {AddTodolistActionType} from "./todo-list-reducer";

export type RemoveTaskActionType = {
    type: "REMOVE-TASK"
    todolistID: string
    taskID: string
}
export type AddTaskActionType = {
    type: "ADD-TASK"
    title: string
    todolistID: string
}
export type ChangeTaskStatusActionType = {
    type: "CHANGE-TASK-STATUS"
    taskID: string
    isDone: boolean
    todolistID: string
}
export type ChangeTaskTitleActionType = {
    type: "CHANGE-TASK-TITLE"
    taskID: string
    title: string
    todolistID: string
}
export type RemoveTodolistActionType = {
    type: "REMOVE-TODOLIST"
    todolistID: string
}

type ActionType = RemoveTaskActionType | AddTaskActionType | ChangeTaskStatusActionType | ChangeTaskTitleActionType | AddTodolistActionType | RemoveTodolistActionType

export const tasksReducer = (state: TasksStateType, action: ActionType): TasksStateType => {
    switch (action.type) {
        case "REMOVE-TASK": {
            const stateCopy = {...state}
            const tasks = state[action.todolistID]
            stateCopy[action.todolistID] = tasks.filter(t => t.id !== action.taskID)
            return stateCopy
        }
        case "ADD-TASK": {
            const copyState = {...state}
            const newTask: TasksType = {id: v1(), title: action.title, isDone: false}
            const todoList = copyState[action.todolistID]
            copyState[action.todolistID] = [newTask, ...todoList]
            return copyState
        }
        case "CHANGE-TASK-STATUS": {
            const copyState = {...state}
            const todoList = copyState[action.todolistID]
            copyState[action.todolistID] = todoList.map(task => {
                if (task.id === action.taskID) {
                    return {...task, isDone: action.isDone}
                }
                return task
            })
            return copyState
        }
        case "CHANGE-TASK-TITLE": {
            const copyState = {...state}
            const todoList = copyState[action.todolistID]
            copyState[action.todolistID] = todoList.map(task => {
                if (task.id === action.taskID) {
                    return {...task, title: action.title}
                }
                return task
            })
            return copyState
        }
        case "ADD-TODOLIST": {
            const stateCopy = {...state}
            stateCopy[action.id] = []
            return stateCopy
        }
        case "REMOVE-TODOLIST": {
            const stateCopy = {...state}
            delete stateCopy[action.todolistID]
            return stateCopy
        }
        default:
            throw new Error("I don't understand this type")
    }
}

export const removeTaskAC = (taskID: string, todolistID: string): RemoveTaskActionType => ({type: "REMOVE-TASK", todolistID, taskID})
export const addTaskAC = (title: string, todolistID: string): AddTaskActionType => ({type: "ADD-TASK", title, todolistID})
export const changeTaskStatusAC = (taskID: string, isDone: boolean, todolistID: string): ChangeTaskStatusActionType => ({type: "CHANGE-TASK-STATUS", taskID, isDone, todolistID})
export const changeTaskTitleAC = (taskID: string, title: string, todolistID: string): ChangeTaskTitleActionType => ({type: "CHANGE-TASK-TITLE", taskID, title, todolistID})
export const addTodolistAC = (title: string): AddTodolistActionType => ({type: "ADD-TODOLIST", title, id: v1()})
export const removeTodolistAC = (todolistID: string): RemoveTodolistActionType => ({type: "REMOVE-TODOLIST", todolistID})