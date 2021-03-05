import axios from "axios";

const settings = {
    withCredentials: true,
    headers: {
        "API-KEY": "9e4686de-4379-4e75-89bc-e99abdd3cdc3"
    }
}

type TodolistResponseType<T = {}> = {
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
}

export const todolistsAPI = {
    getTodolists() {
        return axios.get<Array<TodolistType>>("https://social-network.samuraijs.com/api/1.1/todo-lists", settings)
    },
    createTodolis(title: string) {
        return axios.post<TodolistResponseType<{item: TodolistType }>>("https://social-network.samuraijs.com/api/1.1/todo-lists", {title: title}, settings)
    },
    deleteTodolist(id: string) {
        return axios.delete<TodolistResponseType>(`https://social-network.samuraijs.com/api/1.1/todo-lists/${id}`, settings)
    },
    updateTodolistTitle(id: string, title: string) {
        return axios.put<TodolistResponseType>(`https://social-network.samuraijs.com/api/1.1/todo-lists/${id}`, {title: title}, settings)
    }
}