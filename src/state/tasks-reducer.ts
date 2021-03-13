import {TasksStateType} from "../App";
import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType} from "./todolist-reducer";
import {TaskPriorities, tasksAPI, TaskStatuses, TaskType, UpdateTaskModelType} from "../api/tasks-api";
import {ThunkAction} from "redux-thunk";
import {AppRootStateType} from "./store";

export type RemoveTaskActionType = {
    type: "REMOVE-TASK"
    todolistID: string
    taskID: string
}
export type AddTaskActionType = {
    type: "ADD-TASK"
    task: TaskType
}
export type UpdateTaskActionType = {
    type: "UPDATE-TASK"
    taskID: string
    todolistID: string
    model: UpdateDomainTaskModelType
}
export type ChangeTaskTitleActionType = {
    type: "CHANGE-TASK-TITLE"
    taskID: string
    title: string
    todolistID: string
}
export type SetTasksActionType = {
    type: 'SET-TASKS'
    tasks: Array<TaskType>
    todolistId: string
}

let initialState: TasksStateType = {}

type ActionType = RemoveTaskActionType
    | AddTaskActionType
    | UpdateTaskActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | SetTasksActionType

export const tasksReducer = (state = initialState, action: ActionType): TasksStateType => {
    switch (action.type) {
        case "REMOVE-TASK": {
            const stateCopy = {...state}
            const tasks = state[action.todolistID]
            stateCopy[action.todolistID] = tasks.filter(t => t.id !== action.taskID)
            return stateCopy
        }
        case 'ADD-TASK': {
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        }

        case "UPDATE-TASK": {
            const copyState = {...state}
            const todoList = copyState[action.todolistID]
            copyState[action.todolistID] = todoList.map(task => {
                if (task.id === action.taskID) {
                    return {...task, ...action.model}
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
        case 'SET-TODOLISTS': {
            const stateCopy = {...state}
            action.todolists.forEach((tl) => {
                stateCopy[tl.id] = []
            })
            return stateCopy;
        }
        case "SET-TASKS": {
            const stateCopy = {...state}
            stateCopy[action.todolistId] = action.tasks
            return stateCopy
        }
        default:
            return state
    }
}

export const removeTaskAC = (taskID: string, todolistID: string): RemoveTaskActionType => ({
    type: "REMOVE-TASK",
    todolistID,
    taskID
})
export const addTaskAC = (task: TaskType): AddTaskActionType => ({
    type: "ADD-TASK",
    task
})
export const updateTaskAC = (taskID: string, model: UpdateDomainTaskModelType, todolistID: string): UpdateTaskActionType => ({
    type: "UPDATE-TASK",
    taskID,
    model,
    todolistID
})
export const changeTaskTitleAC = (taskID: string, title: string, todolistID: string): ChangeTaskTitleActionType => ({
    type: "CHANGE-TASK-TITLE",
    taskID,
    title,
    todolistID
})
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string): SetTasksActionType => {
    return {type: 'SET-TASKS', tasks, todolistId}
}

//thunks Type
type ThunkType = ThunkAction<void, AppRootStateType, unknown, ActionType>

//thunk
export const fetchTasksTC = (todolistId: string): ThunkType => {
    return (dispatch) => {
        tasksAPI.getTasks(todolistId)
            .then((res) => {
                const tasks = res.data.items
                const action = setTasksAC(tasks, todolistId)
                dispatch(action)
            })
    }
}

export const removeTaskTC = (taskId: string, todolistId: string): ThunkType => (dispatch) => {
    tasksAPI.deleteTask(todolistId, taskId)
        .then(() => {
            const action = removeTaskAC(taskId, todolistId);
            dispatch(action);
        })
}

export const addTaskTC = (title: string, todolistId: string): ThunkType => (dispatch) => {
    tasksAPI.createTask(todolistId, title)
        .then((res) => {
            const action = addTaskAC(res.data.data.item)
            dispatch(action)
        })
}

export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string): ThunkType =>
    (dispatch, getState: () => AppRootStateType) => {
        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)
        if (!task) {
            console.warn('task not found in the state')
            return
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...domainModel
        }

        tasksAPI.updateTask(todolistId, taskId, apiModel)
            .then(() => {
                dispatch(updateTaskAC(taskId, domainModel, todolistId))
            })
    }

// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

