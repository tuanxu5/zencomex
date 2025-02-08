import { Box, Grid, useMediaQuery } from "@mui/material";
import CardProduct from "./card-product";
import LoadingChildScreen from "../../../components/loading-child-screen";

const CardProductList = ({ products, loading = false }) => {
    const smUp = useMediaQuery((theme) => theme.breakpoints.up("sm"));
    return (
        <Box position="relative">
            {loading && <LoadingChildScreen />}
            <Grid container justifyContent="flex-start" spacing={2} mt={smUp ? 2 : 0}>
                {products.map((child) => {
                    return (
                        <Grid
                            item
                            key={child.id}
                            xs={6} // Chiếm toàn bộ chiều rộng trên thiết bị nhỏ
                            sm={4} // Chiếm nửa chiều rộng trên thiết bị trung bình
                            md={6} // Chiếm 1/3 chiều rộng trên thiết bị lớn
                            lg={4} // Chiếm 1/4 chiều rộng trên thiết bị rất lớn
                            xl={3} // Chiếm 1/5 chiều rộng trên thiết bị rất lớn
                        >
                            <CardProduct child={child} />
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};
export default CardProductList;
