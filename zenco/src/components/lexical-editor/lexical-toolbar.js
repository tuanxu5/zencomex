import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import { Box, Button, ButtonGroup, IconButton, MenuItem, Select, Tooltip } from "@mui/material";
import {
    $getSelection,
    $isRangeSelection,
    TextNode,
    $createParagraphNode,
    $isParagraphNode,
    $isTextNode,
    FORMAT_TEXT_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    $isElementNode,
} from "lexical";

import { $createHeadingNode } from "@lexical/rich-text";
import { useCallback, useEffect, useState } from "react";
import LinkIcon from "@mui/icons-material/Link";
import ImageIcon from "@mui/icons-material/Image";
import BoxIcon from "../../sections/components/buttons/box-for-icon";

const headings = [
    { label: "Normal", level: "" },
    { label: "H1", level: 1 },
    { label: "H2", level: 2 },
    { label: "H3", level: 3 },
    { label: "H4", level: 4 },
    { label: "H5", level: 5 },
    { label: "H6", level: 6 },
];
const fonts = ["Arial", "Courier New", "Georgia", "Times New Roman", "Verdana"];
const fontSizes = [
    "6px",
    "8px",
    "12px",
    "14px",
    "16px",
    "18px",
    "24px",
    "32px",
    "36px",
    "40px",
    "42px",
    "48px",
    "60px",
    "90px",
];

function Toolbar() {
    const [editor] = useLexicalComposerContext();
    //----------Font and Size-------------//
    const applyStyle = useCallback(
        (styleName, styleValue) => {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    selection.getNodes().forEach((node) => {
                        if (node instanceof TextNode) {
                            const currentStyle = node.getStyle() || ""; // Lấy kiểu hiện tại

                            // Tạo một đối tượng từ các kiểu
                            const styles = currentStyle.split(";").reduce((acc, style) => {
                                const [key, value] = style.split(":").map((s) => s.trim());
                                if (key && value) {
                                    acc[key] = value; // Thêm kiểu vào đối tượng
                                }
                                return acc;
                            }, {});

                            // Kiểm tra và cập nhật các kiểu
                            if (styleName === "font-weight") {
                                if (styles[styleName] === "bold") {
                                    delete styles[styleName]; // Bỏ in đậm
                                    setIsBold(false);
                                } else {
                                    styles[styleName] = styleValue; // Thêm in đậm
                                    setIsBold(true);
                                }
                            } else if (styleName === "font-style") {
                                if (styles[styleName] === "italic") {
                                    delete styles[styleName]; // Bỏ nghiêng
                                } else {
                                    styles[styleName] = styleValue; // Thêm nghiêng
                                }
                            } else if (styleName === "text-decoration") {
                                if (styles[styleName] === "underline") {
                                    delete styles[styleName]; // Bỏ gạch chân
                                } else {
                                    styles[styleName] = styleValue; // Thêm gạch chân
                                }
                            } else {
                                // Đối với các kiểu khác như font-size
                                styles[styleName] = styleValue; // Cập nhật hoặc thêm kiểu kích thước
                            }

                            // Chuyển đổi lại thành chuỗi và áp dụng
                            const newStyle =
                                Object.entries(styles)
                                    .map(([key, value]) => `${key}: ${value}`)
                                    .join("; ") + ";"; // Kết thúc bằng dấu chấm phẩy

                            node.setStyle(newStyle); // Áp dụng các kiểu
                        }
                    });
                }
            });
        },
        [editor]
    );
    //======================================//

    //------------BOLD,ITALIC,UNDERLINE----------------//
    const formatType = (type) => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, type);
    };
    //===========================================================

    //---------Left,center,right,justify---------------//
    const handleAlign = (position) => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, position);
    };
    //===================================

    // -----------HEADING---------------//
    const applyHeading = (level) => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                const nodes = selection.getNodes();
                nodes.forEach((node) => {
                    const parentNode = node.getParent();
                    if (parentNode) {
                        // Chuyển kiểu node cha thành heading và giữ lại nội dung
                        const headingNode = level !== "" ? $createHeadingNode(`h${level}`) : $createHeadingNode(`p`);
                        // Thêm style cho headingNode, ví dụ text-align
                        parentNode.getChildren().forEach((child) => {
                            headingNode.append(child);
                        });
                        parentNode.replace(headingNode);
                    }
                });
            }
        });
    };
    const [selectedHeading, setSelectedHeading] = useState("");
    const handleChange = (event) => {
        const level = event.target.value;
        setSelectedHeading(level);
        applyHeading(level); // Gọi hàm applyHeading để áp dụng cấp độ heading
    };
    //================================================================//

    const insertImage = useCallback(() => {
        const url = prompt("Nhập URL hình ảnh:");
        if (url) {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    const imgNode = $createParagraphNode(); // Tạo node đoạn văn
                    imgNode.append(TextNode.create(`![image](${url})`));
                    selection.insertNodes([imgNode]);
                }
            });
        }
    }, [editor]);

    const insertLink = useCallback(() => {
        const url = prompt("Nhập URL:");
        if (url) {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    selection.getNodes().forEach((node) => {
                        if (node instanceof TextNode) {
                            node.setText(`[[${node.getText()}|${url}]]`);
                        }
                    });
                }
            });
        }
    }, [editor]);

    return (
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <Tooltip title="Heading">
                <Select
                    sx={{ height: 40 }}
                    labelId="heading-select-label"
                    value={selectedHeading}
                    onChange={handleChange}
                    label="Heading"
                    displayEmpty
                >
                    {headings.map((heading) => (
                        <MenuItem key={heading.level} value={heading.level}>
                            {heading.label}
                        </MenuItem>
                    ))}
                </Select>
            </Tooltip>

            <Tooltip title="Phông chữ">
                <Select
                    sx={{ height: 40, minWidth: 150 }}
                    defaultValue=""
                    onChange={(e) => applyStyle("font-family", e.target.value)}
                    displayEmpty
                >
                    <MenuItem value="">Font</MenuItem>
                    {fonts.map((font) => (
                        <MenuItem key={font} value={font}>
                            {font}
                        </MenuItem>
                    ))}
                </Select>
            </Tooltip>

            <Tooltip title="Cỡ chữ">
                <Select
                    sx={{ height: 40 }}
                    defaultValue=""
                    onChange={(e) => applyStyle("font-size", e.target.value)}
                    displayEmpty
                >
                    <MenuItem value="">Size</MenuItem>
                    {fontSizes.map((size) => (
                        <MenuItem key={size} value={size}>
                            {size}
                        </MenuItem>
                    ))}
                </Select>
            </Tooltip>

            <BoxIcon onClick={() => formatType("bold")}>
                <Tooltip title="in đậm">
                    <FormatBoldIcon />
                </Tooltip>
            </BoxIcon>
            <BoxIcon onClick={() => formatType("italic")}>
                <Tooltip title="in nghiêng">
                    <FormatItalicIcon />
                </Tooltip>
            </BoxIcon>
            <BoxIcon onClick={() => formatType("underline")}>
                <Tooltip title="Gạch chân">
                    <FormatUnderlinedIcon />
                </Tooltip>
            </BoxIcon>
            <BoxIcon onClick={() => handleAlign("left")} size="small">
                <Tooltip title="Căn trái">
                    <FormatAlignLeftIcon fontSize="small" />
                </Tooltip>
            </BoxIcon>
            <BoxIcon onClick={() => handleAlign("center")} size="small">
                <Tooltip title="Căn giữa">
                    <FormatAlignCenterIcon fontSize="small" />
                </Tooltip>
            </BoxIcon>
            <BoxIcon onClick={() => handleAlign("right")} size="small">
                <Tooltip title="Căn phải">
                    <FormatAlignRightIcon fontSize="small" />
                </Tooltip>
            </BoxIcon>
            <BoxIcon onClick={() => handleAlign("justify")} size="small">
                <Tooltip title="Căn đều">
                    <FormatAlignJustifyIcon fontSize="small" />
                </Tooltip>
            </BoxIcon>
            <BoxIcon onClick={insertLink} size="small">
                <LinkIcon fontSize="small" />
            </BoxIcon>
            <BoxIcon onClick={insertImage} size="small">
                <ImageIcon fontSize="small" />
            </BoxIcon>
        </Box>
    );
}

export default Toolbar;
