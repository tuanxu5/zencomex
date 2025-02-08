import { Mark } from "@tiptap/core";

const TocMark = Mark.create({
    name: "tocMark",
    addAttributes() {
        return {
            id: {
                default: null,
            },
        };
    },
    parseHTML() {
        return [{ tag: "span[data-toc-id]" }];
    },
    renderHTML({ HTMLAttributes }) {
        return ["span", { ...HTMLAttributes, "data-toc-id": HTMLAttributes.id }, 0];
    },
});
export default TocMark;
