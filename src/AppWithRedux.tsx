import React, {useCallback} from 'react';
import './App.css';
import {Todolist} from "./Todolist";
import AddItemForm from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {changeTodoListTitleAC, changeTodoListFilterAC,removeTodolistAC, addTodoListAC} from "./state/todo-list-reducer";
import {changeTaskTitleAC, changeTaskStatusAC, removeTaskAC, addTaskAC} from './state/tasks-reducer';
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import { TasksStateType } from './App';

export type TodoListType = {
    id: string
    title: string
    filter: FiltersValuesType
}

export type FiltersValuesType = "all" | "active" | "completed"

function AppWithRedux() {

    let todoLists = useSelector<AppRootStateType, Array<TodoListType>>(state => state.todolists)
    let tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)

    let dispatch = useDispatch()

    const addTask = useCallback((taskTitle: string, todoListID: string) => {
        const action = addTaskAC(taskTitle, todoListID)
        dispatch(action)
    }, [])

    const removeTask = useCallback((taskID: string, todoListID: string) => {
        const action = removeTaskAC(taskID, todoListID);
        dispatch(action)
    }, [])

    const changeTaskStatus = useCallback((taskID: string, isDone: boolean, todoListID: string) => {
        const action = changeTaskStatusAC(taskID, isDone, todoListID)
        dispatch(action)
    }, [])

    const changeTaskTitle = useCallback((taskID: string, title: string, todoListID: string) => {
        const action = changeTaskTitleAC(taskID, title, todoListID)
        dispatch(action)
    }, [])

    const changeFilter = useCallback((value: FiltersValuesType, todoListID: string) => {
        const action = changeTodoListFilterAC(value, todoListID)
        dispatch(action)
    }, [])

    const removeTodoList = useCallback((todoListID: string) => {
        dispatch(removeTodolistAC(todoListID))
    }, [])

    const addTodoList = useCallback((title: string) => {
        const action = addTodoListAC(title)
        dispatch(action)
    }, [])

    const changeTodoListTitle = useCallback((todoListID: string, title: string) => {
        const action = changeTodoListTitleAC(todoListID,title)
        dispatch(action)
    }, [])

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: "15px"}}>
                    <AddItemForm addItem={addTodoList}/>
                </Grid>
                <Grid container spacing={3}>
                    {
                        todoLists.map(tl => {
                            let allTodoListTasks = tasks[tl.id]
                            return (
                                <Grid item>
                                    <Paper elevation={3} style={{padding: "0 15px 15px 15px"}}>
                                        <Todolist
                                            key={tl.id}
                                            id={tl.id}
                                            title={tl.title}
                                            filter={tl.filter}
                                            tasks={allTodoListTasks}
                                            addTask={addTask}
                                            removeTask={removeTask}
                                            changeFilter={changeFilter}
                                            removeTodoList={removeTodoList}
                                            changeTaskTitle={changeTaskTitle}
                                            changeTaskStatus={changeTaskStatus}
                                            changeTodoListTitle={changeTodoListTitle}
                                        />
                                    </Paper>
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </Container>
        </div>
    );
}

export default AppWithRedux;
