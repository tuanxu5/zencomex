import { Box, ButtonBase } from "@mui/material";

const BoxIcon = (props) => {
    const { children, sx, ...others } = props;
    return (
        <Box
            component={ButtonBase}
            sx={{
                alignItems: "center",
                display: "flex",
                borderWidth: 2,
                borderStyle: "solid",
                borderColor: "divider",
                height: 40,
                width: 40,
                borderRadius: "50%",
                "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
                ...sx,
            }}
            {...others}
        >
            {children}
        </Box>
    );
};

export default BoxIcon;
