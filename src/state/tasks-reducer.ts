import {TasksStateType} from "../App";
import {v1} from "uuid";
import {AddTodolistActionType, RemoveTodolistActionType} from "./todo-list-reducer";
import {TaskPriorities, TaskStatuses, TaskType} from "../api/tasks-api";

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
    status: TaskStatuses
    todolistID: string
}
export type ChangeTaskTitleActionType = {
    type: "CHANGE-TASK-TITLE"
    taskID: string
    title: string
    todolistID: string
}


let initialState: TasksStateType = {}

type ActionType = RemoveTaskActionType | AddTaskActionType | ChangeTaskStatusActionType | ChangeTaskTitleActionType | AddTodolistActionType | RemoveTodolistActionType

export const tasksReducer = (state= initialState, action: ActionType): TasksStateType => {
    switch (action.type) {
        case "REMOVE-TASK": {
            const stateCopy = {...state}
            const tasks = state[action.todolistID]
            stateCopy[action.todolistID] = tasks.filter(t => t.id !== action.taskID)
            return stateCopy
        }
        case "ADD-TASK": {
            const copyState = {...state}
            const newTask: TaskType = {id: v1(), title: action.title, status: TaskStatuses.New, addedDate: '', deadline: '', description: '', order: 0, priority: TaskPriorities.Later, startDate: '', todoListId: action.todolistID}
            const todoList = copyState[action.todolistID]
            copyState[action.todolistID] = [newTask, ...todoList]
            return copyState
        }
        case "CHANGE-TASK-STATUS": {
            const copyState = {...state}
            const todoList = copyState[action.todolistID]
            copyState[action.todolistID] = todoList.map(task => {
                if (task.id === action.taskID) {
                    return {...task, status: action.status}
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
            delete stateCopy[action.id]
            return stateCopy
        }
        default:
            return state
    }
}

export const removeTaskAC = (taskID: string, todolistID: string): RemoveTaskActionType => ({type: "REMOVE-TASK", todolistID, taskID})
export const addTaskAC = (title: string, todolistID: string): AddTaskActionType => ({type: "ADD-TASK", title, todolistID})
export const changeTaskStatusAC = (taskID: string, status: TaskStatuses, todolistID: string): ChangeTaskStatusActionType => ({type: "CHANGE-TASK-STATUS", taskID, status, todolistID})
export const changeTaskTitleAC = (taskID: string, title: string, todolistID: string): ChangeTaskTitleActionType => ({type: "CHANGE-TASK-TITLE", taskID, title, todolistID})

