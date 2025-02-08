import Head from "next/head";
import { Layout as AdminLayout } from "../../../layouts/dashboard";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import { FileUpload } from "../../../components/file-upload";
import { useCallback, useEffect, useState } from "react";
import { fileToBase64 } from "../../../utils/file-to-base64";
import { FileView } from "../../../components/file-view";
import { LoadingButton } from "@mui/lab";
import { ToastMessage } from "../../../components/custom-toast";
import axiosInstance from "../../../utils/axios";

const Page = () => {
    const getImagesPartner = async () => {
        try {
            const images = await axiosInstance.get("image/list?type=partner");
            if (images && images.data.DT) {
                setFilesPartner(images.data.DT);
            }
        } catch (error) {
            console.log("error", error);
        }
    };
    useEffect(() => {
        getImagesPartner();
    }, []);

    // files
    const [filesPartner, setFilesPartner] = useState([]);
    const [filesPartnerTemp, setFilesPartnerTemp] = useState([]);

    // Upload Image
    const handleImageDrop = useCallback(
        async (files) => {
            files.forEach(async (file) => {
                const data = await fileToBase64(file);
                setFilesPartnerTemp((prev) => [
                    ...prev,
                    { link: data, ten_vi: file.name, path: file.path, file: file, temp: true },
                ]);
            });
        },
        [filesPartnerTemp]
    );

    // Remove file
    const handleFileRemove = useCallback(
        (file) => {
            setFilesPartnerTemp((prev) => prev.filter((item) => item.path !== file.path));
        },
        [filesPartnerTemp]
    );

    // Remove all files
    const handleFilesAttachRemoveAll = useCallback(() => {
        setFilesPartnerTemp([]);
    }, [filesPartnerTemp]);

    const [loadingButton, setLoadingButton] = useState(false);
    const handleUpdateImageToBanner = async () => {
        setLoadingButton(true);
        const formData = new FormData();
        filesPartnerTemp.forEach((file) => {
            formData.append("files", file.file);
        });
        try {
            const upload = await axiosInstance.post(`/upload/folder?dir=partner&type=partner`, formData);
            if (upload && upload.data.DT) {
                ToastMessage("Cập nhật thành công", "success");
                getImagesPartner();
                setFilesPartnerTemp([]);
            }
        } catch (error) {
            console.log("error", error);
            ToastMessage("Cập nhật thất bại", "error");
        }
        setLoadingButton(false);
    };

    // album partner default
    const [loadingDelete, setLoadingDelete] = useState({ loading: false, index: -1 });
    const deleteImagePartner = async (file, index) => {
        setLoadingDelete({ loading: true, index: index });
        try {
            const res = await axiosInstance.post(`/upload/folder/delete`, {
                link: [file.link],
            });

            if (res && res.data.DT) {
                ToastMessage("Xoá ảnh thành công", "success");
                getImagesPartner();
            }
        } catch (error) {}

        setFilesPartner((prevFiles) => prevFiles.filter((item) => item.id !== file.id));
        setLoadingDelete({ loading: false, index: -1 });
    };

    return (
        <>
            <Head>
                <title>Partner</title>
            </Head>
            <Box component="main" p={4}>
                <Container maxWidth="xl">
                    <Box>
                        <h1>Đối tác</h1>
                        <Grid container>
                            <Grid item xs={12} md={3} lg={2}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Typography fontWeight={700}>Tải ảnh lên: </Typography>

                                    <FileUpload
                                        accept={{ "image/*": [] }}
                                        caption="(SVG, JPG, PNG, or gif maximum 900x400)"
                                        files={filesPartnerTemp}
                                        onDrop={handleImageDrop}
                                        multiple={true}
                                    />
                                </Stack>
                                {filesPartnerTemp.length > 0 && (
                                    <LoadingButton
                                        loading={loadingButton}
                                        onClick={handleUpdateImageToBanner}
                                        sx={{ height: 50, width: 120, backgroundColor: "#BBDEFB", mt: 2 }}
                                    >
                                        Cập nhật
                                    </LoadingButton>
                                )}
                            </Grid>
                            <Grid item xs={12} md={9} lg={10}>
                                {filesPartnerTemp.length > 0 && (
                                    <FileView
                                        files={filesPartnerTemp}
                                        onRemoveFile={handleFileRemove}
                                        onRemoveFileAll={handleFilesAttachRemoveAll}
                                    />
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                    <Box mt={4}>
                        <h1>Danh sách đối tác hiện tại: </h1>
                        <FileView
                            files={filesPartner}
                            onRemoveFile={deleteImagePartner}
                            loadingButton={loadingDelete}
                        />
                    </Box>
                </Container>
            </Box>
        </>
    );
};

Page.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default Page;
