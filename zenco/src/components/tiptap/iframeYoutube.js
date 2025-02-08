import { Node } from "@tiptap/core";

const Iframe = Node.create({
    name: "iframe",
    group: "block",
    atom: true, // Đảm bảo iframe được coi là một block atom

    addAttributes() {
        return {
            src: { default: null },
            width: { default: "560" },
            height: { default: "315" },
            frameborder: { default: "0" },
            allow: {
                default: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
            },
            allowfullscreen: { default: true },
            textAlign: { default: "center" },
        };
    },

    parseHTML() {
        return [
            {
                tag: "iframe",
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        const { textAlign, ...iframeAttributes } = HTMLAttributes;
        return [
            "div",
            { style: `text-align: ${textAlign};` }, // Căn giữa iframe
            ["iframe", iframeAttributes],
        ];
    },

    addCommands() {
        return {
            insertIframe:
                (attrs) =>
                ({ commands }) => {
                    return commands.insertContent({
                        type: this.name,
                        attrs,
                    });
                },
        };
    },
});

export default Iframe;
