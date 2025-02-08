import { Box, Container, Grid, Input, Stack, SvgIcon, Typography, useMediaQuery } from "@mui/material";
import SearchMdIcon from "@untitled-ui/icons-react/build/esm/SearchMd";
import { useEffect, useState } from "react";
import LoadingScreen from "../../../components/loading-screen";
import PaginationComponent from "../../../components/panigation";
import { BoxEmpty } from "../../../components/view-layout/box-empty";
import useDebounce from "../../../hooks/use-debounce";
import CardProduct from "../../../sections/home/component/card-product";
import { MenuCategory } from "../../../sections/home/component/menu-category";
import axiosInstance from "../../../utils/axios";
import CardNewList from "../general/view-news-list";
import ViewProductDescription from "./view-product-description";

const ViewProductList = (props) => {
    const { detail, setBreadcrumbsList, search } = props;

    //-----------------responsive---------------//
    const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
    const smUp = useMediaQuery((theme) => theme.breakpoints.up("sm"));
    const xlUp = useMediaQuery((theme) => theme.breakpoints.up("xl"));

    const defaultBreadcrumb = [
        {
            id: 1,
            title: "Trang chủ",
            alias: "",
        },
        {
            id: 2,
            title: "Sản phẩm",
            alias: "",
        },
    ];

    const defaultPage = {
        pageSize: 20,
        pageIndex: 1,
    };

    //------------ Pagination ------------//
    const [page, setPage] = useState(defaultPage);
    const [totalPage, setTotalPage] = useState(0);
    const [products, setProducts] = useState([]);
    const [news, setNews] = useState([]);
    const [loadingProduct, setLoadingProduct] = useState(false);

    // category
    const [category, setCategory] = useState(() => {
        detail ? detail : null;
    });
    const [expandCategoryIndex, setExpandCategoryIndex] = useState(null);

    const [activeId, setActiveId] = useState(() => {
        return detail ? detail.id : null;
    });

    // search
    const [searchValue, setSearchValue] = useState(() => {
        if (search && search.length > 0) {
            return search;
        }
        return "";
    });

    useEffect(() => {
        if (search && search.length > 0) {
            setSearchValue(search);
        }
    }, [search]);

    // Get products
    const checkId = () => {
        if (detail.type === "san-pham") return "";
        if (detail) {
            if (detail.type === "category") {
                return `&id_list=${detail.id}`;
            }
            if (detail.type === "childCategory") {
                return `&id_cat=${detail.id}`;
            }
        }
        return "";
    };

    const getProducts = async () => {
        setLoadingProduct(true);
        try {
            const products = await axiosInstance.get(
                `/product/list?page=${page.pageIndex - 1}&pageSize=${page.pageSize}${checkId()}&name=${searchValue}`
            );
            if (products && products.data.DT) {
                const newProducts = products.data.DT.map((item) => {
                    return {
                        id: item.id,
                        name: item.ten_vi,
                        price: item.price,
                        description: item.mota_vi,
                        image: item.photo,
                        alias: item.tenkhongdau,
                    };
                });
                setTotalPage(Math.ceil(products.data.total / page.pageSize));
                setProducts(newProducts);
            }
        } catch (error) {
            console.log("error", error);
        }
        setTimeout(() => {
            setLoadingProduct(false);
        }, 200);
    };

    const getNewsList = async () => {
        if (detail) {
            try {
                const idCategory = detail.type === "category" ? detail.id : "";

                const response = await axiosInstance.get(`/general/tin-tuc?page=0&pageSize=10&category=${idCategory}`);
                if (response && response.data && response.data.DT) {
                    setNews(response.data.DT);
                }
            } catch (error) {
                console.log("error", error);
            }
        }
    };

    useEffect(() => {
        setPage(defaultPage);
        if (detail.type === "san-pham") {
            setCategory(null);
            setActiveId(null);
            setExpandCategoryIndex(null);
            setBreadcrumbsList(defaultBreadcrumb);
        } else {
            setCategory(detail);
            setActiveId(detail.id);
            if (detail.type === "childCategory" || detail.type === "product") {
                setExpandCategoryIndex(detail.parent.id);
            }
        }
        getProducts();
        getNewsList();
    }, [detail]);

    const handlePageChange = (value) => {
        setPage({ ...page, pageIndex: value });
    };

    useEffect(() => {
        window.scrollTo({
            top: 200,
            behavior: "smooth",
        });
        getProducts();
    }, [page]);

    //------------ Category ------------//
    const changeBreadScrums = () => {
        if (category) {
            setBreadcrumbsList(() => {
                if (category.type === "category") {
                    return [
                        ...defaultBreadcrumb,
                        {
                            id: category.id,
                            title: category.title,
                            alias: category.alias,
                            type: category.type,
                        },
                    ];
                }
                if (category.type === "childCategory") {
                    return [
                        ...defaultBreadcrumb,
                        {
                            id: category.parent.id,
                            title: category.parent.title,
                            alias: category.parent.alias,
                            type: category.parent.type,
                        },
                        {
                            id: category.id,
                            title: category.title,
                            alias: category.alias,
                            type: category.type,
                        },
                    ];
                }
            });
        }
    };

    useEffect(() => {
        changeBreadScrums();
    }, [category]);

    const searchDebounce = useDebounce(searchValue, 500);
    useEffect(() => {
        setPage(defaultPage);
    }, [searchDebounce]);

    return (
        <>
            <Container maxWidth="xxl">
                {loadingProduct && <LoadingScreen />}
                <Box position="relative">
                    <Grid container spacing={2}>
                        {mdUp && (
                            <Grid item xs={xlUp ? 3.4 : 5}>
                                <Stack spacing={2}>
                                    <Box
                                        sx={{
                                            backgroundColor: "#f5fbfd",
                                            borderRadius: 1,
                                        }}
                                    >
                                        <Stack>
                                            <Box
                                                sx={{
                                                    backgroundColor: "#BBDEFB",
                                                    height: 35,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    borderRadius: 1,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: 18,
                                                        fontWeight: 700,
                                                        pl: 2,
                                                    }}
                                                >
                                                    Danh mục sản phẩm
                                                </Typography>
                                            </Box>

                                            <MenuCategory activeId={activeId} expandIndex={expandCategoryIndex} />
                                        </Stack>
                                    </Box>

                                    <CardNewList news={news} />
                                </Stack>
                            </Grid>
                        )}
                        <Grid item xs={mdUp ? (xlUp ? 8.6 : 7) : 12}>
                            <Stack>
                                <Box
                                    sx={{
                                        height: mdUp ? "5vh" : "15vh",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <Stack
                                        direction={smUp ? "row" : "column"}
                                        sx={{
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            justifyItems: "",
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: "20px !important",
                                                pl: 2,
                                            }}
                                            variant="h1"
                                        >
                                            {category ? category.title : "Tất cả sản phẩm"}
                                        </Typography>
                                        <Stack
                                            alignItems="center"
                                            component="form"
                                            direction="row"
                                            spacing={1}
                                            sx={{ p: 2 }}
                                        >
                                            <Input
                                                disableUnderline
                                                fullWidth
                                                // inputProps={{ ref: queryRef }}
                                                placeholder="Tìm sản phẩm"
                                                sx={{ flexGrow: 1, border: "1px solid #ccc", borderRadius: 5, pl: 2 }}
                                                value={searchValue}
                                                onChange={(e) => {
                                                    setSearchValue(e.target.value);
                                                }}
                                            />
                                            <SvgIcon sx={{ cursor: "pointer", color: "#1976D2" }}>
                                                <SearchMdIcon />
                                            </SvgIcon>
                                        </Stack>
                                    </Stack>
                                </Box>
                                <Box sx={{ mt: 1 }}>
                                    {products.length === 0 ? (
                                        <BoxEmpty note={" Sản phẩm hiện đang chờ cập nhật..."} />
                                    ) : (
                                        <>
                                            <Grid container justifyContent="flex-start" spacing={2}>
                                                {products.map((child) => {
                                                    return (
                                                        <Grid
                                                            item
                                                            key={child.id}
                                                            xs={6} // Chiếm toàn bộ chiều rộng trên thiết bị nhỏ
                                                            sm={4} // Chiếm nửa chiều rộng trên thiết bị trung bình
                                                            md={6} // Chiếm 1/3 chiều rộng trên thiết bị lớn
                                                            lg={4} // Chiếm 1/4 chiều rộng trên thiết bị rất lớn
                                                            xl={3} // Chiếm 1/5 chiều rộng trên thiết bị rất lớn
                                                        >
                                                            <CardProduct child={child} />
                                                        </Grid>
                                                    );
                                                })}
                                            </Grid>

                                            <PaginationComponent
                                                onPageChange={handlePageChange}
                                                totalPage={totalPage}
                                                pageIndex={page.pageIndex}
                                            />
                                            {products.length <= 16 && (
                                                <Container maxWidth="lg" sx={{ padding: "0" }}>
                                                    {detail && detail.description && detail.description.length > 0 && (
                                                        <ViewProductDescription
                                                            data={detail.description}
                                                            type={detail.type}
                                                            sx={{ mt: 4 }}
                                                        />
                                                    )}
                                                </Container>
                                            )}
                                        </>
                                    )}
                                </Box>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
            {products.length > 16 && (
                <Container maxWidth="lg" sx={{ padding: "0" }}>
                    {detail && detail.description && detail.description.length > 0 && (
                        <ViewProductDescription data={detail.description} type={detail.type} sx={{ mt: 4 }} />
                    )}
                </Container>
            )}
        </>
    );
};

export default ViewProductList;
