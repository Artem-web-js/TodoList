import axios from "axios";

const settings = {
    withCredentials: true,
    headers: {
        "API-KEY": "9e4686de-4379-4e75-89bc-e99abdd3cdc3"
    }
}

export const todolistsAPI = {
    getTodolists() {
        return axios.get("https://social-network.samuraijs.com/api/1.1/todo-lists", settings)
    },
    createTodolis() {
        return axios.post("https://social-network.samuraijs.com/api/1.1/todo-lists", {title: "Read book"}, settings)
    },
    deleteTodolist(todolistId: string) {
        return axios.delete(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistId}`, settings)
    },
    updateTodolistTitle(todolistId: string) {
        return axios.put(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistId}`, {title: "React"}, settings)
    }
}