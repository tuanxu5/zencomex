import toast from "react-hot-toast";
//icon
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import ErrorIcon from "@mui/icons-material/Error";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import InfoIcon from "@mui/icons-material/Info";

export const ToastMessage = (message, type, position, time = 2000, sx) => {
    const checkType = () => {
        if (type === "success") {
            return "green";
        } else if (type === "error") {
            return "red";
        } else if (type === "warning") {
            return "yellow";
        } else {
            return "green";
        }
    };

    const checkIcon = () => {
        if (type === "success") {
            return <DoneOutlineIcon color="success" />;
        } else if (type === "error") {
            return <ErrorIcon color="error" />;
        } else if (type === "warning") {
            return <ReportProblemIcon color="warning" />;
        } else if (type === "info") {
            return <InfoIcon color="info" />;
        } else {
            return <DoneOutlineIcon color="success" />;
        }
    };

    return toast(message, {
        position: position ? position : "top-right",
        icon: checkIcon(),
        duration: time,
        style: {
            border: `1px solid ${checkType()}`,
            color: "black",
            fontWeight: "bold",
            fontSize: "12px",
            background: "white",
            ...sx,
        },
    });
};
