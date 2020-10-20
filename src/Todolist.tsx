import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {FiltersValuesType, TasksType} from "./App";
import './App.css';
import AddItemForm from "./AddItemForm";
import EditableSpan from "./EditableSpan";

type PropsTodolist = {
    id: string
    title: string
    tasks: Array<TasksType>
    filter: FiltersValuesType
    removeTodoList: (todoListID: string) => void
    addTask: (taskTitle: string, todoListID: string) => void
    removeTask: (taskID: string, todoListID: string) => void
    changeFilter: (value: FiltersValuesType, todoListID: string) => void
    changeTaskTitle: (taskID: string, title: string, todoListID: string) => void
    changeTaskStatus: (taskID: string, isDone: boolean, todoListID: string) => void
    changeTodoListTitle: (todoListID: string, title: string) => void
}

export function Todolist(props: PropsTodolist) {

    // const [title, setTitle] = useState<string>("")
    // let [error, setError] = useState<string | null>(null)

    let tasks = props.tasks.map(t => {
        const removeTask = () => {props.removeTask(t.id, props.id)}
        const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
            props.changeTaskStatus(t.id, e.currentTarget.checked, props.id)
        }
        const changeTitle = (title: string) => {
            props.changeTaskTitle(t.id, title, props.id)
        }
        return (
            <li key={t.id}>
                <input
                    type="checkbox"
                    onChange={changeTaskStatus}
                    checked={t.isDone}/>
                    <EditableSpan title={t.title} changeTitle={changeTitle}/>
                {/*<span className={t.isDone ? "isDone" : ""}>{t.title}</span>*/}
                <button className={"deleteItem"} onClick={removeTask}>x</button>
            </li>
        )
    });

    /*const onAddTaskClick = () => {
        if(title.trim()) {
            props.addTask(title.trim(), props.id)
            setTitle("")
        } else {
            setError("Title is required!")
        }
    }*/

    // const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {setTitle(e.currentTarget.value)}

    /*const onAddTaskKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        setError(null)
        if(e.key === "Enter") {
            onAddTaskClick()
        }
    }*/

    const addTask = (title: string) => {
        props.addTask(title, props.id)
    }
    const changeTodoListTitle = (title: string) => {props.changeTodoListTitle(props.id, title)}
    const removeTodoList = () => {props.removeTodoList(props.id)}

    const onSetAllFilterClick = () => {props.changeFilter("all", props.id)}
    const onSetActiveFilterClick = () => {props.changeFilter("active", props.id)}
    const onSetCompletedFilterClick = () => {props.changeFilter("completed", props.id)}

    return (
        <div>
            <h3>
                <EditableSpan title={props.title} changeTitle={changeTodoListTitle}/>
                <button onClick={removeTodoList}>x</button>
            </h3>
            <AddItemForm addItem={addTask}/>
            {/*<div>
                <input
                    value={title}
                    onChange={changeTitle}
                    onKeyPress={onAddTaskKeyPress}
                    className={error ? "error" : ""}
                />
                <button onClick={onAddTaskClick}>+</button>
                {error && <div className={"errorMessage"}>{error}</div>}
            </div>*/}
            <ul>
                {tasks}
            </ul>
            <div>
                <button
                    className={props.filter === "all" ? "active" : ""}
                    onClick={onSetAllFilterClick}>All</button>
                <button
                    className={props.filter === "active" ? "active" : ""}
                    onClick={onSetActiveFilterClick}>Active</button>
                <button
                    className={props.filter === "completed" ? "active" : ""}
                    onClick={onSetCompletedFilterClick}>Completed</button>
            </div>
        </div>
    )
}