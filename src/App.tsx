import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import './App.css';
import {Todolist} from "./Todolist";
import {v1} from "uuid";

export type TasksType = {
    id: string
    title: string
    isDone: boolean
}

type TodoListType = {
    id: string
    title: string
    filter: FiltersValuesType
}

type TasksStateType = {
    [key: string]: Array<TasksType>
}

export type FiltersValuesType = "all" | "active" | "completed"

function App() {
    const todoListID1 = v1();
    const todoListID2 = v1();

    const [todoLists, setTodoLists] = useState <Array<TodoListType>>([
        {id: todoListID1, title: "What to learn", filter: "all"},
        {id: todoListID2, title: "What to buy", filter: "active"}
    ]);

    const [tasks, setTasks] = useState<TasksStateType>({
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
        const newTask: TasksType = {id: v1(), title: taskTitle, isDone: false}
        const todoList = tasks[todoListID]
        tasks[todoListID] = [newTask, ...todoList]
        setTasks({...tasks})
    }

    function removeTask(taskID: string, todoListID: string) {
        const todoList = tasks[todoListID]
        tasks[todoListID] = todoList.filter(t => t.id !== taskID)
        setTasks({...tasks})
    };

    function changeTaskStatus (taskID: string, isDone: boolean, todoListID: string) {
        const todoList = tasks[todoListID]
        let newTodoList = todoList.map(task => {
            if(task.id === taskID) {
                return {...task, isDone: isDone}
            }
            return task
        })
        tasks[todoListID] = newTodoList
        setTasks({...tasks})
    }

    function changeFilter(value: FiltersValuesType, todoListID: string) {
        const todoList = todoLists.find(tl => tl.id === todoListID)
        if (todoList) {
            todoList.filter = value
            //setTodoLists([...todoLists])
        }
    }

    function removeTodoList(todoListID: string) {
        setTodoLists(todoLists.filter(tl => tl.id !== todoListID))
        delete tasks[todoListID]
        setTasks({...tasks})
    }

    return (
        <div className="App">
            {
                todoLists.map(tl => {
                    let tasksForTodoList = tasks[tl.id];
                    if (tl.filter === "active") {
                        tasksForTodoList = tasks[tl.id].filter(t => t.isDone === false)
                    }
                    if (tl.filter === "completed") {
                        tasksForTodoList = tasks[tl.id].filter(t => t.isDone === true)
                    }
                    return (
                        <Todolist
                            key={tl.id}
                            id={tl.id}
                            title={tl.title}
                            filter={tl.filter}
                            tasks={tasksForTodoList}
                            addTask={addTask}
                            removeTask={removeTask}
                            changeFilter={changeFilter}
                            removeTodoList={removeTodoList}
                            changeTaskStatus={changeTaskStatus}
                        />
                    )
                })
            }
        </div>
    );
}

export default App;