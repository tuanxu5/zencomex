import { Box, Container, Typography, useMediaQuery } from "@mui/material";
import TiptapEditor from "../../../components/tiptap/tiptapEditor";

const ViewProductDescription = ({ data, type, expand = true, sx = {} }) => {
    const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
    return (
        <Container maxWidth="lg" sx={{ ...sx, padding: "0px !important" }}>
            {data && data !== "" && (
                <Box>
                    {type === "product" && (
                        <Box
                            width={160}
                            p={1}
                            mt={2}
                            mb={0.5}
                            sx={{
                                backgroundColor: "#E8E8E8",
                                borderRadius: 1,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: "800",
                                }}
                                variant="h6"
                                component="h2"
                            >
                                Mô tả sản phẩm
                            </Typography>
                        </Box>
                    )}

                    <Box>
                        <TiptapEditor
                            expand={type === "product" ? false : true}
                            contentEditor={data}
                            isDisable={true}
                        />
                    </Box>
                </Box>
            )}
        </Container>
    );
};

export default ViewProductDescription;
