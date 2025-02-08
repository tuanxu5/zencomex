import axiosInstance from "../utils/axios";

const sitemap = () => {};

export const getServerSideProps = async ({ res }) => {
    // Thiết lập tiêu đề Content-Type cho sitemap
    res.setHeader("Content-Type", "text/xml");

    // Thiết lập danh sách các URL
    const baseUrl = process.env.NEXT_PUBLIC_API_URL; // Thay đổi thành tên miền của bạn

    const urls = await axiosInstance.get("/general/page-seo");
    if (urls && urls.data.DT) {
        const pageMain = [
            { url: "/", changefreq: "daily", priority: 0.7 },
            { url: "/san-pham", changefreq: "daily", priority: 0.7 },
            { url: "/giai-phap", changefreq: "daily", priority: 0.7 },
            { url: "/tin-tuc", changefreq: "daily", priority: 0.7 },
            { url: "/gioi-thieu", changefreq: "daily", priority: 0.7 },
            { url: "/lien-he", changefreq: "daily", priority: 0.7 },
            { url: "/tuyen-dung", changefreq: "daily", priority: 0.7 },
            { url: "/ho-tro", changefreq: "daily", priority: 0.7 },
            { url: "/xuat-nhap-khau", changefreq: "daily", priority: 0.7 },
            { url: "/du-an", changefreq: "daily", priority: 0.7 },
            { url: "/chinh-sach-ho-tro", changefreq: "daily", priority: 0.7 },
        ];
        // Tạo XML cho sitemap
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
            xmlns:xhtml="http://www.w3.org/1999/xhtml"
            xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
            xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
            xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
      ${pageMain
          .concat(urls.data.DT)
          .map(({ url, changefreq, priority }) => {
              return `
          <url>
            <loc>${`${baseUrl}${url}`}</loc>
            <changefreq>${changefreq}</changefreq>
            <priority>${priority}</priority>
          </url>
        `;
          })
          .join("")}
    </urlset>`;

        // Gửi phản hồi
        res.write(xml);
        res.end();
    }

    return {
        props: {}, // Không cần props cho API route
    };
};

export default sitemap;
