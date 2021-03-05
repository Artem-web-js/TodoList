import axios from "axios";

const settings = {
    withCredentials: true,
    headers: {
        "API-KEY": "9e4686de-4379-4e75-89bc-e99abdd3cdc3"
    }
}

/*type TodolistResponseType<T = {}> = {
    resultCode: number
    messages: Array<string>
    data: {
        item: T
    }
}

export type TodolistType = {
    id: string
    title: string
    addedData: string
    order: number
}*/

export const tasksAPI = {
    getTasks(todolistId: string) {
        return axios.get(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistId}/tasks`, settings)
    },
    createTask(todolistId: string, title: string) {
        return axios.post(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistId}/tasks`, {title: title}, settings)
    },
    deleteTask(todolistId: string, taskId: string) {
        return axios.delete(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistId}/tasks/${taskId}`, settings)
    },
    updateTaskTitle(todolistId: string, taskId: string, title: string) {
        return axios.put(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistId}/tasks/${taskId}`, {title: title}, settings)
    }
}