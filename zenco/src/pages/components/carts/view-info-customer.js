import {
    Button,
    ButtonBase,
    Card,
    CardContent,
    CardHeader,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    IconButton,
    Radio,
    RadioGroup,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
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
import { useFormik } from "formik";
import * as Yup from "yup";

const gender = [
    { value: "male", label: "Anh" },
    { value: "female", label: "Chị" },
    { value: "other", label: "Khác" },
];
const address = [
    { value: "customer", label: "Nhận hàng tại nhà" },
    { value: "factory", label: "Đến nhà máy nhận hàng" },
];

const ViewInfoCustomer = (props) => {
    const { cart } = props;
    const initialValues = {
        name: "",
        phone: "",
        message: "",
    };
    const validationSchema = Yup.object({
        name: Yup.string().max(255).required("Tên là bắt buộc"),
        phone: Yup.string().required("Số điện thoại là bắt buộc"),
    });
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            console.log("value", values);
            // const response = await axiosInstance.post("/email/send", values);
            // if (response && response.data.DT) {
            //     ToastMessage(
            //         "Bạn đã gửi thông tin thành công, chúng tôi sẽ sớm liên lạc với bạn",
            //         "success",
            //         "top-right",
            //         5000
            //     );
            //     resetForm();
            // } else {
            //     ToastMessage("Gửi thông tin không thành công ", "success");
            // }
        },
    });
    return (
        <Card>
            <Box p={2}>
                <Grid container>
                    <Typography sx={{ fontWeight: 700, mt: 1 }}>Thông tin khách hàng</Typography>
                    <Grid item xs={12}>
                        <FormControl>
                            <RadioGroup defaultValue="female">
                                <Stack direction="row">
                                    {gender.map((i) => (
                                        <FormControlLabel
                                            key={i.value}
                                            sx={{
                                                minWidth: 100,
                                                "& .MuiFormControlLabel-label": {
                                                    fontSize: 14, // Thay đổi kích cỡ chữ tại đây
                                                },
                                            }}
                                            value={i.value}
                                            control={
                                                <Radio
                                                    sx={{
                                                        "& .MuiSvgIcon-root": {
                                                            fontSize: 16,
                                                        },
                                                    }}
                                                />
                                            }
                                            label={i.label}
                                        />
                                    ))}
                                </Stack>
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <form noValidate onSubmit={formik.handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        error={!!(formik.touched.name && formik.errors.name)}
                                        fullWidth
                                        helperText={formik.touched.name && formik.errors.name}
                                        label="Họ & Tên"
                                        name="name"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        value={formik.values.name}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        error={!!(formik.touched.phone && formik.errors.phone)}
                                        fullWidth
                                        helperText={formik.touched.phone && formik.errors.phone}
                                        label="Số điện thoại"
                                        name="phone"
                                        onBlur={formik.handleBlur}
                                        value={formik.values.phone}
                                        type="text"
                                        onChange={(e) => {
                                            if (/^\d*$/.test(e.target.value)) {
                                                formik.handleChange(e);
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        error={!!(formik.touched.message && formik.errors.message)}
                                        fullWidth
                                        multiline
                                        minRows={3}
                                        maxRows={5}
                                        helperText={formik.touched.message && formik.errors.message}
                                        label="Ghi chú thêm (Không bắt buộc)"
                                        name="message"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        value={formik.values.message}
                                    />
                                </Grid>
                            </Grid>
                            <Typography sx={{ fontWeight: 700, mt: 2 }}>Chọn hình thức nhận hàng</Typography>
                            <Grid item xs={12}>
                                <FormControl>
                                    <RadioGroup defaultValue="customer">
                                        <Stack direction="row">
                                            {address.map((i) => (
                                                <FormControlLabel
                                                    key={i.value}
                                                    sx={{
                                                        minWidth: 250,
                                                        "& .MuiFormControlLabel-label": {
                                                            fontSize: 14, // Thay đổi kích cỡ chữ tại đây
                                                        },
                                                    }}
                                                    value={i.value}
                                                    control={
                                                        <Radio
                                                            sx={{
                                                                "& .MuiSvgIcon-root": {
                                                                    fontSize: 16,
                                                                },
                                                            }}
                                                        />
                                                    }
                                                    label={i.label}
                                                />
                                            ))}
                                        </Stack>
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Button fullWidth size="large" sx={{ mt: 2 }} type="submit" variant="contained">
                                Gửi thông tin của bạn
                            </Button>
                        </form>
                    </Grid>
                </Grid>
            </Box>
        </Card>
    );
};
export default ViewInfoCustomer;
