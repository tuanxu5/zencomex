import { Box, Container, Grid, Typography, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import { useSelector } from "react-redux";
import { ToastMessage } from "../../../components/custom-toast";
import LazyLoadedImage from "../../../components/lazy-loaded-image";
import { Scrollbar } from "../../../components/scrollbar";
import SliderGeneral from "../../../sections/home/component/slide-general";
import axiosInstance, { BASE_URL } from "../../../utils/axios";
import ViewProductDescription from "./view-product-description";
import ShareButtons from "../../../components/shareButton";
import CardNewList from "../general/view-news-list";

const defaultBreadcrumb = [
    {
        id: 1,
        title: "Trang chủ",
        alias: "trang-chu",
    },
    {
        id: 2,
        title: "Sản phẩm",
        alias: "san-pham",
    },
];
const ViewProductDetail = (props) => {
    const [linkZalo, setLinkZalo] = useState("");
    const { overviewInfo } = useSelector((state) => state.information);

    useEffect(() => {
        if (!!overviewInfo && Object.keys(overviewInfo).length > 0) {
            const zalo = overviewInfo.socials.filter((i) => i.ten_vi === "Zalo");
            if (!!zalo) {
                setLinkZalo(zalo[0]?.noidung_vi);
            }
        }
    }, [overviewInfo]);
    const handleOpenZalo = () => {
        if (linkZalo !== "") {
            window.open(linkZalo, "_blank");
        } else {
            ToastMessage("Link Zalo đang chờ cập nhật", "warning", "bottom-right");
        }
    };
    const smDown = useMediaQuery((theme) => theme.breakpoints.down("sm"));

    const { data, setBreadcrumbsList } = props;
    const [productRelated, setProductRelated] = useState([]);
    const product = {
        name: data.title,
        price: data.price,
        description: data.intro,
        images: data.attach ? [data.image].concat(data.attach) : [data.image],
    };
    // Get products
    const checkId = () => {
        if (data) {
            if (data.parentChild) {
                return `&id_cat=${data.parentChild.id}`;
            }
            if (data.parent) {
                return `&id_list=${data.parent.id}`;
            }
        }
    };

    const getProductRelated = async () => {
        // Call API to get list product related
        try {
            const products = await axiosInstance.get(`/product/list?${checkId()}`);
            if (products && products.data && products.data.DT) {
                const newProducts = products.data.DT.map((item) => {
                    return {
                        id: item.id,
                        title: item.ten_vi,
                        price: item.price,
                        description: item.mota_vi,
                        image: item.photo,
                        alias: item.tenkhongdau,
                    };
                }).filter((item) => item.id !== data.id);
                setProductRelated(newProducts);
            }
        } catch (error) {
            console.log("error", error);
        }
    };

    // News
    const [news, setNews] = useState([]);
    const getNewsList = async () => {
        if (data) {
            try {
                const idCategory = data.parent ? data.parent.id : "";

                const response = await axiosInstance.get(`/general/tin-tuc?page=0&pageSize=10&category=${idCategory}`);
                if (response && response.data && response.data.DT) {
                    setNews(response.data.DT);
                }
            } catch (error) {
                console.log("error", error);
            }
        }
    };

    useEffect(() => {
        getProductRelated();
        setSelectedImageIndex(0);
        getNewsList();
    }, [data]);

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const changeBreadScrums = () => {
        setBreadcrumbsList(() => {
            if (data.parentChild) {
                return [
                    ...defaultBreadcrumb,
                    {
                        id: data.parent.id,
                        title: data.parent.title,
                        alias: data.parent.alias,
                        type: data.parent.type,
                    },
                    {
                        id: data.parentChild.id,
                        title: data.parentChild.title,
                        alias: data.parentChild.alias,
                        type: data.parentChild.type,
                    },
                    {
                        id: data.id,
                        title: data.title,
                        alias: data.alias,
                        type: data.type,
                    },
                ];
            } else {
                return [
                    ...defaultBreadcrumb,
                    {
                        id: data.parent.id,
                        title: data.parent.title,
                        alias: data.parent.alias,
                        type: data.parent.type,
                    },
                    {
                        id: data.id,
                        title: data.title,
                        alias: data.alias,
                        type: data.type,
                    },
                ];
            }
        });
    };

    useEffect(() => {
        changeBreadScrums();
    }, [data]);
    return (
        <>
            <Container maxWidth="lg" sx={{ marginTop: 2 }}>
                <Grid container spacing={4}>
                    {/* Thanh bên trái chứa ảnh */}
                    <Grid position={"relative"} item xs={12} sm={2.5} md={1.8} lg={1.3}>
                        <Scrollbar
                            sx={{
                                maxHeight: "60vh",
                                "&:hover::-webkit-scrollbar": {
                                    width: "4px", // Show the scrollbar on hover
                                    height: "4px", // Show the scrollbar on hover
                                },
                                width: smDown ? "100%" : 100,
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: smDown ? "rows" : "column",
                                    gap: 2,
                                }}
                            >
                                {product &&
                                    product.images?.map((image, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                overflow: "hidden",
                                                borderRadius: "4px",
                                                border:
                                                    selectedImageIndex === index
                                                        ? "3px solid #1976d2"
                                                        : "1px solid #ccc",
                                                cursor: "pointer",
                                                position: "relative",
                                            }}
                                            onMouseEnter={() => setSelectedImageIndex(index)}
                                        >
                                            <LazyLoadedImage
                                                src={index === 0 ? `/upload/product/${image}` : `/upload/${image}`}
                                                alt={image}
                                            />
                                        </Box>
                                    ))}
                            </Box>
                        </Scrollbar>
                    </Grid>

                    {/* Hình ảnh sản phẩm chính */}
                    <Grid item xs={12} sm={8} md={5} sx={{ position: "relative" }}>
                        <Box
                            sx={{
                                width: "100%",
                                paddingTop: "100%", // Tỷ lệ khung hình 4:3 (hoặc tỷ lệ khác nếu cần)
                                position: "relative",
                            }}
                        >
                            <Carousel
                                autoPlay={false}
                                index={selectedImageIndex}
                                onChange={(index) => setSelectedImageIndex(index)}
                                indicators={false}
                                sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                            >
                                {product.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={
                                            index !== 0
                                                ? `${BASE_URL}/upload/${image}`
                                                : `${BASE_URL}/upload/product/${image}`
                                        }
                                        alt={`Product Image ${index + 1}`}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                        }}
                                    />
                                ))}
                            </Carousel>
                        </Box>
                    </Grid>

                    {/* Chi tiết sản phẩm */}
                    <Grid item xs={12} md={5.2} lg={5.7}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            {product.name}
                        </Typography>
                        <Typography
                            variant="body"
                            sx={{
                                color: "red",
                                fontStyle: "italic",
                                cursor: "pointer",
                            }}
                            onClick={() => handleOpenZalo()}
                        >
                            {/* {product.price} */}
                            Liên hệ
                        </Typography>

                        <Typography fontStyle="italic" variant="body1" color="text.secondary" paragraph>
                            {product.description}
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container sx={{ pt: 4 }}>
                    <Grid item xs={12} md={news.length > 0 ? 8.5 : 12}>
                        <Box>
                            {data.description && <ViewProductDescription data={data.description} type="product" />}
                        </Box>
                        <Box mt={2}>
                            <ShareButtons url={`${process.env.NEXT_PUBLIC_API_URL}/${data.alias}`} title={data.title} />
                        </Box>
                    </Grid>
                    {news.length > 0 && (
                        <Grid item xs={12} md={3.5} sx={{ p: 1 }}>
                            <Box mt={1}>
                                <CardNewList news={news} />
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </Container>
            <Box
                p={2}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Box
                    width={180}
                    p={1}
                    sx={{
                        backgroundColor: "#E8E8E8",
                        margin: "24px 8px 8px 0px",
                        borderRadius: 1,
                    }}
                >
                    <Typography fontWeight={800} variant="h6" component="h2">
                        Sản phẩm liên quan
                    </Typography>
                </Box>
            </Box>
            <SliderGeneral generalList={productRelated} isProductRelated={true} />
        </>
    );
};

export default ViewProductDetail;
