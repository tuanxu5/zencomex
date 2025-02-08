import Head from "next/head";
import { useRouter, useSearchParams } from "next/navigation";
import NextLink from "next/link";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
    Alert,
    Button,
    Card,
    CardContent,
    CardHeader,
    FormHelperText,
    Link,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { IssuerGuard } from "../../../guards/issuer-guard";
import { GuestGuard } from "../../../guards/guest-guard";
import { Issuer } from "../../../utils/auth";
import { Layout as AuthLayout } from "../../../layouts/auth/classic-layout";
import { useMounted } from "../../../hooks/use-mounted";
import { useAuth } from "../../../hooks/use-auth";
import { usePageView } from "../../../hooks/use-page-view";
import { paths } from "../../../paths";
import { AuthIssuer } from "../../../sections/auth/auth-issuer";
import { ToastMessage } from "../../../components/custom-toast";

const useParams = () => {
    const searchParams = useSearchParams();
    const returnTo = searchParams.get("returnTo") || undefined;

    return {
        returnTo,
    };
};

const initialValues = {
    email: "",
    password: "",
    submit: null,
};

const validationSchema = Yup.object({
    email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
    password: Yup.string().max(255).required("Password is required"),
});

const Page = () => {
    const isMounted = useMounted();
    const router = useRouter();
    const { returnTo } = useParams();
    const { issuer, signIn } = useAuth();
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values, helpers) => {
            try {
                const res = await signIn(values.email, values.password);
                if (res) {
                    if (isMounted()) {
                        router.push(returnTo || paths.admin.index);
                    }
                } else {
                    helpers.setErrors({
                        email: "Email hoặc mật khẩu không đúng",
                        password: "Email hoặc mật khẩu không đúng",
                    });
                }
            } catch (err) {
                console.error(err);

                if (isMounted()) {
                    helpers.setStatus({ success: false });
                    helpers.setErrors({ submit: err.message });
                    helpers.setSubmitting(false);
                }
            }
        },
    });

    usePageView();

    return (
        <>
            <Head>
                <title>Đăng nhập</title>
            </Head>
            <div>
                <Card elevation={16}>
                    <CardHeader title="Zencomex Admin Đăng nhập" />
                    <CardContent>
                        <form noValidate onSubmit={formik.handleSubmit}>
                            <Stack spacing={3}>
                                <TextField
                                    autoFocus
                                    error={!!(formik.touched.email && formik.errors.email)}
                                    fullWidth
                                    helperText={formik.touched.email && formik.errors.email}
                                    label="Email Address"
                                    name="email"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="email"
                                    value={formik.values.email}
                                />
                                <TextField
                                    error={!!(formik.touched.password && formik.errors.password)}
                                    fullWidth
                                    helperText={formik.touched.password && formik.errors.password}
                                    label="Password"
                                    name="password"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="password"
                                    value={formik.values.password}
                                />
                            </Stack>
                            {formik.errors.submit && (
                                <FormHelperText error sx={{ mt: 3 }}>
                                    {formik.errors.submit}
                                </FormHelperText>
                            )}
                            <Button
                                disabled={formik.isSubmitting}
                                fullWidth
                                size="large"
                                sx={{ mt: 2 }}
                                type="submit"
                                variant="contained"
                            >
                                Đăng nhập
                            </Button>
                        </form>
                    </CardContent>
                </Card>
                <Stack alignItems="center" direction="row" sx={{ mt: 3 }}>
                    <Alert severity="error" />

                    <div>
                        Nếu bạn không có <b>tài khoản</b> vui lòng về{" "}
                        <NextLink href={paths.index}>
                            <Button>Trang chủ</Button>
                        </NextLink>
                    </div>
                </Stack>
            </div>
        </>
    );
};

Page.getLayout = (page) => (
    <IssuerGuard issuer={Issuer.JWT}>
        <GuestGuard>
            <AuthLayout>{page}</AuthLayout>
        </GuestGuard>
    </IssuerGuard>
);

export default Page;
