import { styled } from "@mui/material/styles";
import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import { useRef, useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";

// Tải ReactQuill một cách động
const ReactQuill = dynamic(() => import("react-quill"), {
    ssr: false,
});

const Quill = ReactQuill.Quill;

const QuillEditorRoot = styled("div")(({ theme }) => ({
    border: 1,
    borderColor: theme.palette.divider,
    borderRadius: theme.shape.borderRadius,
    borderStyle: "solid",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    "& .ql-snow.ql-toolbar": {
        borderColor: theme.palette.divider,
        borderLeft: "none",
        borderRight: "none",
        borderTop: "none",
    },
    "& .ql-snow.ql-container": {
        borderBottom: "none",
        borderColor: theme.palette.divider,
        borderLeft: "none",
        borderRight: "none",
    },
}));

export const QuillEditor = ({ sx, onChange, placeholder, value, isDisabled = false, ...other }) => {
    const quillRef = useRef(null);
    const [isEditorReady, setIsEditorReady] = useState(false);

    useEffect(() => {
        const loadQuill = async () => {
            try {
                const QuillImport = await import("quill"); // Tải Quill
                setQuill(QuillImport.default || QuillImport); // Lưu Quill vào state
                setIsEditorReady(true); // Đánh dấu Quill đã sẵn sàng
            } catch (error) {
                console.error("Error loading Quill:", error);
            }
        };

        loadQuill();
    }, []);

    useEffect(() => {
        if (isEditorReady && Quill) {
            var Font = Quill.import("formats/font");
            Font.whitelist = ["Arial", "Times New Roman", "sans-serif", "serif", "monospace"];
            Quill.register(Font, true);
        }
    }, [isEditorReady, Quill]); // Thêm Quill vào danh sách dependency

    // if (!isEditorReady) {
    //     return <div>Loading editor...</div>; // Hiển thị loader khi Quill chưa sẵn sàng
    // }
    return (
        <QuillEditorRoot sx={sx} {...other}>
            <ReactQuill
                ref={quillRef}
                onChange={onChange}
                placeholder={placeholder}
                value={value}
                readOnly={isDisabled}
                className="quill-editor"
                style={{
                    fontFamily: "'Arial', sans-serif", // Thiết lập font chữ mặc định
                }}
                modules={{
                    toolbar: [
                        [{ header: [1, 2, 3, 4, false] }],
                        [{ size: [] }],
                        [
                            {
                                font: [
                                    "Arial", // Đảm bảo tên này chính xác
                                    "Times New Roman",
                                    "sans-serif",
                                    "serif",
                                    "monospace",
                                ],
                            },
                        ],
                        ["bold", "italic", "underline", "strike", "blockquote"],
                        [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                        [{ align: [] }],
                        ["link", "image", "video"],
                        ["clean"],
                    ],
                }}
            />
        </QuillEditorRoot>
    );
};

QuillEditor.propTypes = {
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    sx: PropTypes.object,
    value: PropTypes.string,
    isDisabled: PropTypes.bool,
};
