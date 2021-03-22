import {addTaskAC, updateTaskAC, removeTaskAC, tasksReducer, setTasksAC, TasksStateType} from './tasks-reducer';
import {addTodoListAC, removeTodolistAC, setTodolistsAC} from './todolist-reducer';
import {TaskPriorities, TaskStatuses} from "../../api/tasks-api";

let startState: TasksStateType = {}

beforeEach(() => {
    startState = {
        "todolistId1": [
            { id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", startDate: '', priority: TaskPriorities.Low, order: 0, description: '', deadline: '', addedDate: '' },
            { id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", startDate: '', priority: TaskPriorities.Low, order: 0, description: '', deadline: '', addedDate: ''  },
            { id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", startDate: '', priority: TaskPriorities.Low, order: 0, description: '', deadline: '', addedDate: ''  }
        ],
        "todolistId2": [
            { id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", startDate: '', priority: TaskPriorities.Low, order: 0, description: '', deadline: '', addedDate: ''  },
            { id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId1", startDate: '', priority: TaskPriorities.Low, order: 0, description: '', deadline: '', addedDate: ''  },
            { id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", startDate: '', priority: TaskPriorities.Low, order: 0, description: '', deadline: '', addedDate: ''  }
        ]
    };
})


test('correct task should be deleted from correct array', () => {
    const action = removeTaskAC("2", "todolistId2");
    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        "todolistId1": [
            { id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", startDate: '', priority: TaskPriorities.Low, order: 0, description: '', deadline: '', addedDate: '' },
            { id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", startDate: '', priority: TaskPriorities.Low, order: 0, description: '', deadline: '', addedDate: ''  },
            { id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", startDate: '', priority: TaskPriorities.Low, order: 0, description: '', deadline: '', addedDate: ''  }
        ],
        "todolistId2": [
            { id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", startDate: '', priority: TaskPriorities.Low, order: 0, description: '', deadline: '', addedDate: ''  },
            { id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", startDate: '', priority: TaskPriorities.Low, order: 0, description: '', deadline: '', addedDate: ''  }
        ]
    });
});

test('correct task should be added to correct array', () => {
    const action = addTaskAC({id: "4", title: "juice", status: TaskStatuses.New, todoListId: "todolistId2", startDate: '', priority: TaskPriorities.Low, order: 0, description: '', deadline: '', addedDate: ''});
    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(4);
    expect(endState["todolistId2"][0].id).toBeDefined();
    expect(endState["todolistId2"][0].title).toBe("juice");
    expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
})

test('status of specified task should be changed', () => {
    const action = updateTaskAC("2", {status: TaskStatuses.New}, "todolistId2");
    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][1].status).toBe(TaskStatuses.New);
    expect(endState["todolistId1"][1].status).toBe(TaskStatuses.Completed);
});

test('title of specified task should be changed', () => {
    const action = updateTaskAC("2", {title: "Milkyway"}, "todolistId2");
    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][1].title).toBe("Milkyway");
    expect(endState["todolistId1"][1].title).toBe("JS");
});

test('new array should be added when new todolist is added', () => {
    const action = addTodoListAC("new todolist");
    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState);
    const newKey = keys.find(k => k != "todolistId1" && k != "todolistId2");
    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});

test('property with todolistId should be deleted', () => {
    const action = removeTodolistAC("todolistId2");
    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).not.toBeDefined();
});

test('empty arrays should be added when we set todolists', () => {
    const action = setTodolistsAC([
        {id: "1", title: "title 1", order: 0, addedData: ""},
        {id: "2", title: "title 2", order: 0, addedData: ""}
    ])

    const endState = tasksReducer({}, action)
    const keys = Object.keys(endState)

    expect(keys.length).toBe(2)
    expect(endState["1"]).toStrictEqual([])
    expect(endState["2"]).toStrictEqual([])
})

test('tasks should be added to todolist', () => {
    const action = setTasksAC(startState["todolistId1"], "todolistId2")
    const endState = tasksReducer({"todolistId1": [], "todolistId2": []}, action)

    expect(endState["todolistId2"].length).toBe(3)
    expect(endState["todolistId1"].length).toBe(0)
})

