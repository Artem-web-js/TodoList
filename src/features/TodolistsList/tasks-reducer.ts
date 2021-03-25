import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType} from "./todolist-reducer";
import {
    ResultCodeStatuses,
    TaskPriorities,
    tasksAPI,
    TaskStatuses,
    TaskType,
    UpdateTaskModelType
} from "../../api/tasks-api";
import {ThunkAction} from "redux-thunk";
import {AppRootStateType} from "../../app/store";
import {Dispatch} from "redux";
import {setAppStatusAC, SetAppStatusType, setAppErrorAC, SetAppErrorType} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

let initialState: TasksStateType = {}

export const tasksReducer = (state = initialState, action: ActionType): TasksStateType => {
    switch (action.type) {
        case "REMOVE-TASK":
            return {
                ...state,
                [action.todolistID]: state[action.todolistID].filter(t => t.id !== action.taskID)
            }
        case 'ADD-TASK': {
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        }
        case "UPDATE-TASK":
            return {
                ...state, [action.todolistID]: state[action.todolistID].map(task =>
                    task.id === action.taskID ? {...task, ...action.model} : task)
            }
        case "ADD-TODOLIST": {
            return {...state, [action.todolist.id]: []}
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
        case "SET-TASKS":
            return {...state, [action.todolistId]: action.tasks}
        default:
            return state
    }
}

//action creators
export const removeTaskAC = (taskID: string, todolistID: string) =>
    ({type: "REMOVE-TASK", todolistID, taskID} as const)
export const addTaskAC = (task: TaskType) =>
    ({type: "ADD-TASK", task} as const)
export const updateTaskAC = (taskID: string, model: UpdateDomainTaskModelType, todolistID: string) =>
    ({type: "UPDATE-TASK", taskID, model, todolistID} as const)
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
    ({type: 'SET-TASKS', tasks, todolistId} as const)

//thunks
export const fetchTasksTC = (todolistId: string): ThunkType => {
    return async (dispatch: Dispatch<ActionType>) => {
        dispatch(setAppStatusAC('loading'))
        let res = await tasksAPI.getTasks(todolistId)
        const tasks = res.data.items
        const action = setTasksAC(tasks, todolistId)
        dispatch(action)
        dispatch(setAppStatusAC('succeeded'))
    }
}
export const removeTaskTC = (taskId: string, todolistId: string): ThunkType => async (dispatch: Dispatch<ActionType>) => {
    dispatch(setAppStatusAC('loading'))
    await tasksAPI.deleteTask(todolistId, taskId)
    const action = removeTaskAC(taskId, todolistId);
    dispatch(action);
    dispatch(setAppStatusAC('succeeded'))
}
export const addTaskTC = (title: string, todolistId: string): ThunkType => async (dispatch: Dispatch<ActionType>) => {
    try {
        dispatch(setAppStatusAC('loading'))
        let res = await tasksAPI.createTask(todolistId, title)
        if (res.data.resultCode === ResultCodeStatuses.Success) {
            const task = res.data.data.item
            dispatch(addTaskAC(task))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (err) {
        handleServerNetworkError(err, dispatch)
    }
}
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string): ThunkType =>
    async (dispatch: Dispatch<ActionType>, getState: () => AppRootStateType) => {
        dispatch(setAppStatusAC('loading'))
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
        try {
            await tasksAPI.updateTask(todolistId, taskId, apiModel)
            dispatch(updateTaskAC(taskId, domainModel, todolistId))
            dispatch(setAppStatusAC('succeeded'))
        } catch (err) {
            if (err.data.messages.length) {
                dispatch(setAppErrorAC(err.data.messages[0]))
            } else {
                dispatch(setAppErrorAC('Some error occurred'))
            }
        }

    }

// types
export type TasksStateType = {
    [key: string]: Array<TaskType>
}
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

type ActionType = ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof setTasksAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | SetAppStatusType
    | SetAppErrorType

//thunks Type
type ThunkType = ThunkAction<void, AppRootStateType, unknown, ActionType>