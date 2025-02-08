import { Box, Button, ButtonBase, Card, CardContent, Stack, Typography, useMediaQuery } from "@mui/material";
import NextLink from "next/link";
import { motion } from "framer-motion";
import LazyLoadedImage from "../../../components/lazy-loaded-image";

//icon
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/Slices/cart";
import { ToastMessage } from "../../../components/custom-toast";

export const isValidUrl = (string) => {
    try {
        new URL(string); // Tạo URL từ chuỗi, nếu không hợp lệ sẽ ném lỗi
        return true;
    } catch (_) {
        return false;
    }
};

const CardProduct = ({ child }) => {
    const smUp = useMediaQuery((theme) => theme.breakpoints.up("sm"));

    const dispatch = useDispatch();
    const handleAddToCart = () => {
        dispatch(addToCart(child));
        ToastMessage("Thêm vào giỏ hàng thành công", "success");
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{
                display: "flex",
                justifyContent: "center",
            }}
        >
            <Card
                sx={{
                    maxWidth: smUp ? 220 : 150,
                    width: "100%",
                    height: smUp ? 280 : 200,
                    overflow: "hidden",
                    transition: "transform 0.4s ease-in-out",
                    "&:hover .cart-icon": {
                        boxShadow: "0 0 10px 0 rgba(0,0,0,0.2)",
                        opacity: 1,
                        transform: "translateY(0)",
                    },
                    borderRadius: 0,
                    backgroundColor: "#F5F5F5",
                    position: "relative",
                    mb: smUp ? 2 : 0,
                }}
            >
                <NextLink href={child.alias} style={{ textDecoration: "none" }}>
                    <Card
                        sx={{
                            borderRadius: 0,
                            width: "100%",
                            height: smUp ? 220 : 150,
                        }}
                    >
                        <Box
                            sx={{
                                height: smUp ? 220 : 150,
                                width: "100%",
                                objectFit: "cover",
                                objectPosition: "center",
                                transition: "transform 0.3s ease-in-out",
                                "&:hover": {
                                    transform: "scale(1.2)",
                                },
                            }}
                        >
                            <LazyLoadedImage
                                src={isValidUrl(child.image) ? child.image : `/upload/product/${child.image}`}
                                alt={`Hình ảnh sản phẩm:  ${child.name}`}
                            />
                        </Box>
                    </Card>

                    <CardContent sx={{ padding: 1 }}>
                        <Stack
                            alignItems="center"
                            justifyItems="center"
                            sx={{
                                height: "100%",
                                width: "100%",
                            }}
                        >
                            <Typography
                                sx={{
                                    textAlign: "center",
                                    fontSize: smUp ? "14px !important" : "12px !important",
                                    fontWeight: 600,
                                    display: "-webkit-box",
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden", // Ẩn văn bản thừa
                                    WebkitLineClamp: 1, // Giới hạn số dòng hiển thị
                                    textOverflow: "ellipsis", // Hiển thị dấu ba chấm khi văn bản bị tràn
                                    lineHeight: 1.3,
                                    mt: 0.5,
                                    color: "#0000AA",
                                    "&:hover": {
                                        textDecoration: "underline",
                                    },
                                }}
                                variant="h3"
                                title={child.name}
                            >
                                {child.name}
                            </Typography>
                            <Typography color="text.secondary" noWrap variant="body2">
                                <Typography
                                    color="red"
                                    component="span"
                                    variant="subtitle2"
                                    sx={{
                                        fontSize: smUp ? 14 : 12,
                                        fontStyle: "italic",
                                    }}
                                >
                                    Liên hệ
                                </Typography>{" "}
                            </Typography>
                        </Stack>
                    </CardContent>
                </NextLink>
                <Box
                    aria-label="Giỏ hàng"
                    className="cart-icon"
                    component={ButtonBase}
                    onClick={handleAddToCart}
                    sx={{
                        position: "absolute",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        top: 8,
                        right: 8,
                        opacity: 0,
                        transform: "translateY(-30px)",
                        transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
                        cursor: "pointer",
                        width: 36,
                        height: 36,
                        color: "#0099FF",
                    }}
                >
                    <ShoppingCartIcon />
                </Box>
            </Card>
        </motion.div>
    );
};

export default CardProduct;
