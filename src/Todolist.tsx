import React, {ChangeEvent} from "react";
import {FiltersValuesType, TasksType} from "./App";
import './App.css';
import AddItemForm from "./AddItemForm";
import EditableSpan from "./EditableSpan";
import {Button, Checkbox, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";

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
        const removeTask = () => {
            props.removeTask(t.id, props.id)
        }
        const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
            props.changeTaskStatus(t.id, e.currentTarget.checked, props.id)
        }
        const changeTitle = (title: string) => {
            props.changeTaskTitle(t.id, title, props.id)
        }
        return (
            <div key={t.id}>
                <Checkbox onChange={changeTaskStatus} checked={t.isDone} color={"secondary"}></Checkbox>
                <EditableSpan title={t.title} changeTitle={changeTitle}/>
                <IconButton className={"deleteItem"} onClick={removeTask}>
                    <Delete/>
                </IconButton>
            </div>
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
    const changeTodoListTitle = (title: string) => {
        props.changeTodoListTitle(props.id, title)
    }
    const removeTodoList = () => {
        props.removeTodoList(props.id)
    }

    const onSetAllFilterClick = () => {
        props.changeFilter("all", props.id)
    }
    const onSetActiveFilterClick = () => {
        props.changeFilter("active", props.id)
    }
    const onSetCompletedFilterClick = () => {
        props.changeFilter("completed", props.id)
    }

    return (
        <div>
            <h3>
                <EditableSpan title={props.title} changeTitle={changeTodoListTitle}/>
                <IconButton onClick={removeTodoList}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask}/>

            <div>
                {tasks}
            </div>
            <div>
                <Button
                    color={props.filter === "all" ? "default" : "default"}
                    variant={props.filter === "all" ? "contained" : "outlined"}
                    onClick={onSetAllFilterClick}>All</Button>
                <Button
                    color={props.filter === "active" ? "primary" : "default"}
                    variant={props.filter === "active" ? "contained" : "outlined"}
                    onClick={onSetActiveFilterClick}>Active</Button>
                <Button
                    color={props.filter === "completed" ? "secondary" : "default"}
                    variant={props.filter === "completed" ? "contained" : "outlined"}
                    onClick={onSetCompletedFilterClick}>Completed</Button>
            </div>
        </div>
    )
}