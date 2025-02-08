import React from "react";
import { TextField } from "@mui/material";

const CustomTextField = ({ label, sx, ...props }) => {
    return (
        <TextField
            label={label}
            sx={{
                // width: 200, // Điều chỉnh chiều rộng của TextField
                "& .MuiInputLabel-root": {
                    fontSize: 13, // Kích thước chữ của label
                    top: -6, // Điều chỉnh vị trí label
                    left: 0, // Đảm bảo label căn trái
                },
                "& .MuiInputBase-input": {
                    fontSize: 13, // Kích thước chữ trong ô input
                },
                "& .MuiFormControl-root": {
                    height: 40, // Chiều cao của TextField
                },
                ...sx, // Truyền các style custom vào TextField
            }}
            InputProps={{
                sx: {
                    height: 45, // Chiều cao của TextField
                },
            }}
            {...props} // Truyền các thuộc tính khác (như value, onChange) vào TextField
        />
    );
};

export default CustomTextField;
