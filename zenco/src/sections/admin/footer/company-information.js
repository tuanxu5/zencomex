import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Container, Grid, Stack, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import CustomTextField from "../../../components/custom-textfield";
import { ToastMessage } from "../../../components/custom-toast";
import axiosInstance, { BASE_URL } from "../../../utils/axios";
import BoxIcon from "../../components/buttons/box-for-icon";
import { IconBack } from "../../components/buttons/button-mui";
import { FileUpload } from "../../../components/file-upload";
import { fileToBase64 } from "../../../utils/file-to-base64";
import { FileView } from "../../../components/file-view";

const CompanyInformation = () => {
    const smUp = useMediaQuery((theme) => theme.breakpoints.up("sm"));
    const getFooter = async () => {
        try {
            const footer = await axiosInstance.get("/footer");
            if (footer && footer.data.DT) {
                const oldData = footer.data.DT;
                const data = oldData.overview.concat(
                    oldData.certification,
                    oldData.policies,
                    oldData.sales,
                    oldData.socials,
                    oldData.menu,
                    oldData.logo
                );
                const newCompanyInformation = [
                    {
                        id: 0,
                        name: "Mã số thuế",
                        type: "tax",
                        child: [],
                        temp: [],
                    },
                    {
                        id: 1,
                        name: "Văn phòng",
                        type: "office",
                        child: [],
                        temp: [],
                    },
                    {
                        id: 2,
                        name: "Nhà máy",
                        type: "factory",
                        child: [],
                        temp: [],
                    },
                    {
                        id: 3,
                        name: "Email",
                        type: "email",
                        child: [],
                        temp: [],
                    },
                    {
                        id: 4,
                        name: "Hotline",
                        type: "hotline",
                        child: [],
                        temp: [],
                    },
                    {
                        id: 5,
                        name: "Phòng kinh Doanh",
                        type: "sale",
                        child: [],
                        temp: [],
                    },
                    {
                        id: 6,
                        name: "Mạng xã hội",
                        type: "social",
                        child: [],
                        temp: [],
                    },
                    {
                        id: 7,
                        name: "Chứng nhận",
                        type: "certification",
                        child: [],
                        temp: [],
                    },
                    {
                        id: 8,
                        name: "Menu chính",
                        type: "menu",
                        child: [],
                        temp: [],
                    },
                    {
                        id: 9,
                        name: "Logo Company",
                        type: "logo",
                        child: [],
                        temp: [],
                    },
                ];
                data.forEach((item) => {
                    const data =
                        item.type === "office" || item.type === "factory"
                            ? {
                                  id: item.id,
                                  left: {
                                      name: item.type === "office" ? "Tên văn phòng" : "Tên nhà máy",
                                      value: item.ten_vi,
                                  },
                                  right: {
                                      name: "Địa chỉ",
                                      value: item.noidung_vi,
                                  },
                              }
                            : {
                                  id: item.id,
                                  left: {
                                      name: item.type === "sale" ? "Tên" : item.ten_vi,
                                      value: item.ten_vi,
                                  },
                                  right: {
                                      name:
                                          item.type === "sale"
                                              ? "Số điện thoại"
                                              : item.type === "menu"
                                              ? "tên không dấu"
                                              : "Thông tin chi tiết",
                                      value: item.noidung_vi,
                                  },
                              };
                    if (item.type === "tax") {
                        newCompanyInformation[0].child.push(data);
                    }
                    if (item.type === "office") {
                        newCompanyInformation[1].child.push(data);
                    }
                    if (item.type === "factory") {
                        newCompanyInformation[2].child.push(data);
                    }
                    if (item.type === "email") {
                        newCompanyInformation[3].child.push(data);
                    }
                    if (item.type === "hotline") {
                        newCompanyInformation[4].child.push(data);
                    }
                    if (item.type === "sale") {
                        newCompanyInformation[5].child.push(data);
                    }
                    if (item.type === "social") {
                        newCompanyInformation[6].child.push(data);
                    }
                    if (item.type === "certification") {
                        newCompanyInformation[7].child.push(data);
                    }
                    if (item.type === "menu") {
                        newCompanyInformation[8].child.push(data);
                    }
                    if (item.type === "logo") {
                        newCompanyInformation[9].child.push(data);
                    }
                });
                setCompanyInformation(newCompanyInformation);
            }
        } catch (error) {}
    };
    useEffect(() => {
        getFooter();
    }, []);
    const [companyInformation, setCompanyInformation] = useState([]);

    const handleAdd = (item) => {
        const newCompanyInformation = [...companyInformation];
        const nameNewItem = () => {
            switch (item.type) {
                case "tax":
                    return {
                        left: {
                            name: "Mã số thuế",
                            value: "MST",
                        },
                        right: {
                            name: "Thông tin chi tiết",
                            value: "",
                        },
                    };
                case "email":
                    return {
                        left: {
                            name: "Email",
                            value: "Email",
                        },
                        right: {
                            name: "Thông tin chi tiết",
                            value: "",
                        },
                    };
                case "hotline":
                    return {
                        left: {
                            name: "Hotline",
                            value: "Hotline",
                        },
                        right: {
                            name: "Thông tin chi tiết",
                            value: "",
                        },
                    };
                case "sale":
                    return {
                        left: {
                            name: "Tên",
                            value: "",
                        },
                        right: {
                            name: "Số điện thoại",
                            value: "",
                        },
                    };
                case "certification":
                    return {
                        left: {
                            name: "Chứng nhận",
                            value: "Chứng nhận",
                        },
                        right: {
                            name: "Thông tin chi tiết",
                            value: "",
                        },
                    };
                case "logo":
                    return {
                        left: {
                            name: "logo",
                            value: "Logo Company",
                        },
                        right: {
                            name: "Thông tin chi tiết",
                            value: "",
                        },
                    };
                case "menu":
                    return {
                        left: {
                            name: "Tên",
                            value: "",
                        },
                        right: {
                            name: "tên không dấu",
                            value: "",
                        },
                    };

                default:
                    return {
                        left: {
                            name: `Tên ${item.name}`,
                            value: "",
                        },
                        right: {
                            name: "Địa chỉ",
                            value: "",
                        },
                    };
            }
        };
        const newItem = {
            id: item.temp.length + 1,
            left: nameNewItem().left,
            right: nameNewItem().right,
        };
        const index = newCompanyInformation.findIndex((i) => i.id === item.id);
        newCompanyInformation[index].temp.push(newItem);
        setCompanyInformation(newCompanyInformation);
    };

    const handleDelete = async (item, child) => {
        if (item.type === "certification") {
            const data = { link: [child.right.value], id_vitri: 0, type: "certification" };
            try {
                await axiosInstance.delete("/image/delete", { data });
            } catch (error) {}
        }
        if (item.type === "logo") {
            const data = { link: [child.right.value], id_vitri: 0, type: "logo" };
            try {
                await axiosInstance.delete("/image/delete", { data });
            } catch (error) {}
        }
        try {
            const res = await axiosInstance.delete(`/footer/delete/${child.id}`);
            if (res && res.data.DT) {
                ToastMessage("Xóa thành công", "success");
                getFooter();
            } else {
                ToastMessage("Xóa thất bại", "error");
            }
        } catch (error) {
            ToastMessage("Xóa thất bại", "error");
        }
    };

    const handleDeleteTemp = (item, child) => {
        const newCompanyInformation = [...companyInformation];
        const index = newCompanyInformation.findIndex((i) => i.id === item.id);
        newCompanyInformation[index].temp = newCompanyInformation[index].temp.filter((i) => i.id !== child.id);
        setCompanyInformation(newCompanyInformation);
    };

    const [childChange, setChildChange] = useState({});
    const handleOnChange = (item, child, value, position) => {
        if (item.type !== "certification" && item.type !== "logo") {
            const newCompanyInformation = [...companyInformation];
            const index = newCompanyInformation.findIndex((i) => i.id === item.id);
            const childIndex = newCompanyInformation[index].child.findIndex((i) => i.id === child.id);
            if (position === "left") {
                newCompanyInformation[index].child[childIndex].left.value = value;
            }
            if (position === "right") {
                newCompanyInformation[index].child[childIndex].right.value = value;
            }
            const newChild = newCompanyInformation[index].child[childIndex];
            if (item.type === "menu") {
                setChildChange({
                    id: child.id,
                    ten_vi: newChild.left.value,
                    noidung_vi: newChild.right.value,
                    tenkhongdau: newChild.right.value,
                });
            } else {
                setChildChange({
                    id: child.id,
                    ten_vi: newChild.left.value,
                    noidung_vi: newChild.right.value,
                });
            }
            setCompanyInformation(newCompanyInformation);
        } else {
            setChildChange({
                id: child.id,
                type: item.type,
                ten_vi: child.left.value,
                noidung_vi: child.right.value,
            });
        }
    };

    const handleOnChangeTemp = (item, child, value, position) => {
        const newCompanyInformation = [...companyInformation];
        const index = newCompanyInformation.findIndex((i) => i.id === item.id);
        const childIndex = newCompanyInformation[index].temp.findIndex((i) => i.id === child.id);
        if (position === "left") {
            newCompanyInformation[index].temp[childIndex].left.value = value;
        }
        if (position === "right") {
            newCompanyInformation[index].temp[childIndex].right.value = value;
        }
        setCompanyInformation(newCompanyInformation);
    };

    const handleUploadItem = async (item, child) => {
        const data = {
            ten_vi: child.left.value,
            noidung_vi: child.right.value,
            type: item.type,
            stt: item.child.length + 1,
        };
        if (item.type === "certification" && fileCertificationTemp.length !== 0) {
            const formData = new FormData();
            formData.append("files", fileCertificationTemp[0].file);
            const upload = await axiosInstance.post(`/upload/folder?dir=certification&type=certification`, formData);
            if (upload && upload.data.DT) {
                data.noidung_vi = upload.data.DT[0].link;
                setFileCertificationTemp([]);
            }
            try {
            } catch (error) {
                console.log("error", error);
            }
        }
        if (item.type === "logo" && fileLogoTemp.length !== 0) {
            const formData = new FormData();
            formData.append("files", fileLogoTemp[0].file);
            const upload = await axiosInstance.post(`/upload/folder?dir=logo&type=logo`, formData);
            if (upload && upload.data.DT) {
                data.noidung_vi = upload.data.DT[0].link;
                setFileLogoTemp([]);
            }
            try {
            } catch (error) {
                console.log("error", error);
            }
        }
        if (item.type === "menu") {
            data.tenkhongdau = child.right.value;
        }
        try {
            const res = await axiosInstance.post("/footer/create", { data });
            if (res && res.data.DT) {
                ToastMessage("Tải lên thành công", "success");
                getFooter();
            } else {
                ToastMessage("Tải lên thất bại", "error");
            }
        } catch (error) {
            ToastMessage("Tải lên thất bại", "error");
        }
    };

    const handleUpdateItem = async () => {
        const newChildChange = { ...childChange };
        if (childChange.type === "certification" && fileCertificationTemp.length !== 0) {
            try {
                await axiosInstance.post(`/upload/folder/delete`, {
                    link: [childChange.noidung_vi],
                });
            } catch (error) {}
            const formData = new FormData();
            formData.append("files", fileCertificationTemp[0].file);
            const upload = await axiosInstance.post(`/upload/folder?dir=certification&type=certification`, formData);
            if (upload && upload.data.DT) {
                newChildChange.noidung_vi = upload.data.DT[0].link;
                setFileCertificationTemp([]);
            }
            try {
            } catch (error) {
                console.log("error", error);
            }
        }
        if (childChange.type === "logo" && fileLogoTemp.length !== 0) {
            try {
                await axiosInstance.post(`/upload/folder/delete`, {
                    link: [childChange.noidung_vi],
                });
            } catch (error) {}
            const formData = new FormData();
            formData.append("files", fileLogoTemp[0].file);
            const upload = await axiosInstance.post(`/upload/folder?dir=logo&type=logo`, formData);
            if (upload && upload.data.DT) {
                newChildChange.noidung_vi = upload.data.DT[0].link;
                setFileLogoTemp([]);
            }
            try {
            } catch (error) {
                console.log("error", error);
            }
        }
        try {
            const res = await axiosInstance.put(`/footer/update/${newChildChange.id}`, newChildChange);
            if (res && res.data.DT) {
                ToastMessage("Cập nhật thành công", "success");
                getFooter();
                setChildChange({});
            } else {
                ToastMessage("Cập nhật thất bại", "error");
            }
        } catch (error) {
            ToastMessage("Cập nhật thất bại", "error");
        }
    };

    // Upload image certification
    const [fileCertificationTemp, setFileCertificationTemp] = useState([]);
    const handleImageDrop = useCallback(
        async (files) => {
            const file = files[0];
            const data = await fileToBase64(file);
            setFileCertificationTemp([{ link: data, ten_vi: file.name, path: file.path, file: file, temp: true }]);
        },
        [fileCertificationTemp]
    );
    // Upload image logo
    const [fileLogoTemp, setFileLogoTemp] = useState([]);
    const handleImageDropLogo = useCallback(
        async (files) => {
            const file = files[0];
            const data = await fileToBase64(file);
            setFileLogoTemp([{ link: data, ten_vi: file.name, path: file.path, file: file, temp: true }]);
        },
        [fileLogoTemp]
    );

    // Remove file
    const handleFileRemove = useCallback(
        (file) => {
            setFileCertificationTemp((prev) => prev.filter((item) => item.path !== file.path));
            setChildChange({});
        },
        [fileCertificationTemp]
    );
    const handleFileRemoveLogo = useCallback(
        (file) => {
            setFileLogoTemp((prev) => prev.filter((item) => item.path !== file.path));
            setChildChange({});
        },
        [fileLogoTemp]
    );

    return (
        <Box position="relative">
            {companyInformation.map((item, index) => (
                <Box key={index}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <h2>{item.name}</h2>
                        {item.type === "tax" ||
                        item.type === "email" ||
                        item.type === "hotline" ||
                        item.type === "certification" ? (
                            item.child.length === 0 ? (
                                <BoxIcon>
                                    <AddIcon
                                        sx={{
                                            color: "green",
                                        }}
                                        onClick={() => handleAdd(item)}
                                    />
                                </BoxIcon>
                            ) : null
                        ) : (
                            <BoxIcon>
                                <AddIcon
                                    sx={{
                                        color: "green",
                                    }}
                                    onClick={() => handleAdd(item)}
                                />
                            </BoxIcon>
                        )}
                    </Stack>
                    {item.child.map((child, index) => (
                        <Stack key={index} mb={2} direction="row" spacing={1} display="flex" alignItems="center">
                            <CustomTextField
                                label={child.left.name}
                                value={child.left.value}
                                onChange={(e) => handleOnChange(item, child, e.target.value, "left")}
                                disabled={
                                    item.type === "tax" ||
                                    item.type === "email" ||
                                    item.type === "hotline" ||
                                    item.type === "certification" ||
                                    item.type === "logo"
                                        ? true
                                        : false
                                }
                            />
                            {item.type === "certification" ? (
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Box onClick={() => handleOnChange(item, child, "", "right")}>
                                        <FileUpload
                                            accept={{ "image/*": [] }}
                                            caption="(SVG, JPG, PNG, or gif maximum 900x400)"
                                            files={fileCertificationTemp}
                                            onDrop={handleImageDrop}
                                        />
                                    </Box>
                                    {fileCertificationTemp.length > 0 && (
                                        <FileView files={fileCertificationTemp} onRemoveFile={handleFileRemove} />
                                    )}
                                    <Box component="img" src={`${BASE_URL}/upload/${child.right.value}`} />
                                </Stack>
                            ) : item.type === "logo" ? (
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Box onClick={() => handleOnChange(item, child, "", "right")}>
                                        <FileUpload
                                            accept={{ "image/*": [] }}
                                            caption="(SVG, JPG, PNG, or gif maximum 900x400)"
                                            files={fileLogoTemp}
                                            onDrop={handleImageDropLogo}
                                        />
                                    </Box>
                                    {fileLogoTemp.length > 0 && (
                                        <FileView files={fileLogoTemp} onRemoveFile={handleFileRemoveLogo} />
                                    )}
                                    <Box
                                        component="img"
                                        sx={{
                                            width: 100,
                                            height: 100,
                                        }}
                                        src={`${BASE_URL}/upload/${child.right.value}`}
                                    />
                                </Stack>
                            ) : (
                                <CustomTextField
                                    label={child.right.name}
                                    value={child.right.value}
                                    sx={{ width: "50%" }}
                                    onChange={(e) => handleOnChange(item, child, e.target.value, "right")}
                                />
                            )}

                            <DeleteIcon
                                sx={{
                                    color: "gray",
                                    cursor: "pointer",
                                    "&:hover": {
                                        color: "red",
                                    },
                                }}
                                onClick={() => handleDelete(item, child)}
                            />
                            {child.id === childChange.id && (
                                <Button
                                    sx={{
                                        backgroundColor: "#BBDEFB",
                                        "&:hover": {
                                            backgroundColor: "green",
                                            color: "white",
                                        },
                                    }}
                                    onClick={handleUpdateItem}
                                >
                                    Cập nhật
                                </Button>
                            )}
                        </Stack>
                    ))}
                    {item.temp.length > 0 && (
                        <>
                            <hr />
                            {item.temp.map((child, index) => (
                                <Stack
                                    key={index}
                                    mb={2}
                                    direction="row"
                                    spacing={1}
                                    display="flex"
                                    alignItems="center"
                                >
                                    <CustomTextField
                                        label={child.left.name}
                                        value={child.left.value}
                                        onChange={(e) => handleOnChangeTemp(item, child, e.target.value, "left")}
                                    />
                                    {item.type === "certification" ? (
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <FileUpload
                                                accept={{ "image/*": [] }}
                                                caption="(SVG, JPG, PNG, or gif maximum 900x400)"
                                                files={fileCertificationTemp}
                                                onDrop={handleImageDrop}
                                            />
                                            {fileCertificationTemp.length > 0 && (
                                                <FileView
                                                    files={fileCertificationTemp}
                                                    onRemoveFile={handleFileRemove}
                                                />
                                            )}
                                        </Stack>
                                    ) : item.type === "logo" ? (
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <FileUpload
                                                accept={{ "image/*": [] }}
                                                caption="(SVG, JPG, PNG, or gif maximum 900x400)"
                                                files={fileLogoTemp}
                                                onDrop={handleImageDropLogo}
                                            />
                                            {fileLogoTemp.length > 0 && (
                                                <FileView files={fileLogoTemp} onRemoveFile={handleFileRemove} />
                                            )}
                                        </Stack>
                                    ) : (
                                        <CustomTextField
                                            label={child.right.name}
                                            value={child.right.value}
                                            sx={{ width: "50%" }}
                                            onChange={(e) => handleOnChangeTemp(item, child, e.target.value, "right")}
                                        />
                                    )}

                                    <LoadingButton
                                        sx={{ backgroundColor: "#BABABA" }}
                                        onClick={() => handleUploadItem(item, child)}
                                    >
                                        Tải lên
                                    </LoadingButton>

                                    <DeleteIcon
                                        sx={{
                                            color: "gray",
                                            cursor: "pointer",
                                            "&:hover": {
                                                color: "red",
                                            },
                                        }}
                                        onClick={() => handleDeleteTemp(item, child)}
                                    />
                                </Stack>
                            ))}
                        </>
                    )}
                </Box>
            ))}
            <Stack
                direction="row"
                spacing={2}
                sx={{
                    position: "absolute",
                    top: 0,
                    right: "35%",

                    padding: "10px",
                }}
            >
                <BoxIcon
                    onClick={() => {
                        getFooter();
                        setChildChange({});
                        setFileCertificationTemp([]);
                        setFileLogoTemp([]);
                    }}
                >
                    <IconBack />
                </BoxIcon>
            </Stack>
        </Box>
    );
};

export default CompanyInformation;
