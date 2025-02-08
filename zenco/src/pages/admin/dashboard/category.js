import { Box, Breadcrumbs, Button, Card, Container, Link, Stack, SvgIcon, Typography } from "@mui/material";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import Head from "next/head";
import NextLink from "next/link";
import { useCallback, useEffect, useState } from "react";
import { BreadcrumbsSeparator } from "../../../components/breadcrumbs-separator";
import { usePageView } from "../../../hooks/use-page-view";
import { Layout as DashboardLayout } from "../../../layouts/dashboard";
import { paths } from "../../../paths";
import { ListTable } from "../../../sections/dashboard/product/component/table";

//category
import { useSelector, useDispatch } from "react-redux";
import useDebounce from "../../../hooks/use-debounce";
import ModalProduct from "../../../sections/dashboard/product/component/modalProduct";
import { SearchToolbarTable } from "../../../sections/dashboard/product/component/searchToolbarTable";
import axiosInstance from "../../../utils/axios";

//toast
import { ToastMessage } from "../../../components/custom-toast";
import { fetchCategories } from "../../../redux/thunks/productThunks";
import { createCategory, getListImages, updateCategory } from "../../../services/product-service";

const TABLE_HEAD = [
    { id: "ten_vi", label: "Tên", minWidth: 60, align: "center" },
    { id: "noibat", label: "Nổi bật", minWidth: 80, align: "center" },
    { id: "hienthi", label: "Hiển thị", width: 180, align: "center" },
    { id: "action", label: "Sửa/Xoá", width: 180, align: "center" },
];

const useSearch = () => {
    const [search, setSearch] = useState({
        page: 0,
        rowsPerPage: 5,
    });

    return {
        search,
        updateSearch: setSearch,
    };
};

const CategoryList = () => {
    const { search, updateSearch } = useSearch();

    usePageView();

    const handlePageChange = useCallback(
        (event, page) => {
            setLoadingScreenTable(true);
            updateSearch((prevState) => ({
                ...prevState,
                page,
            }));
        },
        [updateSearch]
    );

    const handleRowsPerPageChange = useCallback(
        (event) => {
            setLoadingScreenTable(true);
            updateSearch((prevState) => ({
                ...prevState,
                page: 0,
                rowsPerPage: parseInt(event.target.value, 10),
            }));
        },
        [updateSearch]
    );

    // get Categories
    const dispatch = useDispatch();
    const { categoryList, categoryCount } = useSelector((state) => state.product.category);
    const getCategories = async () => {
        const params = {
            page: search.page,
            rowsPerPage: search.rowsPerPage,
            searchCategoryByName: searchCategoryByName,
        };
        dispatch(fetchCategories(params));
    };

    // useDebounce
    const [searchCategoryByName, setSearchCategoryByName] = useState("");
    const searchDebounce = useDebounce(searchCategoryByName, 500);

    useEffect(() => {
        setLoadingScreenTable(true);
        getCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    useEffect(() => {
        setLoadingScreenTable(true);
        updateSearch((prevState) => ({
            ...prevState,
            page: 0,
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchDebounce]);

    // open modal add category || child category || product
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const handleClickAdd = () => {
        setOpenModalCreate(true);
    };

    // handle submit category
    const handleCreateCategory = async (data) => {
        const res = await createCategory(data);
        if (res) {
            getCategories();
            return res;
        }
        return false;
    };

    // Update category
    const handleSubmittedUpdateCategory = async (data, id) => {
        const images = await getListImages(id);
        const imagesDelete = images.filter((item) => item.isdelete === true);
        if (imagesDelete.length > 0) {
            try {
                await axiosInstance.post("/upload/folder/delete", {
                    link: imagesDelete.map((item) => item.link),
                });
            } catch (error) {}
        }
        const res = await updateCategory(data, id);
        if (res) {
            getCategories();
            return res;
        }
        return false;
    };

    // loading screen table
    const [loadingScreenTable, setLoadingScreenTable] = useState(false);

    // delete category
    const handleDeleteCategory = async (e, data) => {
        setLoadingScreenTable(true);
        try {
            if (data && data.id) {
                const images = await getListImages(data.id);
                if (images.length > 0) {
                    const linkImage = images.map((item) => item.link);
                    try {
                        await axiosInstance.post("/upload/folder/delete", {
                            link: linkImage,
                        });
                    } catch (error) {}
                }
                try {
                    const res = await axiosInstance.delete(`/product/category/delete/${data.id}`);
                    if (res && res.data.DT) {
                        ToastMessage("Xoá danh mục thành công", "success");
                        getCategories();
                        setLoadingScreenTable(false);
                    }
                } catch (error) {
                    ToastMessage("Xoá thất bại", "error");
                    setLoadingScreenTable(false);
                }
            }
        } catch (error) {
            setLoadingScreenTable(false);
        }
    };
    return (
        <>
            <Head>
                <title>Dashboard: Product List | Zencomex</title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8,
                }}
            >
                <Container maxWidth="xl">
                    <Stack spacing={4}>
                        <Stack direction="row" justifyContent="space-between" spacing={4}>
                            <Stack spacing={1}>
                                <Typography variant="h4">Danh sách sản phẩm</Typography>
                                <Breadcrumbs separator={<BreadcrumbsSeparator />}>
                                    <Link
                                        color="text.primary"
                                        component={NextLink}
                                        href={paths.admin.index}
                                        variant="subtitle2"
                                    >
                                        Trang chủ
                                    </Link>

                                    <Typography color="text.secondary" variant="subtitle2">
                                        Danh mục
                                    </Typography>
                                </Breadcrumbs>
                            </Stack>
                            <Stack alignItems="center" direction="row" spacing={3}>
                                <Button
                                    onClick={handleClickAdd}
                                    startIcon={
                                        <SvgIcon>
                                            <PlusIcon />
                                        </SvgIcon>
                                    }
                                    variant="contained"
                                >
                                    Thêm
                                </Button>
                            </Stack>
                        </Stack>
                        <Card sx={{ position: "relative" }}>
                            <SearchToolbarTable
                                searchValue={searchCategoryByName}
                                onchangeSearchValue={setSearchCategoryByName}
                            />
                            <ListTable
                                onPageChange={handlePageChange}
                                onRowsPerPageChange={handleRowsPerPageChange}
                                page={search.page}
                                products={categoryList}
                                productsCount={categoryCount}
                                rowsPerPage={search.rowsPerPage}
                                headLabel={TABLE_HEAD}
                                type="category"
                                onDeleteRow={handleDeleteCategory}
                                onUpdateRow={handleSubmittedUpdateCategory}
                            />
                        </Card>
                    </Stack>
                </Container>
            </Box>
            {openModalCreate && (
                <ModalProduct
                    onClose={() => setOpenModalCreate(!openModalCreate)}
                    open={openModalCreate}
                    type="category"
                    create={true}
                    onSubmitted={handleCreateCategory}
                />
            )}
        </>
    );
};

CategoryList.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CategoryList;
