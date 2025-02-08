import { Layout as MarketingLayout } from "../layouts/marketing";

import {
    Box,
    ButtonBase,
    Card,
    CardHeader,
    Checkbox,
    Container,
    Grid,
    IconButton,
    Stack,
    SvgIcon,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import DotsHorizontalIcon from "@untitled-ui/icons-react/build/esm/DotsHorizontal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePageView } from "../hooks/use-page-view";
import { BASE_URL } from "../utils/axios";
import { addToCart, changeQuantityToCart, changeSelectedToCart, clearCart, removeFromCart } from "../redux/Slices/cart";
import { ToastMessage } from "../components/custom-toast";
import Head from "next/head";
import NextLink from "next/link";
import { paths } from "../paths";
import { Scrollbar } from "../components/scrollbar";
import ViewCartDetail from "./components/carts/view-cart-detail";
import ViewInfoCustomer from "./components/carts/view-info-customer";

const Page = () => {
    const cart = useSelector((state) => state.cart);
    usePageView();
    return (
        <Container maxWidth="xl">
            <Head>
                <title>Giỏ hàng - Zencomex</title>
            </Head>

            <Box
                sx={{
                    backgroundColor: (theme) => (theme.palette.mode === "dark" ? "neutral.800" : "neutral.100"),
                    p: 3,
                    minHeight: "70vh",
                }}
            >
                {cart.items.length > 0 ? (
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={5}>
                            <ViewCartDetail cart={cart} />
                        </Grid>
                        <Grid item xs={12} md={7}>
                            <ViewInfoCustomer cart={cart} />
                        </Grid>
                    </Grid>
                ) : (
                    <Stack
                        spacing={2}
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            justifyItems: "center",
                        }}
                    >
                        <Box
                            sx={{
                                height: "auto",
                                maxWidth: "30%",
                                margin: "0 auto",
                            }}
                            src="/assets/products/empty-cart.png"
                            alt="Not found"
                            component={"img"}
                        />

                        <Typography
                            display="flex"
                            justifyContent="center"
                            sx={{
                                fontWeight: 700,
                                fontSize: 16,
                            }}
                        >
                            Giỏ hàng của bạn đang trống
                        </Typography>
                        <Box
                            component={NextLink}
                            href={paths.detail()}
                            sx={{
                                width: "100%",
                                textDecoration: "none",
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <Box
                                component={ButtonBase}
                                sx={{
                                    height: 40,
                                    width: 120,
                                    fontWeight: 600,
                                    backgroundColor: "#BBDEFB",
                                    borderRadius: 1,
                                }}
                            >
                                Mua sắm
                            </Box>
                        </Box>
                    </Stack>
                )}
            </Box>
        </Container>
    );
};

Page.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default Page;
