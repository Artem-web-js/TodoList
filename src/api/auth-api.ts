import axios from "axios";

const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/",
    withCredentials: true,
    headers: {
        "API-KEY": "9e4686de-4379-4e75-89bc-e99abdd3cdc3"
    }
})

export const authAPI = {
    me() {
        return instance.get<LoginResponseType<{id: number, email: string, login: string}>>(`auth/me`)
    },
    login(email: string, password: string, rememberMe: boolean = false) {
        return instance.post<LoginResponseType<{userId: number}>>(`/auth/login`, {email, password, rememberMe})
    },
    logout() {
        return instance.delete(`auth/login`)
    }
}

export type LoginParamsType = {
    email: string
    password: string
    rememberMe: boolean
}

export type LoginResponseType<D> = {
    resultCode: number
    messages: []
    data: D
}