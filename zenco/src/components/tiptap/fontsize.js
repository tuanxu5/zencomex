import { Extension } from "@tiptap/core";
import "@tiptap/extension-text-style";

// Track the caret position during transactions.
let caretPosition = Infinity;
let defFontSize = "16px";

const removeTempSpan = (p) => {
    if (p?.childNodes) {
        p.childNodes.forEach((child) => {
            if (child.innerHTML) {
                child.innerHTML = child.innerHTML.replace(String.fromCodePoint(0x200b), "");
            }
        });
    }
};

const initialize = (fontSize) => {
    const p = Array.from(document.querySelector(".ProseMirror")?.children || [])[0];
    removeTempSpan(p);
    if (p?.childNodes[0]?.tagName === "BR") {
        p.innerHTML = `<span style="font-size: ${fontSize}">&ZeroWidthSpace;</span>`;
    }
};

const injectTempSpan = (fontSize, editor) => {
    const pList = Array.from(document.querySelector(".ProseMirror")?.children || []);
    pList.forEach((p) => {
        if (p?.childNodes.length === 1 && p?.childNodes[0]?.tagName === "BR") {
            return initialize(fontSize);
        }

        removeTempSpan(p);
        let counter = 0;
        let pos = 0;

        p?.childNodes.forEach((child) => {
            if (child.tagName === "img") {
                return; // Skip processing this element if it's an image
            }

            if (child && child.innerHTML && counter <= caretPosition) {
                const htmlChild = child;
                const caretPositionTrim = caretPosition - counter - 2;
                counter += htmlChild.innerHTML.length;
                if (counter >= caretPosition - 2) {
                    if (htmlChild.style.fontSize !== fontSize) {
                        const str = htmlChild.innerHTML;
                        const str1 = str.substr(0, caretPositionTrim);
                        const str2 = str.substr(caretPositionTrim);
                        htmlChild.innerHTML = `<span style="font-size: ${htmlChild.style.fontSize}">${str1}</span><span style="font-size: ${fontSize}">&ZeroWidthSpace;</span><span style="font-size: ${htmlChild.style.fontSize}">${str2}</span>`;
                        pos = caretPosition;
                    }
                }
            }
        });

        // Re-focus after modifying the content
        setTimeout(() => editor.commands.focus(pos), 0.00000001);
    });
};

export const FontSize = Extension.create({
    name: "fontSize",

    onTransaction: ({ transaction }) => {
        caretPosition = transaction.selection.$anchor.pos;
    },

    onCreate: ({ editor }) => editor.chain().initialize(defFontSize).run(),

    onUpdate: ({ editor }) => {
        if (editor.getText().length === 0) {
            editor.chain().focus().initialize(defFontSize).run();
        }
    },

    addGlobalAttributes: () => [
        {
            types: ["textStyle"],
            attributes: {
                fontSize: {
                    default: null,
                    parseHTML: (element) => element.style.fontSize,
                    renderHTML: (attributes) => {
                        if (!attributes.fontSize) return {};
                        return {
                            style: `font-size: ${attributes.fontSize}`,
                        };
                    },
                },
            },
        },
    ],

    addCommands: () => ({
        setFontSize:
            (fontSize) =>
            ({ chain, editor }) => {
                defFontSize = fontSize;
                injectTempSpan(fontSize, editor);
                // This sets the font size on the textStyle mark and returns the chain.
                return chain().setMark("textStyle", { fontSize }).run();
            },

        initialize:
            (fontSize) =>
            ({ chain }) => {
                initialize(fontSize);
                return chain().setMark("textStyle", { fontSize }).run();
            },
    }),
});
