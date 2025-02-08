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
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../../utils/axios";

// use debounce
import { ToastMessage } from "../../../components/custom-toast";
import useDebounce from "../../../hooks/use-debounce";
import { fetchProducts } from "../../../redux/thunks/productThunks";
import ModalProduct from "../../../sections/dashboard/product/component/modalProduct";
import { SearchToolbarTable } from "../../../sections/dashboard/product/component/searchToolbarTable";
import { createProduct, getListImages, updateProduct } from "../../../services/product-service";
import { FilterToolbarTable } from "../../../sections/dashboard/product/component/filterToolbarTable";

const TABLE_HEAD = [
    { id: "ten_vi", label: "Tên", minWidth: 150, align: "center" },
    { id: "id_list", label: "Danh mục cấp 1", minWidth: 150, align: "center" },
    { id: "id_cat", label: "Danh mục cấp 2", minWidth: 150, align: "center" },
    { id: "noibat", label: "Nổi bật", minWidth: 80, align: "center" },
    { id: "hienthi", label: "Hiển thị", width: 80, align: "center" },
    { id: "action", label: "Sửa/Xoá", width: 80, align: "center" },
];

const useSearch = () => {
    const [search, setSearch] = useState({
        filters: {
            category: {},
            childCategory: {},
        },
        page: 0,
        rowsPerPage: 5,
    });

    return {
        search,
        updateSearch: setSearch,
    };
};

const ProductList = () => {
    const { search, updateSearch } = useSearch();

    usePageView();

    const handlePageChange = useCallback(
        (event, page) => {
            updateSearch((prevState) => ({
                ...prevState,
                page,
            }));
        },
        [updateSearch]
    );

    const handleRowsPerPageChange = useCallback(
        (event) => {
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
    const { productList, productCount } = useSelector((state) => state.product.product);
    const { loading } = useSelector((state) => state.product);

    const getProducts = async () => {
        const params = {
            page: search.page,
            rowsPerPage: search.rowsPerPage,
            searchProductByName: searchProductByName,
            filterProductByCategory: categoryFilter?.id,
            filterProductByChildCategory: childCategoryFilter?.id,
        };
        dispatch(fetchProducts(params));
    };

    // useDebounce
    const [searchProductByName, setSearchProductByName] = useState("");
    const searchDebounce = useDebounce(searchProductByName, 500);

    useEffect(() => {
        getProducts();
    }, [search]);

    useEffect(() => {
        updateSearch((prevState) => ({
            ...prevState,
            page: 0,
        }));
    }, [searchDebounce]);

    // category
    const [categoryList, setCategoryList] = useState([]);

    const [categorySelected, setCategorySelected] = useState("");
    useEffect(() => {
        getChildCategories();
    }, [categorySelected]);
    const getCategories = async () => {
        try {
            const categories = await axiosInstance.get(`/admin/product/category`);
            if (categories && categories.data) {
                setCategoryList(categories.data.DT);
            }
        } catch (error) {
            // console.log("error", error);
        }
    };
    // child category
    const [childCategoryList, setChildCategoryList] = useState([]);
    const getChildCategories = async () => {
        try {
            const childCategory = await axiosInstance.get(`/admin/product/child-category?id_list=${categorySelected}`);
            if (childCategory && childCategory.data) {
                setChildCategoryList(childCategory.data.DT);
            }
        } catch (error) {
            // console.log("error", error);
        }
    };

    useEffect(() => {
        getCategories();
        getChildCategories();
    }, []);

    // handle submit create product
    const handleCreateProduct = async (data) => {
        const res = await createProduct(data);
        if (res) {
            getProducts();
            return res;
        }
        return false;
    };

    // Update product
    const handleSubmittedUpdateProduct = async (data, id) => {
        const images = await getListImages(id);
        const imagesDelete = images.filter((item) => item.isdelete === true);
        if (imagesDelete.length > 0) {
            try {
                await axiosInstance.post("/upload/folder/delete", {
                    link: imagesDelete.map((item) => item.link),
                });
            } catch (error) {}
        }
        const res = await updateProduct(data, id);
        if (res) {
            getProducts();
            return res;
        }
        return false;
    };

    const handleDeleteProduct = async (e, data) => {
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
                    const res = await axiosInstance.delete(`/product/delete/${data.id}`);
                    if (res && res.data.DT) {
                        ToastMessage("Xoá sản phẩm thành công", "success");
                        getProducts();
                    }
                } catch (error) {
                    ToastMessage("Xoá sản phẩm thất bại", "error");
                }
            }
        } catch (error) {}
    };

    // open modal add category || child category || product
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const handleClickAdd = () => {
        setCategorySelected("");
        setOpenModalCreate(true);
    };

    //Filter
    const [categoryFilter, setCategoryFilter] = useState(null);
    const [childCategoryFilter, setChildCategoryFilter] = useState(null);
    const handleChangeCategoryFilter = (category) => {
        setCategoryFilter(category);
        setCategorySelected(category ? category.id : "");
        setChildCategoryFilter(null);
        updateSearch((prevState) => ({
            ...prevState,
            filters: {
                ...prevState.filters,
                category: category,
            },
            page: 0,
        }));
    };
    const handleChangeChildCategoryFilter = (childCategory) => {
        setChildCategoryFilter(childCategory);
        updateSearch((prevState) => ({
            ...prevState,
            filters: {
                ...prevState.filters,
                childCategory: childCategory,
            },
            page: 0,
        }));
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
                                    <Link
                                        color="text.primary"
                                        component={NextLink}
                                        href={paths.admin.dashboard.index}
                                        variant="subtitle2"
                                    >
                                        Sản phẩm
                                    </Link>
                                    <Typography color="text.secondary" variant="subtitle2">
                                        Danh sách sản phẩm
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
                            <FilterToolbarTable
                                categoryList={categoryList}
                                childCategoryList={childCategoryList}
                                categorySelected={categoryFilter}
                                childCategorySelected={childCategoryFilter}
                                onChangeCategory={handleChangeCategoryFilter}
                                onChangeChildCategory={handleChangeChildCategoryFilter}
                            />
                            <SearchToolbarTable
                                searchValue={searchProductByName}
                                onchangeSearchValue={setSearchProductByName}
                            />
                            <ListTable
                                onPageChange={handlePageChange}
                                onRowsPerPageChange={handleRowsPerPageChange}
                                page={search.page}
                                products={productList}
                                productsCount={productCount}
                                rowsPerPage={search.rowsPerPage}
                                headLabel={TABLE_HEAD}
                                type="product"
                                categoryFilter={categoryFilter}
                                categoryList={categoryList}
                                childCategoryList={childCategoryList}
                                onDeleteRow={handleDeleteProduct}
                                onUpdateRow={handleSubmittedUpdateProduct}
                                onChangeCategorySelected={setCategorySelected}
                            />
                        </Card>
                    </Stack>
                </Container>
            </Box>
            {openModalCreate && (
                <ModalProduct
                    onClose={() => {
                        if (categoryFilter !== null) {
                            setCategorySelected(categoryFilter.id);
                        }
                        setOpenModalCreate(!openModalCreate);
                    }}
                    open={openModalCreate}
                    type="product"
                    category={categoryList}
                    childCategory={childCategoryList}
                    create={true}
                    onSubmitted={handleCreateProduct}
                    onChangeCategorySelected={setCategorySelected}
                />
            )}
        </>
    );
};

ProductList.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default ProductList;
