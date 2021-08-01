import { tasksReducer } from "../features/TodolistsList/tasks-reducer";
import { combineReducers } from 'redux';
import { todolistReducer } from "../features/TodolistsList/todolist-reducer";
import thunk from "redux-thunk";
import { appReducer } from "./app-reducer";
import { authReducer } from "../features/Login/auth-reducer";
import { configureStore } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistReducer,
    app: appReducer,
    auth: authReducer
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware()
            .prepend(thunk)
})

export type AppRootStateType = ReturnType<typeof rootReducer>

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;