import React, {useEffect, useState} from 'react'
import {tasksAPI} from "../api/tasks-api";

export default {
    title: 'Tasks API'
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        let todolistId = "d98aac03-71ab-4589-8171-7915b4a9e8db";
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
        let todolistId = "d98aac03-71ab-4589-8171-7915b4a9e8db"
        let taskId = "a5ba4a3f-bd47-4521-8850-f10b1254c03a";
        tasksAPI.deleteTask(todolistId, taskId)
            .then((res) => {
                setState(res.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const UpdateTaskTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        let todolistId = "d98aac03-71ab-4589-8171-7915b4a9e8db";
        let taskId = "bab94e66-10c2-4d03-9438-13d951228324";
        let title = "I'm so happy!";
        tasksAPI.updateTaskTitle(todolistId, taskId, title)
            .then((res) => {
                setState(res.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}