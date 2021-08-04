import { tasksReducer } from "../features/TodolistsList/tasks-reducer";
import { todolistReducer } from "../features/TodolistsList/todolist-reducer";
import thunk from "redux-thunk";
import { appReducer } from "./app-reducer";
import { authReducer } from "../features/Login/auth-reducer";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        todolists: todolistReducer,
        app: appReducer,
        auth: authReducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware()
            .prepend(thunk)
})

// @ts-ignore
export type AppRootStateType = ReturnType<typeof store.getState>

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;