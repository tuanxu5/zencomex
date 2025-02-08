import CloseIcon from "@mui/icons-material/Close";
import { LoadingButton } from "@mui/lab";
import {
    Box,
    Button,
    Card,
    CardMedia,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stack,
    SvgIcon,
    Tooltip,
} from "@mui/material";
import { BASE_URL } from "../utils/axios";

export const FileView = ({ files, onRemoveFile, onRemoveFileAll, loadingButton }) => {
    return (
        <Box>
            <List>
                <Grid container spacing={1}>
                    {files.map((file, index) => {
                        return (
                            <Grid key={index} item xs={12} sm={6} lg={4} xl={onRemoveFileAll ? 4 : 3}>
                                <ListItem
                                    key={file.path}
                                    sx={{
                                        border: 1,
                                        borderColor: "divider",
                                        borderRadius: 1,
                                        "& + &": {
                                            mt: 1,
                                        },
                                        minWidth: 280,
                                    }}
                                >
                                    <ListItemIcon>
                                        <Card
                                            sx={{
                                                objectFit: "center",
                                                objectPosition: "center",
                                            }}
                                        >
                                            <CardMedia
                                                image={file.temp ? file.link : `${BASE_URL}/upload/${file.link}`}
                                                title={file.ten_vi}
                                                sx={{
                                                    height: 50,
                                                    width: 50,
                                                    "&:hover": {
                                                        opacity: 0.8,
                                                        cursor: "pointer",
                                                    },
                                                }}
                                            />
                                        </Card>
                                        {/* <FileIcon extension={extension} /> */}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={file.ten_vi}
                                        primaryTypographyProps={{
                                            variant: "subtitle2",
                                        }}
                                        sx={{
                                            width: "75%",
                                            overflow: "hidden", // Prevent overflow
                                            textOverflow: "ellipsis", // Show ellipsis when text overflows
                                            whiteSpace: "nowrap", // Prevent wrapping of text
                                        }}
                                    />
                                    <LoadingButton
                                        loading={
                                            loadingButton && loadingButton.index === index
                                                ? loadingButton.loading
                                                : false
                                        }
                                        sx={{
                                            minWidth: 0,
                                            p: 1,
                                            ml: 1,
                                            borderRadius: "50%",
                                        }}
                                        edge="end"
                                        onClick={() => onRemoveFile?.(file, index)}
                                    >
                                        <Tooltip title="Remove">
                                            <SvgIcon>
                                                <CloseIcon />
                                            </SvgIcon>
                                        </Tooltip>
                                    </LoadingButton>
                                </ListItem>
                            </Grid>
                        );
                    })}
                </Grid>
            </List>
            <Stack alignItems="center" direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 2 }}>
                {onRemoveFileAll && (
                    <Button color="inherit" onClick={onRemoveFileAll} size="small" type="button">
                        Remove All
                    </Button>
                )}
            </Stack>
        </Box>
    );
};
