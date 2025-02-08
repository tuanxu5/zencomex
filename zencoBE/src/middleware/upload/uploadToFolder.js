import multer from "multer";
const path = require("path");
import fs from "fs";

// Thiết lập thư mục để lưu file tải lên

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const { dir } = req.query;
        let uploadPath;

        // Kiểm tra xem dir có được cung cấp không
        if (dir) {
            uploadPath = path.join(__dirname, `../../../public/upload/${dir}`);
        } else {
            uploadPath = path.join(__dirname, "../../../public/upload"); // Thư mục mặc định
        }

        fs.mkdir(uploadPath, { recursive: true }, (err) => {
            if (err) {
                return cb(err); // Nếu có lỗi khi tạo thư mục, gọi callback với lỗi
            }
            cb(null, uploadPath); // Gọi callback với đường dẫn thư mục
        });
    },
    filename: function (req, file, cb) {
        // Tạo tên file mới với thời gian hiện tại
        const timestamp = Date.now();
        const fileExtension = path.extname(file.originalname); // Lấy đuôi file
        const originalNameWithoutExt = path.basename(file.originalname, fileExtension); // Lấy tên file không có đuôi

        // Bỏ khoảng cách và kết hợp tên file với timestamp
        const sanitizedOriginalName = originalNameWithoutExt.replace(/\s+/g, "_");
        const newFileName = `${sanitizedOriginalName}_${timestamp}${fileExtension}`;
        cb(null, newFileName); // Đặt tên file mới
    },
});

const uploadToFolder = multer({ storage: storage });

module.exports = uploadToFolder;
