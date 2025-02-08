// components/LexicalEditor.js
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useState, useEffect, useCallback } from "react";
import Toolbar from "./lexical-toolbar"; // Toolbar sẽ sử dụng useLexicalComposerContext
import { HeadingNode } from "@lexical/rich-text";
import { $getRoot, TextNode } from "lexical";

// Cấu hình của editor
const editorConfig = {
    namespace: "MyEditor",
    theme: {
        text: {
            bold: "font-bold",
            italic: "italic",
            underline: "underline",
        },
        editor: "editor-container bg-white p-4",
        placeholder: "text-gray-400",
        contentEditable: "editor-input text-lg",
    },
    onError: (error) => {
        console.error(error);
    },
    nodes: [HeadingNode], // Đảm bảo HeadingNode được định nghĩa ở đây
};

function LexicalEditor() {
    const [contentEditor, setContentEditor] = useState("");

    // Hàm chuyển đổi các node thành HTML
    const renderNodeToHtml = (node) => {
        if (node.type === "paragraph") {
            let style = "";
            if (node.format) {
                style += `text-align: ${node.format}; `;
            }
            const childrenHtml = node.children.map(renderNodeToHtml).join("");
            return `<p style="${style}">${childrenHtml}</p>`;
        }
        if (node.type === "text") {
            return node.text;
        }
        if (node.type === "heading") {
            const level = node.level || 1;
            return `<h${level}>${node.text}</h${level}>`;
        }
        if (node.type === "bold") {
            return `<strong>${node.text}</strong>`;
        }
        if (node.type === "italic") {
            return `<em>${node.text}</em>`;
        }
        return "";
    };

    // Hàm render nội dung của editor thành HTML
    const renderEditorContent = (editorContent) => {
        const parseJson = JSON.parse(editorContent);
        console.log("parseJson", parseJson);
        return parseJson.root.children.map(renderNodeToHtml).join("");
    };

    function convertToHtml(node) {
        console.log("node", node);
        if (node instanceof TextNode) {
            let content = node.__text;

            // Kiểm tra xem có định dạng nào trong __style không
            if (node.__style) {
                content = `<span style="${node.__style}">${content}</span>`;
            }

            return content;
        }

        // Nếu là node khác, bạn có thể xử lý thêm ở đây
        return "";
    }

    const onChange = useCallback((editorState) => {
        editorState.read(() => {
            const root = editorState._nodeMap; // Lấy root node của editor
            let html = "";
            root.forEach((childNode) => {
                // Lặp qua các node con để chuyển đổi thành HTML
                html += convertToHtml(childNode);
            });
            console.log("..", html);
        });
    }, []);

    return (
        <LexicalComposer initialConfig={editorConfig}>
            {/* Tất cả các component con phải nằm trong phạm vi của LexicalComposer */}
            <div className="editor-container">
                <Toolbar />
                <RichTextPlugin
                    contentEditable={<ContentEditable className="editor-input" />}
                    placeholder={<div className="editor-placeholder">Nhập nội dung...</div>}
                />
                <OnChangePlugin onChange={onChange} />
                <HistoryPlugin />
            </div>
        </LexicalComposer>
    );
}

export default LexicalEditor;
