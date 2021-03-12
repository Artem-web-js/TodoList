type StateType = {
    name: string
    age: number
    childrenCount: number
}

type ActionType = {
    type: string
    [key: string]: any
}

export const userReducer = (user: StateType, action: ActionType) => {
    switch (action.type) {
        case "INCREMENT-AGE":
            // user.age = user.age + 1
            return {...user, age: user.age + 1};
        case "INCREMENT-CHILDREN-COUNT":
            // user.childrenCount = user.childrenCount + 1
            return {...user, childrenCount: user.childrenCount + 1};
        case "CHANGE-NAME":
            return {...user, name: action.newName}
        default:
            throw new Error("I don't understand this type")
    }
}