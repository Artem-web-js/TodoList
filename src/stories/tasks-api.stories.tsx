import React, {useEffect, useState} from 'react'
import {tasksAPI} from "../api/tasks-api";

export default {
    title: 'Tasks API'
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        let todolistId = "7b89923a-b49d-426d-b2fb-cc5fad63b0bd";
        tasksAPI.getTasks(todolistId)
            .then((res) => {
                setState(res.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        let title = "Learn JavaScript";
        let todolistId = "d98aac03-71ab-4589-8171-7915b4a9e8db";
        tasksAPI.createTask(todolistId, title)
            .then((res) => {
                setState(res.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        let todolistId = "0ca80ad7-7bc7-4388-a011-ebca291eb527"
        let taskId = "";
        tasksAPI.deleteTask(todolistId, taskId)
            .then((res) => {
                setState(res.data.items)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const UpdateTaskTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        let todolistId = "7b89923a-b49d-426d-b2fb-cc5fad63b0bd";
        let taskId = "";
        let title = "Param";
        tasksAPI.updateTaskTitle(todolistId, taskId, title)
            .then((res) => {
                setState(res.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}