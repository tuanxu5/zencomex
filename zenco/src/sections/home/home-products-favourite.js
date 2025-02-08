import { Box, Container, Grid, Stack, Typography, useMediaQuery } from "@mui/material";
import { MenuCategory } from "./component/menu-category";
import CardProductList from "./component/card-product-list";
import { getListProductFavorite } from "../../services/product-service";
import { useEffect, useState } from "react";
import { BoxEmpty } from "../../components/view-layout/box-empty";
import { useSelector } from "react-redux";

const HomeProductFavourite = () => {
    const { allCategory } = useSelector((state) => state.product);
    const smUp = useMediaQuery((theme) => theme.breakpoints.up("sm"));
    const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
    const xlUp = useMediaQuery((theme) => theme.breakpoints.up("xl"));
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getProductFavorite = async () => {
        try {
            const data = await getListProductFavorite();
            if (data && data.DT) {
                const newProducts = data.DT.map((item) => ({
                    id: item.id,
                    name: item.ten_vi,
                    price: item.giaban,
                    description: item.mota_vi,
                    image: item.photo,
                    alias: item.tenkhongdau,
                }));
                setProducts(newProducts);
            }
        } catch (error) {
            setError("Failed to load favorite products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProductFavorite();
    }, []);

    return (
        <Box
            sx={{
                backgroundRepeat: "no-repeat",
                backgroundPosition: "top center",
                backgroundImage: 'url("/assets/gradient-bg.svg")',
                p: 2,
            }}
        >
            <Container maxWidth="xl">
                <Box>
                    <Grid
                        container
                        sx={{
                            width: "100%",
                        }}
                    >
                        <Grid
                            item
                            xs={12}
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "24px !important",
                                    fontWeight: 700,
                                }}
                                variant="h2"
                            >
                                Sản phẩm nổi bật
                            </Typography>
                        </Grid>
                        {allCategory && allCategory.length > 0 && mdUp && (
                            <Grid item xs={xlUp ? 3 : smUp ? 5 : 4} mt={4}>
                                <Stack>
                                    <Box
                                        sx={{
                                            backgroundColor: "#f5fbfd",
                                            borderRadius: 1,
                                        }}
                                    >
                                        <MenuCategory />
                                    </Box>
                                </Stack>
                            </Grid>
                        )}

                        <Grid
                            item
                            xs={mdUp && allCategory && allCategory.length > 0 ? (xlUp ? 9 : smUp ? 7 : 8) : 12}
                            pl={mdUp ? 4 : 0}
                            width={"100%"}
                        >
                            {products.length === 0 || error ? (
                                <BoxEmpty note={"Sản phẩm nổi bật đang chờ cập nhật"} />
                            ) : (
                                <CardProductList products={products} loading={loading} />
                            )}
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
};

export default HomeProductFavourite;
