import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { ToastMessage } from "../../components/custom-toast";
import TiptapEditor from "../../components/tiptap/tiptapEditor";
import { getListImages } from "../../services/product-service";
import axiosInstance, { BASE_URL } from "../../utils/axios";
import BoxIcon from "../components/buttons/box-for-icon";
import { IconBack } from "../components/buttons/button-mui";

const AdminIntroduction = ({ introduction }) => {
    const [content, setContent] = useState(introduction?.description);
    const [initcontent, setInitContent] = useState(introduction?.description);
    const initialValues = {
        thumb2: introduction?.videoUrl,
        mota_vi: introduction?.intro,
    };

    const formik = useFormik({
        initialValues,
        onSubmit: async (values) => {
            const data = {
                ...values,
                noidung_vi: content,
            };
            const images = await getListImages(introduction.id);
            const imagesDelete = images.filter((item) => item.isdelete === true);
            if (imagesDelete.length > 0) {
                try {
                    await axiosInstance.post("/upload/folder/delete", {
                        link: imagesDelete.map((item) => item.link),
                    });
                } catch (error) {}
            }
            try {
                const response = await axiosInstance.put(`/general/introduct/${introduction.id}`, data);
                if (response && response.data.DT) {
                    ToastMessage("Cập nhật thành công", "success");
                } else {
                    ToastMessage("Cập nhật thất bại", "error");
                }
            } catch (error) {
                ToastMessage("Có lỗi xảy ra", "error");
            }
        },
    });

    // --------------- florala editor ---------------- //
    const [filesEditor, setFilesEditor] = useState([]);
    const [filesEditorTemp, setFilesEditorTemp] = useState([]);

    const handleUploadImageIntoEditor = async (image, alt, title, editor) => {
        if (image) {
            const formData = new FormData();
            formData.append("files", image);
            const checkId = introduction ? introduction.id : 0;
            try {
                const upload = await axiosInstance.post(
                    `/upload/folder?dir=baiviet/editor&type=introduction_editor&id=${checkId}`,
                    formData
                );
                if (upload && upload.data.DT) {
                    // Xóa hết các hình ảnh đã chèn trước đó (nếu có)
                    const link = `${BASE_URL}/upload/${upload.data.DT[0].link}`;
                    // Insert the image into the editor
                    editor.chain().focus().setImage({ src: link, alt: alt, title: title }).run();

                    setFilesEditor((prevFiles) => {
                        const existLink = prevFiles.find((item) => item.link === upload.data.DT[0].link);
                        if (existLink) {
                            return prevFiles;
                        } else {
                            const newData = [...prevFiles, upload.data.DT[0]];
                            return newData;
                        }
                    });
                }
            } catch (error) {
                console.log("error", error);
            }
        }
    };

    const customHandleDeleteImage = async (image) => {
        if (image.length > 0) {
            const extractedPaths = image.map((url) => url.split("/upload/")[1]);
            const body = {
                link: extractedPaths,
                id_vitri: introduction ? introduction.id : 0,
                data: {
                    isdelete: true,
                    deleted_at: new Date().toISOString(),
                },
                type: `${type}_editor`,
            };
            try {
                await axiosInstance.post("/image/update", { body });
            } catch (error) {}
            if (image.length === 1) {
                setFilesEditor((prevFiles) => prevFiles.filter((item) => item.link !== extractedPaths[0]));
            }
        }
    };

    const getImagesEditor = async () => {
        // get Image Editor by Id Vi_tri
        const images = await getListImages(introduction?.id);
        if (images) {
            setFilesEditor(images);
            setFilesEditorTemp(images);
        }
    };
    useEffect(() => {
        if (introduction) {
            getImagesEditor();
        }
    }, []);
    const handleClickBack = async () => {
        formik.resetForm();
        setContent(initcontent);
        if (JSON.stringify(filesEditor) !== JSON.stringify(filesEditorTemp)) {
            if (filesEditorTemp.length === 0) {
                if (filesEditor.length > 0) {
                    try {
                        await axiosInstance.post("/upload/folder/delete", {
                            link: [filesEditor[0].link],
                        });
                    } catch (error) {}
                }
            } else {
                const deletedItems = filesEditorTemp.filter(
                    (itemB) => !filesEditor.some((itemA) => itemA.id === itemB.id)
                );
                const addedItems = filesEditor.filter(
                    (itemA) => !filesEditorTemp.some((itemB) => itemB.id === itemA.id)
                );

                if (deletedItems.length > 0) {
                    deletedItems.forEach(async (item) => {
                        const body = {
                            link: [item.link],
                            id_vitri: introduction ? introduction.id : 0,
                            data: {
                                isdelete: false,
                                deleted_at: "",
                            },
                            type: `introduction_editor`,
                        };
                        try {
                            await axiosInstance.post("/image/update", { body });
                        } catch (error) {}
                    });
                }
                if (addedItems.length > 0) {
                    try {
                        await axiosInstance.post("/upload/folder/delete", {
                            link: addedItems.map((item) => item.link),
                        });
                    } catch (error) {}
                }
            }
        }
        setFilesEditor(filesEditorTemp);
        ToastMessage("Đã hủy thay đổi", "info");
    };

    const handleChangeEditorTest = (value) => {
        console.log("...", value);
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <Box p={4}>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h4">Giới thiệu chung</Typography>
                    <Stack direction="row" spacing={2}>
                        <BoxIcon onClick={handleClickBack}>
                            <IconBack />
                        </BoxIcon>
                        <Button
                            type="submit"
                            sx={{
                                backgroundColor: "#BBDEFB",
                                "&:hover": {
                                    backgroundColor: "green",
                                    color: "white",
                                },
                            }}
                        >
                            Cập nhật
                        </Button>
                    </Stack>
                </Stack>
                <Box mt={4}>
                    <Stack spacing={2}>
                        <TextField
                            multiline
                            label="IFrame Youtube"
                            name="thumb2"
                            value={formik.values.thumb2}
                            onChange={formik.handleChange}
                        />
                        <TextField
                            multiline
                            label="Mô tả ngắn"
                            name="mota_vi"
                            value={formik.values.mota_vi}
                            onChange={formik.handleChange}
                        />
                    </Stack>
                    <Box width="80%" mt={2}>
                        <Typography>Nội dung chi tiết</Typography>
                        <TiptapEditor
                            contentEditor={content}
                            fileEditor={filesEditor}
                            onChangeContent={setContent}
                            onUploadImage={handleUploadImageIntoEditor}
                            onDeleteImage={customHandleDeleteImage}
                            onChangeFile={setFilesEditor}
                            isCreate={false}
                            folder="introduction"
                        />
                    </Box>
                </Box>
            </Box>
        </form>
    );
};

export default AdminIntroduction;
