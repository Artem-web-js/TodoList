import axios from "axios";

const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/",
    withCredentials: true,
    headers: {
        "API-KEY": "9e4686de-4379-4e75-89bc-e99abdd3cdc3"
    }
})

export const todolistsAPI = {
    getTodolists() {
        return instance.get<Array<TodolistType>>("todo-lists")
    },
    createTodolis(title: string) {
        return instance.post<TodolistResponseType<{ item: TodolistType }>>("todo-lists", {title: title})
    },
    deleteTodolist(id: string) {
        return instance.delete<TodolistResponseType>(`todo-lists/${id}`)
    },
    updateTodolistTitle(id: string, title: string) {
        return instance.put<TodolistResponseType>(`todo-lists/${id}`, {title: title})
    }
}

export const authAPI = {
    login(data: LoginParamsType) {
        return instance.post<TodolistResponseType<{userId: string}>>("auth/login", data)
    },
    logout() {
      return instance.delete<TodolistResponseType>("auth/login")
    },
    me() {
        return instance.get<TodolistResponseType<{id: number, email: string, login: string}>>('auth/me')
    }
}

//types
export type TodolistResponseType<T = {}> = {
    resultCode: number
    messages: Array<string>
    data: T
}
export type TodolistType = {
    id: string
    title: string
    addedData?: string
    order?: number
}

export type LoginParamsType = {
    email: string
    password: string
    rememberMe?: boolean
    captcha?: boolean
}