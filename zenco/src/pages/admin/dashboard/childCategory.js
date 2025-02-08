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
import { ToastMessage } from "../../../components/custom-toast";
import useDebounce from "../../../hooks/use-debounce";
import { fetchChildCategories } from "../../../redux/thunks/productThunks";
import ModalProduct from "../../../sections/dashboard/product/component/modalProduct";
import { SearchToolbarTable } from "../../../sections/dashboard/product/component/searchToolbarTable";
import { createChildCategory, getListImages, updateChildCategory } from "../../../services/product-service";
import axiosInstance from "../../../utils/axios";

const TABLE_HEAD = [
    { id: "ten_vi", label: "Tên", minWidth: 150, align: "center" },
    { id: "id_list", label: "Danh mục cấp 1", minWidth: 150, align: "center" },
    { id: "noibat", label: "Nổi bật", minWidth: 80, align: "center" },
    { id: "hienthi", label: "Hiển thị", width: 80, align: "center" },
    { id: "action", label: "Sửa/Xoá", width: 80, align: "center" },
];

const useSearch = () => {
    const [search, setSearch] = useState({
        filters: {
            name: undefined,
            category: [],
            status: [],
        },
        page: 0,
        rowsPerPage: 5,
    });

    return {
        search,
        updateSearch: setSearch,
    };
};

const ChildCategoryList = () => {
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
    const { childCategoryList, childCategoryCount } = useSelector((state) => state.product.childCategory);
    const getChildCategories = async () => {
        const params = {
            page: search.page,
            rowsPerPage: search.rowsPerPage,
            searchChildCategoryByName: searchChildCategoryByName,
        };
        dispatch(fetchChildCategories(params));
    };

    // useDebounce
    const [searchChildCategoryByName, setSearchChildCategoryByName] = useState("");
    const searchDebounce = useDebounce(searchChildCategoryByName, 500);

    useEffect(() => {
        setLoadingScreenTable(true);
        getChildCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    useEffect(() => {
        setLoadingScreenTable(true);
        updateSearch((prevState) => ({
            ...prevState,
            page: 0,
        }));
    }, [searchDebounce]);

    // open modal add category || child category || product
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const handleClickAdd = () => {
        setOpenModalCreate(true);
    };

    //---- category ------ //
    const [categoryList, setCategoryList] = useState([]);
    const getCategories = async () => {
        try {
            const categories = await axiosInstance.get(`/product/category`);
            if (categories && categories.data) {
                setCategoryList(categories.data.DT);
            }
        } catch (error) {
            // console.log("error", error);
        }
    };
    useEffect(() => {
        getCategories();
    }, []);

    const [loadingScreenTable, setLoadingScreenTable] = useState(true);
    // handle submit child category
    const handleCreateChildCategory = async (data) => {
        const res = await createChildCategory(data);
        if (res) {
            getChildCategories();
            return res;
        }
        return false;
    };

    // Update child category
    const handleSubmittedUpdateChildCategory = async (data, id) => {
        const images = await getListImages(id);
        const imagesDelete = images.filter((item) => item.isdelete === true);
        if (imagesDelete.length > 0) {
            try {
                await axiosInstance.post("/upload/folder/delete", {
                    link: imagesDelete.map((item) => item.link),
                });
            } catch (error) {}
        }
        const res = await updateChildCategory(data, id);
        if (res) {
            getChildCategories();
            return res;
        }
        return false;
    };

    const handleDeleteChildCategory = async (e, data) => {
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
                    const res = await axiosInstance.delete(`/product/child-category/delete/${data.id}`);
                    if (res && res.data.DT) {
                        ToastMessage("Xoá danh mục con thành công", "success");
                        getChildCategories();
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
                                        href={paths.admin.dashboard.index}
                                        variant="subtitle2"
                                    >
                                        Trang chủ
                                    </Link>

                                    <Typography color="text.secondary" variant="subtitle2">
                                        Danh mục con
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
                        <Card>
                            <SearchToolbarTable
                                searchValue={searchChildCategoryByName}
                                onchangeSearchValue={setSearchChildCategoryByName}
                            />
                            <ListTable
                                onPageChange={handlePageChange}
                                onRowsPerPageChange={handleRowsPerPageChange}
                                page={search.page}
                                products={childCategoryList}
                                productsCount={childCategoryCount}
                                rowsPerPage={search.rowsPerPage}
                                headLabel={TABLE_HEAD}
                                type="childCategory"
                                categoryList={categoryList}
                                onDeleteRow={handleDeleteChildCategory}
                                onUpdateRow={handleSubmittedUpdateChildCategory}
                            />
                        </Card>
                    </Stack>
                </Container>
            </Box>
            {openModalCreate && (
                <ModalProduct
                    onClose={() => setOpenModalCreate(!openModalCreate)}
                    open={openModalCreate}
                    type="childCategory"
                    create={true}
                    category={categoryList}
                    onSubmitted={handleCreateChildCategory}
                />
            )}
        </>
    );
};

ChildCategoryList.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ChildCategoryList;
