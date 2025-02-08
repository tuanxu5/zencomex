import Head from "next/head";
import { useRouter, useSearchParams } from "next/navigation";
import NextLink from "next/link";
import * as Yup from "yup";
import { useFormik } from "formik";
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
    TextField,
    Typography,
} from "@mui/material";
import { GuestGuard } from "../../../guards/guest-guard";
import { IssuerGuard } from "../../../guards/issuer-guard";
import { useAuth } from "../../../hooks/use-auth";
import { useMounted } from "../../../hooks/use-mounted";
import { usePageView } from "../../../hooks/use-page-view";
import { Layout as AuthLayout } from "../../../layouts/auth/classic-layout";
import { paths } from "../../../paths";
import { AuthIssuer } from "../../../sections/auth/auth-issuer";
import { Issuer } from "../../../utils/auth";

const useParams = () => {
    const searchParams = useSearchParams();
    const returnTo = searchParams.get("returnTo") || undefined;

    return {
        returnTo,
    };
};

const initialValues = {
    email: "",
    name: "",
    password: "",
    policy: false,
    submit: null,
};

const validationSchema = Yup.object({
    email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
    name: Yup.string().max(255).required("Name is required"),
    password: Yup.string().min(7).max(255).required("Password is required"),
});

const Page = () => {
    const isMounted = useMounted();
    const router = useRouter();
    const { returnTo } = useParams();
    const { issuer, signUp } = useAuth();
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values, helpers) => {
            try {
                await signUp(values.email, values.name, values.password);

                if (isMounted()) {
                    router.push(returnTo || paths.dashboard.index);
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
                <title>Đăng kí tài khoản</title>
            </Head>
            <div>
                <Card elevation={16}>
                    <CardHeader title="Đăng kí tài khoản" />
                    <CardContent>
                        <form noValidate onSubmit={formik.handleSubmit}>
                            <Stack spacing={3}>
                                <TextField
                                    error={!!(formik.touched.name && formik.errors.name)}
                                    fullWidth
                                    helperText={formik.touched.name && formik.errors.name}
                                    label="Name"
                                    name="name"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.name}
                                />
                                <TextField
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

                            <Button
                                disabled={formik.isSubmitting}
                                fullWidth
                                size="large"
                                sx={{ mt: 2 }}
                                type="submit"
                                variant="contained"
                            >
                                Đăng kí
                            </Button>
                        </form>
                    </CardContent>
                </Card>
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
