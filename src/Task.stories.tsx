import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import {Story, Meta} from '@storybook/react/types-6-0';
import {Task, TaskPropsType} from "./Task";
import {action} from "@storybook/addon-actions";

export default {
    title: 'Todolist/Task',
    component: Task,
    args: {
        removeTask: action('Title changed inside Task'),
        changeTaskStatus: action('Remove button inside Task clicked'),
        changeTaskTitle: action('Status changed inside Task'),
    },
} as Meta;

const Template: Story<TaskPropsType> = (args) => <Task {...args} />;
export const TaskIsDoneExample = Template.bind({});
TaskIsDoneExample.args = {
    task: {id: '1', isDone: true, title: 'CSS'},
    todolistId: 'todolistId1',
};

export const TaskIsNotDoneExample = Template.bind({});
TaskIsNotDoneExample.args = {
    task: {id: '2', isDone: false, title: 'JS'},
    todolistId: 'todolistId2',
};
