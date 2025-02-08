import PropTypes from "prop-types";
import { useDropzone } from "react-dropzone";

//icon
import UploadIcon from "@mui/icons-material/Upload";
import Upload01Icon from "@untitled-ui/icons-react/build/esm/Upload01";

import { Avatar, Box, Stack, SvgIcon, Typography } from "@mui/material";

export const FileUpload = (props) => {
    const { caption, files = [], onRemove, onRemoveAll, onUpload, isDragandDrop, ...other } = props;
    const { getRootProps, getInputProps, isDragActive } = useDropzone(other);

    return (
        <div>
            {isDragandDrop ? (
                <Box
                    sx={{
                        alignItems: "center",
                        borderRadius: 1,
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        outline: "none",
                        p: 6,
                        ...(isDragActive && {
                            backgroundColor: "action.active",
                            opacity: 0.5,
                        }),
                    }}
                    {...getRootProps()}
                >
                    <input {...getInputProps()} />
                    <Stack
                        sx={{
                            "&:hover": {
                                backgroundColor: "action.hover",
                                cursor: "pointer",
                                opacity: 0.8,
                            },
                            borderRadius: 4,
                        }}
                        alignItems="center"
                        direction="row"
                        spacing={2}
                    >
                        <Avatar
                            sx={{
                                height: 64,
                                width: 64,
                            }}
                        >
                            <SvgIcon>
                                <Upload01Icon />
                            </SvgIcon>
                        </Avatar>
                        <Stack spacing={1} xs={3}>
                            {caption && (
                                <Typography color="text.secondary" variant="body2">
                                    {caption}
                                </Typography>
                            )}
                        </Stack>
                    </Stack>
                </Box>
            ) : (
                <Avatar
                    sx={{
                        height: 24,
                        width: 24,
                        cursor: "pointer",
                        "&:hover": {
                            backgroundColor: "action.hover",
                            opacity: 0.8,
                        },
                    }}
                    {...getRootProps()}
                >
                    <input {...getInputProps()} />
                    <SvgIcon sx={{ fontSize: 20 }}>
                        <UploadIcon />
                    </SvgIcon>
                </Avatar>
            )}
        </div>
    );
};

FileUpload.propTypes = {
    caption: PropTypes.string,
    files: PropTypes.array,
    onRemove: PropTypes.func,
    onRemoveAll: PropTypes.func,
    onUpload: PropTypes.func,
    // From Dropzone
    accept: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string.isRequired).isRequired),
    disabled: PropTypes.bool,
    getFilesFromEvent: PropTypes.func,
    maxFiles: PropTypes.number,
    maxSize: PropTypes.number,
    minSize: PropTypes.number,
    noClick: PropTypes.bool,
    noDrag: PropTypes.bool,
    noDragEventsBubbling: PropTypes.bool,
    noKeyboard: PropTypes.bool,
    onDrop: PropTypes.func,
    onDropAccepted: PropTypes.func,
    onDropRejected: PropTypes.func,
    onFileDialogCancel: PropTypes.func,
    preventDropOnDocument: PropTypes.bool,
};
