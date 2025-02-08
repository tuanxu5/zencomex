import { LoadingButton } from "@mui/lab";
import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormHelperText,
    Grid,
    InputAdornment,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import * as Yup from "yup";
import { ToastMessage } from "../../../components/custom-toast";
import { FileUpload } from "../../../components/file-upload";
import { FileView } from "../../../components/file-view";
import LoadingChildScreen from "../../../components/loading-child-screen";
import { Scrollbar } from "../../../components/scrollbar";
import TiptapEditor from "../../../components/tiptap/tiptapEditor";
import useDebounce from "../../../hooks/use-debounce";
import { getListImages } from "../../../services/product-service";
import axiosInstance, { BASE_URL } from "../../../utils/axios";

const AdminModalGeneralDetail = ({ data, open, onClose, create, type, onSubmitted, onSubmitUpdate, category }) => {
    const checkNameByType = () => {
        if (type === "home") {
            return "Trang chủ";
        } else if (type === "service") {
            return "dịch vụ";
        } else if (type === "recruitment") {
            return "tuyển dụng";
        } else if (type === "project") {
            return "dự án";
        } else if (type === "news") {
            return "tin tức";
        } else if (type === "exportimport") {
            return "xuất nhập khẩu";
        } else if (type === "policy") {
            return "chính sách và hỗ trợ";
        }
    };

    //check url
    const [url, setUrl] = useState("");

    const validationSchema = Yup.object({
        title: Yup.string().max(255).required("Tên không được để trống"),
        alias: Yup.string().max(255).required("Tên không dấu không được để trống"),
        // description: Yup.string().required("Mô tả không được để trống"),
    });
    const initialValues = create
        ? {
              title: "",
              alias: "",
              category: "",
              description: "",
              intro: "",
              image: "",
              titleSeo: "",
              keywordSeo: "",
              descriptionSeo: "",
          }
        : {
              title: data.title,
              alias: data.alias,
              category: data.category,
              description: data.description,
              intro: data.intro,
              image: data.image,
              titleSeo: data.titleSeo,
              keywordSeo: data.keywordSeo,
              descriptionSeo: data.descriptionSeo,
          };

    // formik
    const [loading, setLoading] = useState(false);
    const formik = useFormik({
        initialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values, helpers) => {
            const newData = {
                ...values,
                description: contentEditor,
                imageEditor: filesEditor,
                imageNow: fileNow,
            };
            const dataSubmit = {
                ten_vi: newData.title,
                mota_vi: newData.intro,
                noidung_vi: newData.description,
                tenkhongdau: newData.alias,
                id_list: newData.category ? newData.category : "",
                photo: newData.imageNow.length > 0 ? newData.imageNow[0].photo_vi : initialValues.image || "",
                title: newData.titleSeo,
                keywords: newData.keywordSeo,
                description: newData.descriptionSeo,
                imageEditor: newData.imageEditor,
                imageNow: newData.imageNow,
            };
            try {
                setLoading(true);
                if (create) {
                    if (fileNow.length > 0) {
                        const res = await onSubmitted(dataSubmit);
                        if (res && res.data.DT) {
                            ToastMessage("Tạo mới thành công!", "success");
                            formik.resetForm();
                            setFileNow([]);
                            setFilesEditor([]);
                            setContentEditor("");
                            onClose();
                        } else {
                            ToastMessage("Tạo mới thất bại!", "error");
                        }
                    } else {
                        ToastMessage("Bạn chưa thêm ảnh hiện tại", "warning");
                    }
                } else {
                    const initData = {
                        ten_vi: initialValues.title,
                        mota_vi: initialValues.intro,
                        noidung_vi: initialValues.description,
                        tenkhongdau: initialValues.alias,
                        id_list: initialValues.category ? initialValues.category : "",
                        title: initialValues.titleSeo,
                        keywords: initialValues.keywordSeo,
                        description: initialValues.descriptionSeo,
                    };
                    const doneData = {
                        ten_vi: values.title,
                        mota_vi: values.intro,
                        noidung_vi: values.description,
                        tenkhongdau: values.alias,
                        id_list: values.category ? values.category : "",
                        title: values.titleSeo,
                        keywords: values.keywordSeo,
                        description: values.descriptionSeo,
                    };
                    const checkImageEditor = JSON.stringify(filesEditor) !== JSON.stringify(filesEditorTemp);
                    const checkImageNow = JSON.stringify(fileNow) !== JSON.stringify(fileNowTemp);
                    if (JSON.stringify(initData) !== JSON.stringify(doneData) || checkImageEditor || checkImageNow) {
                        if (fileNow.length > 0) {
                            const res = onSubmitUpdate(dataSubmit, data.id);
                            if (res) {
                                ToastMessage("Cập nhật thành công!", "success");
                                setTimeout(() => {
                                    onClose();
                                    formik.resetForm();
                                    setFileNow([]);
                                    setFilesEditor([]);
                                    setContentEditor("");
                                    setFilesEditorTemp([]);
                                    setFileNowTemp([]);
                                    setLoading(false);
                                    setTimeout(() => {}, 300);
                                }, 1000);
                            }
                        } else {
                            ToastMessage("Bạn chưa thêm ảnh hiện tại", "warning");
                            setLoading(false);
                        }
                    } else {
                        ToastMessage("Không có thay đổi để cập nhật!", "warning");
                        setLoading(false);
                    }
                    setLoading(false);
                }

                // setLoading(false);
            } catch (error) {
                console.error(error);
                ToastMessage("Có lỗi xảy ra", "error");
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: error.message });
                helpers.setSubmitting(false);
            }
            setLoading(false);
        },
    });

    //file
    const [fileNow, setFileNow] = useState([]);
    const [fileNowTemp, setFileNowTemp] = useState([]);
    const handleFileNowDrop = useCallback(async (newFiles) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("files", newFiles[0]);
        const checkId = data ? data.id : 0;
        try {
            const upload = await axiosInstance.post(
                `/upload/folder?dir=baiviet&type=${type}_now&id=${checkId}`,
                formData
            );
            if (upload && upload.data.DT) {
                setFileNow([...upload.data.DT]);
                ToastMessage("Tải ảnh lên thành công!", "success");
                setLoading(false);
            }
        } catch (error) {
            ToastMessage("Có lỗi xảy ra khi tải ảnh lên!", "error");
            setLoading(false);
        }
    }, []);

    const handleFileNowRemove = useCallback(async (file) => {
        if (create) {
            try {
                const res = await axiosInstance.post("/upload/folder/delete", {
                    link: [file.link],
                });
                if (res && res.data.DT) {
                    ToastMessage("Xóa thành công", "success");
                    setFileNow([]);
                }
            } catch (error) {
                ToastMessage("Xóa Thất bại", "error");
            }
            // customHandleDeleteFiles([file], "now");
        } else {
            const body = {
                isdelete: true,
                deleted_at: new Date().toISOString(),
            };
            try {
                const res = await axiosInstance.post(`/image/update/${file.id}`, { body });
                if (res && res.data) {
                    setFileNow([]);
                    ToastMessage("Xóa ảnh thành công!", "success");
                }
            } catch (error) {
                ToastMessage("Có lỗi xảy ra khi xóa ảnh!", "error");
            }
        }
    }, []);

    // content
    // files editor
    const [filesEditor, setFilesEditor] = useState([]);
    const [filesEditorTemp, setFilesEditorTemp] = useState([]);
    const [contentEditor, setContentEditor] = useState("");
    useEffect(() => {
        formik.setFieldValue("description", contentEditor);
    }, [contentEditor]);

    useEffect(() => {
        formik.setFieldValue("imageEditor", filesEditor);
        formik.setFieldValue("imageProductNow", fileNow);
    }, [fileNow, filesEditor]);

    useEffect(() => {
        if (!create) {
            setContentEditor(data.description);
        }
    }, [open]);

    // --------------- florala editor ---------------- //
    const handleUploadImageIntoEditor = async (image, alt, title, editor) => {
        if (image) {
            const formData = new FormData();
            formData.append("files", image);
            const checkId = data ? data.id : 0;
            try {
                const upload = await axiosInstance.post(
                    `/upload/folder?dir=baiviet/editor&type=${type}_editor&id=${checkId}`,
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
                id_vitri: data ? data.id : 0,
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

    const handleCloseModal = () => {
        if (create) {
            if (
                JSON.stringify(formik.values) === JSON.stringify(initialValues) &&
                fileNow.length === 0 &&
                contentEditor === ""
            ) {
                onClose();
            } else {
                ToastMessage("Dữ liệu chưa được lưu!", "warning");
            }
        }
        ToastMessage("Dữ liệu chưa được lưu!", "warning");
    };

    //close modal with Button Close
    const handleCloseModalWithButton = async () => {
        setLoading(true);
        if (!create) {
            setLoading(true);
            if (JSON.stringify(fileNow) !== JSON.stringify(fileNowTemp)) {
                if (fileNow.length > 0) {
                    try {
                        await axiosInstance.post("/upload/folder/delete", {
                            link: [fileNow[0].link],
                        });
                    } catch (error) {}
                }
                fileNowTemp.forEach(async (item) => {
                    const body = {
                        isdelete: false,
                        deleted_at: "",
                    };
                    try {
                        await axiosInstance.post(`/image/update/${item.id}`, { body });
                    } catch (error) {}
                });
            }
            if (JSON.stringify(filesEditor) !== JSON.stringify(filesEditorTemp)) {
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
                            id_vitri: data ? data.id : 0,
                            data: {
                                isdelete: false,
                                deleted_at: "",
                            },
                            type: `${type}_editor`,
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

            setLoading(false);
        }
        if (create) {
            setLoading(true);
            if (fileNow.length > 0) {
                try {
                    await axiosInstance.post("/upload/folder/delete", {
                        link: [fileNow[0].link],
                    });
                } catch (error) {}
            }
            if (filesEditor.length > 0) {
                try {
                    await axiosInstance.post("/upload/folder/delete", {
                        link: filesEditor.map((item) => item.link),
                    });
                } catch (error) {}
            }
            setLoading(false);
        }

        setContentEditor("");
        setFilesEditor([]);
        setFilesEditorTemp([]);
        setFileNow([]);
        setFileNowTemp([]);
        onClose();
        formik.resetForm();
        setLoading(false);
    };

    // get list images by id product
    const getImages = async (id) => {
        const images = await getListImages(id);
        if (images) {
            const imageEditor = images
                .filter((item) => item.type === `${type}_editor` && item.isdelete !== true)
                .map((item) => item);
            const imageNow = images
                .filter((item) => item.type === `${type}_now` && item.isdelete !== true)
                .map((item) => item);
            if (imageEditor.length > 0) {
                let Fisrt = true;
                setFilesEditor(imageEditor);
                if (Fisrt) {
                    setFilesEditorTemp(imageEditor);
                    Fisrt = false;
                }
            }
            if (imageNow.length > 0) {
                let Fisrt = true;
                setFileNow(imageNow);
                if (Fisrt) {
                    setFileNowTemp(imageNow);
                    Fisrt = false;
                }
            }
        }
    };

    // check type to render froala editor
    useEffect(() => {
        if (!create) {
            if (open) {
                getImages(data.id);
                setContentEditor(data.description);
            } else {
                setContentEditor("");
            }
        }
    }, [open]);

    // check url exist
    const urlDebounce = useDebounce(url, 2000);
    const checkUrl = async () => {
        try {
            const res = await axiosInstance.get(`/admin/url?url=${url}`);
            if (res && res.data.DT === false) {
                formik.setErrors({ alias: "Tên không dấu này đã tồn tại" });
                formik.setFieldTouched("alias", true, false);
                return;
            }
        } catch (error) {
            console.log("error", error);
        }
    };
    useEffect(() => {
        if (url.length > 0) {
            checkUrl();
        }
    }, [urlDebounce]);

    return (
        <Dialog
            sx={{
                "& .MuiDialog-paper": {
                    width: "95vw", // Chiều rộng của hộp thoại là 60% chiều rộng viewport
                    maxWidth: "none", // Bỏ qua các thiết lập maxWidth mặc định
                    height: "95vh",
                },
                "& .MuiDialog-paper > div": {
                    overflow: "auto", // Cuộn nội dung
                },
            }}
            open={open}
            onClose={handleCloseModal}
        >
            {loading && <LoadingChildScreen />}
            <Box position="relative">
                <form onSubmit={formik.handleSubmit}>
                    <DialogTitle>
                        <Typography fontSize={30} fontWeight={700}>
                            {create ? `Tạo mới ${checkNameByType()}` : `Chỉnh sửa ${checkNameByType()}`}
                        </Typography>
                    </DialogTitle>
                    <Scrollbar
                        autoHide={false}
                        sx={{
                            height: "75vh",
                        }}
                    >
                        <DialogContent>
                            <Stack spacing={4}>
                                <Card>
                                    <CardContent>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} md={3} lg={2} p={2}>
                                                <Typography variant="h6">Thông tin cơ bản</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={9} lg={10}>
                                                <Stack spacing={3}>
                                                    <TextField
                                                        error={!!(formik.touched.title && formik.errors.title)}
                                                        fullWidth
                                                        helperText={formik.touched.title && formik.errors.title}
                                                        label="Tên"
                                                        name="title"
                                                        onBlur={formik.handleBlur}
                                                        onChange={formik.handleChange}
                                                        value={formik.values.title}
                                                    />
                                                    <TextField
                                                        error={!!(formik.touched.alias && formik.errors.alias)}
                                                        fullWidth
                                                        helperText={formik.touched.alias && formik.errors.alias}
                                                        label="Tên không dấu"
                                                        name="alias"
                                                        onBlur={formik.handleBlur}
                                                        onChange={(e) => {
                                                            formik.handleChange(e);
                                                            setUrl(e.target.value);
                                                        }}
                                                        value={formik.values.alias}
                                                    />
                                                    <TextField
                                                        error={!!(formik.touched.category && formik.errors.category)}
                                                        fullWidth
                                                        label="Danh mục cấp 1"
                                                        name="category"
                                                        onBlur={formik.handleBlur}
                                                        onChange={formik.handleChange}
                                                        select
                                                        value={formik.values.category || ""}
                                                    >
                                                        {category &&
                                                            category
                                                                .map((item) => ({
                                                                    label: item.ten_vi,
                                                                    value: item.id,
                                                                }))
                                                                .map((option) => (
                                                                    <MenuItem key={option.value} value={option.value}>
                                                                        {option.label}
                                                                    </MenuItem>
                                                                ))}
                                                    </TextField>

                                                    <Grid container>
                                                        <Grid item xs={12} md={3} lg={2}>
                                                            <Stack direction="row" spacing={1} alignItems="center">
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: 14,
                                                                        fontWeight: 500,
                                                                        ml: 0.5,
                                                                    }}
                                                                >
                                                                    Ảnh hiện tại:
                                                                </Typography>
                                                                <FileUpload
                                                                    accept={{ "image/*": [] }}
                                                                    caption="(SVG, JPG, PNG, or gif maximum 900x400)"
                                                                    files={fileNow}
                                                                    onDrop={handleFileNowDrop}
                                                                    maxFiles={1}
                                                                />
                                                            </Stack>
                                                        </Grid>
                                                        <Grid item xs={12} md={9} lg={10}>
                                                            {fileNow.length > 0 && (
                                                                <FileView
                                                                    files={fileNow}
                                                                    onRemoveFile={handleFileNowRemove}
                                                                />
                                                            )}
                                                        </Grid>
                                                    </Grid>

                                                    <TextField
                                                        minRows={2}
                                                        multiline
                                                        error={!!(formik.touched.intro && formik.errors.intro)}
                                                        fullWidth
                                                        label="Mô tả"
                                                        name="intro"
                                                        onBlur={formik.handleBlur}
                                                        onChange={formik.handleChange}
                                                        value={formik.values.intro}
                                                    />

                                                    <div>
                                                        <Typography
                                                            color="text.secondary"
                                                            sx={{ mb: 2 }}
                                                            variant="subtitle2"
                                                        >
                                                            Nội dung
                                                        </Typography>
                                                        <TiptapEditor
                                                            contentEditor={contentEditor}
                                                            fileEditor={filesEditor}
                                                            onChangeContent={setContentEditor}
                                                            onUploadImage={handleUploadImageIntoEditor}
                                                            onDeleteImage={customHandleDeleteImage}
                                                            onChangeFile={setFilesEditor}
                                                            isCreate={create}
                                                            folder="baiviet"
                                                        />
                                                        {!!(
                                                            formik.touched.description && formik.errors.description
                                                        ) && (
                                                            <Box sx={{ mt: 2 }}>
                                                                <FormHelperText error>
                                                                    {formik.errors.description}
                                                                </FormHelperText>
                                                            </Box>
                                                        )}
                                                    </div>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent>
                                        <Grid container spacing={3} p={2}>
                                            <Grid item xs={12} md={3} lg={2} mb={2}>
                                                <Typography variant="h6">Nội dung SEO</Typography>
                                            </Grid>
                                            <Grid item xs={12} md={9} lg={10}>
                                                <Stack spacing={3}>
                                                    <TextField
                                                        error={!!(formik.touched.titleSeo && formik.errors.titleSeo)}
                                                        fullWidth
                                                        label="Tiêu đề"
                                                        name="titleSeo"
                                                        onBlur={formik.handleBlur}
                                                        onChange={formik.handleChange}
                                                        value={formik.values.titleSeo}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <Typography variant="body2" color="textSecondary">
                                                                        {formik.values.titleSeo.length} / 70
                                                                    </Typography>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                    <TextField
                                                        error={
                                                            !!(formik.touched.keywordSeo && formik.errors.keywordSeo)
                                                        }
                                                        fullWidth
                                                        label="Từ khoá"
                                                        name="keywordSeo"
                                                        onBlur={formik.handleBlur}
                                                        onChange={formik.handleChange}
                                                        value={formik.values.keywordSeo}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <Typography variant="body2" color="textSecondary">
                                                                        {formik.values.keywordSeo.length} / 70
                                                                    </Typography>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                    <TextField
                                                        minRows={2}
                                                        multiline
                                                        error={
                                                            !!(
                                                                formik.touched.descriptionSeo &&
                                                                formik.errors.descriptionSeo
                                                            )
                                                        }
                                                        fullWidth
                                                        label="Nội dung seo"
                                                        name="descriptionSeo"
                                                        onBlur={formik.handleBlur}
                                                        onChange={formik.handleChange}
                                                        value={formik.values.descriptionSeo}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <Typography variant="body2" color="textSecondary">
                                                                        {formik.values.descriptionSeo.length} / 160
                                                                    </Typography>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Stack>
                        </DialogContent>
                    </Scrollbar>

                    <DialogActions>
                        <Stack alignItems="center" direction="row" justifyContent="flex-end" spacing={1} mr={2}>
                            <Button color="inherit" onClick={handleCloseModalWithButton}>
                                Thoát
                            </Button>
                            <LoadingButton type="submit" variant="contained">
                                Lưu
                            </LoadingButton>
                        </Stack>
                    </DialogActions>
                </form>
            </Box>
        </Dialog>
    );
};

export default AdminModalGeneralDetail;
