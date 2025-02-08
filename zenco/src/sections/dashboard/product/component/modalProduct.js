"use client";
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

import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { FileUpload } from "../../../../components/file-upload";
import { FileView } from "../../../../components/file-view";
import FroalaEditorWrapper from "../../../../components/froala-editor";
import axiosInstance, { BASE_URL } from "../../../../utils/axios";

//icon
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import WarningIcon from "@mui/icons-material/Warning";
import { ToastMessage } from "../../../../components/custom-toast";
import LoadingChildScreen from "../../../../components/loading-child-screen";
import { Scrollbar } from "../../../../components/scrollbar";
import useDebounce from "../../../../hooks/use-debounce";
import { getListImages } from "../../../../services/product-service";
import TiptapEditor from "../../../../components/tiptap/tiptapEditor";

const validationSchema = Yup.object({
    name: Yup.string().max(255).required("Tên không được để trống"),
    alias: Yup.string().max(255).required("Tên không dấu không được để trống"),
});

const ModalProduct = ({
    product = {},
    category,
    childCategory,
    onClose,
    open,
    type,
    create = false,
    onSubmitted,
    onSubmittedUpdate,
    onChangeCategorySelected,
}) => {
    // check
    const checkEdit = () => {
        switch (type) {
            case "category":
                return "danh mục cấp 1";
            case "childCategory":
                return "danh mục cấp 2";
            case "product":
                return "sản phẩm";
            default:
                return "";
        }
    };

    //--------------- STATE ---------------//

    // loading
    const [loading, setLoading] = useState(false);

    // files
    const [filesAttach, setFilesAttach] = useState([]);
    // state save files attach deleted to Rollback
    const [filesAttachTemp, setFilesAttachTemp] = useState([]);
    // file now
    const [fileNow, setFileNow] = useState([]);
    // state save file now deleted to Rollback
    const [fileNowTemp, setFileNowTemp] = useState([]);

    // files editor
    const [filesEditor, setFilesEditor] = useState([]);

    // state save files editor deleted to Rollback
    const [filesEditorTemp, setFilesEditorTemp] = useState([]);

    // froala editor
    const [contentEditor, setContentEditor] = useState("");

    //check url
    const [url, setUrl] = useState("");

    const initialValues = create
        ? {
              category: "",
              childCategory: "",
              description: "",
              descriptionProduct: "",
              imageEditor: [], // Ảnh trong editor
              imageProductNow: [], // Ảnh hiển thị của sản phẩm
              imageProductAttach: [], // Ảnh đính kèm của sản phẩm
              name: "",
              submit: null,
              titleSeo: "",
              keywordsSeo: "",
              descriptionSeo: "",
              codeProduct: "",
              price: "",
              alias: "",
          }
        : {
              category: product?.id_list || "",
              childCategory: product?.id_cat || "",
              description: type === "product" ? product?.noidung_vi : product?.mota_vi || "",
              descriptionProduct: product?.mota_vi || "",
              imageEditor: filesEditor || [],
              imageProductNow: fileNow || [], // Ảnh hiển thị của sản phẩm
              imageProductAttach: filesAttach || [],
              name: product?.ten_vi || "",
              submit: null,
              titleSeo: product.title || "",
              keywordsSeo: product.keywords || "",
              descriptionSeo: product.description || "",
              codeProduct: product?.masp || "",
              price: product?.giaban || "",
              alias: product?.tenkhongdau || "",
          };

    // --------------- file attach ---------------- //

    const handleFilesAttachDrop = useCallback(async (newFiles) => {
        setLoading(true);
        const formData = new FormData();
        newFiles.forEach((file) => {
            formData.append("files", file);
        });
        const id = localStorage.getItem("idProduct");
        const checkId = id ? id : 0;
        try {
            const upload = await axiosInstance.post(
                `/upload/folder?dir=images&type=${type}_attach&id=${checkId}`,
                formData
            );
            if (upload && upload.data.DT) {
                if (create) {
                    setFilesAttach([...upload.data.DT]);
                } else {
                    setFilesAttach((prevFiles) => [...prevFiles, ...upload.data.DT]);
                }
                ToastMessage("Tải ảnh lên thành công!", "success");
                setLoading(false);
            }
        } catch (error) {
            ToastMessage("Có lỗi xảy ra khi tải ảnh lên!", "error");
            setLoading(false);
        }
    }, []);

    const handleFileAttachRemove = useCallback(async (file) => {
        if (create) {
            try {
                const res = await axiosInstance.post("/upload/folder/delete", {
                    link: [file.link],
                });
                if (res && res.data.DT) {
                    ToastMessage("Xóa thành công", "success");
                    setFilesAttach((pre) => pre.filter((i) => i.link !== file.link));
                }
            } catch (error) {
                ToastMessage("Xóa Thất bại", "error");
            }
        } else {
            const body = {
                isdelete: true,
                deleted_at: new Date().toISOString(),
            };
            try {
                const res = await axiosInstance.post(`/image/update/${file.id}`, { body });
                if (res && res.data) {
                    setFilesAttach((prevFiles) => prevFiles.filter((item) => item.id !== file.id));
                    ToastMessage("Xóa ảnh thành công!", "success");
                }
            } catch (error) {
                ToastMessage("Có lỗi xảy ra khi xóa ảnh!", "error");
            }
        }
    }, []);

    // -------------------File Now---------------------//

    const handleFileNowDrop = useCallback(async (newFiles) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("files", newFiles[0]);
        const id = localStorage.getItem("idProduct");
        const checkId = id ? id : 0;
        try {
            const upload = await axiosInstance.post(
                `/upload/folder?dir=product&type=${type}_now&id=${checkId}`,
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

    const handleFilesAttachRemoveAll = useCallback(async () => {
        if (create) {
            try {
                if (filesAttach.length > 0) {
                    const res = await axiosInstance.post("/upload/folder/delete", {
                        link: filesAttach.map((i) => i.link),
                    });
                    if (res && res.data.DT) {
                        ToastMessage("Xóa thành công", "success");
                        setFilesAttach([]);
                    }
                }
            } catch (error) {
                ToastMessage("Xóa Thất bại", "error");
            }
        } else {
            const body = {
                isdelete: true,
                deleted_at: new Date().toISOString(),
            };
            try {
                filesAttach.forEach(async (item) => {
                    const res = await axiosInstance.post(`/image/update/${item.id}`, { body });
                    if (res && res.data) {
                        setFilesAttach([]);
                        ToastMessage("Xóa ảnh thành công!", "success");
                    }
                });
            } catch (error) {
                ToastMessage("Có lỗi xảy ra khi xóa ảnh!", "error");
            }
        }
    }, [filesAttach]);

    // --------------- florala editor ---------------- //
    const handleUploadImageIntoEditor = async (image, alt, title, editor) => {
        if (image) {
            const formData = new FormData();
            formData.append("files", image);
            const checkId = product ? product.id : 0;
            try {
                const upload = await axiosInstance.post(
                    `/upload/folder?dir=product/editor&type=${type}_editor&id=${checkId}`,
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

    // delete image in editor
    // check close modal with event onChange or Button Close
    const customHandleDeleteImage = async (image) => {
        if (image.length > 0) {
            const extractedPaths = image.map((url) => url.split("/upload/")[1]);
            const body = {
                link: extractedPaths,
                id_vitri: product ? product.id : 0,
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
    //close modal with event onChange
    const handleCloseModal = () => {
        if (create) {
            if (JSON.stringify(formik.values) === JSON.stringify(initialValues)) {
                onClose();
            } else {
                toast.error("Bạn chưa lưu thay đổi", {
                    icon: <WarningIcon color="warning" />,
                    position: "top-right",
                    duration: 1000,
                });
            }
        } else {
            ToastMessage("Dữ liệu chưa được lưu!", "warning");
        }
    };
    //close modal with Button Close
    const handleCloseModalWithButton = async () => {
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
            if (JSON.stringify(filesAttach) !== JSON.stringify(filesAttachTemp)) {
                const deletedItems = filesAttachTemp.filter(
                    (itemB) => !filesAttach.some((itemA) => itemA.id === itemB.id)
                );
                const addedItems = filesAttach.filter(
                    (itemA) => !filesAttachTemp.some((itemB) => itemB.id === itemA.id)
                );
                if (deletedItems.length > 0) {
                    deletedItems.forEach(async (item) => {
                        const body = {
                            link: [item.link],
                            id_vitri: checkId,
                            data: {
                                isdelete: false,
                                deleted_at: "",
                            },
                            type: `${type}_attach`,
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
                            id_vitri: checkId,
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
            if (filesAttach.length > 0) {
                try {
                    await axiosInstance.post("/upload/folder/delete", {
                        link: filesAttach.map((item) => item.link),
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

        setLoading(true);
        setFilesAttach;
        setContentEditor("");
        setFileNow([]);
        setFileNowTemp([]);
        setFilesEditor([]);
        setFilesEditorTemp([]);
        setFilesAttach([]);
        setFilesAttachTemp([]);
        onClose();
        formik.resetForm();
        setLoading(false);
    };

    // formik
    const formik = useFormik({
        initialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values, helpers) => {
            const newData = {
                ...values,
                description: contentEditor,
                imageEditor: filesEditor,
                imageProductNow: fileNow,
                imageProductAttach: filesAttach,
            };
            const data = {
                ten_vi: newData.name,
                masp: newData.codeProduct,
                giaban: parseInt(newData.price) || 0,
                mota_vi: `${type === "product" ? newData.descriptionProduct : newData.description}`,
                noidung_vi: newData.description,
                id_list: newData.category !== "" ? parseInt(newData.category) : 0,
                id_cat: newData.childCategory !== "" ? parseInt(newData.childCategory) : 0,
                tenkhongdau: newData.alias,
                title: newData.titleSeo,
                keywords: newData.keywordsSeo,
                description: newData.descriptionSeo,
                imageEditor: newData.imageEditor,
                imageProductNow: newData.imageProductNow,
                imageProductAttach: newData.imageProductAttach,
            };
            if (type === "product") {
                if (newData.imageProductNow.length > 0) {
                    data.photo = newData.imageProductNow[0].photo_vi;
                }
            }

            try {
                setLoading(true);
                // NOTE: Make API request
                if (create) {
                    if (fileNow.length === 0 && type === "product") {
                        ToastMessage("Bạn chưa thêm ảnh hiện tại", "warning");
                    } else {
                        const res = onSubmitted(data);
                        if (res) {
                            ToastMessage("Tạo mới thành công!", "success");
                            setTimeout(() => {
                                onClose();
                                formik.resetForm();
                                setFilesAttach([]);
                                setFileNow([]);
                                setFilesEditor([]);
                                setContentEditor("");
                                setLoading(false);
                            }, 1000);
                        } else {
                            ToastMessage("Tạo mới thất bại!", "error");
                        }
                    }
                } else {
                    const initData = {
                        ten_vi: initialValues.name,
                        masp: initialValues.codeProduct,
                        giaban: initialValues.price,
                        mota_vi: `${type === "product" ? initialValues.descriptionProduct : initialValues.description}`,
                        noidung_vi: initialValues.description,
                        id_list: initialValues.category,
                        id_cat: initialValues.childCategory,
                        tenkhongdau: initialValues.alias,
                        title: initialValues.titleSeo,
                        keywords: initialValues.keywordsSeo,
                        description: initialValues.descriptionSeo,
                    };
                    const doneData = {
                        ten_vi: values.name,
                        masp: values.codeProduct,
                        giaban: values.price,
                        mota_vi: `${type === "product" ? values.descriptionProduct : values.description}`,
                        noidung_vi: values.description,
                        id_list: values.category,
                        id_cat: values.childCategory,
                        tenkhongdau: values.alias,
                        title: values.titleSeo,
                        keywords: values.keywordsSeo,
                        description: values.descriptionSeo,
                    };
                    const checkImageEditor = JSON.stringify(filesEditor) !== JSON.stringify(filesEditorTemp);
                    const checkImageNow = JSON.stringify(fileNow) !== JSON.stringify(fileNowTemp);
                    const checkImageAttach = JSON.stringify(filesAttach) !== JSON.stringify(filesAttachTemp);
                    if (
                        JSON.stringify(initData) !== JSON.stringify(doneData) ||
                        checkImageEditor ||
                        checkImageNow ||
                        checkImageAttach
                    ) {
                        const res = onSubmittedUpdate(data, product.id);
                        if (res) {
                            toast.success("Cập nhật thành công!", {
                                icon: <DoneOutlineIcon color="success" />,
                                position: "top-right",
                            });
                            setTimeout(() => {
                                localStorage.setItem("isModalClosing", "true");
                                localStorage.setItem("typeModal", create ? "create" : "update");
                                onClose();
                                formik.resetForm();
                                setFilesAttach([]);
                                setFileNow([]);
                                setFilesEditor([]);
                                setContentEditor("");
                                setFilesEditorTemp([]);
                                setFilesAttachTemp([]);
                                setFileNowTemp([]);
                                setLoading(false);
                                setTimeout(() => {
                                    localStorage.removeItem("isModalClosing");
                                    localStorage.removeItem("typeModal");
                                }, 300);
                            }, 1000);
                        }
                    } else {
                        ToastMessage("Không có thay đổi để cập nhật!", "warning");
                        setLoading(false);
                    }
                }

                setLoading(false);
            } catch (err) {
                console.error(err);
                toast.error("Something went wrong!");
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
                setLoading(false);
            }
        },
    });

    useEffect(() => {
        formik.setFieldValue("imageEditor", filesEditor);
        formik.setFieldValue("imageProductNow", fileNow);
        formik.setFieldValue("imageProductAttach", filesAttach);
    }, [fileNow, filesAttach, filesEditor]);

    useEffect(() => {
        formik.setFieldValue("description", contentEditor);
    }, [contentEditor]);

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
            const imageAttach = images
                .filter((item) => item.type === `${type}_attach` && item.isdelete !== true)
                .map((item) => item);
            let Fisrt = true;
            if (imageEditor.length > 0) {
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
            if (imageAttach.length > 0) {
                let Fisrt = true;
                setFilesAttach(imageAttach);
                if (Fisrt) {
                    setFilesEditorTemp(imageEditor);
                    setFileNowTemp(imageNow);
                    setFilesAttachTemp(imageAttach);
                    Fisrt = false;
                }
            }
        }
    };

    // check type to render froala editor
    useEffect(() => {
        if (!create) {
            if (open) {
                getImages(product?.id);
                setContentEditor(type === "product" ? product?.noidung_vi : product?.mota_vi);
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
                    width: "80vw", // Chiều rộng của hộp thoại là 60% chiều rộng viewport
                    maxWidth: "none", // Bỏ qua các thiết lập maxWidth mặc định
                },
                "& .MuiDialog-paper > div": {
                    overflow: "auto", // Cuộn nội dung
                },
            }}
            open={open}
            onClose={handleCloseModal}
        >
            {loading && <LoadingChildScreen />}
            <form onSubmit={formik.handleSubmit}>
                <DialogTitle>
                    <Typography fontSize={30} fontWeight={700}>
                        {create ? "Tạo mới" : "Chỉnh sửa"} {checkEdit()}
                    </Typography>
                </DialogTitle>

                <DialogContent>
                    <Scrollbar
                        autoHide={false}
                        sx={{
                            height: "70vh",
                        }}
                    >
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
                                                    error={!!(formik.touched.name && formik.errors.name)}
                                                    fullWidth
                                                    helperText={formik.touched.name && formik.errors.name}
                                                    label="Tên"
                                                    name="name"
                                                    onBlur={formik.handleBlur}
                                                    onChange={formik.handleChange}
                                                    value={formik.values.name}
                                                />
                                                <TextField
                                                    error={!!(formik.errors.alias && formik.touched.alias)}
                                                    fullWidth
                                                    helperText={
                                                        formik.errors.alias && formik.touched.alias
                                                            ? formik.errors.alias
                                                            : ""
                                                    }
                                                    label="Tên không dấu"
                                                    name="alias"
                                                    onBlur={formik.handleBlur}
                                                    onChange={(e) => {
                                                        formik.handleChange(e);
                                                        setUrl(e.target.value);
                                                    }}
                                                    value={formik.values.alias}
                                                />

                                                {type === "product" && (
                                                    <>
                                                        <TextField
                                                            error={!!(formik.touched.name && formik.errors.name)}
                                                            fullWidth
                                                            helperText={formik.touched.name && formik.errors.name}
                                                            label="Mã sản phẩm"
                                                            name="codeProduct"
                                                            onBlur={formik.handleBlur}
                                                            onChange={formik.handleChange}
                                                            value={formik.values.codeProduct}
                                                        />
                                                        <TextField
                                                            type="number"
                                                            error={!!(formik.touched.name && formik.errors.name)}
                                                            fullWidth
                                                            helperText={formik.touched.name && formik.errors.name}
                                                            label="Giá sản phẩm"
                                                            name="price"
                                                            onBlur={formik.handleBlur}
                                                            onChange={formik.handleChange}
                                                            value={formik.values.price}
                                                            inputProps={{ min: 0 }}
                                                        />
                                                        <TextField
                                                            minRows={2}
                                                            multiline
                                                            error={
                                                                !!(
                                                                    formik.touched.description &&
                                                                    formik.errors.description
                                                                )
                                                            }
                                                            fullWidth
                                                            label="Mô tả"
                                                            name="descriptionProduct"
                                                            onBlur={formik.handleBlur}
                                                            onChange={formik.handleChange}
                                                            value={formik.values.descriptionProduct}
                                                        />
                                                        <TextField
                                                            error={
                                                                !!(formik.touched.category && formik.errors.category)
                                                            }
                                                            fullWidth
                                                            label="Danh mục cấp 1"
                                                            name="category"
                                                            onBlur={formik.handleBlur}
                                                            onChange={(e) => {
                                                                formik.handleChange(e);
                                                                onChangeCategorySelected(e.target.value);
                                                            }}
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
                                                                        <MenuItem
                                                                            key={option.value}
                                                                            value={option.value}
                                                                        >
                                                                            {option.label}
                                                                        </MenuItem>
                                                                    ))}
                                                        </TextField>
                                                        <TextField
                                                            error={
                                                                !!(
                                                                    formik.touched.childCategory &&
                                                                    formik.errors.childCategory
                                                                )
                                                            }
                                                            fullWidth
                                                            label="Danh mục cấp 2"
                                                            name="childCategory"
                                                            onBlur={formik.handleBlur}
                                                            onChange={formik.handleChange}
                                                            select
                                                            value={formik.values.childCategory || ""}
                                                        >
                                                            {childCategory &&
                                                                childCategory
                                                                    .map((item) => ({
                                                                        label: item.ten_vi,
                                                                        value: item.id,
                                                                    }))
                                                                    .map((option) => (
                                                                        <MenuItem
                                                                            key={option.value}
                                                                            value={option.value}
                                                                        >
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
                                                                        Ảnh đính kèm:
                                                                    </Typography>
                                                                    <FileUpload
                                                                        accept={{ "image/*": [] }}
                                                                        caption="(SVG, JPG, PNG, or gif maximum 900x400)"
                                                                        files={filesAttach}
                                                                        onDrop={handleFilesAttachDrop}
                                                                    />
                                                                </Stack>
                                                            </Grid>
                                                            <Grid item xs={12} md={9} lg={10}>
                                                                {filesAttach.length > 0 && (
                                                                    <FileView
                                                                        files={filesAttach}
                                                                        onRemoveFile={handleFileAttachRemove}
                                                                        onRemoveFileAll={handleFilesAttachRemoveAll}
                                                                    />
                                                                )}
                                                            </Grid>
                                                        </Grid>
                                                    </>
                                                )}

                                                {type === "childCategory" && (
                                                    <>
                                                        <TextField
                                                            error={
                                                                !!(formik.touched.category && formik.errors.category)
                                                            }
                                                            fullWidth
                                                            label="Danh mục cấp 1"
                                                            name="category"
                                                            onBlur={formik.handleBlur}
                                                            onChange={formik.handleChange}
                                                            select
                                                            value={formik.values.category}
                                                        >
                                                            {category &&
                                                                category
                                                                    .map((item) => ({
                                                                        label: item.ten_vi,
                                                                        value: item.id,
                                                                    }))
                                                                    .map((option) => (
                                                                        <MenuItem
                                                                            key={option.value}
                                                                            value={option.value}
                                                                        >
                                                                            {option.label}
                                                                        </MenuItem>
                                                                    ))}
                                                        </TextField>
                                                    </>
                                                )}

                                                <div>
                                                    <Typography
                                                        color="text.secondary"
                                                        sx={{ mb: 2 }}
                                                        variant="subtitle2"
                                                    >
                                                        {type === "product" ? "Nội dung" : "Mô tả"}
                                                    </Typography>
                                                    <TiptapEditor
                                                        contentEditor={contentEditor}
                                                        fileEditor={filesEditor}
                                                        onChangeContent={setContentEditor}
                                                        onUploadImage={handleUploadImageIntoEditor}
                                                        onDeleteImage={customHandleDeleteImage}
                                                        onChangeFile={setFilesEditor}
                                                        isCreate={create}
                                                        folder={"product"}
                                                    />
                                                    {!!(formik.touched.description && formik.errors.description) && (
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
                                                    error={!!(formik.touched.keywordsSeo && formik.errors.keywordsSeo)}
                                                    fullWidth
                                                    label="Từ khoá"
                                                    name="keywordsSeo"
                                                    onBlur={formik.handleBlur}
                                                    onChange={formik.handleChange}
                                                    value={formik.values.keywordsSeo}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <Typography variant="body2" color="textSecondary">
                                                                    {formik.values.keywordsSeo.length} / 70
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
                    </Scrollbar>
                </DialogContent>

                <DialogActions>
                    <Stack alignItems="center" direction="row" justifyContent="flex-end" spacing={1} sx={{ m: 2 }}>
                        <Button color="inherit" onClick={handleCloseModalWithButton}>
                            Thoát
                        </Button>
                        <LoadingButton type="submit" variant="contained">
                            Lưu
                        </LoadingButton>
                    </Stack>
                </DialogActions>
            </form>
        </Dialog>
    );
};
export default ModalProduct;
