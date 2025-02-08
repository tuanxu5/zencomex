import NextLink from "next/link";
import * as Yup from "yup";
import { useFormik } from "formik";
import ArrowLeftIcon from "@untitled-ui/icons-react/build/esm/ArrowLeft";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Checkbox,
    FormHelperText,
    Link,
    Stack,
    SvgIcon,
    TextField,
    Typography,
} from "@mui/material";
import axiosInstance from "../../../utils/axios";
import { ToastMessage } from "../../../components/custom-toast";
const ContactWithUs = () => {
    const initialValues = {
        name: "",
        phone: "",
        email: "",
        message: "",
    };
    const validationSchema = Yup.object({
        name: Yup.string().max(255).required("Tên là bắt buộc"),
        phone: Yup.string().required("Số điện thoại là bắt buộc"),
        email: Yup.string().email("Must be a valid email").max(255).required("Email là bắt buộc"),
    });
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            const response = await axiosInstance.post("/email/send", values);
            if (response && response.data.DT) {
                ToastMessage(
                    "Bạn đã gửi thông tin thành công, chúng tôi sẽ sớm liên lạc với bạn",
                    "success",
                    "top-right",
                    5000
                );
                resetForm();
            } else {
                ToastMessage("Gửi thông tin không thành công ", "success");
            }
        },
    });
    return (
        <Box display="flex" justifyContent="center">
            <Card
                elevation={16}
                sx={{
                    width: 500,
                }}
            >
                <CardHeader sx={{ pb: 0 }} title="Bạn cần chúng tôi hỗ trợ" subheader={"Nhập thông tin của bạn"} />
                <CardContent>
                    <form noValidate onSubmit={formik.handleSubmit}>
                        <Stack spacing={3}>
                            <TextField
                                error={!!(formik.touched.name && formik.errors.name)}
                                fullWidth
                                helperText={formik.touched.name && formik.errors.name}
                                label="Tên của bạn"
                                name="name"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.name}
                            />
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
                            <TextField
                                error={!!(formik.touched.email && formik.errors.email)}
                                fullWidth
                                helperText={formik.touched.email && formik.errors.email}
                                label="Thông tin Email"
                                name="email"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                type="email"
                                value={formik.values.email}
                            />
                            <TextField
                                error={!!(formik.touched.message && formik.errors.message)}
                                fullWidth
                                multiline
                                helperText={formik.touched.message && formik.errors.message}
                                label="Nội dung yêu cầu của bạn"
                                name="message"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.message}
                            />
                        </Stack>

                        <Button fullWidth size="large" sx={{ mt: 2 }} type="submit" variant="contained">
                            Gửi thông tin của bạn
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ContactWithUs;
