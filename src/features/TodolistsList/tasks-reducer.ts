import {
    ResultCodeStatuses,
    TaskPriorities,
    tasksAPI,
    TaskStatuses,
    TaskType,
    UpdateTaskModelType
} from "../../api/tasks-api";
import {Dispatch} from "redux";
import {setAppStatusAC, setAppErrorAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
// @ts-ignore
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {addTodoListAC, removeTodolistAC, setTodolistsAC, TodolistDomainType} from "./todolist-reducer";
import {TodolistType} from "../../api/todolists-api";

let initialState: TasksStateType = {}

const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        removeTaskAC(state: TasksStateType, action: RemoveTaskType) {
            const tasks = state[action.payload.todolistID]
            const index = tasks.findIndex(t => t.id === action.payload.taskID)
            tasks.splice(index, 1)
        },
        addTaskAC(state: TasksStateType, action: AddTaskType) {
            state[action.payload.task.todoListId] = [action.payload.task, ...state[action.payload.task.todoListId]]
        },
        updateTaskAC(state: TasksStateType, action: UpdateTaskType) {
            const tasks = state[action.payload.todolistID]
            const index = tasks.findIndex(t => t.id === action.payload.taskID)
            tasks[index] = {...tasks[index], ...action.payload.model}
        },
        setTasksAC(state: TasksStateType, action: SetTaskType) {
            return {...state, [action.payload.todolistId]: action.payload.tasks}
        }
    },
    extraReducers: {
        [addTodoListAC.type]: (state: Array<TodolistDomainType>, action: PayloadAction<{ todolist: TodolistType }>) => {
            return {...state, [action.payload.todolist.id]: []}
        },
        [removeTodolistAC.type]: (state: Array<TodolistDomainType>, action: PayloadAction<{ id: string }>) => {
            delete state[action.payload.id]
        },
        [setTodolistsAC.type]: (state: Array<TodolistDomainType>, action: PayloadAction<{ todolists: Array<TodolistType> }>) => {
            action.payload.todolists.forEach((tl: TodolistType) => {
                // @ts-ignore
                state[tl.id] = []
            })
        }
    }
})

export const tasksReducer = slice.reducer;

export const {removeTaskAC, addTaskAC, updateTaskAC, setTasksAC} = slice.actions

//thunks
export const fetchTasksTC = (todolistId: string) => {
    return async (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        let res = await tasksAPI.getTasks(todolistId)
        const tasks = res.data.items
        const action = setTasksAC({tasks, todolistId})
        dispatch(action)
        dispatch(setAppStatusAC({status: 'succeeded'}))
    }
}
export const removeTaskTC = (taskId: string, todolistId: string) => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    await tasksAPI.deleteTask(todolistId, taskId)
    const action = removeTaskAC({taskID: taskId, todolistID: todolistId});
    dispatch(action);
    dispatch(setAppStatusAC({status: 'succeeded'}))
}
export const addTaskTC = (title: string, todolistId: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC({status: 'loading'}))
        let res = await tasksAPI.createTask(todolistId, title)
        if (res.data.resultCode === ResultCodeStatuses.Success) {
            const task = res.data.data.item
            dispatch(addTaskAC({task}))
        } else {
            handleServerAppError(res.data, dispatch);
        }
    } catch (err) {
        handleServerNetworkError(err, dispatch)
    } finally {
        dispatch(setAppStatusAC({status: 'succeeded'}))
    }
}
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
    async (dispatch: Dispatch, getState: () => any) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        const state = getState()
        const task = state.tasks[todolistId].find((t: any) => t.id === taskId)
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
            dispatch(updateTaskAC({taskID: taskId, model: domainModel, todolistID: todolistId}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        } catch (err) {
            if (err.data?.messages?.length) {
                dispatch(setAppErrorAC({error: err.data.messages[0]}))
            } else {
                dispatch(setAppErrorAC({error: 'Some error occurred'}))
            }
        }

    }

//actions types
type RemoveTaskType = PayloadAction<{ taskID: string, todolistID: string }>
type AddTaskType = PayloadAction<{ task: TaskType }>
type UpdateTaskType = PayloadAction<{ taskID: string, model: UpdateDomainTaskModelType, todolistID: string }>
type SetTaskType = PayloadAction<{ tasks: Array<TaskType>, todolistId: string }>

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