import React, {ChangeEvent, useState} from "react";

type EditableSpanPropsType = {
    title: string
    changeTitle: (title: string) => void
}

function EditableSpan(props: EditableSpanPropsType) {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [title, setTitle] = useState(props.title)
    const onEditMode = () => {
        setEditMode(true)
    }
    const offEditMode = () => {
        setEditMode(false)
        if(title.trim()) {
            props.changeTitle(title.trim())
        }
    }
    const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    return editMode
        ? <input
            value={title}
            autoFocus={true}
            onBlur={offEditMode}
            onChange={onChangeTitle}
        />
        : <span onDoubleClick={onEditMode}>{props.title}</span>
};

export default EditableSpan;