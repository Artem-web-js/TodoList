import React, {useReducer} from 'react';
import './App.css';
import {Todolist} from "./Todolist";
import {v1} from "uuid";
import AddItemForm from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {changeTodoListTitleAC, todoListReducer, changeTodoListFilterAC,removeTodolistAC, addTodoListAC} from "./state/todo-list-reducer";
import {changeTaskTitleAC, tasksReducer, changeTaskStatusAC, removeTaskAC, addTaskAC} from './state/tasks-reducer';

export type TodoListType = {
    id: string
    title: string
    filter: FiltersValuesType
}

export type FiltersValuesType = "all" | "active" | "completed"

function AppWithReducer() {

    const todoListID1 = v1();
    const todoListID2 = v1();

    const [todoLists, dispatchToTodolist] = useReducer(todoListReducer, [
        {id: todoListID1, title: "What to learn", filter: "all"},
        {id: todoListID2, title: "What to buy", filter: "all"}
    ]);

    const [tasks, dispatchToTasks] = useReducer(tasksReducer, {
        [todoListID1]: [
            {id: v1(), title: "HTML", isDone: true},
            {id: v1(), title: "CSS", isDone: true},
            {id: v1(), title: "JS", isDone: false}
        ],
        [todoListID2]: [
            {id: v1(), title: "Milk", isDone: true},
            {id: v1(), title: "Bread", isDone: true},
            {id: v1(), title: "Candy", isDone: false}
        ]
    });

    function addTask(taskTitle: string, todoListID: string) {
        const action = addTaskAC(taskTitle, todoListID)
        dispatchToTasks(action)
    }

    function removeTask(taskID: string, todoListID: string) {
        const action = removeTaskAC(taskID, todoListID);
        dispatchToTasks(action)
    }

    function changeTaskStatus(taskID: string, isDone: boolean, todoListID: string) {
        const action = changeTaskStatusAC(taskID, isDone, todoListID)
        dispatchToTasks(action)
    }

    function changeTaskTitle(taskID: string, title: string, todoListID: string) {
        const action = changeTaskTitleAC(taskID, title, todoListID)
        dispatchToTasks(action)
    }

    function changeFilter(value: FiltersValuesType, todoListID: string) {
        const action = changeTodoListFilterAC(value, todoListID)
        dispatchToTodolist(action)
    }

    function removeTodoList(todoListID: string) {
        dispatchToTodolist(removeTodolistAC(todoListID))
        dispatchToTasks(removeTodolistAC(todoListID))
    }

    function addTodoList(title: string) {
        const action = addTodoListAC(title)
        dispatchToTasks(action)
        dispatchToTodolist(action)
    }

    function changeTodoListTitle(todoListID: string, title: string) {
        const action = changeTodoListTitleAC(todoListID,title)
        dispatchToTodolist(action)
    }

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
                            let tasksForTodoList = tasks[tl.id];
                            if (tl.filter === "active") {
                                tasksForTodoList = tasks[tl.id].filter(t => !t.isDone)
                            }
                            if (tl.filter === "completed") {
                                tasksForTodoList = tasks[tl.id].filter(t => t.isDone)
                            }
                            return (
                                <Grid item>
                                    <Paper elevation={3} style={{padding: "0 15px 15px 15px"}}>
                                        <Todolist
                                            key={tl.id}
                                            id={tl.id}
                                            title={tl.title}
                                            filter={tl.filter}
                                            tasks={tasksForTodoList}
                                            addTask={addTask}
                                            removeTask={removeTask}
                                            changeFilter={changeFilter}
                                            removeTodolist={removeTodoList}
                                            changeTaskTitle={changeTaskTitle}
                                            changeTaskStatus={changeTaskStatus}
                                            changeTodolistTitle={changeTodoListTitle}
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

export default AppWithReducer;
