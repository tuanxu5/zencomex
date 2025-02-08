import { Extension } from "@tiptap/core";

const LineHeight = Extension.create({
    name: "lineHeight",

    addOptions() {
        return {
            types: ["paragraph", "heading"], // Áp dụng cho các loại node bạn muốn
        };
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    lineHeight: {
                        default: "normal",
                        renderHTML: (attributes) => {
                            const lineHeight = attributes.lineHeight || "normal"; // Đảm bảo trả về chuỗi hợp lệ
                            return {
                                style: `line-height: ${lineHeight}`,
                            };
                        },
                        parseHTML: (element) => {
                            const lineHeight = element.style.lineHeight;
                            return {
                                lineHeight: lineHeight ? lineHeight : "normal", // Đảm bảo giá trị trả về là chuỗi hợp lệ
                            };
                        },
                    },
                },
            },
        ];
    },

    addCommands() {
        return {
            setLineHeight:
                (lineHeight) =>
                ({ commands }) => {
                    return this.options.types.every((type) => commands.updateAttributes(type, { lineHeight }));
                },
        };
    },
});

export default LineHeight;
