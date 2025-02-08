import { ButtonBase, Card, CardHeader, Checkbox, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useDispatch } from "react-redux";
import { Scrollbar } from "../../../components/scrollbar";
//icon
import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RemoveIcon from "@mui/icons-material/Remove";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../../utils/axios";

//next
import NextLink from "next/link";
import { paths } from "../../../paths";
import { changeQuantityToCart, changeSelectedToCart, clearCart, removeFromCart } from "../../../redux/Slices/cart";
import { ToastMessage } from "../../../components/custom-toast";

const ViewCartDetail = (props) => {
    const { cart } = props;

    const dispatch = useDispatch();
    const handleIncrease = (product) => {
        const item = { ...product, type: "increase" };
        dispatch(changeQuantityToCart(item));
    };

    const handleDecrease = (product) => {
        const item = { ...product, type: "decrease" };
        dispatch(changeQuantityToCart(item));
    };
    const handleChange = (product) => {
        const item = { ...product, type: "change" };
        dispatch(changeQuantityToCart(item));
    };

    const [quantityProduct, setQuantityProduct] = useState(cart.items);
    const handleChangeQuantity = (e, product) => {
        const inputValue = e.target.value.replace(/[+-]/g, ""); // Loại bỏ dấu + và -
        setQuantityProduct((prev) => {
            const newArray = prev.map((i) => {
                if (i.id === product.id) {
                    return { ...i, quantity: inputValue !== "" ? parseInt(inputValue) : inputValue }; // Tạo đối tượng mới thay vì chỉnh sửa trực tiếp
                }
                return i; // Trả về các phần tử không bị thay đổi
            });
            return newArray;
        });
    };
    useEffect(() => {
        setQuantityProduct(cart.items);
        setSelectedAll(() => {
            const check = cart.items.every((i) => i.checked === true);
            return check;
        });
    }, [cart]);

    //remove product out carts
    const handleClickDeleteProduct = (item) => {
        if (item) {
            dispatch(removeFromCart(item.id));
            ToastMessage("Xóa thành công", "success");
        }
    };

    // SelectedAll adn Selected
    const [selectedAll, setSelectedAll] = useState(true);
    const handleClickSelectedAll = () => {
        const newCart = cart.items.map((item) => {
            return { ...item, checked: !selectedAll };
        });

        setSelectedAll(() => {
            const check = cart.items.every((i) => i.checked === true);
            return check;
        });
        dispatch(changeSelectedToCart({ cart: newCart, type: "All" }));
    };

    const handleClickSelected = (item) => {
        dispatch(changeSelectedToCart({ cart: item, type: "" }));
    };

    // Delete All
    const handleClickDeleteAll = () => {
        ToastMessage("Xóa giỏ hàng thành công", "success");
        dispatch(clearCart());
    };
    return (
        <Card>
            <Stack direction="row" p={1}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Checkbox
                        onClick={handleClickSelectedAll}
                        checked={selectedAll}
                        sx={{
                            width: 40,
                            height: 40,
                        }}
                    />
                </Box>
                <Stack
                    width="100%"
                    direction="row"
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems="center"
                >
                    <CardHeader sx={{ p: 2 }} title="Giỏ hàng của bạn" />
                    <Box
                        disabled={!selectedAll}
                        component={ButtonBase}
                        onClick={handleClickDeleteAll}
                        sx={{
                            p: 1,
                            mr: 1,
                            height: 30,
                            minWidth: 80,
                            fontSize: 12,
                            borderRadius: 1,
                            fontWeight: 500,
                            opacity: !selectedAll && 0.3,
                            "&:hover": {
                                backgroundColor: selectedAll && "#BBDEFB",
                            },
                        }}
                    >
                        Xóa tất cả
                    </Box>
                </Stack>
            </Stack>
            <Box>
                <Scrollbar
                    sx={{
                        maxHeight: "70vh",
                    }}
                >
                    {cart &&
                        cart.items.map((product, index) => {
                            return (
                                <Stack key={product.id} direction="row" spacing={2} sx={{ p: 1, height: 120 }}>
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <Checkbox
                                            onClick={() => handleClickSelected(product)}
                                            checked={product.checked}
                                            sx={{
                                                width: 35,
                                                height: 35,
                                            }}
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            alignItems: "center",
                                            backgroundColor: "neutral.50",
                                            backgroundImage: `url(${BASE_URL}/upload/product/${product.image})`,
                                            backgroundPosition: "center",
                                            backgroundSize: "cover",
                                            // borderRadius: 1,
                                            display: "flex",
                                            height: 100,
                                            justifyContent: "center",
                                            overflow: "hidden",
                                            width: 100,
                                            minWidth: 100,
                                            // border: "0.5px solid #BABABA",
                                        }}
                                    />
                                    <Stack width={"40%"}>
                                        <Box
                                            component={NextLink}
                                            href={paths.detail(product.alias)}
                                            sx={{
                                                textDecoration: "none",
                                                color: "black",
                                                "&:hover": {
                                                    textDecoration: "underline",
                                                },
                                            }}
                                        >
                                            <Typography variant="subtitle2">{product.name}</Typography>
                                        </Box>
                                        <Typography color="text.secondary" noWrap variant="body2">
                                            <Typography
                                                color="red"
                                                component="span"
                                                variant="subtitle2"
                                                sx={{
                                                    fontSize: 13,
                                                    fontStyle: "italic",
                                                }}
                                            >
                                                Liên hệ
                                            </Typography>{" "}
                                        </Typography>
                                    </Stack>

                                    <Box display="flex" alignItems="center" gap={1}>
                                        <IconButton
                                            onClick={() => handleDecrease(product)}
                                            color="primary"
                                            disabled={product.quantity === 1}
                                        >
                                            <RemoveIcon
                                                sx={{
                                                    color: product.quantity > 1 && "#0099FF",
                                                    fontSize: 14,
                                                }}
                                            />
                                        </IconButton>
                                        <TextField
                                            onBlur={() => {
                                                const pd = quantityProduct.find((i) => i.id === product.id);
                                                if (pd.quantity === "" || pd.quantity === 0) {
                                                    setQuantityProduct((prev) => {
                                                        const newArray = prev.map((i) => {
                                                            if (
                                                                (i.id === product.id && i.quantity === "") ||
                                                                i.quantity === 0
                                                            ) {
                                                                return { ...i, quantity: 1 }; // Tạo đối tượng mới thay vì chỉnh sửa trực tiếp
                                                            }
                                                            return i; // Trả về các phần tử không bị thay đổi
                                                        });
                                                        return newArray;
                                                    });
                                                    handleChange({ ...pd, quantity: 1 });
                                                } else {
                                                    handleChange(pd);
                                                }
                                            }}
                                            type="number"
                                            onChange={(e) => {
                                                handleChangeQuantity(e, product);
                                            }}
                                            value={quantityProduct.find((i) => i?.id === product.id).quantity}
                                            sx={{
                                                "& .MuiInputBase-input": {
                                                    fontSize: 12, // Kích thước chữ
                                                    fontWeight: 700, // Độ đậm chữ
                                                    textAlign: "center", // Căn giữa chữ
                                                    padding: "0px !important", // Loại bỏ padding
                                                },
                                                "& input[type=number]": {
                                                    MozAppearance: "textfield", // Ẩn mũi tên trong Firefox
                                                },
                                                "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
                                                    {
                                                        WebkitAppearance: "none", // Ẩn mũi tên trong Chrome, Safari, Edge, Opera
                                                        margin: 0,
                                                    },
                                            }}
                                            InputProps={{
                                                sx: {
                                                    height: 25, // Tùy chỉnh chiều cao nếu cần
                                                    width: 50,
                                                },
                                            }}
                                        />

                                        <IconButton onClick={() => handleIncrease(product)} color="primary">
                                            <AddIcon
                                                sx={{
                                                    fontSize: 14,
                                                    color: "#0099FF",
                                                }}
                                            />
                                        </IconButton>
                                    </Box>
                                    <Box height="100%" sx={{ display: "flex", alignItems: "center" }}>
                                        <Tooltip title="Xóa sản phẩm">
                                            <Box
                                                component={ButtonBase}
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: "50%",
                                                    color: "#BABABA",
                                                    "&:hover": {
                                                        color: "red",
                                                        backgroundColor: "pink",
                                                    },
                                                    mr: 2,
                                                }}
                                                onClick={() => handleClickDeleteProduct(product)}
                                            >
                                                <DeleteForeverIcon
                                                    sx={{
                                                        fontSize: 20,
                                                    }}
                                                />
                                            </Box>
                                        </Tooltip>
                                    </Box>
                                </Stack>
                            );
                        })}
                </Scrollbar>
            </Box>
        </Card>
    );
};
export default ViewCartDetail;
