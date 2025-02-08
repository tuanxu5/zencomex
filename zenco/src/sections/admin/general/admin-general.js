import { Box, Button, Card, Grid, Stack, SvgIcon, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance, { BASE_URL } from "../../../utils/axios";
//icons
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import LoadingScreen from "../../../components/loading-screen";
import { isValidUrl } from "../../home/component/card-product";

import { ToastMessage } from "../../../components/custom-toast";
import PaginationComponent from "../../../components/panigation";
import { getListImages } from "../../../services/product-service";
import BoxIcon from "../../components/buttons/box-for-icon";
import { IconDelete, IconEdit } from "../../components/buttons/button-mui";
import { ModalWarningDelete } from "../../components/modals/modal-8";
import AdminModalGeneralDetail from "./admin-modal-general-detail";

const ViewAdminGeneral = ({ generalSelected }) => {
    const folderByType = () => {
        if (generalSelected) {
            if (generalSelected.alias === "") return "home";
            if (generalSelected.alias === "dich-vu") return "service";
            if (generalSelected.alias === "tuyen-dung") return "recruitment";
            if (generalSelected.alias === "du-an") return "project";
            if (generalSelected.alias === "tin-tuc") return "news";
            if (generalSelected.alias === "xuat-nhap-khau") return "exportimport";
            if (generalSelected.alias === "chinh-sach-ho-tro") return "policy";
        }
    };
    //
    const [generalList, setGeneralList] = useState([]);
    // category
    const [categoryList, setCategoryList] = useState([]);

    const [loading, setLoading] = useState(false);
    const getGeneralList = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(
                `/general/${generalSelected?.alias === "" ? "trang-chu" : generalSelected?.alias}?page=${
                    page.pageIndex - 1
                }&pageSize=${page.pageSize}`
            );
            if (response && response.data.DT) {
                setTotalPage(Math.ceil(response.data.total / page.pageSize));
                setGeneralList(response.data.DT);
            }
            setTimeout(() => {
                setLoading(false);
            }, 200);
        } catch (error) {
            console.error(error);
        }
    };
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
    useEffect(() => {
        getGeneralList();
        getCategories();
    }, [generalSelected]);

    //pagination
    const defaultPage = {
        pageIndex: 1,
        pageSize: 10,
    };
    const [page, setPage] = useState(defaultPage);
    const [totalPage, setTotalPage] = useState(0);

    const handlePageChange = (value) => {
        setPage({ ...page, pageIndex: value });
    };

    useEffect(() => {
        getGeneralList();
    }, [page.pageIndex]);

    // Modal Warning Delete
    const [childGeneralSelected, setChildGeneralSelected] = useState(null);
    const [openWarning, setOpenWarning] = useState(false);
    const handleClickDelete = (item) => {
        setChildGeneralSelected(item);
        setOpenWarning(true);
    };
    const handleCloseModalWarning = () => {
        setOpenWarning(false);
        setChildGeneralSelected(null);
    };

    const handleAcceptDelete = async () => {
        setLoading(true);
        try {
            if (childGeneralSelected && childGeneralSelected.id) {
                const images = await getListImages(childGeneralSelected.id);

                if (images.length > 0) {
                    const linkImage = images.map((item) => item.link);
                    try {
                        await axiosInstance.post("/upload/folder/delete", {
                            link: linkImage,
                        });
                    } catch (error) {}
                }
                try {
                    const res = await axiosInstance.delete(`/general/delete/${childGeneralSelected.id}`);
                    if (res && res.data.DT) {
                        ToastMessage("Xoá danh mục thành công", "success");
                        getGeneralList();
                        handleCloseModalWarning();
                        setLoading(false);
                    }
                } catch (error) {
                    ToastMessage("Xoá thất bại", "error");
                    setLoading(false);
                }
            }
        } catch (error) {
            setLoading(false);
        }
    };

    // modal edit general item
    const [openEdit, setOpenEdit] = useState(false);
    const handleClickEdit = (item) => {
        setChildGeneralSelected(item);
        setOpenEdit(true);
    };
    const handleCloseModalEdit = () => {
        setOpenEdit(false);
        setChildGeneralSelected(null);
    };
    // modal create general item
    const [openCreate, setOpenCreate] = useState(false);
    const handleClickCreate = () => {
        setOpenCreate(true);
    };
    const handleCloseModalCreate = () => {
        setOpenCreate(false);
    };

    // handle submit category
    const handleCreateGeneral = async (data) => {
        const newData = {
            ...data,
            type: generalSelected?.alias === "" ? "trang-chu" : generalSelected?.alias,
        };
        try {
            const response = await axiosInstance.post(`/general/create`, newData);
            if (response && response.data.DT) {
                getGeneralList();
                return response;
            }
            return false;
        } catch (error) {
            return false;
        }
    };
    const handleUpdateGeneral = async (data) => {
        const images = await getListImages(childGeneralSelected.id);
        const imagesDelete = images.filter((item) => item.isdelete === true);
        if (imagesDelete.length > 0) {
            try {
                await axiosInstance.post("/upload/folder/delete", {
                    link: imagesDelete.map((item) => item.link),
                });
            } catch (error) {}
        }
        try {
            const response = await axiosInstance.post(`/general/update/${childGeneralSelected.id}`, data);
            if (response && response.data.DT) {
                getGeneralList();
                return response;
            }
            return false;
        } catch (error) {
            return false;
        }
    };

    return (
        <Box p={4}>
            <Stack direction="row" justifyContent="space-between">
                <Typography variant="h4">Danh sách - {generalSelected?.title}</Typography>
                <Button
                    onClick={handleClickCreate}
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
            <Box>
                {loading && <LoadingScreen />}
                <Grid container mt={2} spacing={2}>
                    {generalList.map((item, index) => (
                        <Grid key={index} item mt={1} xs={12} sm={6} md={4} lg={3} xl={2.4}>
                            <Box
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    justifyItems: "center",
                                    padding: "0 5px", // Thêm khoảng cách bên trái và bên phải
                                }}
                            >
                                <Box
                                    style={{
                                        background: "#f5f5f5",
                                        padding: "10px",
                                        borderRadius: "10px",
                                        textAlign: "center",
                                        maxWidth: "230px", // Giới hạn kích thước tối đa của item
                                        margin: "0 auto", // Căn giữa item trong slider
                                        height: 350, // Độ cao của item
                                        boxSizing: "border-box",
                                        minWidth: "230px",
                                    }}
                                >
                                    <Card
                                        sx={{
                                            borderRadius: 0,
                                            width: "100%",
                                            height: 200,
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={`${BASE_URL}/upload/baiviet/${item.image}`}
                                            sx={{
                                                height: 200,
                                                width: "100%",
                                                objectFit: "center",
                                                objectPosition: "center",
                                                transition: "transform 0.3s ease-in-out",
                                                "&:hover": {
                                                    transform: "scale(1.2)",
                                                },
                                                cursor: "pointer",
                                            }}
                                            alt={`Hình ảnh ${item.name}`}
                                        />
                                    </Card>

                                    <Stack
                                        spacing={1}
                                        alignItems="center"
                                        justifyItems="center"
                                        sx={{
                                            width: "100%",
                                        }}
                                        p={1}
                                    >
                                        <Typography
                                            sx={{
                                                textAlign: "center",
                                                fontSize: 15,
                                                fontWeight: 600,
                                                display: "-webkit-box",
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                                WebkitLineClamp: 2, // Số dòng tối đa
                                                textOverflow: "ellipsis",
                                                lineHeight: 1.6, // Đảm bảo độ cao dòng nhất quán
                                                height: "3.2em",
                                            }}
                                            title={item.title}
                                        >
                                            {item.title}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                textAlign: "center",
                                                fontSize: 13,
                                                fontWeight: 300,
                                                display: "-webkit-box",
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                                WebkitLineClamp: 3, // Số dòng tối đa
                                                textOverflow: "ellipsis",
                                                lineHeight: 1.2, // Đảm bảo độ cao dòng nhất quán
                                                height: "3.5em",
                                                fontStyle: "italic",
                                            }}
                                            title={item.intro}
                                        >
                                            {item.intro}
                                        </Typography>
                                        <Stack width="90%" direction="row" spacing={1} justifyContent="space-between">
                                            <BoxIcon onClick={() => handleClickDelete(item)}>
                                                <IconDelete />
                                            </BoxIcon>
                                            <BoxIcon
                                                onClick={() => {
                                                    handleClickEdit(item);
                                                }}
                                            >
                                                <IconEdit />
                                            </BoxIcon>
                                        </Stack>
                                    </Stack>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <PaginationComponent onPageChange={handlePageChange} totalPage={totalPage} pageIndex={page.pageIndex} />
            {openWarning && (
                <ModalWarningDelete
                    open={openWarning}
                    onClose={handleCloseModalWarning}
                    title={`Xóa - ${generalSelected?.title}`}
                    name={childGeneralSelected?.title}
                    onAccept={handleAcceptDelete}
                />
            )}
            {openCreate && (
                <AdminModalGeneralDetail
                    open={openCreate}
                    onClose={handleCloseModalCreate}
                    type={folderByType()}
                    create={true}
                    onSubmitted={handleCreateGeneral}
                    category={categoryList}
                />
            )}
            {openEdit && (
                <AdminModalGeneralDetail
                    open={openEdit}
                    data={childGeneralSelected}
                    onClose={handleCloseModalEdit}
                    type={folderByType()}
                    onSubmitUpdate={handleUpdateGeneral}
                    category={categoryList}
                />
            )}
        </Box>
    );
};

export default ViewAdminGeneral;
