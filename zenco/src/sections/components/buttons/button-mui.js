import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import UndoIcon from "@mui/icons-material/Undo";

export const IconEdit = () => {
    return (
        <EditIcon
            sx={{
                color: "green",
                fontSize: 20,
            }}
        />
    );
};

export const IconDelete = () => {
    return (
        <DeleteForeverIcon
            sx={{
                color: "red",
                fontSize: 20,
            }}
        />
    );
};

export const IconBack = () => {
    return (
        <UndoIcon
            sx={{
                color: "blue",
                fontSize: 20,
            }}
        />
    );
};
