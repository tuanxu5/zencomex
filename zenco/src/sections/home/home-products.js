import {
    AppBar,
    Box,
    Container,
    Divider,
    Grid,
    Stack,
    Tab,
    Tabs,
    Tooltip,
    Typography,
    useMediaQuery,
} from "@mui/material";
import { useSelector } from "react-redux";
import CardProduct from "./component/card-product";
import NextLink from "next/link";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

const HomeProducts = () => {
    const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
    const smUp = useMediaQuery((theme) => theme.breakpoints.up("sm"));
    const smDown = useMediaQuery((theme) => theme.breakpoints.down("sm"));
    const { allCategory } = useSelector((state) => state.product);

    return (
        <Box
            sx={{
                p: 2,
            }}
        >
            <Container maxWidth="xl">
                {allCategory &&
                    allCategory.map((product, index) => {
                        if (!product.childrenProduct || product.childrenProduct.length === 0) return null;
                        return (
                            <Box
                                key={index}
                                sx={{
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "top center",
                                    backgroundImage: 'url("/assets/gradient-bg.svg")',
                                    pt: 2,
                                }}
                            >
                                <Typography
                                    pl={mdUp ? 4 : 2}
                                    sx={{
                                        fontSize: {
                                            xs: "16px",
                                            sm: "18px",
                                            md: "20px",
                                        },
                                        fontWeight: 700,
                                        position: "relative",
                                        display: "inline-block", // Điều này giúp giới hạn đường viền chỉ bao quanh chữ
                                        "&:after": {
                                            content: '""', // Tạo một phần tử giả để thêm đường line
                                            position: "absolute",
                                            left: smUp ? 32 : 16,
                                            bottom: 0, // Điều chỉnh khoảng cách từ chữ xuống đường gạch chân
                                            width: "90%", // Đường line sẽ có chiều dài bằng đoạn chữ
                                            height: "1px", // Độ dày của đường gạch chân
                                            backgroundColor: "#0099FF", // Màu của đường gạch chân
                                        },
                                    }}
                                    variant="h2"
                                >
                                    {product.ten_vi}
                                </Typography>

                                <Divider
                                    textAlign="right"
                                    sx={{
                                        "&::before, &::after": {
                                            borderColor: "#0099FF", // Màu border
                                            borderWidth: 1,
                                        },
                                        "&::after": {
                                            width: 0,
                                        },
                                        ml: smUp ? 4 : 2, // Margin-left
                                        mr: smUp ? 4 : 2, // Margin-right
                                        mt: -1,
                                    }}
                                >
                                    {smUp && (
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            sx={{
                                                "&:hover": {
                                                    backgroundColor: "#BBDEFB",
                                                },
                                                cursor: "pointer",
                                            }}
                                        >
                                            <Tooltip title={`Xem thêm ${product.ten_vi}`}>
                                                <Typography
                                                    component={NextLink}
                                                    href={product.tenkhongdau}
                                                    sx={{
                                                        fontStyle: "italic",
                                                        ml: 0.5,
                                                        textDecoration: "none",
                                                        color: "black",
                                                        fontSize: smUp ? 16 : 14,
                                                    }}
                                                >
                                                    Xem thêm
                                                </Typography>
                                            </Tooltip>
                                            <KeyboardDoubleArrowRightIcon sx={{ fontSize: smUp ? 18 : 16 }} />
                                        </Stack>
                                    )}
                                </Divider>

                                <Box p={mdUp ? 2 : 0} mt={mdUp ? 0 : 2} mb={mdUp ? 0 : 2}>
                                    <Grid container spacing={2}>
                                        {product.childrenProduct &&
                                            product.childrenProduct.map((child, index) => {
                                                return (
                                                    <Grid
                                                        item
                                                        key={child.id}
                                                        xs={6} // Chiếm toàn bộ chiều rộng trên thiết bị nhỏ
                                                        sm={4} // Chiếm nửa chiều rộng trên thiết bị trung bình
                                                        md={4} // Chiếm 1/3 chiều rộng trên thiết bị lớn
                                                        lg={2.4} // Chiếm 1/4 chiều rộng trên thiết bị rất lớn
                                                    >
                                                        <CardProduct child={child} />
                                                    </Grid>
                                                );
                                            })}
                                        <Box mt={1} width={"100vh"}>
                                            <Divider
                                                textAlign="right"
                                                sx={{
                                                    "&::before, &::after": {
                                                        borderColor: "#0099FF", // Màu border
                                                        borderWidth: 1,
                                                    },
                                                    "&::after": {
                                                        width: 0,
                                                    },
                                                    ml: smUp ? 4 : 2, // Margin-left

                                                    mt: -1,
                                                }}
                                            >
                                                {smDown && (
                                                    <Stack
                                                        direction="row"
                                                        alignItems="center"
                                                        sx={{
                                                            "&:hover": {
                                                                backgroundColor: "#BBDEFB",
                                                            },
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        <Tooltip title={`Xem thêm ${product.ten_vi}`}>
                                                            <Typography
                                                                component={NextLink}
                                                                href={product.tenkhongdau}
                                                                sx={{
                                                                    fontStyle: "italic",
                                                                    ml: 0.5,
                                                                    textDecoration: "none",
                                                                    color: "black",
                                                                    fontSize: smUp ? 16 : 14,
                                                                }}
                                                            >
                                                                Xem thêm
                                                            </Typography>
                                                        </Tooltip>
                                                        <KeyboardDoubleArrowRightIcon
                                                            sx={{ fontSize: smUp ? 18 : 16 }}
                                                        />
                                                    </Stack>
                                                )}
                                            </Divider>
                                        </Box>
                                    </Grid>
                                </Box>
                            </Box>
                        );
                    })}
            </Container>
        </Box>
    );
};

export default HomeProducts;
