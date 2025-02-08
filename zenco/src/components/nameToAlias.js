function removeVietnameseAccents(str) {
    const accentsMap = [
        { base: "a", letters: /[àáạảãâầấậẩẫăằắặẳẵ]/g },
        { base: "e", letters: /[èéẹẻẽêềếệểễ]/g },
        { base: "i", letters: /[ìíịỉĩ]/g },
        { base: "o", letters: /[òóọỏõôồốộổỗơờớợởỡ]/g },
        { base: "u", letters: /[ùúụủũưừứựửữ]/g },
        { base: "y", letters: /[ỳýỵỷỹ]/g },
        { base: "d", letters: /[đ]/g },
    ];

    accentsMap.forEach((accent) => {
        str = str.replace(accent.letters, accent.base);
    });

    return str;
}

export function createAlias(str) {
    return removeVietnameseAccents(str)
        .toLowerCase()
        .trim()
        .replace(/[\s-]+/g, "-") // Thay thế khoảng trắng và dấu gạch ngang liên tiếp bằng một dấu gạch ngang
        .replace(/^-+|-+$/g, ""); //oại bỏ dấu gạch ngang ở đầu và cuối chuỗi
}
