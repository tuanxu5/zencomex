import { Box, Stack, Typography } from "@mui/material";
import LazyLoadedImage from "../lazy-loaded-image";

export const BoxEmpty = ({ note, sx }) => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                mt: 4,
            }}
        >
            <Stack
                spacing={2}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Box
                    sx={{
                        // height: "auto",
                        maxWidth: "100%",
                        ...sx,
                    }}
                    src="/assets/products/empty.png"
                    alt="Not found"
                    component={"img"}
                />

                <Typography
                    display="flex"
                    justifyContent="center"
                    sx={{
                        fontWeight: 700,
                        fontSize: 16,
                    }}
                >
                    {note || ""}
                </Typography>
            </Stack>
        </Box>
    );
};
