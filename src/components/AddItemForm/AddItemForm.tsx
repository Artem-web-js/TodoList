import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {IconButton, TextField} from "@material-ui/core";
import {AddBox} from "@material-ui/icons";
import {RequestStatusType} from "../../app/app-reducer";

export type AddItemFormPropsType = {
    addItem: (title: string) => void
    entityStatus?: RequestStatusType
};

const AddItemForm = React.memo(function (props: AddItemFormPropsType) {
    const [title, setTitle] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value);
    };

    const onAddItemKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if(error !== null) {
            setError(null);
        }
        if (e.key === "Enter") {
            onAddItemClick()
        }
    };

    const onAddItemClick = () => {
        const trimmedTitle = title.trim();
        if (trimmedTitle) {
            props.addItem(trimmedTitle)
            setTitle("")
        } else {
            setError("Title is required!")
        }
    };

    return (
        <div>
            <TextField
                size={"small"}
                id="outlined-basic"
                label={error ? "Error" : "Write task"}
                variant="outlined"
                value={title}
                onChange={changeTitle}
                onKeyPress={onAddItemKeyPress}
                error={!!error}
                helperText={error}
                disabled={props.entityStatus === "loading"}
            />
            <IconButton color={"primary"} onClick={onAddItemClick} disabled={props.entityStatus === "loading"}>
                <AddBox/>
            </IconButton>
            {/*{error && <div className={"errorMessage"}>{error}</div>}*/}
        </div>
    )
});

export default AddItemForm;