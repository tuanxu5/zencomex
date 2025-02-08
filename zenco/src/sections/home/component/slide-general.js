import { Box, Card, Stack, styled, Typography, useMediaQuery } from "@mui/material";
import Slider from "react-slick";
import { isValidUrl } from "./card-product";
import NextLink from "next/link";
import { paths } from "../../../paths";
import LazyLoadedImage from "../../../components/lazy-loaded-image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BoxEmpty } from "../../../components/view-layout/box-empty";

const SliderGeneral = ({ generalList, setting, isProductRelated }) => {
    const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
    const smUp = useMediaQuery((theme) => theme.breakpoints.up("sm"));

    // Cài đặt slider
    const settingsSlide = {
        dots: false,
        infinite: generalList.length > 6 || setting,
        speed: 500,
        slidesToShow: setting ? (lgUp ? 3 : 2) : 6,
        rows: setting ? 2 : 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: setting ? 1500 : 2000,
        draggable: setting ? true : generalList.length >= 6,
        swipeToSlide: setting ? true : generalList.length >= 6,
        arrows: false,
        responsive: [
            { breakpoint: 1500, settings: { slidesToShow: setting ? 3 : 5 } },
            { breakpoint: 1200, settings: { slidesToShow: setting ? 2 : 4 } },
            { breakpoint: 1024, settings: { slidesToShow: setting ? 2 : 3 } },
            { breakpoint: 900, settings: { slidesToShow: 3 } },
            { breakpoint: 700, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 2 } },
        ],
    };

    // Component styled cho item slider
    const StyledSliderItem = styled(Box)(({ theme }) => ({
        padding: theme.spacing(0, 1),
        display: "flex",
    }));

    return (
        <>
            {generalList.length > 0 ? (
                <Slider {...settingsSlide}>
                    {generalList.map((item, index) => (
                        <StyledSliderItem key={index}>
                            <Box
                                sx={{
                                    background: "#f5f5f5",
                                    padding: 1.5,
                                    borderRadius: 2,
                                    textAlign: "center",
                                    maxWidth: 220,
                                    height: smUp ? 340 : 310,
                                    marginBottom: setting ? 2 : 0,
                                    m: "0 auto 10px",
                                    "&:hover": {
                                        cursor: "grab",
                                    },
                                }}
                            >
                                <Card sx={{ borderRadius: 0, height: smUp ? 200 : 170 }}>
                                    <NextLink href={paths.detail(item.alias)} passHref>
                                        <Box
                                            sx={{
                                                height: "100%",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                cursor: "pointer",
                                                transition: "transform 0.3s ease-in-out",
                                                "&:hover": {
                                                    transform: "scale(1.2)",
                                                },
                                            }}
                                        >
                                            <LazyLoadedImage
                                                src={
                                                    isValidUrl(item.image)
                                                        ? item.image
                                                        : `/upload/${isProductRelated ? "product" : "baiviet"}/${
                                                              item.image
                                                          }`
                                                }
                                                alt={`Hình ảnh ${item.title}`}
                                                style={{ maxHeight: "100%", objectFit: "cover" }}
                                            />
                                        </Box>
                                    </NextLink>
                                </Card>
                                <Stack
                                    spacing={1}
                                    sx={{
                                        width: "100%",
                                        padding: 1,
                                    }}
                                >
                                    <NextLink
                                        href={paths.detail(item.alias)}
                                        style={{
                                            textDecoration: "none",
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: "16px !important",
                                                color: "#0000AA",
                                                fontWeight: 600,
                                                lineHeight: 1.4,
                                                display: "-webkit-box",
                                                overflow: "hidden",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                textOverflow: "ellipsis",
                                                "&:hover": {
                                                    textDecoration: "underline",
                                                },
                                            }}
                                            title={item.title}
                                            variant="h3"
                                        >
                                            {item.title}
                                        </Typography>
                                    </NextLink>
                                    <Typography
                                        sx={{
                                            fontSize: "14px !important",
                                            fontWeight: 300,
                                            fontStyle: "italic",
                                            lineHeight: 1.2,
                                            display: "-webkit-box",
                                            overflow: "hidden",
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: "vertical",
                                            textOverflow: "ellipsis",
                                        }}
                                        variant="h4"
                                        title={isProductRelated ? item.description : item.intro}
                                    >
                                        {isProductRelated ? item.description : item.intro}
                                    </Typography>
                                </Stack>
                            </Box>
                        </StyledSliderItem>
                    ))}
                </Slider>
            ) : (
                <BoxEmpty
                    sx={{
                        height: 200,
                    }}
                />
            )}
        </>
    );
};

export default SliderGeneral;
