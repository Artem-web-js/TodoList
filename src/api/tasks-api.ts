import axios from "axios";

const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/",
    withCredentials: true,
    headers: {
        "API-KEY": "9e4686de-4379-4e75-89bc-e99abdd3cdc3"
    }
})

type TasksResponseType = {
    items: TaskType[]
    totalCount: number
    error: null | string
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}

export type TaskType = {
    id: string
    title: string
    description: null | string
    todoListId: string
    order: number
    status: TaskStatuses
    priority: TaskPriorities
    startDate: null | string
    deadline: null | string
    addedDate: string
}

/*export type UpdateTaskType = {
    title: string
    description: null | string
    status: number
    priority: number
    startDate: null | string
    deadline: null | string
}*/

export const tasksAPI = {
    getTasks(todolistId: string) {
        return instance.get<TasksResponseType>(`todo-lists/${todolistId}/tasks`)
    },
    createTask(todolistId: string, title: string) {
        return instance.post<TaskType>(`todo-lists/${todolistId}/tasks`, {title: title})
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<TaskType>(`todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTaskTitle(todolistId: string, taskId: string, title: string) {
        return instance.put<TaskType>(`todo-lists/${todolistId}/tasks/${taskId}`, {title: title})
    }
}