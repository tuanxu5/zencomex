// mailer.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Địa chỉ email của bạn
        pass: process.env.EMAIL_PASS, // Mật khẩu email của bạn
    },
});

export const sendMail = async (contact) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Địa chỉ email của bạn
        to: process.env.RECEIVER_EMAIL, // Địa chỉ email nhận thông báo
        subject: "Có thông tin mới từ khách hàng",
        text: `Tên: ${contact.name}\nĐiện thoại: ${contact.phone}\nEmail: ${contact.email}\nTin nhắn: ${contact.message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log("Lỗi khi gửi email: ", error);
        }
    });
};
