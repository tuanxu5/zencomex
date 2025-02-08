export const CheckMenuItem = (type) => {
    switch (type) {
        case "san-pham":
            return {
                id: 2,
                title: "Sản phẩm",
                alias: "san-pham",
                intro: "Tất cả các sản phẩm của chúng tôi được chọn lọc kỹ lưỡng, đảm bảo chất lượng và phù hợp với nhu cầu đa dạng của khách hàng",
                type: "san-pham",
            };
        case "dich-vu":
            return {
                id: 3,
                title: "Dịch vụ",
                alias: "dich-vu",
                intro: "Giải pháp và dịch vụ hàng đầu, đáp ứng nhu cầu khách hàng",
            };
        case "tin-tuc":
            return {
                id: 4,
                title: "Tin tức",
                alias: "tin-tuc",
                intro: "Cập nhật những tin tức mới nhất từ công ty và thị trường",
            };
        case "gioi-thieu":
            return {
                id: 5,
                title: "Giới thiệu",
                alias: "gioi-thieu",
                intro: "Tìm hiểu về sứ mệnh, giá trị và lịch sử của công ty chúng tôi",
            };
        case "lien-he":
            return {
                id: 6,
                title: "Liên hệ",
                alias: "lien-he",
                intro: "Liên hệ với chúng tôi để được tư vấn và hỗ trợ tốt nhất",
            };
        case "tuyen-dung":
            return {
                id: 7,
                title: "Tuyển dụng",
                alias: "tuyen-dung",
                intro: "Cơ hội việc làm hấp dẫn đang chờ đón bạn tại công ty chúng tôi",
            };
        case "ho-tro":
            return {
                id: 8,
                title: "Hỗ trợ",
                alias: "ho-tro",
                intro: "Chúng tôi luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi",
            };
        case "xuat-nhap-khau":
            return {
                id: 9,
                title: "Xuất nhập khẩu",
                alias: "xuat-nhap-khau",
                intro: "Dịch vụ xuất nhập khẩu chuyên nghiệp, nhanh chóng và an toàn",
            };
        case "du-an":
            return {
                id: 10,
                title: "Dự án",
                alias: "du-an",
                intro: "Khám phá các dự án nổi bật mà chúng tôi đã và đang thực hiện",
            };
        case "chinh-sach-ho-tro":
            return {
                id: 10,
                title: "Chính sách và hỗ trợ",
                alias: "chinh-sach-ho-tro",
                intro: "Tìm hiểu các chính sách và dịch vụ hỗ trợ khách hàng của chúng tôi",
            };
        default:
            return null;
    }
};
