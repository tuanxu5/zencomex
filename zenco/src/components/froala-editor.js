// components/FroalaEditor.js
"use client";
import dynamic from "next/dynamic";

// import "froala-editor/js/plugins.pkgd.min.js";
import { Box, Stack, Typography } from "@mui/material";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/plugins/colors.min.css";
import "froala-editor/css/plugins/image.min.css";
import { useEffect, useImperativeHandle, useRef, useState } from "react";

//icon
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import { Scrollbar } from "./scrollbar";

const FroalaEditorComponent = dynamic(
    async () => {
        const { default: FroalaEditor } = await import("react-froala-wysiwyg");
        if (typeof window !== "undefined") {
            await import("froala-editor/js/plugins.pkgd.min.js"); // Import plugins dynamically
            await import("froala-editor/js/languages/vi.js"); // Import language dynamically
            await import("froala-editor/js/plugins/colors.min.js");
            await import("froala-editor/js/plugins/print.min.js");
        }
        return FroalaEditor;
    },
    {
        ssr: false, // Disable server-side rendering
    }
);

const FroalaEditorWrapper = ({
    model,
    onModelChange,
    type,
    customHandleDeleteImage,
    handleUploadImageIntoEditor,
    isDisabled = false,
    expand = false,
}) => {
    // add image into editor before
    const handleImageEditor = async (image, editor) => {
        if (image.length > 0) {
            await handleUploadImageIntoEditor(image, editor);
        }
    };
    // after delete image in editor
    const handleDeleteImage = async (image) => {
        const modalClosingStatus = localStorage.getItem("isModalClosing");
        const typeModal = localStorage.getItem("typeModal");
        if (image[0].src) {
            if (modalClosingStatus === "true" && typeModal === "update") {
                return;
            } else {
                customHandleDeleteImage([image[0].src]);
            }
        }
    };

    const ref = useRef(null);
    useImperativeHandle(ref, () => ({
        getEditorInstance: () => ref.current,
    }));

    // Đặt trình soạn thảo thành chế độ chỉ đọc
    const setReadOnly = (isReadOnly) => {
        if (ref.current) {
            if (isReadOnly) {
                ref.current.edit.off();
            } else {
                ref.current.edit.on();
            }
        }
    };

    useEffect(() => {
        const style = document.createElement("style");
        style.innerHTML = isDisabled
            ? `
            .fr-box.fr-basic .fr-element {
                font-family: sans-serif !important;
                color: #414141 !important;
                font-size: 14px !important;
                line-height: 1.6 !important;
                padding: 8px !important;
                box-sizing: border-box !important;
                overflow-x: auto !important;
                min-height: 60px !important;
                text-align: left !important;
                border: none !important;
            }

            .fr-box.fr-basic .fr-wrapper {
                background: #FFF !important;
                border: none !important;
                box-shadow: none !important;
                border-bottom-color: #efefef !important;
            }

            .fr-toolbar {
                border: none !important;
                box-shadow: none !important;
                background: transparent !important;
            }
            .fr-second-toolbar{
            border: none !important;
            display: none !important;
            }
            
             div[style*="z-index:9999"] a {
                display: none !important;
            }
            
        `
            : `
            .fr-box.fr-basic .fr-element {
                font-family: sans-serif !important;
                color: #414141 !important;
                font-size: 14px !important;
                line-height: 1.6 !important;
                padding: 8px !important;
                box-sizing: border-box !important;
                overflow-x: auto !important;
                min-height: 250px !important;
                text-align: left !important;
                border: none !important;
            } 
            div[style*="z-index:9999"] a {
                display: none !important;
            }`;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const [expendContent, setExpendContent] = useState(expand);

    return (
        <div
            ref={ref}
            style={{
                // border: isDisabled ? "" : "1px solid #000",
                borderRadius: 12,
            }}
        >
            <Scrollbar
                sx={{
                    maxHeight: `${isDisabled ? (expendContent ? "auto" : "80vh") : "60vh"}`,
                    overflow: expendContent ? "auto" : "hidden",
                    "&:hover": {
                        overflowY: expendContent ? "auto" : isDisabled ? "hidden" : "auto", // Show scrollbar on hover
                    },
                }}
            >
                <FroalaEditorComponent
                    tag="textarea"
                    model={model}
                    onModelChange={onModelChange}
                    config={{
                        attribution: false,
                        toolbarButtons: isDisabled
                            ? []
                            : [
                                  "paragraphFormat",
                                  "bold",
                                  "italic",
                                  "underline",
                                  "|",
                                  "fontFamily",
                                  "fontSize",
                                  "textColor", // Ensure this line is included
                                  "|",
                                  "align",
                                  "formatOL",
                                  "formatUL",
                                  "outdent",
                                  "indent",
                                  "|",
                                  "insertLink",
                                  "insertImage",
                                  "insertVideo",
                                  "insertFile",
                                  "insertTable",
                                  "|",
                                  "emoticons",
                                  "specialCharacters",
                                  "insertHR",
                                  "selectAll",
                                  "clearFormatting",
                                  "|",
                                  "print",
                                  "help",
                                  "html",
                                  "|",
                              ],
                        pluginsEnabled: isDisabled
                            ? []
                            : [
                                  "align",
                                  "charCounter",
                                  "codeBeautifier",
                                  "codeView",
                                  "colors", // Đảm bảo plugin màu sắc được bật
                                  "draggable",
                                  "emoticons",
                                  "entities",
                                  "file",
                                  "fontFamily",
                                  "fontSize",
                                  "forms",
                                  "fullscreen",
                                  "image",
                                  "imageManager",
                                  "inlineStyle",
                                  "lineBreaker",
                                  "link",
                                  "lists",
                                  "paragraphFormat",
                                  "paragraphStyle",
                                  "quickInsert",
                                  "quote",
                                  "save",
                                  "table",
                                  "url",
                                  "video",
                                  "wordPaste",
                                  "print",
                                  "help",
                                  "html",
                                  "undo",
                                  "redo",
                                  "specialCharacters",
                                  "insertHR",
                                  "selectAll",
                                  "clearFormatting",
                              ],
                        toolbarSticky: true,
                        toolbarStickyOffset: 0,
                        toolbartop: false,
                        toolbarsticky: true,
                        imageUpload: true,
                        imageDefaultWidth: 0,
                        imageUploadURL: "",
                        imageUploadMethod: "POST",
                        placeholderText: `${type === "product" ? "Nhập nội dung" : "Nhập mô tả"}`,
                        events: {
                            initialized: function () {
                                ref.current = this;
                                setReadOnly(isDisabled);
                                var css = `
        .muc-luc {
          border: 1px solid #000;
          padding: 10px;
          border-radius: 5px;
          background-color: #f9f9f9;
          list-style-type: none;
        }
        .muc-luc li {
          margin-bottom: 5px;
        }
        .muc-luc li h4 {
          color: #007bff;
          margin: 0;
        }
        .muc-luc li a {
          text-decoration: none;
          color: #000;
          margin-left: 12px;
        }
        .muc-luc li a:hover {
          color: #007bff;
        }
        .fr-toolbar.fr-top {
                    position: sticky !important;
                    top: 0 !important;
                    z-index: 9999 !important;
                }
      `;
                                var style = document.createElement("style");
                                style.innerHTML = css;
                                document.head.appendChild(style);
                            },
                            "image.beforeUpload": function (files) {
                                return handleImageEditor(files, this);
                            },
                            "image.removed": function (files) {
                                return handleDeleteImage(files);
                            },
                        },
                        language: "vi",
                    }}
                />
            </Scrollbar>
            {isDisabled && (
                <Box
                    sx={{
                        backgroundColor: "#f9f9f9",
                        padding: 1,
                        borderRadius: 1,
                        cursor: "pointer",
                        "&:hover": {
                            backgroundColor: "#e9e9e9",
                        },
                        mt: 2,
                    }}
                    onClick={() => setExpendContent(!expendContent)}
                >
                    <Stack direction="row" justifyContent="center" alignItems="center">
                        {expendContent ? (
                            <>
                                <KeyboardDoubleArrowUpIcon />
                                <Typography fontWeight={500} fontSize={14}>
                                    Thu gọn
                                </Typography>
                            </>
                        ) : (
                            <>
                                <KeyboardDoubleArrowDownIcon />
                                <Typography fontWeight={500} fontSize={14}>
                                    Xem thêm
                                </Typography>
                            </>
                        )}
                    </Stack>
                </Box>
            )}
        </div>
    );
};

export default FroalaEditorWrapper;
