import React from "react";
import Carousel from "react-material-ui-carousel";
import { Container, Box, Grid, Typography, useMediaQuery } from "@mui/material";
import CardProduct from "../../../sections/home/component/card-product";

const SlideCarousel = ({ productRelated }) => {
    // Chia productRelated thành các nhóm nhỏ để hiển thị 5 sản phẩm trong mỗi slide
    const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
    const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
    const chunkSize = lgUp ? 5 : mdUp ? 3 : 2; // Số sản phẩm trong mỗi nhóm
    const chunks = [];

    for (let i = 0; i < productRelated.length; i += chunkSize) {
        chunks.push(productRelated.slice(i, i + chunkSize));
    }

    return (
        <Container maxWidth="lg">
            <Box>
                <Box
                    sx={{
                        position: "relative",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "top center",
                        backgroundImage: 'url("/assets/gradient-bg.svg")',
                        boxShadow: "0px 0px 3px 0px rgba(0,0,0,0.75)",
                        width: "100%",
                        p: 1,
                        mr: -2,
                    }}
                >
                    <Carousel
                        autoPlay={true} // Kích hoạt tự động chuyển slide
                        animation="slide" // Hiệu ứng chuyển slide
                        indicators={false} // Ẩn chỉ số slide
                        navButtonsAlwaysVisible={true} // Luôn hiển thị các nút điều hướng
                        cycleNavigation={true} // Cho phép vòng lặp carousel
                        swipe={true} // Kích hoạt vuốt để điều khiển
                        navButtonsProps={{
                            style: {
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                color: "white",
                                borderRadius: "50%",
                            },
                        }}
                        navButtonsWrapperProps={{
                            style: {
                                bottom: "10px",
                                height: "auto",
                            },
                        }}
                        interval={5000} // Thay đổi slide sau mỗi 5 giây
                        swipeable={true}
                        transitionTime={1000}
                    >
                        {chunks.map((chunk, index) => (
                            <Box key={index} sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                                <Grid container justifyContent="space-evenly">
                                    {chunk.map((item, index) => (
                                        <Grid sx={{ mr: -1 }} item xs={6} md={4} lg={2.4} key={index}>
                                            <CardProduct child={item} />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        ))}
                    </Carousel>
                </Box>
            </Box>
        </Container>
    );
};

export default SlideCarousel;
