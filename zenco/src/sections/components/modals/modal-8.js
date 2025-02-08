import AlertTriangleIcon from "@untitled-ui/icons-react/build/esm/AlertTriangle";
import { Avatar, Box, Button, Container, Dialog, Paper, Stack, SvgIcon, Typography } from "@mui/material";

export const ModalWarningDelete = ({ title, name, open, onClose, onAccept }) => {
    return (
        <Dialog open={open}>
            <Container maxWidth="xs">
                <Paper elevation={12}>
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            display: "flex",
                            p: 3,
                        }}
                    >
                        <Avatar
                            sx={{
                                backgroundColor: "error.lightest",
                                color: "error.main",
                            }}
                        >
                            <SvgIcon>
                                <AlertTriangleIcon />
                            </SvgIcon>
                        </Avatar>
                        <div>
                            <Typography variant="h6">{title}</Typography>
                            <Typography
                                sx={{ mt: 1, fontSize: "14", fontStyle: "italic", fontWeight: "600" }}
                                variant="body2"
                            >
                                {name}
                            </Typography>
                            <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
                                Bạn có chắc chắn với quyết định này không? Tất cả dữ liệu của bạn sẽ bị xóa và không thể
                                khôi phục.
                            </Typography>
                        </div>
                    </Stack>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            pb: 2,
                            px: 2,
                        }}
                    >
                        <Button onClick={onClose} color="inherit" sx={{ mr: 2 }}>
                            Hủy
                        </Button>
                        <Button
                            onClick={onAccept}
                            sx={{
                                backgroundColor: "error.main",
                                "&:hover": {
                                    backgroundColor: "error.dark",
                                },
                            }}
                            variant="contained"
                            size="small"
                        >
                            Xác nhận
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Dialog>
    );
};
