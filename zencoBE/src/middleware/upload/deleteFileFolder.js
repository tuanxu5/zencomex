import fs from "fs";
import path from "path";

// Middleware xóa hình ảnh
const deleteImage = (req, res, next) => {
    const { link } = req.body; // Đường dẫn tệp cần xóa

    if (!link || link.length === 0) {
        return res.status(400).json({ error: "Image path is required" });
    }

    // Tạo mảng các promise để xóa tệp
    const deletePromises = link.map((li) => {
        const filePath = path.join(__dirname, "../../../public/upload", li);

        return new Promise((resolve) => {
            // Xóa tệp
            fs.unlink(filePath, (err) => {
                if (err) {
                    resolve(false); // Gọi resolve với false nếu có lỗi
                } else {
                    resolve(true); // Gọi resolve với true nếu xóa thành công
                }
            });
        });
    });

    // Chờ cho tất cả các promise hoàn thành
    Promise.all(deletePromises).then((results) => {
        // Kiểm tra xem có bất kỳ kết quả nào là false không
        const hasError = results.includes(false);
        req.body.deletesSuccess = !hasError; // Đặt thành công nếu không có lỗi
        next(); // Tiếp tục với middleware tiếp theo
    });
};

export default deleteImage;
