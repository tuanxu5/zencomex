import { LoadingButton, TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Grid, InputAdornment, Tab, TextField, Typography } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import { usePageView } from "../../../hooks/use-page-view";
import { Layout as AdminLayout } from "../../../layouts/dashboard";
import AdminIntroduction from "../../../sections/admin/admin-introduction";
import ViewAdminGeneral from "../../../sections/admin/general/admin-general";
import axiosInstance from "../../../utils/axios";
import { Stack } from "@mui/system";
import { ToastMessage } from "../../../components/custom-toast";
import { useFormik } from "formik";

const Page = ({ introduction, menu }) => {
    const [menuGeneral, setMenuGeneral] = useState(() => {
        if (menu && menu.length > 0) {
            return menu.map((item) => {
                if (item?.tenkhongdau === "gioi-thieu") {
                    return {
                        id: `${item?.id}`,
                        title: item?.ten_vi,
                        alias: item?.tenkhongdau,
                        titleSeo: item?.title,
                        keywordSeo: item?.keywords,
                        descriptionSeo: item?.description,
                        component: <AdminIntroduction introduction={introduction ? introduction : ""} />,
                    };
                }
                if (item?.tenkhongdau === "san-pham" || item?.tenkhongdau === "lien-he") {
                    return {
                        id: `${item?.id}`,
                        title: item?.ten_vi,
                        alias: item?.tenkhongdau,
                        titleSeo: item?.title,
                        keywordSeo: item?.keywords,
                        descriptionSeo: item?.description,
                    };
                }
                return {
                    id: `${item?.id}`,
                    title: item?.ten_vi,
                    alias: item?.tenkhongdau,
                    titleSeo: item?.title,
                    keywordSeo: item?.keywords,
                    descriptionSeo: item?.description,
                    component: <ViewAdminGeneral />,
                };
            });
        }
        return [];
    });
    usePageView();
    const [menuSelected, setMenuSelected] = useState(() => {
        if (menuGeneral && menuGeneral.length > 0) {
            return menuGeneral.find((i) => i?.alias === "gioi-thieu");
        }
        return 0;
    });
    const [value, setValue] = useState(() => {
        if (menuGeneral) {
            const selected = menuGeneral.find((i) => i?.alias === "gioi-thieu");
            return selected?.id;
        }
        return "";
    });

    useEffect(() => {
        formik.resetForm();
    }, [menuSelected]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setMenuSelected(() => {
            return menuGeneral.find((i) => i?.id === newValue);
        });

        setMenuGeneral((pre) =>
            pre.map((item) => {
                if (item?.alias === "san-pham" || item?.alias === "lien-he") {
                    return { ...item };
                }
                if (item?.id === newValue && item?.alias !== "gioi-thieu") {
                    return {
                        ...item,
                        component: <ViewAdminGeneral generalSelected={pre.find((i) => i?.id === newValue)} />,
                    };
                }

                return {
                    ...item,
                    component: <AdminIntroduction introduction={introduction ? introduction : ""} />,
                };
            })
        );
    };
    const initialValues = {
        titleSeo: menuSelected?.alias === "gioi-thieu" ? introduction?.titleSeo : menuSelected?.titleSeo || "",
        keywordSeo: menuSelected?.alias === "gioi-thieu" ? introduction?.keywordSeo : menuSelected?.keywordSeo || "",
        descriptionSeo:
            menuSelected?.alias === "gioi-thieu" ? introduction?.descriptionSeo : menuSelected?.descriptionSeo || "",
    };

    const formik = useFormik({
        initialValues,
        enableReinitialize: true,
        onSubmit: async (values, helpers) => {
            const data = {
                title: values.titleSeo,
                keywords: values.keywordSeo,
                description: values.descriptionSeo,
            };
            try {
                if (menuSelected.alias === "gioi-thieu") {
                    try {
                        const response = await axiosInstance.put(`/general/introduct/${introduction.id}`, data);
                        if (response && response.data.DT) {
                            ToastMessage("Cập nhật thành công", "success");
                        } else {
                            ToastMessage("Cập nhật thất bại", "error");
                        }
                    } catch (error) {
                        ToastMessage("Có lỗi xảy ra", "error");
                    }
                } else {
                    const res = await axiosInstance.put(`/footer/update/${parseInt(value)}`, data);
                    if (res && res.data.DT) {
                        ToastMessage("Cập nhật thành công", "success");
                    } else {
                        ToastMessage("Cập nhật thất bại", "error");
                    }
                }
            } catch (error) {
                console.error(error);
                ToastMessage("Có lỗi xảy ra", "error");
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: error.message });
                helpers.setSubmitting(false);
            }
            setLoading(false);
        },
    });

    return (
        <>
            <Head>
                <title>Admin - General</title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 4,
                }}
            >
                <Box sx={{ width: "100%", typography: "body1", p: 2 }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                {menuGeneral.map((item, index) => {
                                    return (
                                        <Tab
                                            sx={{
                                                width: 120,
                                            }}
                                            key={item.id}
                                            label={item.title}
                                            value={item.id}
                                        />
                                    );
                                })}
                            </TabList>
                        </Box>
                        {menuGeneral.map((item) => (
                            <TabPanel key={item.id} value={item.id}>
                                {item.component}
                            </TabPanel>
                        ))}
                    </TabContext>
                    <Box>
                        <form onSubmit={formik.handleSubmit}>
                            <Grid container spacing={3} p={2}>
                                <Grid item xs={12} md={3} lg={2} mb={2}>
                                    <Typography variant="h6">Nội dung SEO</Typography>
                                </Grid>
                                <Grid item xs={12} md={9} lg={10}>
                                    <Stack spacing={3}>
                                        <TextField
                                            error={!!(formik.touched.titleSeo && formik.errors.titleSeo)}
                                            fullWidth
                                            label="Tiêu đề"
                                            name="titleSeo"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.titleSeo}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Typography variant="body2" color="textSecondary">
                                                            {formik.values.titleSeo.length} / 70
                                                        </Typography>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <TextField
                                            error={!!(formik.touched.keywordSeo && formik.errors.keywordSeo)}
                                            fullWidth
                                            label="Từ khoá"
                                            name="keywordSeo"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.keywordSeo}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Typography variant="body2" color="textSecondary">
                                                            {formik.values.keywordSeo.length} / 70
                                                        </Typography>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <TextField
                                            minRows={2}
                                            multiline
                                            error={!!(formik.touched.descriptionSeo && formik.errors.descriptionSeo)}
                                            fullWidth
                                            label="Nội dung seo"
                                            name="descriptionSeo"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            value={formik.values.descriptionSeo}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Typography variant="body2" color="textSecondary">
                                                            {formik.values.descriptionSeo.length} / 160
                                                        </Typography>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Stack>
                                    <LoadingButton sx={{ mt: 2 }} type="submit" variant="contained">
                                        Cập nhật SEO
                                    </LoadingButton>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

Page.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default Page;

export async function getServerSideProps() {
    try {
        // Gọi hai API cùng một lúc với Promise.all
        const [res, response] = await Promise.all([
            axiosInstance.get("/footer?type=menu"),
            axiosInstance.get("/general/gioi-thieu"),
        ]);

        if (response && response.data.DT && res && res.data.DT) {
            return {
                props: { introduction: response.data.DT[0], menu: res.data.DT },
            };
        } else {
            return { props: { introduction: null, menu: null } };
        }
    } catch (error) {
        return { props: { introduction: null, menu: null } };
    }
}
