import { Box, ButtonBase, Stack, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useLayoutEffect, useState } from "react";

//icon
import ClearAllIcon from "@mui/icons-material/ClearAll";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

const TableOfContents = ({ editor, isDisable, onChangeContentEditor, tocItems, onChangeTocItems }) => {
    //Response
    const lgDown = useMediaQuery((theme) => theme.breakpoints.down("lg"));

    //box table of content
    const defaultSetting = {
        type: "default",
        setting: {
            width: lgDown ? "100%" : "50%",
            height: "auto",
        },
    };
    const [styleBox, setStyleBox] = useState(defaultSetting);

    const handleClickItem = (item) => {
        document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    const handleRemoveItem = (id) => {
        onChangeTocItems((prevItems) => prevItems.filter((item) => item.id !== id));
        const element = editor.view.dom.querySelector(`span[data-toc-id="${id}"]`);
        if (element) {
            element.removeAttribute("data-toc-id"); // Xóa thuộc tính data-toc-id
            editor.commands.setContent(editor.view.dom.innerHTML);
        }
        const content = editor.getHTML();
        onChangeContentEditor(content);
    };
    return (
        <>
            {tocItems.length > 0 && (
                <Box
                    sx={{
                        backgroundColor: "#F5F5F5",
                        borderRadius: 1,
                        border: "1px solid grey",
                        position: "relative",
                        mb: 1,
                        ...styleBox.setting,
                    }}
                >
                    <Typography
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            fontSize: lgDown ? 20 : 24,
                            fontWeight: 700,
                            ml: styleBox.type === "default" ? 0 : -5,
                        }}
                    >
                        Nội dung chính
                    </Typography>
                    <ClearAllIcon
                        onClick={() =>
                            setStyleBox((pre) => {
                                if (pre.type === "default") {
                                    return {
                                        type: "customs",
                                        setting: {
                                            width: 250,
                                            height: 40,
                                        },
                                    };
                                } else {
                                    return defaultSetting;
                                }
                            })
                        }
                        sx={{ fontSize: 30, position: "absolute", top: 6, right: 6, opacity: 0.9, cursor: "pointer" }}
                    />
                    <Stack
                        p={2}
                        sx={{
                            display: styleBox.type === "default" ? "" : "none",
                        }}
                        spacing={0.5}
                    >
                        {tocItems.map((item, index) => (
                            <Stack key={index} direction="row" justifyContent="space-between" alignItems="center">
                                <Box
                                    key={item.id}
                                    onClick={() => handleClickItem(item)}
                                    sx={{
                                        all: "unset",
                                        cursor: "pointer",
                                        p: 0.5,
                                        pl: 1,
                                        "&:hover": {
                                            backgroundColor: "#BBDEFB",
                                            borderRadius: 1,
                                        },
                                        width: "95%",
                                    }}
                                >
                                    {`${index + 1}. ${item.text}`}
                                </Box>
                                {!isDisable && (
                                    <Box
                                        component={ButtonBase}
                                        onClick={() => {
                                            handleRemoveItem(item.id);
                                        }}
                                        sx={{
                                            p: 1,
                                            borderRadius: "50%",
                                            "&:hover": {
                                                color: "red",
                                                backgroundColor: "#BABABA",
                                            },
                                        }}
                                    >
                                        <ClearOutlinedIcon
                                            sx={{
                                                cursor: "pointer",
                                                fontSize: 14,
                                            }}
                                        />
                                    </Box>
                                )}
                            </Stack>
                        ))}
                    </Stack>
                </Box>
            )}
        </>
    );
};

export default TableOfContents;
