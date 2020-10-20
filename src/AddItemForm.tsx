import React, {ChangeEvent, KeyboardEvent, useState} from 'react';

type AddItemFormPropsType = {
    addItem: (title: string) => void
};

function AddItemForm(props: AddItemFormPropsType) {
    const [title, setTitle] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value);
    };

    const onAddItemKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        setError(null);
        if(e.key === "Enter") {
            onAddItemClick()
        }
    };

    const onAddItemClick = () => {
        const trimmedTitle = title.trim();
        if(trimmedTitle) {
            props.addItem(trimmedTitle)
            setTitle("")
        } else {
            setError("Title is required!")
        }
    };

    return (
        <div>
            <input
                value={title}
                onChange={changeTitle}
                onKeyPress={onAddItemKeyPress}
                className={error ? "error" : ""}
            />
            <button onClick={onAddItemClick}>+</button>
            {error && <div className={"errorMessage"}>{error}</div>}
        </div>
    )
};

export default AddItemForm;