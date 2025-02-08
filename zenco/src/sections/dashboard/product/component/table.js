import {
    Box,
    Button,
    Popover,
    Stack,
    SvgIcon,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
} from "@mui/material";
import Image01Icon from "@untitled-ui/icons-react/build/esm/Image01";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Scrollbar } from "../../../../components/scrollbar";
import ModalProduct from "./modalProduct";

//icons
import ClearIcon from "@mui/icons-material/Clear";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import EditIcon from "@mui/icons-material/Edit";
import LoadingTableScreen from "../../../../components/loading-table";
import { useSelector } from "react-redux";

export const ListTable = (props) => {
    const {
        onUpdateRow, //update category, product, childCategory
        onDeleteRow, //delete category, product, childCategory
        categoryFilter,
        categoryList,
        childCategoryList,
        onChangeCategorySelected,
        type, //category or product or childCategory
        selected,
        onSelectRow,
        orderBy,
        onSort,
        onPageChange,
        onRowsPerPageChange,
        page,
        products,
        productsCount,
        rowsPerPage,
        headLabel,
        ...other
    } = props;

    const { loading } = useSelector((state) => state.product);
    // Onclick row
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [dataUpdate, setDataUpdate] = useState({});

    const handleRowClick = (data) => {
        setOpenModalUpdate(true);
        if (type === "product") {
            onChangeCategorySelected(data.id_list);
        }
        setDataUpdate(data);
        localStorage.setItem("idProduct", data.id);
    };

    const handleClose = () => {
        setOpenModalUpdate(false);
        setDataUpdate({});
        if (type === "product") {
            if (categoryFilter !== null) {
                onChangeCategorySelected(categoryFilter?.id);
            }
        }
        localStorage.removeItem("idProduct");
    };
    //
    const [anchorEl, setAnchorEl] = useState(null);

    const [currentProduct, setCurrentProduct] = useState(null);
    const handleClickDelete = (event, product) => {
        setAnchorEl(event.currentTarget);
        setCurrentProduct(product);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
        setCurrentProduct(null);
    };

    const open = Boolean(anchorEl);
    useEffect(() => {
        setAnchorEl(null);
    }, [products]);
    return (
        <div {...other}>
            <Box position="relative">
                <Scrollbar>
                    <Box sx={{ position: "relative" }}>
                        {loading && <LoadingTableScreen />}
                        <Table sx={{ minWidth: 800 }}>
                            <TableHead>
                                <TableRow>
                                    {headLabel.map((headCell) => (
                                        <TableCell align="center" key={headCell.id}>
                                            {headCell.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {products &&
                                    products.map((product, index) => {
                                        const newRow = headLabel.map((title) => title.id);
                                        const renderRow = (item, key) => {
                                            if (item === "ten_vi") {
                                                return (
                                                    <TableCell key={key} align="left">
                                                        {product[item]}
                                                    </TableCell>
                                                );
                                            }
                                            if (item === "photo") {
                                                return (
                                                    <TableCell key={key} width="25%">
                                                        <Box
                                                            sx={{
                                                                alignItems: "center",
                                                                display: "flex",
                                                            }}
                                                        >
                                                            {product.image ? (
                                                                <Box
                                                                    sx={{
                                                                        alignItems: "center",
                                                                        backgroundColor: "neutral.50",
                                                                        backgroundImage: `url("../../../../../public/upload/product/${product.image}")`,
                                                                        backgroundPosition: "center",
                                                                        backgroundSize: "cover",
                                                                        borderRadius: 1,
                                                                        display: "flex",
                                                                        height: 80,
                                                                        justifyContent: "center",
                                                                        overflow: "hidden",
                                                                        width: 80,
                                                                    }}
                                                                />
                                                            ) : (
                                                                <Box
                                                                    sx={{
                                                                        alignItems: "center",
                                                                        backgroundColor: "neutral.50",
                                                                        borderRadius: 1,
                                                                        display: "flex",
                                                                        height: 80,
                                                                        justifyContent: "center",
                                                                        width: 80,
                                                                    }}
                                                                >
                                                                    <SvgIcon>
                                                                        <Image01Icon />
                                                                    </SvgIcon>
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    </TableCell>
                                                );
                                            }

                                            if (item === "noibat") {
                                                return (
                                                    <TableCell key={key} align="center">
                                                        <Switch
                                                            checked={product[item] === 1 ? true : false}
                                                            onChange={(e) => {
                                                                const newData = {
                                                                    noibat: e.target.checked ? 1 : 0,
                                                                };
                                                                onUpdateRow(newData, product.id);
                                                            }}
                                                            inputProps={{ "aria-label": "controlled" }}
                                                        />
                                                    </TableCell>
                                                );
                                            }
                                            if (item === "hienthi") {
                                                return (
                                                    <TableCell key={key} align="center">
                                                        <Switch
                                                            checked={product[item] === 1 ? true : false}
                                                            onChange={(e) => {
                                                                const newData = {
                                                                    hienthi: e.target.checked ? 1 : 0,
                                                                };
                                                                onUpdateRow(newData, product.id);
                                                            }}
                                                            inputProps={{ "aria-label": "controlled" }}
                                                        />
                                                    </TableCell>
                                                );
                                            }
                                            if (item === "id_list") {
                                                const category =
                                                    categoryList && categoryList.find((i) => i.id === product[item]);
                                                return (
                                                    <TableCell key={key} align="center">
                                                        {category ? category.ten_vi : ""}
                                                    </TableCell>
                                                );
                                            }
                                            if (item === "id_cat") {
                                                const childCategory =
                                                    childCategoryList &&
                                                    childCategoryList.find((i) => i.id === product[item]);
                                                return (
                                                    <TableCell key={key} align="center">
                                                        {childCategory ? childCategory.ten_vi : ""}
                                                    </TableCell>
                                                );
                                            }

                                            if (item === "action") {
                                                return (
                                                    <TableCell key={key} align="center">
                                                        <Stack direction="row" justifyContent="center">
                                                            <Button
                                                                onClick={() => handleRowClick(product)}
                                                                sx={{
                                                                    borderRadius: "50%",
                                                                    minWidth: "40px",
                                                                    height: "45px",
                                                                    "&:hover": {
                                                                        color: "green",
                                                                        backgroundColor: "pink",
                                                                    },
                                                                }}
                                                            >
                                                                <EditIcon />
                                                            </Button>
                                                            <Button
                                                                onClick={(e) => handleClickDelete(e, product)}
                                                                sx={{
                                                                    borderRadius: "50%",
                                                                    minWidth: "40px",
                                                                    height: "45px",
                                                                    "&:hover": {
                                                                        color: "red",
                                                                        backgroundColor: "pink",
                                                                    },
                                                                }}
                                                            >
                                                                <DeleteForeverIcon />
                                                            </Button>
                                                        </Stack>
                                                    </TableCell>
                                                );
                                            }

                                            return (
                                                <TableCell key={key} align="center">
                                                    {product[item]}
                                                </TableCell>
                                            );
                                        };
                                        return (
                                            <TableRow
                                                key={index}
                                                hover
                                                selected={selected !== -1}
                                                sx={{
                                                    cursor: "pointer",
                                                    "& .MuiSvgIcon-root": {
                                                        width: "20px",
                                                    },

                                                    "& td": {
                                                        borderRight: "0 !important",
                                                    },
                                                }}
                                            >
                                                {newRow.map((item, index) => renderRow(item, index))}
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </Box>
                </Scrollbar>
            </Box>

            <TablePagination
                component="div"
                count={productsCount}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
            />
            {/* // Modal update */}
            {openModalUpdate && (
                <ModalProduct
                    onClose={handleClose}
                    open={openModalUpdate}
                    product={dataUpdate}
                    type={type}
                    category={categoryList}
                    childCategory={childCategoryList}
                    onSubmittedUpdate={onUpdateRow}
                    onChangeCategorySelected={onChangeCategorySelected}
                />
            )}
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                <Stack direction="row" justifyContent="center">
                    <Button
                        onClick={handleClosePopover}
                        sx={{
                            // borderRadius: "50%",
                            minWidth: "20px",
                            minHeight: "20px",
                            "&:hover": {
                                color: "red",
                                backgroundColor: "pink",
                            },
                        }}
                    >
                        <ClearIcon />
                    </Button>
                    <Button
                        onClick={(e) => onDeleteRow(e, currentProduct)}
                        sx={{
                            // borderRadius: "50%",
                            minWidth: "20px",
                            minHeight: "20px",
                            "&:hover": {
                                color: "white",
                                backgroundColor: "green",
                            },
                        }}
                    >
                        <DoneAllIcon />
                    </Button>
                </Stack>
            </Popover>
        </div>
    );
};
ListTable.propTypes = {
    products: PropTypes.array.isRequired,
    productsCount: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onRowsPerPageChange: PropTypes.func,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};
