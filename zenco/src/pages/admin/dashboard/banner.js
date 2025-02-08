import { Box, Button, Card, CardMedia, Unstable_Grid2 as Grid, Stack, TextField, Typography } from "@mui/material";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { usePageView } from "../../../hooks/use-page-view";
import { Layout as DashboardLayout } from "../../../layouts/dashboard";

//File
import { FileDropzone } from "../../../components/file-dropzone";
import { fileToBase64 } from "../../../utils/file-to-base64";
const initialCover = "/assets/covers/abstract-1-4x3-large.png";

//icon
import BorderColorIcon from "@mui/icons-material/BorderColor";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

///
import { LoadingButton } from "@mui/lab";
import toast from "react-hot-toast";
import axiosInstance, { BASE_URL } from "../../../utils/axios";
import { FileUpload } from "../../../components/file-upload";
import { FileView } from "../../../components/file-view";
import { ToastMessage } from "../../../components/custom-toast";

const Page = () => {
    const [images, setImages] = useState([]);
    const [albumBaner, setAlbumBanner] = useState([]);
    const [coverImage, setCoverImage] = useState([]);
    const [coverImageTemp, setCoverImageTemp] = useState([]);

    usePageView();

    // Upload Image
    const handleImageDrop = useCallback(
        async (files) => {
            files.forEach(async (file) => {
                const data = await fileToBase64(file);
                setImages((prev) => [...prev, { data, file }]);
            });
        },
        [images]
    );

    // Loading Button
    const [loadingButton, setLoadingButton] = useState(false);

    // uplaod image to banner
    const handleUpdateImageToBanner = async () => {
        setLoadingButton(true);
        const formData = new FormData();
        for (const file of images) {
            formData.append("files", file.file);
        }
        const upload = await axiosInstance.post("/upload/folder?dir=banners&type=banner", formData);
        if (upload && upload.data.DT) {
            setImages([]);
            let dem = 0;
            const data = upload.data.DT.map((banner) => {
                dem = dem + 1;
                return {
                    id: banner.id,
                    data: {
                        stt: albumBaner.length + dem,
                    },
                };
            });
            const result = await axiosInstance.put("/home/slides/update", {
                data,
            });
            if (result.data.DT) {
                toast.success("Upload thành công", 2000);
            }

            getBanner();
        } else {
            toast.error("Upload thất bại", 2000);
        }
        setLoadingButton(false);
    };

    //remove image
    const handleRemoveImage = (index) => {
        const newImages = [...images].filter((_, i) => i !== index);
        setImages(newImages);
    };

    //remove banner
    const handleRemoveBanner = async (banner) => {
        try {
            const res = await axiosInstance.post(`/upload/folder/delete`, {
                link: [banner.link],
            });
            if (res && res.data.DT) {
                toast.success("Xóa thành công", 2000);
                getBanner();
            } else {
                toast.error("Xóa thất bại", 2000);
            }
        } catch (error) {
            ToastMessage("Đã xảy ra lỗi", "error");
        }
    };

    //update banner
    const [isUpdate, setIsUpdate] = useState(false);
    const handleOnchangeSTT = (e, id) => {
        const newBanner = [...albumBaner].map((banner) => {
            if (banner.id === id) {
                banner.stt = e.target.value;
            }
            return banner;
        });
        setAlbumBanner(newBanner);
    };

    const handleUpdateBanner = async () => {
        setLoadingButton(true);
        const data = albumBaner.map((banner) => {
            return {
                id: banner.id,
                data: {
                    stt: banner.stt,
                },
            };
        });
        const result = await axiosInstance.put("/home/slides/update", {
            data,
        });
        if (result && result.data.DT) {
            toast.success("Cập nhật thành công", 2000);
            setIsUpdate(false);
            getBanner();
        } else {
            toast.error("Cập nhật thất bại", 2000);
        }
        setLoadingButton(false);
    };

    //get banner
    const getBanner = async () => {
        const result = await axiosInstance.get("/home/slides");
        if (result && result.data.DT) {
            setAlbumBanner(result.data.DT);
        }
    };

    const getCover = async () => {
        const result = await axiosInstance.get("/image/list?type=cover");
        if (result.data.DT) {
            setCoverImage(result.data.DT);
        }
    };

    // Cover Image
    const handleCoverImageDrop = useCallback(
        async (files) => {
            const file = files[0];
            const data = await fileToBase64(file);
            setCoverImageTemp([{ link: data, ten_vi: file.name, path: file.path, file: file, temp: true }]);
        },
        [coverImageTemp]
    );

    // Remove cover image temp
    const handleCoverImageRemove = useCallback(() => {
        setCoverImageTemp([]);
    }, [coverImageTemp]);

    // upload cover image temp
    const handleUploadCoverImage = async () => {
        setLoadingButton(true);
        try {
            if (coverImage.length > 0) {
                await axiosInstance.post(`/upload/folder/delete`, {
                    link: [coverImage[0].link],
                });
            }
            const formData = new FormData();
            formData.append("files", coverImageTemp[0].file);
            const upload = await axiosInstance.post("/upload/folder?dir=cover&type=cover", formData);
            if (upload && upload.data.DT) {
                ToastMessage("Cập nhật ảnh bìa thành công", "success");
                setCoverImageTemp([]);
            } else {
                ToastMessage("Cập nhật ảnh bìa thất bại", "error");
            }
            getCover();
            setLoadingButton(false);
        } catch (error) {
            ToastMessage("Đã xảy ra lỗi", "error");
            setLoadingButton(false);
        }
    };

    // Call API
    useEffect(() => {
        getBanner();
        getCover();
    }, []);

    return (
        <>
            <Head>
                <title>Banner</title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8,
                }}
            >
                <Grid container>
                    <Grid xs={3} sx={{ alignContent: "center" }}>
                        <Stack alignItems="center">
                            <FileDropzone
                                accept={{ "image/*": [] }}
                                onDrop={handleImageDrop}
                                caption="(SVG, JPG, PNG)"
                            />
                            {images.length > 0 && (
                                <LoadingButton
                                    loading={loadingButton}
                                    onClick={handleUpdateImageToBanner}
                                    sx={{ height: 50, width: 120, backgroundColor: "#00FF66" }}
                                >
                                    Cập nhật
                                </LoadingButton>
                            )}
                        </Stack>
                    </Grid>

                    <Grid xs={9}>
                        <Grid container spacing={2}>
                            {images.map((image, index) => (
                                <Grid columns={{ xs: 6, xl: 4, lg: 3 }} sx={{ position: "relative" }} key={index + 1}>
                                    <Card>
                                        <CardMedia
                                            image={image.data || initialCover}
                                            title="Image Title"
                                            sx={{
                                                height: 230,
                                                width: 330,
                                                borderRadius: 5,
                                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                            }}
                                        />
                                    </Card>
                                    <RemoveCircleIcon
                                        sx={{
                                            color: "red",
                                            position: "absolute",
                                            top: 2,
                                            right: 1,
                                            cursor: "pointer",
                                            "&:hover": {
                                                backgroundColor: "action.hover",
                                                cursor: "pointer",
                                                opacity: 0.8,
                                            },
                                            fontSize: 30,
                                        }}
                                        onClick={() => handleRemoveImage(index)}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
                <Box p={2}>
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <h2>Album Banner</h2>
                        <BorderColorIcon
                            onClick={() => setIsUpdate(!isUpdate)}
                            fontSize="medium"
                            sx={{
                                color: `${isUpdate ? "red" : "black"}`,
                                cursor: "pointer",
                                "&:hover": {
                                    cursor: "pointer",
                                    color: !isUpdate ? "red" : "black",
                                },
                            }}
                        />
                        {isUpdate && (
                            <>
                                <LoadingButton
                                    loading={loadingButton}
                                    onClick={handleUpdateBanner}
                                    sx={{ height: 50, width: 120 }}
                                >
                                    Cập nhật
                                </LoadingButton>
                            </>
                        )}
                    </Stack>
                    <Grid container spacing={2}>
                        {albumBaner.map((banner, index) => (
                            <Grid
                                columns={{ xs: 6, xl: 3, lg: 3 }}
                                sx={{
                                    position: "relative",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                key={banner.id}
                            >
                                <Card
                                    sx={{
                                        height: 230,
                                        width: 330,
                                        borderRadius: 5,
                                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                    }}
                                >
                                    <img
                                        src={`${BASE_URL}/upload/${banner.link}` || initialCover}
                                        style={{
                                            objectFit: "cover",
                                            objectPosition: "center",
                                            width: "100%",
                                            height: "100%",
                                        }}
                                    />
                                </Card>

                                {isUpdate && (
                                    <>
                                        {/* edit number show */}
                                        <TextField
                                            label="STT"
                                            type="number"
                                            value={banner.stt}
                                            // InputLabelProps={{
                                            //   shrink: true,
                                            // }}
                                            sx={{
                                                width: 70,
                                                ml: 1,
                                            }}
                                            onChange={(e) => handleOnchangeSTT(e, banner.id)}
                                        />
                                        {/* Delete Banner */}
                                        <RemoveCircleIcon
                                            sx={{
                                                color: "red",
                                                position: "absolute",
                                                top: 2,
                                                right: 70,
                                                cursor: "pointer",
                                                "&:hover": {
                                                    backgroundColor: "action.hover",
                                                    cursor: "pointer",
                                                    opacity: 0.8,
                                                },
                                                fontSize: 30,
                                            }}
                                            onClick={() => handleRemoveBanner(banner)}
                                        />
                                    </>
                                )}
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Box p={2} mb={16}>
                    <Stack spacing={2} direction="row" display="flex" alignItems="center">
                        <Typography variant="h4">Ảnh bìa chính</Typography>
                        <FileUpload
                            accept={{ "image/*": [] }}
                            caption="(SVG, JPG, PNG, or gif maximum 900x400)"
                            files={coverImageTemp}
                            onDrop={handleCoverImageDrop}
                        />
                        {coverImageTemp.length > 0 && (
                            <FileView files={coverImageTemp} onRemoveFile={handleCoverImageRemove} />
                        )}
                        {coverImageTemp.length > 0 && (
                            <LoadingButton
                                loading={loadingButton}
                                sx={{
                                    backgroundColor: "#BBDEFB",
                                    "&:hover": {
                                        backgroundColor: "green",
                                        color: "white",
                                    },
                                }}
                                onClick={handleUploadCoverImage}
                            >
                                Cập nhật
                            </LoadingButton>
                        )}
                    </Stack>
                    {coverImage.length > 0 && (
                        <Box
                            component={"img"}
                            src={`${BASE_URL}/upload/${coverImage[0]?.link}`}
                            mt={2}
                            width={"100%"}
                            height={200}
                            sx={{
                                objectFit: "cover",
                                objectPosition: "center",
                            }}
                        />
                    )}
                </Box>
            </Box>
        </>
    );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
